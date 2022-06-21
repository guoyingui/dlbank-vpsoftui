import React, { Component } from 'react'
import {
  vpQuery,
  vpAdd,
  VpFormCreate,
  VpModal,
  vpDownLoad,
  VpTooltip,
  VpIcon,
  vpFormatDate,
  VpAlertMsg,
  VpTable,
  EditTableCol,
  VpConfirm 
} from 'vpreact';
import { VpDynamicForm, RightBox } from 'vpbusiness';
import { formatDateTime, requireFile } from 'utils/utils';
import { NotFind } from 'vplat';


const DynamicTabs = requireFile('vfm/DynamicTabs/dynamictabs');
const FirstFlow = requireFile('vfm/DynamicForm/firstflow');
const entityFormChange = requireFile('vfm-entity');
//判断变量是否以某个字符串结尾
function endWithStr(field, endStr) {
  var d = field.length - endStr.length;
  return (d >= 0 && field.lastIndexOf(endStr) == d)
}

//校验用户的登录名，邮箱格式，手机号格式
function validateLogin(values, key) {
  let value = values[key]
  let result = {};
  result.flag = true;
  if (value != '' && value != undefined && value != null) {
    if (key == 'sloginname') {
      var reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
      if (reg.test(value)) {
        result.flag = false;
        result.msg = '登录名不能包含汉字！';
      } else if (value.length < 3) {
        result.flag = false;
        result.msg = '登录名不能少于三位！';
      }

    } else if (key == 'semail') {
      if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value)) {
        result.flag = false;
        result.msg = '邮箱格式不正确！';
      }
    } else if (key == 'sphone') {
      var bValidate = RegExp(/^(0|86|17951)?(13[0-9]|15[012356789]|18[0-9]|14[57])[0-9]{8}$/).test(value);
      if (!bValidate) {
        result.flag = false;
        result.msg = '手机号格式不正确！';
      }
    }
  }
  return result;
}

//比较结束时间和开始时间
function validateDate(value, key) {
  let result = {};
  result.flag = true;
  let start = "";
  let end = "";
  if (value[key] != null || value[key] != '') {
    end = vpFormatDate(value[key], 'YYYY-MM-DD');
    if (key == 'dforecastenddate') {
      //formatDateTime
      start = vpFormatDate(value.dforecaststartdate, 'YYYY-MM-DD');
      if (start > end) {
        result.flag = false;
        result.msg = '预测开始时间不能大于预测结束时间！';
      }
    } else if (key == 'dplanenddate') {
      start = vpFormatDate(value.dplanstartdate, 'YYYY-MM-DD');
      if (start > end) {
        result.flag = false;
        result.msg = '计划开始时间不能大于计划结束时间！';
      }
    } else if (key == 'dactualenddate') {
      start = vpFormatDate(value.dactualstartdate, 'YYYY-MM-DD');
      //alert(start + "---" + end)
      if (start > end) {
        result.flag = false;
        result.msg = '实际开始时间不能大于实际结束时间！';
      }
    }
  }
  return result;
}

class dynamic extends Component {
  constructor(props) {
    super(props)
    let { entityid } = props
    if (props.params && props.params.entityid) {
      entityid = props.params.entityid
    }
    // console.log(entityid, 'dynamic-entityid--------------------')
    this.state = {
      statusList: [],
      eventmap: { onload: '', onsave: '' },
      increaseData: {},
      loading: false,
      formvalue: '',
      visible: false,
      varilsForm: '',
      variid: '',
      iid: 0,
      keyindex: 0,
      modalvisible: false,
      selectedRowKeys: '',
      selectedSkeys: '',
      newiid: '',
      newname: '',
      startflow: false,
      showDetail: false,
      entityrole: (this.props.iid == '' || this.props.add || this.props.iaccesslevel == 1) ? true : false,
      zsrole:false,
      showDetailRightBox: false,
      flowhandler: '', //执行人
      ichanglecount: 0, //状态变迁分支数
      isDocTypeTemplate: false,
      idoctype: '',
      tableloading: false,
      tableHeight: '',
      table_headers: [],
      table_array: [],
      cur_page: 1,
      num_perpage: 10, //每页记录数
      entityFlow: false,
      entityid,
      implement_visible: false,
      reflushKey: 0,
      showCopyRightBox: false,//显示复制页
      showBeforeRightBox: false,//显示上一条
      plbjtableHeader: [],//执行页表头
      plbjurl: '/{vpplat}/csCaseExec/listCasePage',//执行页面

    }

    // 将formchange和formloaded提取出来统一管理
    this.content = NotFind;
    this.state.formChange = this.props.formChange || null
    this.state.formLoaded = this.props.formLoaded || null

    if (entityFormChange && entityFormChange[entityid]) {
      this.state.formChange = entityFormChange[entityid].dynamicFormChange || null
      this.state.formLoaded = entityFormChange[entityid].dynamicFormLoaded || null
      this.state.validateForm = entityFormChange[entityid].validateForm || null
    }
  }

  componentDidMount() {
    this.init(this.props)
    window.form = this
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.row_id != this.props.row_id) {
      this.setState({
        increaseData: {}
      }, () => {
        this.init(nextProps)
      })
    }
  }

  componentWillUnmount() {
    this.setState = () => { }
  }

  init = (props = null) => {
    if (!props) return
    let { add, addType, entitytype } = props
    // 当实体没有可以发起的流程时，不显示“保存并发起”按钮
    // this.queryentityFlow(props.row_entityid, props.row_id);
    this.queryFormData()
      .then(() => {
        if (!add) {
          this.queryStatusList()
        } else {
          props.setBreadCrumb("新建")
          this.state.statusList.push({
            sname: '保存并关闭',
            className: 'primary',
            iid: '',
            visible: this.state.entityrole,
            sflag: 'saveAndClose'
          })
          if (entitytype == 3 && this.state.entityFlow) {
            this.state.statusList.push({
              sname: '保存并发起',
              className: 'primary',
              iid: '',
              visible: this.state.entityrole,
              sflag: 'flow'
            })
          }
          else if (entitytype == 2 && this.state.entityFlow) {
            this.state.statusList.push({
              sname: '保存并提交',
              className: 'primary',
              iid: '',
              visible: this.state.entityrole,
              sflag: 'status'
            })
          }
          this.state.statusList.push({
            sname: '保存并新建',
            className: 'primary',
            iid: '',
            visible: this.state.entityrole,
            sflag: 'saveAndNew'
          })
          if (props.isThirdPartyBottonlist) {
            this.state.statusList.push({
              ...props.isThirdPartyBottonlist
            })
          }
          this.setState({
            statusList: this.state.statusList,
          })
        }
        this.queryentityRole(props.row_entityid, props.row_id)
      })
  }

  // 查询是否有可用流程,当实体没有可以发起的流程时，不显示“保存并发起”按钮
  queryentityFlow = (entityid, iid) => {
    // vpQuery('/{vpflow}/rest/flowstart/list', {
    //   ientityid: entityid,
    //   iid: iid
    // }).then((response) => {
    //   this.setState({
    //     entityFlow: response.data.count > 0 ? true : false
    //   })
    // })
  }

  //查询实体权限
  queryentityRole = (entityid, iid) => {
    // let skey = this.props.skey
    // let tabsformrole = false
    // let entityrole = this.props.entityrole
    // //新建时默认为true
    // if (iid == '' || this.props.add) {
    //   tabsformrole = true
    //   this.setState({
    //     entityrole: tabsformrole
    //   })
    // } else {
    //   //判断是否为主子关系
    //   if (endWithStr(skey, 'subitem')) {
    //     //如果父级对于tabs有写权限，则不用查自己的权限
    //     if (entityrole) {
    //       tabsformrole = entityrole
    //       this.setState({
    //         entityrole: tabsformrole
    //       })
    //     } else {
    //       vpQuery('/{vpplat}/vfrm/entity/entityRole', {
    //         entityid, iid
    //       }).then((response) => {
    //         tabsformrole = response.data.entityRole
    //         this.setState({
    //           entityrole: tabsformrole
    //         })
    //       })
    //     }
    //   } else {//对等关系
    //     if (this.props.entityrole) {
    //       vpQuery('/{vpplat}/vfrm/entity/entityRole', {
    //         entityid, iid
    //       }).then((response) => {
    //         tabsformrole = response.data.entityRole
    //         this.setState({
    //           entityrole: tabsformrole
    //         })
    //       })
    //     } else {
    //       this.setState({
    //         entityrole: false
    //       })
    //     }
    //   }
    // }
  }

  formChange = (eventname, name, value) => {
    let _this = this
    const { formChange } = this.state
    if (eventname != '' && eventname != undefined) {
      let sparam = { 'field_name': name }
      try {
        var valuestr = JSON.stringify(value)
        sparam['field_value'] = value
      } catch (err) {
        sparam['field_value'] = ''
      }
      let result = onChangeEvent(eventname, sparam)
      if (result && result.reloadform) {
        if (result.hidden || result.requires || result.unrequires) {
          _this.state.increaseData.groups.map((group, index) => {
            group.fields.map((item, ss) => {
              let name = item.field_name
              item.isshow = false
              if (result.hidden.indexOf(name) != -1) {
                item.isshow = true
              }
              if (result.requires && result.requires.indexOf(name) != -1) {
                item.validator.required = true
                item.validator.message = item.field_label + "不能为空！"
              }
              if (result.unrequires && result.unrequires.indexOf(name) != -1) {
                item.validator.required = false
              }
            })
          })
          _this.setState({ increaseData: _this.state.increaseData })
        }
      }
    }

    // 接受外部传入的方法
    if (typeof formChange === 'function') {
      let values = []
      if (value instanceof Array) {
        values = value
      }
      formChange(this, value, name)
      return
    }
  }
  //查询表单onsave，onload方法
  getFormEvent = (ientityid, iid, viewtype) => {
    vpQuery('/{vpplat}/vfrm/entity/getformevent', {
      entityid: ientityid, iid, viewtype
    }).then((response) => {
      this.setState({
        eventmap: response.data
      })
    })
  }
  //表单字段信息
  queryFormData = (btn) => {
    let iid = this.props.row_id
    let initdata = null
    if (this.state.newiid != '') {
      iid = this.state.newiid
    }
    let entityid = this.props.row_entityid
    if (this.state.modalentity != '' && this.state.modalentity != null) {
      entityid = this.state.modalentity
    }
    let formparam = {}
    let viewcode = this.props.viewcode
    if (this.props.formType == 'tabs') {
      if (
        this.props.tabsinstance &&
        this.props.tabsinstance.props &&
        this.props.tabsinstance.props.defaultparam != undefined &&
        iid == ''
      ) {
        viewcode = this.props.tabsinstance.props.defaultparam.viewcode
        initdata = this.props.tabsinstance.props.defaultparam
      } else {
        viewcode = this.props.params.data.viewcode
        initdata = this.props.params.data
      }

      formparam = {
        viewcode,
        mainentityid: this.props.mainentity,
        mainiid: this.props.mainentityiid,
        entityid,
        iid,
        stabparam: this.props.stabparam,
        formType: 'tabs' //分辨出这个实体挂在tab页的，还是一级实体
      }
    } else {
      if (this.props.params != undefined && this.props.params.data != undefined && iid == '') {
        viewcode = this.props.params.data.viewcode
        initdata = this.props.params.data
      }
      formparam = {
        entityid,
        iid,
        iparent: this.props.row_id,
        viewcode,
        showDetail: this.props.showDetail,
      }
    }
    if ('copy' == this.props.addType && btn && 'saveAndNew' == btn) {//测试用例保存并关闭时候，iid设为空值
      formparam.iid = ''
    }
    this.getFormEvent(formparam.entityid, formparam.iid, formparam.viewcode);
    // if (formparam.iid && _this.props.addType != 'copy') { // 非新建、复制时，弹出实体表单立即刷新按钮
    //   this.queryStatusList(formparam.entityid, formparam.iid); // 加载表单时，同时加载变迁按钮
    // }
    // 去除，会与form加载后的查询重复调用，造成调用多次
    return vpQuery('/{vpplat}/vfrm/entity/getform', {
      ...formparam,
      initdata: JSON.stringify(initdata)
    }).then((response) => {
      let data = response.data
      let sublist = data.sublist
      let onloadevent = this.state.eventmap ? this.state.eventmap.onload : ''
      if (onloadevent != '' && onloadevent != undefined) {
        let onloadobj = onloadevent.split(".")
        let onloadeventname = onloadobj[0]
        let scon_fieldname = ""
        if (onloadobj.length > 1) {
          scon_fieldname = onloadobj[1].split(";")[0]
        }
        let param = {
          'value': data,
          'entityid': this.props.row_entityid,
          'iid': this.props.row_id,
          'mainentity': this.props.mainentity,
          'mainentityiid': this.props.mainentityiid,
          "scon_fieldname": scon_fieldname
        }
        let result = formeven(param, onloadeventname)
        if (result != '' && result != undefined && result != null) {
          if (result.tabshidden != undefined || result.hidden != undefined || result.requires != undefined || result.unrequires != undefined) {//兼容result传递对象
            data = result.formdata;
            if (result.hidden != undefined) {//需要隐藏的字段
              data.form.groups.map((group, index) => {
                group.fields.map((item, ss) => {
                  let name = item.field_name
                  item.isshow = false
                  if (result.hidden && result.hidden.indexOf(name) != -1) {
                    item.isshow = true
                  }
                  if (result.requires && result.requires.indexOf(name) != -1) {
                    item.validator.required = true
                    item.validator.message = item.field_label + "不能为空！"
                  }
                  if (result.unrequires && result.unrequires.indexOf(name) != -1) {
                    item.validator.required = false
                  }
                })
              })
            }
          } else {//兼容原来的result直接返回结果
            data = result;
          }
        }
      }

      if (data) {
        if (data.hasOwnProperty('form')) {
          if (data.form.hasOwnProperty('groups')) {
            /**2020-2-27 */
            if (this.props.addType === 'copy' || (this.props.tabsinstance && this.props.tabsinstance.props && 'copy' === this.props.tabsinstance.props.addType)) {
              try {
                data.form.groups[0].fields.map(item => {
                  // item.disabled = false
                  // if (item.readonly) (item.readonly = false)
                  if (item.field_name === 'scode') {
                    item.widget = {}
                    throw '循环完成'
                  }
                })
              } catch (error) {

              }

            }

            const { formLoaded } = this.state
            if (typeof formLoaded === 'function') {
              data.form.groups = formLoaded(this, data.form.groups)
            }
          }
          /**end */
          this.setState({
            increaseData: data.form,
            sublist,
            ichanglecount: data.ichanglecount,
            entityFlow: data.showFlowButton
          })
        }
      }

    }).catch(function (err) {
      console.log(err);
    });
  }

  //状态变迁按钮
  queryStatusList = (ientityid, iids) => {
    const _this = this
    let iid = _this.props.row_id;
    if (iid == undefined || iid == '') {
      iid = iids;
    }
    let newientityid = _this.props.row_entityid;
    if (newientityid == undefined || newientityid == '') {
      newientityid = ientityid;
    }
    vpAdd('/{vpplat}/vfrm/entity/getStatusList', {
      entityid: newientityid,
      iid: iid
    }).then((response) => {
      _this.setState({
        entityrole: response.data.entityrole || _this.props.iaccesslevel == 1
      },()=>{
        
      })
      if (!this.props.isflow) { // 在工作流里面关联时，不显示页
        let varis = response.data.varis
        let btns = []
        varis instanceof Array &&
          varis.map((item, index) => {
            let btn = {}
            btn.sname = item.sname
            btn.scode = item.scode
            btn.validate = item.ivalidate === '1' ? false : true;//ivalidate 0验证，1不验证
            btn.className = 'ghost'
            btn.iid = item.iid
            btn.visible = true
            btn.disabled = false
            btn.sflag = item.sflag
            btns.push(btn)
          })
        btns.push({
          sname: '保存并关闭',
          className: 'primary',
          iid: '',
          visible: this.state.entityrole,
          sflag: 'saveAndClose'
        });
        if (_this.props.entitytype == 3 && _this.props.entityrole && this.state.entityFlow) {
          btns.push({
            sname: '保存并发起',
            className: 'primary',
            iid: iids,
            visible: this.state.entityrole,
            sflag: 'flow'
          })
          if (this.props.isThirdPartyBottonlist) {
            btns.push({
              ...this.props.isThirdPartyBottonlist
            })
          }
        }
        if (newientityid == 62) {
          btns.push({
            sname: '执行',
            className: 'primary',
            iid: '',
            visible: this.state.entityrole,
            sflag: 'handleCsExec'
          });
          btns.push({
            sname: '复制',
            className: 'primary',
            iid: '',
            visible: this.state.entityrole,
            sflag: 'handleCopyExec'
          });
          btns.push({
            sname: '上一条',
            className: 'primary',
            iid: '',
            visible: true,
            sflag: 'handleBeforeExec'
          });
          btns.push({
            sname: '下一条',
            className: 'primary',
            iid: '99',
            visible: true,
            sflag: 'handleNextExec'
          });
        }
        
        if (newientityid == 60) {// 年度预算增加 预算结转 按钮,只有终审状态下才可以进行预算结转操作
          vpAdd('/{vppm}/dlbank/ndys/getNdysZt', {
            entityid: newientityid,
            iid: iid,
            scode:'003'
          }).then((response) => {
          debugger
            if(response.data && response.data.flag){
                btns.push({
                  sname: '预算结转',
                  className: 'primary',
                  iid: '',
                  visible: this.state.entityrole ,
                  sflag: 'handleYsjz'
                });
            }
            this.setState({
              statusList: btns,
            })
          })
          
        }else{
          this.setState({
            statusList: btns,
          })
        }
      }
    })
  }

  //保存方法
  handleSave = (value) => {
    let _this = this
    let result;
    let onsaveinfo = this.state.eventmap ? this.state.eventmap.onsave : ''
    if (onsaveinfo != '' && onsaveinfo != undefined) {
      let onsaveobj = onsaveinfo.split(".")
      let eventname = onsaveobj[0]
      let scon_fieldname = ""
      if (onsaveobj.length > 1) {
        scon_fieldname = onsaveobj[1]
      }
      let param = {
        'value': value,
        'entityid': this.props.row_entityid,
        'iid': this.props.row_id,
        'mainentity': this.props.mainentity,
        'mainentityiid': this.props.mainentityiid,
        "scon_fieldname": scon_fieldname
      }
      result = formeven(param, eventname)
    }
    if (result == undefined || result == true || result.submit == true) {
      //校验各个子页面的保存是否成功
      if (!this.props.add) {
        this.handleSubView(value, this.props.row_id)
      } else {
        this.saveRowData(value, 0, false)
      }
    } else {
      VpAlertMsg({
        message: "消息提示",
        description: result.message || '提交失败！',
        type: "error",
        onClose: this.onClose,
        closeText: "关闭",
        showIcon: true
      }, 5)
    }
  }

  //校验各个子页面的保存是否成功
  handleSubView = (value, iid) => {
    const _this = this
    let sublist = _this.state.sublist
    let promisearr = []
    let subparam = {
      iid: iid
    }
    sublist.map((item) => {
      if (window.form[item] && window.form[item].handleSubSave) {
        let p = window.form[item].handleSubSave(subparam);
        promisearr.push(p)
      }
    })
    if (promisearr.length > 0) {
      Promise.all(promisearr).then(function (resolve, reject) {
        let error = ''
        resolve instanceof Array &&
          resolve.map((item, index) => {
            if (!item.success) {
              error += item.message
            }
          })
        if (error != undefined && error != '') {
          VpAlertMsg({
            message: "消息提示",
            description: error,
            type: "error",
            closeText: "关闭",
            showIcon: true
          }, 5)
          return
        } else {
          if (!_this.props.add) {
            _this.saveRowData(value, 0, false);
          }
        }
      });
    } else {
      if (!_this.props.add) {
        _this.saveRowData(value, 0, false);
      }
    }
  }

  // 保存表单
  saveRowData = (value, statusid, btn) => {
    let readonlyfileds = []
    if (this.props.row_entityid == 10) {//WBS特殊处理
      this.state.increaseData.groups.map((item, index) => {
        let deletefields = item.fields
        deletefields.map((field, num) => {
          if (field.readonly || field.disabled) {
            readonlyfileds.push(field.field_name)
          }
        })
      })
    }

    let success = true
    statusid = statusid == undefined ? 0 : statusid
    const _this = this;
    let vae = {}
    for (const key in value) {
      if (value[key] == undefined) {
        value[key] = ''
      } else if (value[key] == null) {
        value[key] = 0
      } else if (value[key] instanceof Date) {
        value[key] = formatDateTime(value[key])
      }

      const { validateForm } = this.state
      const hasValidateForm = (
        validateForm && validateForm instanceof Function
      ) ?
        true
        :
        false

      if (hasValidateForm) {
        let result = validateForm(value, key)
        if (!result.flag) {
          VpAlertMsg({
            message: "消息提示",
            description: result.msg,
            type: "error",
            closeText: "关闭",
            showIcon: true
          }, 5)

          return
        }
      }

      if (!hasValidateForm && (key == 'dforecastenddate' || key == 'dplanenddate' || key == 'dactualenddate' || key == 'dfinishtime')) {
        let result = validateDate(value, key)
        if (!result.flag) {
          VpAlertMsg({
            message: "消息提示",
            description: result.msg,
            type: "error",
            onClose: this.onClose,
            closeText: "关闭",
            showIcon: true
          }, 5)
          success = false
        }
      }
      if (key == 'sloginname' || key == 'semail' || key == 'sphone') {
        let result = validateLogin(value, key)
        if (!result.flag) {
          VpAlertMsg({
            message: "消息提示",
            description: result.msg,
            type: "error",
            onClose: this.onClose,
            closeText: "关闭",
            showIcon: true
          }, 5)
          success = false
        }
      }
      if (key.indexOf('_label') == -1) {
        vae[key] = value[key]
      }
    }
    let entityid = _this.props.row_entityid
    let iid = _this.props.row_id
    if (_this.state.newiid != '') {
      iid = _this.state.newiid
    }
    let formdata = {}
    //将流程表单中的问题实体数据关联到piid与taskid上
    if (entityid == 16 && _this.props.fromentity == 'flow') {
      let extradata = this.props.extradata
      vae.taskid = extradata.taskid
      vae.piid = extradata.piid
    }
    if (this.props.params != undefined && (iid == '' || iid == undefined)) {
      if (this.props.params.data.currentclassid == '' || this.props.params.data.currentclassid == undefined) {
        this.props.params.data.currentclassid = this.props.tabsinstance.props.defaultparam.currentclassid
      }
      vae.iclassid = this.props.params.data.currentclassid
    }

    //加上WBS只读字段的过滤
    if (_this.props.row_entityid == 10) {//WBS特殊处理
      readonlyfileds.map((item, index) => {
        delete vae[item]
      })
    }
    // 测试用例在属性页面进行复制表单功能 把创建时间置为空
    if (this.props.tabsinstance && this.props.tabsinstance.props && 'copy' === this.props.tabsinstance.props.addType && vae.dcreatordate && "" != vae.dcreatordate) {
      vae.dcreatordate = ''
    }
    let viewcode = _this.props.viewcode
    if (_this.props.formType == 'tabs' && _this.props.tabsinstance != undefined) {
      if (_this.props.tabsinstance.props.defaultparam != undefined && iid == '') {
        viewcode = _this.props.tabsinstance.props.defaultparam.viewcode
      }
      vae['sfieldname'] = _this.props.stabparam//关系码
      //干系人保存
      if (this.props.row_entityid == '11') {
        vae.irelentityid = _this.props.mainentity
        vae.irelobjectid = _this.props.mainentityiid
      }
      formdata = {
        sparam: JSON.stringify(vae),
        entityid: _this.props.mainentity,//主实体ID
        iid: _this.props.mainentityiid,//主实体数据ID
        irelationentityid: entityid,//关联实体ID
        irelationentityiid: iid,//关联实体对象数据ID
        irelationid: _this.props.irelationid,//关联实体关联关系ID
        variid: statusid, //变迁ID,
        viewcode,
        flowaction: btn
      }
    } else {
      if (_this.props.params != undefined && _this.props.params.data != undefined && iid == '') {
        viewcode = _this.props.params.data.viewcode
      }
      formdata = {
        sparam: JSON.stringify(vae),
        entityid,
        iid,
        variid: statusid,
        viewcode,
        flowaction: btn
      }
    }
    let sname = vae.sname
    if (typeof sname == String && (sname == '' || sname.replace(/\s+/g, "") == '')) {
      VpAlertMsg({
        message: "消息提示",
        description: '名称不能为空！',
        type: "error",
        closeText: "关闭",
        showIcon: true
      }, 5)
      _this.setState({
        loading: false
      })
      success = false
    }
    else if (btn == 'status' && this.state.ichanglecount <= 0) {
      VpAlertMsg({
        message: "消息提示",
        description: '未配置流转分支，不能直接提交！',
        type: "error",
        closeText: "关闭",
        showIcon: true
      }, 5)
      _this.setState({
        loading: false
      })
      _this.state.statusList.map((cases, index) => {//状态变迁按钮去掉loading
        cases.loading = false
      })
      success = false
    }
    else if (btn == 'status' && this.state.ichanglecount > 1) {
      VpAlertMsg({
        message: "消息提示",
        description: '超过一个流转分支，不能直接提交！',
        type: "error",
        closeText: "关闭",
        showIcon: true
      }, 5)
      _this.setState({
        loading: false
      })
      _this.state.statusList.map((cases, index) => {//状态变迁按钮去掉loading
        cases.loading = false
      })
      success = false
    }
    else if (btn == 'status' && (vae.iassignto == undefined || vae.iassignto == '')) {
      VpAlertMsg({
        message: "消息提示",
        description: '处理人/执行人不能为空！',
        type: "error",
        closeText: "关闭",
        showIcon: true
      }, 5)
      _this.setState({
        loading: false
      })
      _this.state.statusList.map((cases, index) => {//状态变迁按钮去掉loading
        cases.loading = false
      })
      success = false
    }
    if (success) {
      this.setState({
        loading: true
      })
      _this.state.statusList.map((cases, index) => {//所有自定义按钮同步增加loading
        cases.loading = true
      })
      /**2020-2-27 */
      if (_this.props.add == true && 'copy' == this.props.addType) {
        formdata.iid = ''
      }
      /**end */
      // 测试用例在属性页面进行复制表单功能
      if (_this.props.add == true && this.props.tabsinstance && this.props.tabsinstance.props && 'copy' === this.props.tabsinstance.props.addType) {
        formdata.iid = ''
        formdata.irelationentityiid = ''
      }
      vpAdd('/{vpplat}/vfrm/entity/saveFormData', {
        ...formdata
      }).then(function (data) {
        //新建校验各个子页面的保存是否成功
        if (_this.props.add) {
          _this.handleSubView(value, data.data.iid)
        }
        if (vae.sname != undefined && vae.sname != "" && !_this.props.add) {
          try {
            _this.props.setBreadCrumb(vae.sname)
          }
          catch (e) { }
        }
        VpAlertMsg({
          message: "消息提示",
          description: '保存成功！',
          type: "success",
          closeText: "关闭",
          showIcon: true
        }, 5)
        //状态变迁按钮去掉loading
        _this.state.statusList.map((cases, index) => {
          cases.loading = false
        })
        const increaseData = {}
        //保存并发起流程按钮
        if (_this.props.entitytype && btn == 'flow') {
          let flowhandler = _this.dynamic.getFieldValue("iassignto");
          _this.setState({
            loading: false,
            newiid: data.data.iid,
            newname: data.data.sname,
            increaseData,
            startflow: true,
            flowhandler,
            statusList: _this.state.statusList,
            saveiid: data.data.iid
          }, () => _this.queryFormData())
        } else if (btn == 'saveAndNew') {
          _this.setState({
            loading: false,
            newiid: '',
            increaseData,
            statusList: _this.state.statusList,
            saveiid: data.data.iid
          }, () => {
            _this.props.refreshList()
            _this.queryFormData(btn)
          })
        } else if (btn == 'saveAndClose') {
          _this.setState({
            loading: false,
            newiid: '',
            increaseData,
            statusList: _this.state.statusList,
            saveiid: data.data.iid
          }, () => {
            _this.props.refreshList(); // 已经关闭不会调用后面的刷新，独立增加刷新调用
            _this.props.closeRightModal();
          })
        } else {
          if (_this.props.formType == 'tabs') {
            _this.setState({
              increaseData,
              visible: false,
              loading: false,
              newiid: _this.props.isflow || _this.props.add == true ? data.data.iid : '',
              statusList: [],
              saveiid: data.data.iid
            }, () => {
              _this.queryFormData()
            })
          } else {
            _this.setState({
              increaseData,
              visible: false,
              varilsForm: {},
              loading: false,
              newiid: _this.props.isflow || _this.props.add == true ? data.data.iid : '',
              statusList: [],
              saveiid: data.data.iid
            }, () => {
              if (!_this.props.add || _this.props.isflow || _this.state.variid != '') {
                _this.queryFormData()
              }
            })
          }

          //刷新保存按钮
          _this.queryentityRole(entityid, iid)
          _this.queryStatusList(entityid, iid)
          _this.props.refreshList()
          if (_this.props.add) {
            _this.props.closeRightModal(data.data.entityid, data.data.iid, data.data.sname)
          }
        }

      }).catch(function (err) {
        _this.setState({
          loading: false
        })
      });
    } else {
      _this.state.statusList.map((cases, index) => {//状态变迁按钮去掉loading
        cases.loading = false
      })
      _this.setState({
        loading: false,
        statusList: _this.state.statusList
      })
    }
    this.removeUdeit();
  }

  removeUdeit = () => {
    $("textarea[name='editorValue']").remove()
  }

  updateTimeInfo(entityid, iid) {
    const _this = this
    let sparam = {
      iid: iid,
      entityid: entityid,
    }
    vpAdd('/{vppm}/vpmwbs/saveTaskInfo', sparam).then(function (data) {
      _this.queryFormData()
      _this.props.refreshList()
    })
  }

  //获取状态变迁表单
  handleStatus = (item, value, error) => {
    if (item.isThirdParty) {
      this.props.clickThirdPartyBotton(item)
    } else {
      if (error && item.validate) {
      } else {
        let _this = this
        //let submit = true
        let result;
        let onsaveinfo = this.state.eventmap ? this.state.eventmap.onsave : ''
        if (onsaveinfo != '' && onsaveinfo != undefined) {
          let onsaveobj = onsaveinfo.split(".")
          let eventname = onsaveobj[0]
          let scon_fieldname = ""
          if (onsaveobj.length > 1) {
            scon_fieldname = onsaveobj[1]
          }
          let param = {
            'item': item,
            'value': value,
            'entityid': this.props.row_entityid,
            'iid': this.props.row_id,
            'mainentity': _this.props.mainentity,
            'mainentityiid': _this.props.mainentityiid,
            "scon_fieldname": scon_fieldname
          }
          result = formeven(param, eventname)
        }
        if (result == undefined || result == true || result.submit == true) {
          this.state.statusList.map((cases, index) => {
            if (cases.iid == item.iid) {

            }
          })
          this.setState({
            statusList: this.state.statusList,

          })
          //发起流程
          let entityid = this.props.row_entityid;

          if (item.sflag == 'flow' || item.sflag == 'status' || item.sflag == 'saveAndNew' || item.sflag == 'saveAndClose') {
            this.saveRowData(value, 0, item.sflag)
          } else if (item.sflag == 'handleCopyExec') {
            this.handleCopyExec();
          } else if (item.sflag == 'handleCsExec') {
            this.handleCsExec();
          } else if (item.sflag == 'handleBeforeExec') {
            this.handleBeforeExec();
          } else if (item.sflag == 'handleNextExec') {
            this.handleNextExec();
          } else if (item.sflag == 'handleYsjz') {
            this.handleYsjz();
          }else if (entityid == 138 && item.sname == '下载') {
            let iid = this.props.row_id;
            vpDownLoad("/{vpplat}/vfrm/downlicense/exportlicense",
              {
                iid: iid
              }).then((response) => {
                this.state.statusList.map((cases, index) => {
                  if (cases.iid == item.iid) {
                    cases.loading = false
                  }
                })
                this.setState({
                  statusList: this.state.statusList,

                })
              })
          } else {
            //获取变迁表单
            vpAdd('/{vpplat}/vfrm/entity/varilsForm', {
              sflag: item.sflag,
              entityid: this.props.row_entityid,
              iid: this.props.row_id,
              variid: item.iid
            }).then((response) => {
              this.state.statusList.map((cases, index) => {
                if (cases.iid == item.iid) {
                  cases.loading = false
                }
              })
              let variparam = {
                entityid: this.props.row_entityid,
                iid: this.props.row_id,
                variid: item.iid
              }
              let handerinfo = null;
              if (typeof varilsFormHandler == "function") {
                handerinfo = varilsFormHandler(variparam)
              }
              if (handerinfo != undefined && handerinfo != null) {
                response.data.groups[0].fields.map((item) => {
                  let field_name = item.field_name
                  if (field_name == 'iassignto') {
                    item.widget.default_value = handerinfo.iid
                    item.widget.default_label = handerinfo.sname
                  }
                })
              }
              this.setState({
                formvalue: value,
                visible: true,
                varilsForm: response.data,
                variid: item.iid,
                sflag: item.sflag,
                iassignto: response.data.iassignto,
                statusList: this.state.statusList,
              })
            })

          }
        } else {
          VpAlertMsg({
            message: "消息提示",
            description: result.message || '提交失败！',
            type: "error",
            onClose: this.onClose,
            closeText: "关闭",
            showIcon: true
          }, 5)
        }
      }
    }
  }

  //关闭变迁状态弹出的模态框
  cancelModal() {
    this.setState({
      visible: false,
      varilsForm: {}
    })
  }

  //状态变迁提交按钮
  handleStatusSubmit(values) {
    let _this = this
    if (this.state.sflag == 2) {
      values.iassignto = this.state.iassignto
    }
    let iassignto = values.iassignto

    if (iassignto > 0 || this.state.sflag == 2) {
      //校验各个子页面的保存是否成功
      let subparam = {
      }
      let sublist = this.state.sublist
      let promisearr = []
      sublist.map((item) => {
        if (window.form[item] && window.form[item].handleSubSave) {
          let p = window.form[item].handleSubSave(subparam);
          promisearr.push(p)
        }
      })
      if (promisearr.length > 0) {
        Promise.all(promisearr).then(function (resolve, reject) {
          let error = ''
          resolve.map((item, index) => {
            if (!item.success) {
              error += item.message
            }
          })
          if (error != undefined && error != '') {
            VpAlertMsg({
              message: "消息提示",
              description: error,
              type: "error",
              closeText: "关闭",
              showIcon: true
            }, 5)
            return
          } else {
            let val = { ..._this.state.formvalue, ...values }
            let { variid } = _this.state
            _this.saveRowData(val, variid, false)
            _this.cancelModal()
          }
        });
      } else {
        let val = { ..._this.state.formvalue, ...values }
        let { variid } = _this.state
        _this.saveRowData(val, variid, false)
        _this.cancelModal()
      }
    } else {
      if (this.state.varilsForm.groups[0].fields.length == 1) {
        let val = { ..._this.state.formvalue, ...values }
        let { variid } = _this.state
        _this.saveRowData(val, variid, false)
        _this.cancelModal()
      }
      else {
        VpAlertMsg({
          message: "消息提示",
          description: '下一步处理人不能为空!',
          type: "error",
          onClose: this.onClose,
          closeText: "关闭",
          showIcon: true
        }, 5)
      }
    }

  }

  //销毁发起流程DOM
  destoryDom = (flag) => {
    this.setState({
      startflow: false
    })
    if (flag == 'startflow') {

    } else {
      this.props.closeRightModal();
    }
  }

  detailClick = (item, chosenList) => {
    //let widget = item.widget_type
    //let irelationentityid = item.irelationentityid
    if (item.infourl != undefined && item.infourl != '') {
      this.content = requireFile(item.infourl) || NotFind
    } else {
      this.content = requireFile("vfm/DynamicForm/detailForm") || NotFind;
    }

    this.setState({
      showDetail: true,
      widgetDetail: item, //控件的详细信息
      chosenList,//选中的记录
    })
  }

  //销毁详情dom
  destoryDetailDom = () => {
    this.setState({
      showDetail: false,
      showDetailRightBox: false
    })
  }

  bumen = (param) => {
  }

  opensDetailRightBox = () => {
    this.setState({
      showDetailRightBox: true
    })
  }

  namerolechange = (iid) => {
    const { setFieldsValue } = this.dynamic
    vpAdd('/{vpplat}/processAction/changedpt', {
      iid
    }).then((response) => {
      let data = response.data
      let idepartmentid = data.iid || ''
      let idepartmentid_label = data.sname || ''
      setFieldsValue({ 'idepartmentid': idepartmentid, 'idepartmentid_label': idepartmentid_label })
    })
  }

  relpjchange = (value) => {
    if (value == 0) {
      this.state.increaseData.groups[0].fields.map((item, index) => {
        if (item.field_name == 'rrelprj') {
          item.disabled = true
        }
      })
    } else {
      this.state.increaseData.groups[0].fields.map((item, index) => {
        if (item.field_name == 'rrelprj') {
          item.disabled = false
        }
      })
    }
  }

  /**
   * 打开文档类型模版下载弹出框
   */
  openDocTypeTemplateModel = (idoctype) => {
    this.setState({
      idoctype,
      tableloading: true,
      isDocTypeTemplate: true
    }, () => {
      this.getDocTypeTemplateHeader()
      this.loadDocTypeTemplateData()
    })
  }
  /**
   * 关闭文档类型模版下载弹出框
   */
  closeDocTypeTemplateModel = () => {
    this.setState({
      idoctype: '',
      tableloading: false,
      isDocTypeTemplate: false
    })
  }
  //列表字段
  getDocTypeTemplateHeader = () => {
    let header = [
      {
        title: '名称',
        dataIndex: 'sname',
        key: 'sname',
        width: '',
        fixed: '',
        auto: true
      },
      {
        title: '文档类型',
        dataIndex: 'sdoc_type',
        key: 'sdoc_type',
        width: '',
        fixed: '',
        auto: true
      }
    ];
    header.push({
      title: '操作', width: 60, key: 'downloadFile', render: (text, record) => (
        <span>
          <VpTooltip placement="top" title="下载">
            <VpIcon data-id={record.iid} style={{ cursor: 'pointer', color: "#1c84c6", fontWeight: "bold", fontSize: 14, margin: '0 5px' }}
              type="vpicon-download" onClick={() => this.downloadTemplate(record)} />
          </VpTooltip>
        </span>
      )
    });
    this.setState({
      table_headers: header
    })
  }

  checkFile = (fileid) => {
    const _this = this
    return vpQuery("/{vpplat}/file/check", {
      fileid: vp.encrypt.aesEncrypt(fileid, "rSzSK900KLMxOgZ/")
    }).then(function (res) {
      if (res.data.success) {
        _this.setState({
          existFile: true
        })
      }
    })
  }

  downloadTemplate = (record) => {
    let fileid = record.fileid
    this.checkFile(fileid).then(() => {
      fileid = vp.encrypt.aesEncrypt(fileid, "rSzSK900KLMxOgZ/")
      vpDownLoad("/{vpplat}/file/downloadfile", {
        fileid: fileid
      })
    })
  }
  loadDocTypeTemplateData = () => {
    const _this = this
    vpAdd('/{vpplat}/document/loadDocTypeTemplateData', {
      idoctype: this.state.idoctype,
      currentPage: this.state.cur_page,
      pageSize: this.state.num_perpage
    }).then(function (res) {
      let data = res.data;
      let theight = vp.computedHeight(data.resultList.length, '.templateTable') - 140
      let showTotal = () => {
        return '共' + data.totalRows + '条'
      }
      _this.setState({
        tableloading: false,
        table_array: data.resultList,
        tableHeight: theight,
        cur_page: data.currentPage,
        num_perpage: data.numPerPage,
        pagination: {
          total: data.totalRows,
          showTotal: showTotal,
          current: data.currentPage,
          pageSize: data.numPerPage,
          onShowSizeChange: _this.onShowSizeChange,
          showSizeChanger: true,
          showQuickJumper: true,
        },
        size: 'small'
      });
    })
  }
  tableChange = (pagination, filters, sorter) => {
    this.setState({
      cur_page: pagination.current || this.state.cur_page,
      num_perpage: pagination.pageSize || this.state.num_perpage,
    }, () => {
      this.loadDocTypeTemplateData()
    })
  }
  onShowSizeChange(value) {
  }
  refreshFormData = () => {
    this.props.closeRightModal(this.props.row_entityid, this.state.newiid, this.state.newname)
  }
  /**
   * 
   * @param {预算结转} formData 
   */
  handleYsjz = (formData) => {
    console.log(formData,'formData',this.state,this.props);
    let syearField = findFieldByName(this.state.increaseData.groups, "syear");
    let syear = '' 
    if (syearField) {
      syear = syearField.field.widget.default_value;
    }
    let _this = this;
    VpConfirm({
        title: '是否将'+syear+'年度预算结转至下一年，请确认！',
        //content: '一些解释',
        onOk() {
            console.log('确定');
            _this.ysjz();
        },
        onCancel() {},
    });
  }

  ysjz = () => {
    let _this = this;
    let msg = '',type = 'success'
    vpQuery('/{vppm}/dlbank/ndys/ndysjz', {
        iid: this.props.iid
    }).then((response) => {
        if(response.data.flag){
          _this.setState({
            statusList: [],
          }, () => {
              _this.queryFormData()
            
          })
          msg = '预算结转成功';
          //刷新保存按钮
          _this.queryentityRole(this.props.entityid,this.props.iid)
          _this.queryStatusList(this.props.entityid,this.props.iid)
        }else{
          msg = response.data.msg
          type = 'error'
        }
        VpAlertMsg({
              message: "消息提示",
              description: msg,
              type: type,
              closeText: "关闭",
              showIcon: true
            }, 5);
    })
}
  /**
      * 复制按钮
      * @param formData
      */
  handleCopyExec = (formData) => {
    let _this = this;
    let btnName = "handleCopy";
    _this.setState({ showCopyRightBox: true })
  }
  queryBugClassByCase =()=>{
    vpQuery('/{vppm}/dlbank/three/queryBugClassByCase', { iid: this.props.iid }).then((res) => {
      this.setState({
        currentclassid: res.data
      })
    })
  }
  /**
      * 测试执行 执行按钮
      * @param formData
      */
  handleCsExec = (formData) => {
    let _this = this;
    let btnName = "handleExec";
    _this.state.reflushKey++;
    _this.selectStatus();
    _this.queryBugClassByCase()
    _this.setState({ implement_visible: true, reflushKey: this.state.reflushKey })
  }
  //执行状态查询
  selectStatus = () => {
    const _this = this
    let children = [];
    vpQuery('/{vpplat}/csCaseExec/selectStatus', { istatus: '0' }).then((response) => {
      response.data.resultList.map((item, index) => {
        children.push({ value: item.iid + '', label: item.sname, scode: item.scode },);
        if (item.scode == 'pass') {
          this.setState({
            istatusidval: item.iid + ''
          });
        }
      });
      this.setState({ childrenBugClass2: children }, () => {
        //执行----执行页面表头用
        let plbjtableHeader = [];
        vpAdd("/{vpplat}/vfrm/entity/editGrids", { entityid: 62, viewcode: 'editlistexec' }).then((res) => {
          res.data.fields.map((item, index) => {
            switch (item.field_name) {
              case 'scode':
                plbjtableHeader.push({
                  title: item.field_label,
                  dataIndex: item.field_name,
                  fixed: item.fixed,
                  width: 150,
                  edit_col: item.edit_col,
                  widget: item.widget,
                  render: (text, record) => {
                    return (
                      <div key={text} title={text}>
                        {text}
                      </div>
                    )
                  }
                });
                break;
              case 'istatusid':
                plbjtableHeader.push({
                  title: "执行状态",
                  dataIndex: item.field_name,
                  fixed: item.fixed,
                  width: 100,
                  edit_col: item.edit_col,
                  widget: item.widget,
                  render: (text, record) => {
                    let newText = record.istatusid;
                    if (newText == '未运行' || newText == undefined||newText == '未分配') {
                      newText = '运行通过'
                      record.istatusidval = this.state.istatusidval + ''
                    } else {
                      record.istatusidval = record.istatusidval + ''
                    }
                    return (
                      <div title={newText}>
                        <EditTableCol callBack={_this.callBack}
                          item={{ ...item, ientityid: this.props.entityid }}
                          id="iid" data={_this.state.data}
                          record={record}
                          widget={{
                            widget_type: "select",
                            widget_name: "istatusid",
                            default_value_name: "istatusidval",
                            load_template: this.state.childrenBugClass2
                          }}
                          value={<span style={{ color: "#428bca", cursor: "pointer" }}>{newText}</span>} />
                      </div>
                    )
                  }
                });
                break;
              case 'iassignto':
                plbjtableHeader.push({
                  title: '执行人',
                  dataIndex: item.field_name,
                  fixed: item.fixed,
                  width: 100,
                  edit_col: item.edit_col,
                  widget: item.widget,
                  render: (text, record) => {
                    return (
                      <div key={text} title={text}>
                        {text}
                      </div>
                    )
                  }
                });
                break;
              case 'ssjjg':
                plbjtableHeader.push({
                  title: item.field_label,
                  dataIndex: item.field_name,
                  fixed: item.fixed,
                  width: 150,
                  edit_col: item.edit_col,
                  widget: item.widget,
                  render: (text, record) => {
                    return (
                      <EditTableCol callBack={_this.callBack} item={{ ...item, ientityid: this.props.entityid }} id="iid" data={_this.state.data} record={record} widget={item.widget} value={text} />
                    )
                  }
                });
                break;
              default:
                let width = 150;
                plbjtableHeader.push({
                  title: item.field_label,
                  dataIndex: item.field_name,
                  fixed: item.fixed,
                  width,
                  edit_col: item.edit_col,
                  widget: item.widget,
                  render: (text, record) => {
                    return <span title={text}>{text}</span>
                  }
                });
                break;
            }
          })
          plbjtableHeader.push({
            title: '操作', fixed: 'right', width: 80, render: (text, record) => {
              return (
                <div>
                  <VpTooltip placement="top" title="执行记录">
                    <VpIcon className="cursor m-lr-xs f16 blue" type="vpicon-lishijilu" onClick={() => this.showZXJL(record, true)} />
                  </VpTooltip>
                  <VpTooltip placement="top" title="新增缺陷">
                    <VpIcon className="cursor m-lr-xs f16 blue" type="vpicon-bug" onClick={() => this._Newdefects([record.iid], true)} />
                  </VpTooltip>
                </div>
              )
            }
          });
          //设置执行页表头
          this.setState({
            plbjtableHeader: plbjtableHeader
          })
        })
      });
    })

  }
  /**
       * 上一条按钮
       * @param formData
       */
  handleBeforeExec = (formData) => {
    let _this = this;
    let btnName = "handleBefore";
    let sflag = 0;// 0 从实体列表进来属性页面，1 从测试执行中测试列表进来属性页面
    if (!_this.props.entitytype && 'csexec' == _this.props.sfrom) {//从测试执行中测试列表进来属性页面
      sflag = 1;
    }
    vpQuery('/{vpplat}/vfrm/api/getSessionCondtion', { iid: this.props.iid, todo: 'before', sflag: sflag }).then((res) => {
      if (res.data.oid) {
        _this.setState({
          oid: res.data.oid,
          showBeforeRightBox: true
        })
      } else {
        VpAlertMsg({
          message: "消息提示",
          description: '没有上一条记录了！',
          type: "info",
          closeText: "关闭",
          showIcon: true
        }, 5);
        //this.setFormSubmiting(false);
      }

    })

    //this.props.closeRightModal && this.props.closeRightModal();


  }
  /**
  * 下一条按钮
  * @param formData
  */
  handleNextExec = (formData) => {
    let _this = this;
    let btnName = "handleNext";
    let sflag = 0;// 0 从实体列表进来属性页面，1 从测试执行中测试列表进来属性页面
    if (!_this.props.entitytype && 'csexec' == _this.props.sfrom) {//从测试执行中测试列表进来属性页面
      sflag = 1;
    }
    vpQuery('/{vpplat}/vfrm/api/getSessionCondtion', { iid: this.props.iid, todo: 'next', sflag: sflag }).then((res) => {
      if (res.data.oid) {
        _this.setState({
          oid: res.data.oid,
          showBeforeRightBox: true
        })
      } else {
        VpAlertMsg({
          message: "消息提示",
          description: '没有下一条记录了！',
          type: "info",
          closeText: "关闭",
          showIcon: true
        }, 5);
        //this.setFormSubmiting(false);
      }
    })

  }
  // 渲染上一条、下一条
  renderBeforeForm = () => {

    let props = {
      entityid: 62,
      entitytype: this.props.entitytype,
      sfrom: this.props.sfrom,
      iid: this.state.oid,
      closeRightModal: this.closeBeforeRightModal,
      defaultActiveKey: "entity62_attrtab",
      skey: "entity62_attr"
    }
    return (
      <DynamicTabs
        param={{
          entityid: 62,
          iid: this.state.oid,
          type: false,
          viewtype: '',
          entitytype: this.props.entitytype,
          defaultActiveKey: "entity62_attrtab",
          formType: 'tabs', //分辨出这个实体挂在tab页的，还是一级实体
          mainentity: 62,  //从左边导航点进来的实体ID
          mainentityiid: '', //主实体的当前行数据ID
          sfrom : this.props.sfrom
        }}
        defaultparam={{
          currentclassid: '',
          viewcode: ''
        }}

        setBreadCrumb={(sname) => { }}
        closeRightModal={() => this.closeBeforeRightModal()}
        refreshList={() => { }}
      />
    );
  }
  //渲染复制用例
  renderCopyForm = () => {
    return (
      <DynamicTabs
        param={{
          entityid: 62,
          iid: this.props.iid,
          type: true,
          viewtype: '',
          entitytype: '',
          defaultActiveKey: "entity62_attrtab",
          formType: 'tabs', //分辨出这个实体挂在tab页的，还是一级实体
          mainentity: 62,  //从左边导航点进来的实体ID
          mainentityiid: '', //主实体的当前行数据ID
          addType: 'copy'
        }}
        defaultparam={{
          currentclassid: '',
          viewcode: ''
        }}

        addType={'copy'}
        setBreadCrumb={(sname) => { }}
        closeRightModal={() => this.closeCopyRightModal()}
        refreshList={() => { }}
      />
    );
  }
  //copy关闭
  closeCopyRightModal = () => {
    this.setState({
      showCopyRightBox: false
    }, () => {
      this.props.closeRightModal && this.props.closeRightModal();
      //this.setFormSubmiting(false);
    })
  }
  // 上一条关闭
  closeBeforeRightModal = () => {
    this.setState({
      showBeforeRightBox: false
    }, () => {
      this.props.closeRightModal && this.props.closeRightModal();
      //this.setFormSubmiting(false);
    })
  }
  /**
   * 3.实际开始日期=点击“执行”按钮的操作时间
     4.实际完成日期=点击“执行”按钮，且执行状态=“运行通过”的操作时间（即执行记录执行结果=“运行通过”的执行日期）
   * @param {chenxl} values 
   */
  updateTestCaseInfo = (values) => {
    vpAdd('/{vppm}/testManageRest/updateTestCaseInfo', { sparam: JSON.stringify(values) }).then((res) => {
      
      this.queryFormData()
      this.state.reflushKey++;
    })
  }
  //执行用例确定
  implementOkModal = () => {
    let values = this.plbjtable.getCurrentData();
    vpAdd('/{vpplat}/csCaseExec/batchInsterExec', { sparam: JSON.stringify(values) }).then((res) => {
      this.setState({
        implement_visible: false
      },()=>{
        this.updateTestCaseInfo(values)
      });
      //this.loadFormData();
      //this.props.form.resetFields()
     
      //this.setFormSubmiting(false);
      VpAlertMsg({
        message: "成功提示",
        description: "执行成功！",
        type: "success",
        closeText: "关闭",
        showIcon: true
      })
    })
  }
  //执行用例取消
  implementCancelModal = () => {
    this.setState({ implement_visible: false }, () => {
      //this.setFormSubmiting(false);
    });
  }
  //查看执行记录
  showZXJL = (record, flag) => {
    this.setState({
      showYLRightBox: true,
      implement_visible: false,
      flag: flag,
      iid: record.iid,
      defaultActiveKey: 'entity62_exectab',
      skey: 'entity62_exec'
    })
  }
  //渲染右侧弹出框内容
  _renderRightBoxBody() {
    let props = {
      entityid: 62,
      iid: this.state.iid,
      closeRightModal: this.closeRightModal,
      defaultActiveKey: this.state.defaultActiveKey,
      isFat: this.state.isFat
    }
    return (
      <DynamicTabs
        param={{
          entityid: 62,
          iid: this.state.iid,
          type: false,
          viewtype: '',
          entitytype: this.props.entitytype,
          defaultActiveKey: "entity62_exectab",
          formType: 'tabs', //分辨出这个实体挂在tab页的，还是一级实体
          mainentity: 62,  //从左边导航点进来的实体ID
          mainentityiid: '', //主实体的当前行数据ID
          isFat: this.state.isFat
        }}
        defaultparam={{
          currentclassid: '',
          viewcode: ''
        }}

        setBreadCrumb={(sname) => { }}
        closeRightModal={() => this.closeRightModal()}
        refreshList={() => { }}
      />
    );
  }
  //新增
  _Newdefects = (iid, flag) => {
    //判断用例是否FAT类别
    vpQuery('/{vpplat}/csCaseExec/isFat', { iid: iid }).then((res) => {
      this.setState({
        isFat: res.data
      })
    })
    
    //显示缺陷新增
    this.setState({
      showQXRightBox: true,
      implement_visible: false,
      flag,
      iid: iid
    })
  }
  //缺陷右划关闭
  closeQXRightModal = () => {
    this.setState({
      showQXRightBox: false,//关闭用例属性
      implement_visible: this.state.flag
    })
  }
  //用例右滑关闭
  closeRightModal = () => {
    this.setState({
      showYLRightBox: false,//关闭用例属性
      implement_visible: this.state.flag
    })
  }
  //渲染缺陷新建
  renderNewForm = () => {
    return (
      <DynamicTabs
        param={{
          entityid: 64,
          iid: '',
          type: true,
          viewtype: '',
          entitytype: '2',
          defaultActiveKey: "entity64_attrtab",
          formType: 'tabs', //分辨出这个实体挂在tab页的，还是一级实体
          mainentity: 62,  //从左边导航点进来的实体ID
          mainentityiid: this.state.iid, //主实体的当前行数据ID
          stabparam: 'rglcsyl',
        }}
        defaultparam={{
          currentclassid: this.state.currentclassid,
          viewcode: ''
        }}
        setBreadCrumb={(sname) => { }}
        closeRightModal={() => this.closeQXRightModal()}
        refreshList={() => { }}
      />
    );
  }
  render() {
    const { increaseData } = this.state
    let Content = this.content;
    // const formDataLength = Object.keys(increaseData).length
    return (
      <div className="full-height" key={this.state.reflushKey+10000000}>
        <VpDynamicForm
          fileTypeTemplateClick={this.openDocTypeTemplateModel}
          detailClick={this.detailClick}
          ref={(node) => this.dynamic = node}
          bindThis={this}
          //header={this.state.sub_header}
          //dataSource={this.state.sub_data}
          formData={increaseData}
          params={this.props.params}
          handleOk={this.state.entityrole ? this.handleSave : ''}
          handleCancel={this.props.isflow || this.props.hidden ? null : this.props.closeRightModal}
          handleStatus={(item, value, error) => this.handleStatus(item, value, error)}
          buttonList={this.state.statusList}
          okText="保 存"
          noFooter={this.props.noFooter}
          loading={this.state.loading}
        />
        {
          !this.state.isDocTypeTemplate ? null :
            <VpModal
              title='文档类型模版下载'
              visible={this.state.isDocTypeTemplate}
              onCancel={() => this.closeDocTypeTemplateModel()}
              width={'50%'}
              height={'75%'}
              footer={null}
            >
              <div className="full-height">
                <VpTable
                  className="templateTable"
                  bindThis={this}
                  loading={this.state.tableloading}
                  ref={table => this.tableRef = table}
                  columns={this.state.table_headers}
                  dataSource={this.state.table_array}
                  pagination={this.state.pagination}
                  onChange={this.tableChange}
                  rowKey={'iid'}
                  resize={true}
                  scroll={{ y: this.state.tableHeight }}
                />
              </div>
            </VpModal>
        }
        <VpModal
          title='状态变迁'
          visible={this.state.visible}
          onCancel={() => this.cancelModal()}
          width={'70%'}
          height={'80%'}
          footer={null}
        >
          {
            this.state.varilsForm.groups ?
              <VpDynamicForm
                className="vpVarilsForm"
                formData={this.state.varilsForm}
                iid={this.props.row_id}
                bindThis={this}
                handleOk={(values) => this.handleStatusSubmit(values)}
                handleCancel={() => this.cancelModal()}
                loading={this.state.loading}
                okText="提 交" />
              : null
          }
        </VpModal>
        {
          this.state.startflow ?
            <FirstFlow
              flowhandler={this.state.flowhandler}
              flowtype={false}
              entityid={this.props.row_entityid}
              iid={this.state.newiid}
              add={this.props.add}
              refreshFormData={() => { this.refreshFormData() }}
              closeRightModal={() => { this.props.add ? this.props.closeRightModal() : null }}
              showfirstnodepage={true}
              destoryDom={(flag) => this.destoryDom(flag)}
            />
            : ''
        }
        <RightBox
          max={false}
          button={
            <div className="icon p-xs" onClick={() => this.destoryDetailDom()}>
              <VpTooltip placement="top" title=''>
                <VpIcon type="right" />
              </VpTooltip>
            </div>}

          show={this.state.showDetailRightBox}>
          {
            this.state.showDetail ?
              <Content
                widgetDetail={this.state.widgetDetail}
                chosenList={this.state.chosenList}
                opensDetailRightBox={() => this.opensDetailRightBox()}
                showDetailRightBox={this.state.showDetailRightBox}
                destoryDetailDom={() => this.destoryDetailDom()}
              />
              :
              ''
          }
        </RightBox>
        <RightBox
          max={this.props.entitytype ? true : false}
          button={
            <div className="icon p-xs" onClick={this.closeCopyRightModal}>
              <VpTooltip placement="top" title=''>
                <VpIcon type="right" />
              </VpTooltip>
            </div>}
          show={this.state.showCopyRightBox}>
          {this.state.showCopyRightBox ? this.renderCopyForm() : null}
        </RightBox>
        <RightBox
          max={this.props.entitytype ? true : false}
          button={
            <div className="icon p-xs" onClick={this.closeBeforeRightModal}>
              <VpTooltip placement="top" title=''>
                <VpIcon type="right" />
              </VpTooltip>
            </div>}
          show={this.state.showBeforeRightBox}>
          {this.state.showBeforeRightBox ? this.renderBeforeForm() : null}
        </RightBox>
        <RightBox
          max={false}
          button={
            <div className="icon p-xs" onClick={this.closeQXRightModal}>
              <VpTooltip placement="top" title=''>
                <VpIcon type="right" />
              </VpTooltip>
            </div>}
          show={this.state.showQXRightBox}>
          {this.state.showQXRightBox ? this.renderNewForm() : null}
        </RightBox>
        <RightBox
          max={false}
          button={
            <div className="icon p-xs" onClick={this.closeRightModal}>
              <VpTooltip placement="top" title=''>
                <VpIcon type="right" />
              </VpTooltip>
            </div>}
          show={this.state.showYLRightBox}>
          {this.state.showYLRightBox ? this._renderRightBoxBody() : null}
        </RightBox>
        <VpModal
          width="80%"
          style={{ height: "700px" }}
          title="执行"
          visible={this.state.implement_visible}
          onOk={this.implementOkModal}
          onCancel={this.implementCancelModal}
          wrapClassName={"ant-modal-mask"}>
          <div className="full-height" key={this.state.reflushKey}>
            <VpTable
              reflushKey={this.state.reflushKey}
              ref={(dom) => { this.plbjtable = dom }}
              queryMethod='GET'
              columns={this.state.plbjtableHeader}
              dataUrl={this.state.plbjurl}
              params={{ iids: this.props.iid }}
              resize
              scroll={{ y: "380px" }}
              pagination={false}
              bindThis={this}
              rowKey='iid'
              customPagination={{
                pageSizeOptions: ['10', '20', '30', '40']
              }}
              defaultNumPerPage={10}
            />
          </div>
        </VpModal>
      </div>
    )
  }
}

export default dynamic = VpFormCreate(dynamic)
