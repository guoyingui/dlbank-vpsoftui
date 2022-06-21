import React, { Component } from 'react'
import {
  VpAlertMsg,
  VpMenu,
  VpMenuItem,
  VpDropdown,
  VpIcon,
  VpTooltip,
  VpModal,
  VpButton,
  VpRow,
  VpCol,
  VpIconFont,
  vpDownLoad,
  vpQuery,
  vpAdd,
  VpSubMenu,
  VpInputUploader,
  VpRadioGroup,
  VpRadioButton,
  VpFSelect,
  VpSelect,
  VpOption,
  VpForm,
  VpPopconfirm,
  VpFormCreate,
  VpUploader,
  VpConfirm,
  VpTag,
  VpTable,
  EditTableCol
} from 'vpreact';
import { requireFile } from 'utils/utils'
const SearchForm = requireFile('vfm/DynamicForm/SearchForm');
import './task.less';

const DynamicTabs = requireFile('vfm/DynamicTabs/dynamictabs');

import {
  SeachInput,
  FindCheckbox,
  RightBox,
  QuickCreate
} from 'vpbusiness'


const DragBox = requireFile('vfm/Task/draggable/dragbox');
const Gantt = requireFile('vfm/Task/gantt');
const InputSearchName = requireFile('vfm/DynamicForm/InputSearchName');
//判断变量是否以某个字符串结尾
function endWithStr(field, endStr) {
  var d = field.length - endStr.length;
  return (d >= 0 && field.lastIndexOf(endStr) == d)
}
class task extends Component {
  constructor(props) {
    super(props)
    const currentkey = 'filter'
    const openKeys = ['filter']
    const oproparm = this.props.params.sparam != undefined ? eval("("+this.props.params.sparam+")") : {}
    this.state = {
      filters: [],
      visible2: false,
      visible: false,
      showRightBox: false,
      widget_show_none: '',
      widget_show_none_tool: '',
      table_headers: [],
      quickvalue: '', //快速搜索内容
      activeKey: '1',
      increaseData: [], // 新增动态数据
      tabs_array: [],
      tabs: null,
      isAdd: false,
      formSearch_data: [],
      form_data: [],
      formdata: [],
      entityid: '',
      iids: '',
      row_id: '',
      row_entityid: '',
      entityiid: '',
      add: true,
      statusList: [],//状态变迁
      varilsForm: {},
      viewtype: '',
      entityrole: false,//实体是否有可读或者可写权限
      exShow: false,
      exList: [],
      entityVisible: false,
      toolbar: {},
      rowbar: [],
      SearchFormData: {},
      searchData: [],
      loading: false,
      expandedRowKeys: [],
      tableHeight: '',
      tips: '',
      defaultActiveKey: '0',
      shrinkShow: true,
      openKeys,
      currentkey,
      view: 'tree', //看板视图切换参数
      classList: [], //有权限新建的类别
      statusFilters: [],
      classFilters: [],
      scode: '',
      sname: '',
      subItemProjectId: '',
      entitytype: false,//实体类型是否为流程
      cardconfig: false,
      defaultStatusList: [],
      statusboardlist: [],
      cardStatusList: [],
      multiSelect: [],
      flowtype: '',
      currentclassid: '',
      viewcode: '',
      tableloading: true,
      editrowdata: {},
      VpUploader: false,
      filearr: {},
      doctypelist: [],//编辑类表上传文档类型数据源
      selectType: '',
      isaddflag: 0,
      isdeleteflag: 0,
      functionid: '',//功能点id
      sparam: '',
      classListSelect: oproparm.iclassid || null, // 看板页面选中的选项
      searchFormValues: {},//搜索表单值
      conditionVisibleFlag: false
    }
    this.objectid = 0;
    this.closeRightModal = this.closeRightModal.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handlesearch = this.handlesearch.bind(this);
    this.handleVisibleChange = this.handleVisibleChange.bind(this);
    this.onRowClick = this.onRowClick.bind(this);
    this.getHeader = this.getHeader.bind(this);
    this.cancelModal = this.cancelModal.bind(this);
    this.exTypeData = this.exTypeData.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.onExpand = this.onExpand.bind(this);
    this.handleDropDown = this.handleDropDown.bind(this);

    this.filterValue = { currentkey, openKeys } // 用来保存filter的参数，适用于看板和甘特图的无状态和类别的状况
  }

  componentWillReceiveProps(nextProps) {
    const params = nextProps.params
    if (params) {
      if (params.entityid != this.props.params.entityid || params.functionid != this.props.params.functionid) {
        this.setState({
          entityid: params.entityid,
          showRightBox: false,
          functionid: params.functionid,
          sparam: params.sparam,
          viewtype: ''
        }, () => {
          this.getHeader()
          this.querySearchFormData()
          this.queryclassList()
          this.getconfig()
          this.queryEntityType()
        })
      }
      if (params.type != this.props.params.type) {
        this.setState({
          viewtype: params.type,
          functionid: params.functionid,
          sparam: params.sparam,
          showRightBox: false
        }, () => {
          this.getHeader()
          this.querySearchFormData()
          this.getconfig()
          this.queryclassList()
          this.queryEntityType()
        })
      }
    } else {
      this.setState({
        viewtype: nextProps.viewtype,
        entityid: nextProps.entityid,
        toolbar: nextProps.toolbar,
        rowbar: nextProps.rowbar,
        functionid: params.functionid,
        sparam: params.sparam,
        showRightBox: false
      }, () => {
        this.getHeader()
        this.getconfig()
        this.tableRef.getTableData()
      })
    }

  }

  componentDidMount() {
   
    this.setState({
      entityid: this.props.params ? this.props.params.entityid : this.props.entityid,
      viewtype: this.props.params ? this.props.params.type : this.props.type,
      functionid: this.props.params ? this.props.params.functionid : '',
      sparam: this.props.params ? this.props.params.sparam : '',
      toolbar: this.props.toolbar,
      rowbar: this.props.rowbar
    }, () => {
      this.getHeader()
      this.exTypeData()
      this.getconfig()
      this.querySearchFormData()
      this.queryclassList()
      this.queryEntityType()
      this.queryTaskStatus()
      this.loadDocType()
    })
    $('.search').find('input').attr('maxlength', 400)
  }

  componentDidUpdate() {

  }
  componentWillUnmount() {
    //重写组件的setState方法，直接返回空
    this.setState = (state, callback) => {
      return;
    };
  }

  //编辑列表获取上传文档类型
  loadDocType = () => {
    vpQuery('/{vpplat}/vfrm/entity/doctype', {
      entityid: this.state.entityid
    }).then((response) => {
      this.setState({
        doctypelist: response.data,
        selectType: response.data[0].value
      })
    })
  }

  openupload = (record) => {
    let iid = record.iid
    this.state.editrowdata[iid] = record
    this.setState({
      VpUploader: true,
      currentiid: record.iid,
      editrowdata: this.state.editrowdata
    })
  }

  queryEntityType = () => {
    vpQuery('/{vpplat}/vfrm/entity/entitytype', {
      entityid: this.state.entityid
    }).then((response) => {
      const { entitytype, flowtype } = response.data
      /*  let filtervalue = '0'
       let flowtype = response.data.flowtype
       let entityid = this.state.entityid
       if (entityid == 1 || entityid == 2) {//用户、部门时，默认是启用
           filtervalue = '6'
       } else {
           if (flowtype == 1) {//无状态变迁的默认为我负责的
               filtervalue = '1'
           } else if (flowtype == 2) {//状态变迁类实体，默认为待处理
               filtervalue = '2'
           } else {//流程类默认为我负责的
               filtervalue = '1'
           }
       } */
      this.setState({
        entitytype,
        flowtype,
        // filtervalue: filtervalue
      })

    })
  }

  handleChange = (classListSelect) => {
    this.setState({
      classListSelect,
    })
  }

  //点击菜单
  handleClick = (e) => {
    let filtervalue = e.key;
    let openKeys = e.keyPath.slice(1);
    let currentkey = e.keyPath.slice(1)[0];
    if (this.state.filtervalue == filtervalue && this.state.currentkey == currentkey) {
      return
    } else {

      if (currentkey === 'filter') {
        this.filterValue = {
          filtervalue,
          openKeys,
          currentkey,
        }
      }

      this.setState({
        filtervalue,
        openKeys,
        currentkey,
        tableloading: true
      })
    }
  }

  //看板视图切换
  handleViewChange = (e) => {
    const value = e.target.value
    const { currentkey, filtervalue, openKeys } = this.filterValue
    let data = {
      view: value,
      viewtype: value,
    }
    const hasFilter = value !== 'card' && value !== 'gantt'
    if (!hasFilter) data = { ...data, currentkey, filtervalue, openKeys }
    this.setState({
      ...data,
    }, () => {
      if (hasFilter) {
        this.getHeader()
      }
      // if (e.target.value == 'card') {
      //   this.defaultConfig()
      // } else {
      //   this.getHeader()
      // }

    })

  }

  querySearchFormData = () => {
    vpQuery('/{vpplat}/vfrm/entity/searchForm', {
      entityid: this.state.entityid, scode: 'search'
    }).then((response) => {
      this.setState({
        SearchFormData: response.data.form
      })
    })
  }
  // 返回参数给父层控制是否关闭下拉层
  chooseModalVisible = (visible) => {
    this.chooseVisible = visible
  }

  //获取表头数据
  getHeader() {
    this.setState({
      tableloading: true
    })
    let _this = this;
    let { viewtype } = _this.state
    if (viewtype == 'edit') {
      this.getEditHeader()
      return
    }
    vpQuery('/{vpplat}/vfrm/entity/getheaders', {
      entityid: _this.state.entityid,
    }).then(function (data) {
      if (data) {
        if (data.hasOwnProperty('data')) {
         // 屏蔽列表新增按钮
          let  addflag = data.data.addflag == undefined ? 0 : data.data.addflag
          if('114'==_this.state.entityid){
            addflag = 0
          }
          _this.setState({
            loading: false,
            isdeleteflag: data.data.delflag == undefined ? 0 : data.data.delflag,
            isaddflag: addflag
          });
          if (data.data.hasOwnProperty('grid')) {
            let _header = [];
            if (data.data.grid.hasOwnProperty('fields')) {
              data.data.grid.fields.map(function (records, index) {
                let _title, data_index, _field_width, _fixed;
                for (let key in records) {
                  key == 'field_label' ? _title = records[key] :
                    key == 'field_name' ? data_index = records[key] : '';
                  if (key == 'fixed') {
                    _fixed = records[key];
                  }
                  if (key == 'iwidth') {
                    _field_width = records[key];
                  }
                }
                if (_title && data_index) {
                  if (_fixed == 'left' || _fixed == 'right') {
                    _header.push({
                      title: _title,
                      dataIndex: data_index,
                      key: data_index,
                      width: _field_width,
                      fixed: _fixed
                    });
                  } else {
                    _header.push({
                      title: _title,
                      dataIndex: data_index,
                      key: data_index,
                      width: _field_width,
                      fixed: _fixed,
                      sorter: true
                    });
                  }
                }
              });

              //任务活动类型
              const taskIndiclass = ['bg-success', 'bg-warning', 'bg-danger']
              const statusclass = ['text-success', 'text-warning', 'text-danger']
              const statusinfo = ['未开始', '进行中', '已关闭']
              const tasklights = (
                <div>
                  <VpTooltip title="进度"><VpIconFont type="vpicon-tip" className="m-r-xs text-success" /></VpTooltip>
                  <VpTooltip title="状态"><VpIconFont type="vpicon-check" className="m-r-xs text-success" /></VpTooltip>
                  <VpTooltip title="文档"><VpIconFont type="vpicon-wenben" className="m-r-xs text-success" /></VpTooltip>
                </div>
              )
              const taskcolumns = {
                title: tasklights, width: 80, dataIndex: 'indicator', key: 'indicator',
                render: (value, record) => {
                  let scheduleflag = (record.lights && record.lights.scheduleflag == 1) ? 0 : 1
                  let statusflag = (record.lights && record.lights.statusflag == 1) ? 1 : 0
                  let fileflag = record.lights ? record.lights.fileflag : "";
                  return (
                    <div className="indic-wrapper inline-display">
                      <VpTooltip title={scheduleflag == 0 ? "正常进度" : "进度逾期"}><span key={0} className={taskIndiclass[scheduleflag]}></span></VpTooltip>
                      {
                        statusflag == 1 ?
                          <VpTooltip title="已完成"><VpIconFont type="vpicon-check" className="m-r-xs text-success" /></VpTooltip>
                          : null
                      }
                      {
                        fileflag == 1
                          ?
                          <VpTooltip title="文档"><span key={3} className="bg-success"></span></VpTooltip>
                          : ''
                      }

                    </div>
                  )
                }
              }
              let _headerNew = _header

              let { entityid, viewtype } = _this.state

              if (entityid == 114) {
                _headerNew.unshift(taskcolumns)
              }
              _headerNew.map((item, index) => {
                if (item.key == 'icontrolmode') {
                  const pop = (
                    <div className="inline-display">
                      {/*  <VpIconFont type="vpicon-sitemap" className="m-r-xs" /> */}
                      管控模式
                    </div>
                  )
                  item.title = pop
                  item.width = 120
                  item.render = (
                    (text, record) => {
                      return (
                        <div className="indic-wrapper" style={{ textAlign: "center" }}>
                          {record.icontroltype == '2' ? <VpTag color="blue">敏捷</VpTag> : <VpTag color="yellow">瀑布</VpTag>}
                        </div>
                      )
                    }
                  )
                }
              })
              _headerNew.push({
                title: '操作', fixed: 'right', width: 100, key: 'operation',
                render: (text, record) => {
                  let optionlist = []
                  let delflag = false
                  if (record.istatusflag == '0' && _this.state.entityaddrole && _this.state.isdeleteflag == 1
                    && (record.principal != '0' || _this.state.entityid == '2')) {
                    delflag = true
                  }
                  else {
                    delflag = false
                  }

                  { // 增加config参数控制操作是否显示，以及显示顺序   add by oyq
                    (vp.config.vpplat != null && vp.config.vpplat.operation != null && vp.config.vpplat.operation.oprlist != undefined) ?
                      vp.config.vpplat.operation.oprlist.map((item, ss) => {
                        if (item.key == 'collect') {
                          let stitle = item.sname == undefined ? "关注" : item.sname
                          optionlist.push({
                            key: 'collect',
                            sname: record.ilike == 0 ? stitle : '取消' + stitle,
                            classname: 'text-primary m-lr-xs cursor',
                            type: record.ilike == 1 ? "vpicon-star" : "vpicon-star-o"
                          });
                        }
                        else if (item.key == 'discuss') {
                          let stitle = item.sname == undefined ? "评论" : item.sname
                          optionlist.push({
                            key: 'discuss',
                            sname: stitle,
                            classname: 'text-primary m-lr-xs cursor',
                            type: "vpicon-pinglun"
                          });
                        }
                        else if (item.key == 'delete' && delflag == true) {
                          let stitle = item.sname == undefined ? "删除" : item.sname
                          optionlist.push({
                            key: 'delete',
                            sname: stitle,
                            classname: 'cursor m-r-xs f16 text-danger',
                            type: "vpicon-shanchu"
                          });
                        }
                      })
                      :
                      null
                  }

                  if (optionlist.length == 0) {
                    optionlist.push({
                      key: 'collect',
                      sname: record.ilike == 0 ? "关注" : '取消关注',
                      classname: 'text-primary m-lr-xs cursor',
                      type: record.ilike == 1 ? "vpicon-star" : "vpicon-star-o"
                    })
                    optionlist.push({
                      key: 'discuss',
                      sname: '评论',
                      classname: 'text-primary m-lr-xs cursor',
                      type: 'vpicon-pinglun'
                    })

                    if (delflag == true) {
                      optionlist.push({
                        key: 'delete',
                        sname: "删除",
                        classname: 'cursor m-r-xs f16 text-danger',
                        type: "vpicon-shanchu"
                      });
                    }
                  }
                  let moreOption = []
                  let ishow = (vp.config.vpplat != undefined && vp.config.vpplat.operation != undefined && vp.config.vpplat.operation.count != undefined) ? vp.config.vpplat.operation.count : 2

                  return (
                    <span>
                      {
                        optionlist.map((item, i) => {
                          if (i < ishow) {
                            return (item.key == 'delete' ?
                              (
                                <VpTooltip placement="top" title="删除" key={item.key}>
                                  <VpPopconfirm title="确定要删除吗？" onConfirm={() => _this.confirm(record.ientityid, record.iid)}>
                                    <VpIconFont onClick={(e) => { e.stopPropagation() }} className={item.classname} type={item.type} />
                                  </VpPopconfirm>
                                </VpTooltip>
                              )
                              :
                              (
                                <VpTooltip placement="top" title={item.sname} key={item.key}>
                                  <VpIconFont onClick={(e) => _this.barEvent(item.key, e, record.ientityid, record.iid, record)}
                                    className={item.classname} type={item.type} />
                                </VpTooltip>
                              )
                            )
                          }
                          else {
                            moreOption.push(item)
                          }
                        })

                      }

                      {
                        moreOption.length > 0 ?
                          <VpTooltip placement="top" title="更多">
                            {
                              _this.state.isClickMenu ? null :
                                <VpDropdown overlay={(
                                  <VpMenu onClick={(e) => _this.menuClick(e, record.ientityid, record.iid,record)}>

                                    {
                                      moreOption.map((item, index) => {

                                        return (
                                          <VpMenuItem key={item.key}>
                                            <VpIconFont className={item.classname} type={item.type} />
                                            {item.sname}
                                          </VpMenuItem>
                                        )
                                      })
                                    }
                                  </VpMenu>
                                )}
                                  trigger={['click']}
                                  getPopupContainer={() => document.body}
                                >
                                  <VpIconFont data-id={record.iid} className="cursor m-lr-xs f16" type='vpicon-wait-y'
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </VpDropdown>
                            }

                          </VpTooltip>
                          : null
                      }
                    </span>
                  )
                }
              });
              _this.setState({ table_headers: _headerNew, tableloading: false });
            }
          }
        }
      }
    }).catch(function (err) {
      _this.setState({ tableloading: false });
    });
  }

  getconfig = () => {
    const _this = this
    //获取导航数据
    vpQuery('/{vpplat}/vfrm/entity/getConfig', {
      entityid: _this.state.entityid
    }).then(function (data) {
      if (data.hasOwnProperty('data')) {
        if (data.data.hasOwnProperty('search')) {
          let filtervalue = data.data.lastview
          filtervalue = filtervalue == "" || filtervalue == undefined ? '0' : filtervalue
          let filters = data.data.search.filters
          _this.filterValue.filtervalue = filtervalue
          _this.setState({
            filtervalue,
            widget_show_none: data.data.search,
            filters: filters,
            statusFilters: data.data.search.statusFilters,
            classFilters: data.data.search.classFilters
          });
        }
        if (data.data.hasOwnProperty('toolbar')) {
          _this.setState({ widget_show_none_tool: data.data.toolbar });
          if (data.data.toolbar.hasOwnProperty('formSearch')) {
            if (data.data.toolbar.formSearch.hasOwnProperty('form')) {
              if (data.data.toolbar.formSearch.form.hasOwnProperty('groups')) {
                if (data.data.toolbar.formSearch.form.groups[0].hasOwnProperty('fields')) {
                  data.data.toolbar.formSearch.form.groups[0].fields[0].field_name = 'form_sname';
                  _this.setState({ formSearch_data: data.data.toolbar.formSearch.form.groups[0].fields });
                }
              }
            }
          }
          if (data.data.toolbar.hasOwnProperty('tabs')) {
            _this.setState({ tabs: data.data.toolbar.tabs });
          }
          if (data.data.hasOwnProperty('entityrole')) {
            _this.setState({ entityaddrole: data.data.entityrole });
          }
        }
      }
    })
  }

  //编辑表格触发回调
  callBack = (rowdata) => {
    let iid = rowdata.iid
    this.state.editrowdata[iid] = rowdata
    this.setState({
      editrowdata: this.state.editrowdata
    })
  }

  //编辑列表列头
  getEditHeader = () => {
    let _this = this;
    let param = {
      entityid: _this.state.entityid,
      viewcode: 'initeditlist',
      functionid: _this.state.functionid,
      sparam: _this.state.sparam
    }
    vpQuery('/{vpplat}/vfrm/entity/initEditGrids', {
      ...param
    }).then(function (data) {
      if (data) {
        if (data.hasOwnProperty('data')) {
          let _header = [];
          let newData = data.data.fields
          if (newData.length == 0) {
            VpAlertMsg({
              message: "消息提示",
              description: '未查询到编辑列表视图！',
              type: "error",
              onClose: this.onClose,
              closeText: "关闭",
              showIcon: true
            }, 5)
            _this.setState({ table_headers: [] });
            return
          }
          let len = newData.length
          newData.map(function (records, index) {
            let _title, data_index, _field_width, _fixed;
            for (let key in records) {
              key == 'field_label' ? _title = records[key] :
                key == 'field_name' ? data_index = records[key] : '';
              if (key == 'fixed') {
                _fixed = records[key];
              }
              if (key == 'iwidth') {
                _field_width = records[key];
              }
            }
            if (_title && data_index) {
              if (_fixed == 'left' || _fixed == 'right') {
                _header.push({
                  title: _title,
                  dataIndex: data_index,
                  key: data_index,
                  width: _field_width,
                  fixed: _fixed
                });
              } else {
                _header.push({
                  title: _title,
                  dataIndex: data_index,
                  key: data_index,
                  width: _field_width,
                  fixed: _fixed,
                  render: !records.edit_col ? null : (text, record) => {
                    return (
                      <EditTableCol
                        callBack={_this.callBack}
                        record={record}
                        widget={records.widget}
                        item={{ ...records.widget, irelationentityid: records.irelationentityid }}
                        value={text}
                      />
                    )
                  }
                });
              }
            }
          });
          _header.push({
            title: '操作', fixed: 'right', width: 120, key: 'operation', render: (text, record) => (
              <span>
                <VpTooltip placement="top" title="附件">
                  <VpIconFont onClick={() => _this.openupload(record)} className="text-primary m-lr-xs cursor" type="vpicon-paperclip" />
                </VpTooltip>
                {(record.istatusflag == '0' && _this.state.entityaddrole) ?
                  <VpTooltip placement="top" title="删除">
                    <VpPopconfirm title="确定要删除这条信息吗？" onConfirm={() => _this.confirm(record.ientityid, record.iid)} onCancel={_this.cancel}>
                      <VpIconFont className="cursor m-lr-xs text-danger" type="vpicon-shanchu" />
                    </VpPopconfirm>
                  </VpTooltip>
                  :
                  null
                }
                {
                  record.iid > 0 ?
                    <VpTooltip placement="top" title="查看详情">
                      <VpIconFont onClick={() => _this.onRowClick(record, '')} className="text-primary m-lr-xs cursor" type="vpicon-navopen" />
                    </VpTooltip>
                    :
                    null
                }
              </span>
            )
          });
          _this.setState({ table_headers: _header, tableloading: false });
        }
      }
    }).catch(function (err) {
      console.log(err);
      _this.setState({ tableloading: false });
    });

  }

  barEvent = (key, e, entityid, iid, recond) => {
    if (key == 'summary') {
      this.setState({ isClickMenu: true })
      vpAdd('/{vpplat}/vfrm/entity/summary', {
        entityid, iid
      }).then((response) => {
        this.setState({ isClickMenu: false })
        VpAlertMsg({
          message: "消息提示",
          description: '计算汇总成功!',
          type: "success",
          onClose: this.onClose,
          closeText: "关闭",
          showIcon: true
        }, 5)
      })
    } else if (key == 'weekreport') {
      this.setState({ isClickMenu: true })
      vpQuery('/{vppm}/weekport/addweekreport', {
        projectid: iid,
        startdate: '',
        enddate: ''
      }).then((response) => {
        this.setState({ isClickMenu: false })
        VpAlertMsg({
          message: "消息提示",
          description: '生成周报成功!',
          type: "success",
          onClose: this.onClose,
          closeText: "关闭",
          showIcon: true
        }, 5)
      })
    }
    else if (key == 'delete') {
      let _this = this;
      
      let con = '';
      if(recond){
        con = <div><div>{recond.scode ? '编号：' + recond.scode : ''}</div><div>{recond.sname ? '名称：' + recond.sname : ''}</div></div>
      }
      VpConfirm({
        title: '您是否确认要删除这条信息',
        content: con,
        onOk() {
            _this.confirm(entityid, iid)
        },
        onCancel() { },
      });
      
    }
    else if (key == 'discuss') {
      this.discuss(e, entityid, iid)
    }
    else if (key == 'collect') {
      this.handleLike(e, entityid, iid, recond)
    }
    else {
      if (entityid == '7' && this.state.viewtype == 'pjtree') {
        iid = iid.substr(0, iid.length - 1);
      }
      this.jumpTabs(key, entityid, iid)
    }
    try {
      e.stopPropagation();
    }
    catch (e) { }
  }

  //更多操作列点击事件
  menuClick = (e, entityid, iid, recond) => {
    this.barEvent(e.key, e, entityid, iid, recond)
  }

  discuss = (e, ientityid, iids) => {
    try {
      e.stopPropagation();
    }
    catch (e) { }
    let skey = 'entity' + ientityid + '_discuss';
    this.jumpTabs(skey, ientityid, iids)
  }

  document = (e, ientityid, iids) => {
    try {
      e.stopPropagation();
    }
    catch (e) { }
    let skey = 'entity' + ientityid + '_file';
    this.jumpTabs(skey, ientityid, iids)
  }

  jumpTabs = (skey, ientityid, iids) => {
    this.setState({
      defaultActiveKey: skey + 'tab',
      showRightBox: true,
      entityiid: iids,
      row_entityid: ientityid,
      row_id: iids,
    })
  }

  documentList = (e, ientityid, iids) => {
    try {
      e.stopPropagation();
    }
    catch (e) { }
    let skey = 'entity' + ientityid + '_doclist';
    this.jumpDocListTabs(skey, ientityid, iids)
  }

  jumpDocListTabs = (skey, ientityid, iids) => {
    vpQuery('/{vppm}/project/getProjectBySub', {
      subiid: iids,
    }).then((response) => {
      this.setState({
        defaultActiveKey: skey + 'tab',
        showRightBox: true,
        subItemProjectId: response.data.iprojectid,
        entityiid: iids,
        row_entityid: ientityid,
        row_id: iids
      })
    })
  }

  //异步加载树
  onExpand(expanded, record) {
    if (this.state.viewtype == 'pjtree' && record.ientityid == '7' && expanded) {
      let iid = record.iid
      vpAdd('/{vpplat}/vfrm/entity/subList', {
        iid: iid.substr(0, iid.length - 1)
      }).then((response) => {
        record.children.splice(0)
        let sublist = response.data
        record.children.push(...sublist)
      })
    }
    if (!expanded) {
      const idx = this.state.expandedRowKeys.findIndex((iid) => record.key === iid)
      this.setState({
        expandedRowKeys: [...this.state.expandedRowKeys.slice(0, idx), ...this.state.expandedRowKeys.slice(idx + 1)]
      })
    } else {
      this.setState({
        expandedRowKeys: [...this.state.expandedRowKeys, record.key]
      })
    }
  }

  //点击下拉存放ID
  handleDropDown(e) {
    try {
      e.stopPropagation();
    }
    catch (e) { }
  }

  //获取导出类型
  exTypeData() {
    vpQuery('/{vpplat}/vfrm/entity/exListType', {
      entityid: this.state.entityid
    }).then((repsonse) => {
      if('114'==this.state.entityid&&repsonse.data){
        this.setState({
          exList: repsonse.data.splice(1,1)
        })
      }else{
        this.setState({
          exList: repsonse.data
        })
      }
    })
  }

  // 展开行
  getExpandedRowa = (srcArr, resArr) => {
    const _this = this
    let expandArr = resArr
    if (srcArr.length) {
      let tmpArr = []
      srcArr.map((item) => {
        expandArr.push(item.key)
        if (item.hasOwnProperty('children') && _this.state.viewtype != 'pjtree') {
          tmpArr = _this.getExpandedRowa(item.children, expandArr)
          tmpArr.map((tmpid) => {
            const idx = expandArr.findIndex((iid) => tmpid === iid)
            if (idx == -1) {
              expandArr.push(tmpid)
            }
          })
        }
      })
    }
    return expandArr
  }

  handleSearchForm = (searchData, searchFormValues) => {
    this.setState({
      searchData,
      searchFormValues,
      s_visible: false
    })
  }

  inputNameFlag = () => {
    this.setState({
      conditionVisibleFlag: true
    })
  }
  //关闭查询条件名称保存
  closeConditionModalFlag = () => {
    this.setState({
      conditionVisibleFlag: false
    });
  }
  //保存查询条件
  saveSearchCondition = (sname) => {
    vpAdd('/{vpplat}/vfrm/entity/saveSearchForm', {
      entityid: this.state.entityid,
      functionid: this.state.functionid,
      sname: sname,
      data: JSON.stringify(this.state.searchData),
      formdata: JSON.stringify(this.state.searchFormValues)
    }).then((response) => {
      let data = response.data
      if (data) {
        let searchFormValues = this.state.searchFormValues;
        searchFormValues.selectchildren = data;
        this.setState({ selectchildren: data, conditionVisibleFlag: false, searchFormValues });
        VpAlertMsg({
          message: "消息提示",
          description: '保存成功！',
          type: "success",
          onClose: this.onClose,
          closeText: "关闭",
          showIcon: true
        }, 5)
      }
    })
  }

  // 搜索框确定事件
  handlesearch = (value) => {
    this.setState({
      cur_page: 1,
      quickvalue: value
    })
  }
  changesearch = (value) => {
      const quickvalue = $.trim(value)
      this.state.quickvalue = quickvalue
  }

  onShowSizeChange(value) {
  }


  //删除数据确认事件
  confirm = (entityid, iid) => {
    const _this = this;
    vpAdd('/{vpplat}/vfrm/entity/deleteData', {
      iid: iid,
      entityid: entityid
    }).then(function (data) {
      _this.tableRef.getTableData();
    })
  }

  // 展示右侧弹出
  showModal(e) {
    const { id } = e.target.dataset;
    this.setState({
      showRightBox: true,
      isAdd: false
    })
  }
  // 关闭右侧弹出    
  closeRightModal() {
    this.setState({
      showRightBox: false,
      tabs_array: [],
      add: false,
      istatusid: '',
      row_id: '',
      currentclassname: ''
    })
    if (this.state.view === 'gantt') {
      
    } else { // 保存并关闭后重新加载数据
      this.tableRef.getTableData()
    }
    this.queryTaskStatus()
    try {
      this.props.setBreadCrumb()
    }
    catch(e) {

    }
  }

  //关闭变迁状态弹出的模态框
  handleStatusCancel() {
    this.setState({
      visible: false,
      entityVisible: false,
      varilsForm: {},
    })
  }
  //关闭变迁状态弹出的模态框
  cancelModal() {
    this.setState({
      visible: false,
      entityVisible: false,
      varilsForm: {}
    })
  }
  handleOk() {
    this.setState({
      showRightBox: false,
    })
    this.saveRowData(this.props.form.getFieldsValue());
  }
  handleVisibleChange() {
    if (!this.chooseVisible) {
      let { SearchFormData } = this.state
      if (SearchFormData.groups.length > 0) {
        this.setState({ s_visible: !this.state.s_visible })
      } else {
        VpAlertMsg({
          message: "消息提示",
          description: '暂无可搜索项，请配置搜索表单！',
          type: "error",
          onClose: this.onClose,
          closeText: "关闭",
          showIcon: true
        }, 5)
      }
    }
  }
  onRowClick(record, index) {
    let iids = record.iid
    let sname = record.sname
    let scode = record.scode
    let ientityid = record.ientityid
    this.setState({
      showRightBox: true,
      subItemProjectId: record.iprojectid,
      add: false,
      entityiid: iids,
      row_entityid: ientityid,
      row_id: iids,
      s_visible: false,
      defaultActiveKey: "",
      sname: sname,
      scode: scode
    });
    this.props.setBreadCrumb(sname)
  }

  //查询实体权限
  queryentityRole = (entityid, iid) => {
    vpQuery('/{vpplat}/vfrm/entity/entityRole', {
      entityid, iid
    }).then((response) => {
      this.setState({
        entityrole: response.data.entityRole
      })
    })
  }

  handleStatus = (item, value, error) => {

  }


  //导入导出模板点击事件
  handleMenuClick(e) {
    let type = e.item.props.type
    let key = e.key
    this.setState({
      extcurrentkey: key
    }, () => {
      if (type == 5) {
        this.setState({
          entityVisible: true
        })
      } else {
      
        vpDownLoad("/{vpplat}/vfrm/ent/exportfile", {
          quickvalue: this.state.quickvalue,
          ientityid: this.state.entityid,
          type: 'expdata',
          viewcode: 'expexcel',
          filtervalue: this.state.filtervalue,
          currentkey: this.state.currentkey,
          condition: JSON.stringify(this.state.searchData),
          custparam:this.state.sparam
        })
      }
    })
  }

  handleSubmit(type) {
    if (type == 'upload') {
      //导入数据
      this.inputUploader.upload.upload()
    } else {
      //导出数据
      vpDownLoad("/{vpplat}/vfrm/ent/exportfile",
        {
          ientityid: this.state.entityid,
          type: ''
        })
    }
  }

  uploadSuccess = (file, res) => {
    VpAlertMsg({
      message: "消息提示",
      description: '导入成功！',
      type: "success",
      onClose: this.onClose,
      closeText: "关闭",
      showIcon: true
    }, 5)
    this.setState({
      entityVisible: false
    }, () => this.tableRef.getTableData())
  }

  uploadClick = () => {
    this.inputUploader.upload.on("beforeFileQueued", (file) => {
      this.props.form.setFieldsValue({ "xls_label": file.name })
    })
  }

  inputUploaderChange = (value) => {

  }

  cancelSearch = () => {
    this.setState({
      s_visible: false
    })
  }

  handleLike = (e, ientityid, iid) => {
    try {
      e.stopPropagation();
    }
    catch (e) { }
    vpAdd('/{vpplat}/vfrm/entity/handleLike', {
      ientityid,
      iid
    }).then((data) => {
      this.tableRef.getTableData()
    })
  }

  //左侧伸缩
  shrinkLeft = (e) => {
    this.setState({
      shrinkShow: !this.state.shrinkShow
    })
  }

  //查询任务所有的状态
  queryTaskStatus = () => {
    // '/{vpplat}/vfrm/tasks/board/statusList'
    vpQuery('/{vpplat}/vfrm/tasks/statusList', {
      entityid: this.state.entityid, iclasssid: this.state.classListSelect
    }).then((response) => {
      this.setState({
        statusboardlist: response.data,
      })
    })
  }

  onToggle = (info) => {
    this.setState({
      openKeys: info.open ? info.keyPath : info.keyPath.slice(1),
    });
  }

  queryclassList = () => {
    vpQuery('/{vpplat}/vfrm/tasks/classList', {
      entityid: this.state.entityid,
      sparam: this.state.sparam
    }).then((response) => {
      this.setState({
        classList: response.data,
        classListSelect: response.data[0].iid,
      })
    })
  }

  handleNewClick = (e) => {
    let viewcode = e.key.split(",")[1]
    let currentclassid = e.key.split(",")[0]
    let currentclassname = e.domEvent.currentTarget.innerText
    this.setState({
      showRightBox: true,
      row_entityid: this.state.entityid,
      row_id: '',
      add: true,
      entityiid: '',
      statusList: [],
      defaultActiveKey: '0',
      viewcode,
      currentclassid,
      currentclassname
    })
  }

  handleQuikNewClick = () => {
    let viewcode = this.state.classList[0].scode
    let currentclassid = this.state.classList[0].iid
    let currentclassname = this.state.classList[0].sname
    this.setState({
      showRightBox: true,
      row_entityid: this.state.entityid,
      row_id: '',
      add: true,
      entityiid: '',
      statusList: [],
      defaultActiveKey: '0',
      viewcode,
      currentclassid,
      currentclassname
    })
  }

  //查询卡片视图的初始值
  defaultConfig = () => {
    vpQuery('/{vpplat}/vfrm/tasks/initview', {
      mainentityid: this.state.mainentityid,
      mainentityiid: this.state.mainentityiid
    }).then((response) => {
      let cardStatusList = []
      if (response.data != '' || response.data != null) {
        response.data.map((item, index) => {
          cardStatusList.push({ istatusid: item })
        })
      }
      this.setState({
        defaultStatusList: response.data,
        multiSelect: response.data,
        cardStatusList
      })
    })
  }

  //看板配置点击事件
  handleStatusConfig = () => {
    this.setState({
      cardconfig: !this.state.cardconfig
    })
  }

  //选择状态改变事件（看板中）
  handleMultiSelect = (value) => {
    this.setState({
      multiSelect: value
    })
  }

  //配置下拉dom渲染
  statusDom = () => {
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 17 },
    };
    return (
      <div className="task-boardform bg-white p-sm">
        {
          this.state.statusboardlist.length ?
            <VpForm horizontal ref='form' style={{ marginTop: 3 }}>
              <VpRow>
                <VpFSelect
                  label={'状态'}
                  {...formItemLayout}>
                  <VpSelect
                    multiple
                    placeholder="请选择状态"
                    defaultValue={this.state.defaultStatusList}
                    onChange={this.handleMultiSelect}>
                    {
                      this.state.statusboardlist.map((item, index) => {
                        return <VpOption key={index} value={item.iid}>{item.sname}</VpOption>
                      })
                    }
                  </VpSelect>
                </VpFSelect>
                <VpCol sm={24} className="text-center">
                  <VpButton className="vp-btn-br" style={{ marginTop: 10 }} type="primary" onClick={this.okStatusConfig}>保存</VpButton>
                  <VpButton className="vp-btn-br" style={{ marginTop: 10, marginLeft: 5 }} type="ghost" onClick={this.cancleStatusConfig}>取消</VpButton>
                </VpCol>
              </VpRow>
            </VpForm>
            : ''
        }
      </div>
    )
  }

  cancleStatusConfig = () => {
    this.setState({
      cardconfig: false
    })
  }

  okStatusConfig = () => {
    let multiSelect = this.state.multiSelect
    if (multiSelect.length == 0) {
      VpAlertMsg({
        message: "消息提示",
        description: '请选择需要配置的状态列！',
        type: "error",
        onClose: this.onClose,
        closeText: "关闭",
        showIcon: true
      }, 5)
    } else {
      let param = {
        multiSelect
      }
      vpAdd('/{vpplat}/vfrm/tasks/changeInitView', {
        param: JSON.stringify(param)
      }).then((response) => {
        let cardStatusList = []
        multiSelect.map((item, index) => {
          cardStatusList.push({ istatusid: item })
        })
        this.board.queryCardData(cardStatusList)
        this.setState({
          cardStatusList,
          cardconfig: false
        })
      })
    }
  }

  onRef = (ref) => {
    this.board = ref
  }

  //编辑表格新增
  handleEditAdd = () => {
    this.tableRef.addTableRow({ iid: this.objectid-- });
    let theight = vp.computedHeight(1, ".taskTable");
    this.setState({
      tableHeight: theight
    })
  }
  //编辑表格保存
  handleEditSave = () => {
    let editData = this.state.editrowdata
    if ($.isEmptyObject(editData)) {
      VpAlertMsg({
        message: "消息提示",
        description: '暂无可保存的数据！',
        type: "error",
        onClose: this.onClose,
        closeText: "关闭",
        showIcon: true
      }, 5)
      return;
    }
    let saveData = []
    for (const key in editData) {
      if (editData.hasOwnProperty(key)) {
        const rowdatas = editData[key];
        delete rowdatas['undefined'];
        delete rowdatas['className'];
        let fileinfo = this.state.filearr[rowdatas.iid]
        if (fileinfo != '' && fileinfo != undefined) {
          rowdatas['fileinfo'] = fileinfo
        }
        for (const field in rowdatas) {
          if (endWithStr(field, 'val')) {
            let newfield = field.replace("val", "")
            rowdatas[newfield] = rowdatas[field]
          }
        }
        rowdatas.iid = rowdatas.iid > 0 ? rowdatas.iid : ""
        saveData.push(rowdatas)
      }
    }
    vpAdd('/{vpplat}/vfrm/entity/saveEditData', {
      entityid: this.state.entityid,
      editData: JSON.stringify(saveData)
    }).then((response) => {
      this.tableRef.getTableData()
      this.setState({
        editrowdata: {},//需要保存的编辑数据
        filearr: {}
      })
    })
  }
  //编辑表格刷新
  handleReload = () => {
    this.setState({
      tableloading: true
    })
    this.tableRef.getTableData()
  }

  //表格数据加载完的回调
  controlAddButton = (numPerPage, resultList) => {
    let theight = vp.computedHeight(resultList.length, ".taskTable")
    let expandArr = this.getExpandedRowa(resultList, [])
    //设置展开行
    this.setState({
      tableloading: false,
      expandedRowKeys: expandArr,
      tableHeight: theight
    })
  }

  onUploadAccept = (file, response) => {
    const _this = this
    let fileinfo = { fileid: response.data.fileid, doctype: response.data.doctype }
    if (_this.state.filearr[_this.state.currentiid] != undefined &&
      _this.state.filearr[_this.state.currentiid] != null) {

      _this.state.filearr[_this.state.currentiid] = [
        ..._this.state.filearr[_this.state.currentiid],
        fileinfo
      ]
    } else {
      _this.state.filearr[_this.state.currentiid] = [
        fileinfo
      ]
    }
    this.setState({
      filearr: _this.state.filearr
    })
  }

  handleFileCancel = () => {
    this.setState({
      VpUploader: false
    })
  }

  render() {
    const _this = this
    let options = []
    const { filtervalue, openKeys, currentkey, showRightBox, classList: classListData, classListSelect } = this.state
    if (this.state.viewtype == 'edit') {
      options = [
        {
          title: '新增',
          tooltip: false,
          className: 'cursor blue',
          type: 'plus-circle-o',
          iconClickFunction: this.handleEditAdd,
        },
        {
          title: '保存',
          tooltip: false,
          className: 'cursor green',
          type: 'save',
          iconClickFunction: this.handleEditSave
        },
        {
          title: '刷新',
          tooltip: false,
          className: 'cursor sky_blue',
          type: 'reload',
          iconClickFunction: this.handleReload
        }
      ]
    }

    const extypeList = (
      <VpMenu onClick={this.handleMenuClick} selectedKeys={[this.state.extcurrentkey]}>
        {
          _this.state.exList.map((item, index) => {
            return (
              <VpMenuItem key={item.iid} type={item.iviewtype}>{item.sname}</VpMenuItem>
            )
          })
        }
      </VpMenu>
    )
    const menu = (
      <div className="search-form bg-white ant-dropdown-menu">
        <SearchForm chooseModalVisible={this.chooseModalVisible} cancelSearch={this.cancelSearch} handleSearchForm={this.handleSearchForm} defaultSearchValues={this.state.searchFormValues} formData={this.state.SearchFormData} entityid={this.state.entityid} functionid={this.state.functionid} inputNameFlag={this.inputNameFlag} />
      </div>
    )
    const classList = (
      <VpMenu onClick={this.handleNewClick}>
        {
          this.state.classList.map((item, index) => {
            return <VpMenuItem key={item.iid + ',' + item.scode}><VpIconFont type={item.icon} /> {item.sname}</VpMenuItem>
          })

        }
      </VpMenu>
    )

    return (
      <div className="business-container pr full-height task">
        <div className="subAssembly b-b bg-white" style={this.props.style}>
          <VpRow gutter={10}>
            <VpCol className="gutter-row" span={4}>
              <div className="m-b-sm search" >
              <SeachInput placeholder="请输入名称或编号" key={this.state.searchkey} onSearch={this.handlesearch} onChange={this.changesearch}/>
              </div>
            </VpCol>
            <VpCol className="gutter-row" span={4}>
              {
                classListData.length > 1 && this.state.view === 'card' && false &&
                <VpSelect
                  defaultValue={classListSelect}
                  placeholder="请选择类别"
                  style={{ width: 200 }}
                  onChange={this.handleChange}
                >
                  {
                    classListData.map((item, index) => <VpOption value={item.iid} key={index}>{item.sname}</VpOption>)
                  }
                </VpSelect>
              }

            </VpCol>
            <VpCol className="gutter-row text-right" span={16}>
              {
                // this.state.view == 'card' ?
                false ?
                  <VpTooltip placement="top" title="看板配置">
                    <VpDropdown
                      onClick={this.handleStatusConfig}
                      trigger={['click']}
                      overlay={this.statusDom()}
                      visible={this.state.cardconfig}
                      onVisibleChange={this.handleStatusConfig}
                    >
                      <div style={{ display: 'inline-block' }}>
                        <VpButton shape="circle" icon="setting" className="m-l-xs" />
                      </div>
                    </VpDropdown>
                  </VpTooltip>
                  : ''
              }
              {
                this.state.isaddflag == 1 && this.state.view !== 'card' ?
                  this.state.classList.length > 1 ?
                    <VpTooltip placement="top" title="快速创建">
                      <VpDropdown
                        trigger={['click']}
                        overlay={classList}
                      >
                        <div style={{ display: 'inline-block' }}>
                          <VpButton type="primary" shape="circle" icon="plus" className="m-l-xs" />
                        </div>
                      </VpDropdown>
                    </VpTooltip>
                    : <div style={{ display: 'inline-block' }} onClick={() => this.handleQuikNewClick()} ><QuickCreate /></div>
                  : ''
              }
              {
                this.state.view == 'tree' ?
                  <VpDropdown
                    trigger={['click']}
                    overlay={extypeList}
                  >
                    <div style={{ display: 'inline-block' }}>
                      <VpTooltip placement="top" title="导入导出">
                        <VpButton type="ghost" shape="circle" className="m-l-xs">
                          <VpIcon type="cloud-upload" />
                        </VpButton>
                      </VpTooltip>
                    </div>
                  </VpDropdown>
                  : ''
              }

              <VpDropdown
                onClick={this.handleVisibleChange} trigger={['click']}
                overlay={menu}
                onVisibleChange={this.handleVisibleChange}
                visible={this.state.s_visible}>
                <div style={{ display: 'inline-block' }} id="searchbox">
                  <FindCheckbox />
                </div>
              </VpDropdown>

              <div className="fr m-l-xs">
                <VpRadioGroup
                  defaultValue="tree"
                  className="radio-tab"
                  onChange={this.handleViewChange}
                >
                  {
                    //vp.config.vpplat != undefined && vp.config.vpplat.taskView != undefined && vp.config.vpplat.taskView.gantt == true ?
                    <VpRadioButton value="gantt">
                      <VpTooltip placement="top" title="甘特图">
                        <VpIconFont type="vpicon-task" />
                      </VpTooltip>
                    </VpRadioButton>
                    //: null
                  }
                  {
                    //vp.config.vpplat != undefined && vp.config.vpplat.taskView != undefined && vp.config.vpplat.taskView.card == true ?
                    <VpRadioButton value="card">
                      <VpTooltip placement="top" title="看板视图">
                        <VpIconFont type="vpicon-fenlei" />
                      </VpTooltip>
                    </VpRadioButton>
                    //: null
                  }
                  {
                    //vp.config.vpplat != undefined && vp.config.vpplat.taskView != undefined && vp.config.vpplat.taskView.tree == true ?
                    <VpRadioButton value="tree">
                      <VpTooltip placement="top" title="树视图">
                        <VpIconFont type="vpicon-file-tree" />
                      </VpTooltip>
                    </VpRadioButton>
                    //: null
                  }
                  {
                    //vp.config.vpplat != undefined && vp.config.vpplat.taskView != undefined && vp.config.vpplat.taskView.editList == true ?
                    <VpRadioButton value="edit">
                      <VpTooltip placement="top" title="编辑视图">
                        <VpIconFont type="vpicon-demand" />
                      </VpTooltip>
                    </VpRadioButton>
                    //: null
                  }

                </VpRadioGroup>
              </div>

            </VpCol>
          </VpRow>
        </div>
        <div className="business-wrapper p-t-sm full-height" id="table">
          <div className="bg-white p-sm entity-list full-height">
            <VpRow gutter={16} className="full-height">
              <VpCol span={this.state.shrinkShow ? '4' : '0'} className="full-height menuleft">
                <VpMenu className="full-height scroll-y"
                  onClick={this.handleClick}
                  openKeys={this.state.openKeys}
                  onOpen={this.onToggle}
                  onClose={this.onToggle}
                  selectedKeys={[this.state.filtervalue]}
                  mode="inline"
                >
                  <VpSubMenu key="filter" title={<span><VpIconFont type="vpicon-filter" className="m-r-xs" /><span className="f14">过滤器</span></span>}>
                    {
                      this.state.filters.map((item, index) => {
                        return <VpMenuItem className="menu-text-overflow" key={item.value}><span className="f14">{item.name}</span></VpMenuItem>
                      })
                    }
                  </VpSubMenu>
                  {/* <VpSubMenu
                    className={this.state.view === 'card' || this.state.view === 'gantt' ? 'hidden' : ''}
                    key="status"
                    title={<span><VpIconFont type="vpicon-loading" className="m-r-xs" /><span className="f14">状态</span></span>}>
                    {
                      this.state.statusFilters.map((item, index) => {
                        return <VpMenuItem className="menu-text-overflow" key={item.value}><span className="f14">{item.name}</span></VpMenuItem>
                      })
                    }
                    <VpMenuItem className="f14" key='0'><span className="f14">全部</span></VpMenuItem>
                  </VpSubMenu>
                  <VpSubMenu
                    className={this.state.view === 'card' || this.state.view === 'gantt' ? 'hidden' : ''}
                    key="class"
                    title={<span><VpIconFont type="vpicon-fenlei" className="m-r-xs" /><span className="f14">类别</span></span>}>
                    {
                      this.state.classFilters.map((item, index) => {
                        return <VpMenuItem className="menu-text-overflow" key={item.value}><span className="f14">{item.name}</span></VpMenuItem>
                      })
                    }
                    <VpMenuItem className="f14" key='0'><span className="f14">全部</span></VpMenuItem>
                  </VpSubMenu> */}
                </VpMenu>
              </VpCol>
              <VpCol span={this.state.shrinkShow ? '20' : '24'} className="full-height scroll-y pr">
                <div className="togglebar cursor text-center" onClick={this.shrinkLeft}>
                  <VpIconFont className="f12" type={`${this.state.shrinkShow ? 'vpicon-caret-left-s' : 'vpicon-caret-right-s'}`} />
                </div>
                {
                  this.state.filtervalue != undefined && (this.state.view === 'tree' || this.state.view === 'edit') ?
                    <div className={this.state.viewtype == 'edit' ? "batch-table" : ""} style={{ height: '100%' }}>
                      <VpTable
                        loading={this.state.tableloading}
                        ref={table => this.tableRef = table}
                        queryMethod="POST"
                        onExpand={this.onExpand}
                        expandedRowKeys={this.state.expandedRowKeys}
                        controlAddButton={
                          (numPerPage, resultList) => {
                            this.controlAddButton(numPerPage, resultList)
                          }
                        }
                        dataUrl={'/{vpplat}/vfrm/entity/dynamicListData'}
                        params={{
                          entityid: this.state.entityid,
                          currentkey: this.state.currentkey,
                          condition: JSON.stringify(this.state.searchData),
                          filtervalue: this.state.filtervalue,
                          quickSearch: this.state.quickvalue,
                          viewtype: this.state.viewtype == 'edit' ? 'initeditlist' : this.state.viewtype,
                          datafilter: 'auth',
                          functionid: this.state.functionid,
                          sparam: this.state.sparam
                        }}
                        className="taskTable"
                        expandIconColumnIndex={1}
                        columns={this.state.table_headers}
                        onRowClick={this.state.viewtype == 'edit' ? null : this.onRowClick}
                        tableOptions={options}
                        bindThis={this}
                        showTotal={this.state.viewtype == 'tree' ? true : false}
                        rowKey={'iid'}
                        scroll={{ y: this.state.tableHeight }}
                        resize
                      />
                    </div>
                    : null
                }
                {
                  this.state.filtervalue != undefined && this.state.view === 'card' &&
                  <DragBox
                    classListSelect={this.state.classListSelect}
                    functionid={this.state.functionid}
                    sparam={this.state.sparam}
                    entityid={this.state.entityid}
                    filter={{
                      filtervalue, openKeys, currentkey
                    }}
                  />
                }
                {
                  this.state.filtervalue != undefined && this.state.view === 'gantt' &&
                  <Gantt
                    filter={{
                      filtervalue, openKeys, currentkey
                    }}
                    params={{
                      entityid: this.state.entityid,
                      currentkey: this.state.currentkey,
                      condition: JSON.stringify(this.state.searchData),
                      filtervalue: this.state.filtervalue,
                      functionid: this.state.functionid,
                      sparam: this.state.sparam,
                      quickSearch: this.state.quickvalue,
                      viewtype: this.state.viewtype == 'edit' ? 'initeditlist' : this.state.viewtype,
                      datafilter: 'auth',//权限过滤需要加这个参数
                      _k: this.state.timestamp
                    }}
                    showRightBox={showRightBox}
                  />
                }
              </VpCol>
            </VpRow>
          </div>
        </div>
        <div className="drawer-fixed p-sm hide">
          <div className="pr full-height">
            <div className="spin-icon" onclick="closeDrawer">
              <VpIcon type="verticle-left" />
            </div>
            <div className="drawer-box">

            </div>
          </div>
        </div>

        <RightBox
          max={!this.state.isAdd}
          button={
            <div className="icon p-xs" onClick={this.closeRightModal}>
              <VpTooltip placement="top" title=''>
                <VpIcon type="right" />
              </VpTooltip>
            </div>
          }
          tips={
            <div className="tips p-xs">
              <VpTooltip placement="top" title={this.state.sname + '(' + this.state.scode + ')'}>
                <VpIcon type="exclamation-circle text-muted m-r-xs" />
              </VpTooltip>
            </div>
          }
          show={showRightBox}>
          {
            showRightBox ?
              <DynamicTabs
                param={{
                  entityid: this.state.row_entityid,
                  iid: this.state.row_id,
                  type: this.state.add,
                  viewtype: this.state.viewtype,
                  entitytype: this.state.entitytype,
                  defaultActiveKey: this.state.defaultActiveKey,
                  functionid: this.state.functionid,
                  sparam: this.state.sparam
                }}
                data={{
                  currentclassid: this.state.currentclassid,
                  viewcode: this.state.viewcode
                }}
                setBreadCrumb={(sname) => this.props.setBreadCrumb(sname + (undefined!=this.state.currentclassname?this.state.currentclassname:''))}
                closeRightModal={() => this.closeRightModal()}
                refreshList={() => {

                  if (this.state.view === 'gantt') {
                    this.setState({
                      showRightBox: false,
                    })
                  } else {
                    this.tableRef.getTableData()
                  }
                }}
              />
              :
              null
          }
        </RightBox>

        <VpModal
          title='实体导入'
          visible={this.state.entityVisible}
          onCancel={() => this.cancelModal()}
          width={'70%'}
          height={'80%'}
          footer={null}
          wrapClassName='modal-no-footer'
        >
          {
            this.state.entityVisible ?
              <div onClick={this.uploadClick}>
                <VpInputUploader form={this.props.form} item={{
                  field_name: "xls",
                  widget_type: "inputupload",
                  field_label: "选择文件",
                  all_line: 2,
                  tips: '请选择文件（*.xls,*.xlsx)',
                  auto: false,
                  widget: {
                    accept: {
                      title: 'Xls',
                      extensions: 'xlsx,xls',
                    },
                    upload_url: window.vp.config.URL.localHost + "/zuul/{vpplat}/vfrm/ent/importfile?entityid=" + this.state.entityid,
                  }
                }}
                  ref={upload => this.inputUploader = upload}
                  onUploadAccept={this.uploadSuccess} />
              </div>
              : null
          }
          <div className="footFixed p-sm b-t text-center">
            <VpButton type="primary" onClick={() => this.handleSubmit('upload')}>导入数据</VpButton>
            <VpButton style={{ marginLeft: '10px' }} type="primary" onClick={() => this.handleSubmit('download')}>下载模板</VpButton>
          </div>
        </VpModal>
        <VpModal
          title="选择附件"
          visible={this.state.VpUploader}
          onOk={this.handleFileCancel}
          onCancel={this.handleFileCancel}
          width={'70%'}
          height={'80%'}
          wrapClassName='modal-no-footer dynamic-modal'>
          {
            this.state.VpUploader ?
              <VpUploader
                server="/zuul/{vpplat}/file/uploadfile"
                onUploadAccept={this.onUploadAccept}
                fileTypes={this.state.doctypelist}
                selectType={this.state.selectType}
              />
              : null
          }
        </VpModal>
        <VpModal
          title='名称'
          visible={this.state.conditionVisibleFlag}
          footer={null}
          onCancel={() => this.closeConditionModalFlag()}
          width={'30%'}
          height={'40%'}
          ref="modal"
          closable={true}
          maskClosable={false}
        >
          <InputSearchName
            onCancel={this.closeConditionModalFlag}
            onOk={this.saveSearchCondition}
          />
        </VpModal>
      </div>
    );
  }
}

export default task = VpFormCreate(task)
