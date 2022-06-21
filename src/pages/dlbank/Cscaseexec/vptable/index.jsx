import React, { Component } from 'react';
import {
    VpTooltip,
    VpIcon,
    VpModal,
    vpQuery,
    vpAdd,
    VpFormCreate,
    VpAlertMsg,
    VpWidgetGroup,
    VpTable,
    EditTableCol,

    VpMenu,
    VpMenuItem,
    VpDropdown,
    VpButton,
    VpIconFont,
} from 'vpreact';
import {
    RightBox
} from 'vpbusiness';
import { formatDateTime } from 'utils/utils';
import { requireFile } from "utils/utils";

const DynamicTabs = requireFile('vfm/DynamicTabs/dynamictabs');
import './index.less';
class Accessory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,//用例加载中
            selectedRowKeys: [],//被选择的案例ID集合
            implement_visible: false,//是否显示执行页面
            url: '/{vpplat}/csCaseExec/listPage',//我的
            fiturl: '/{vpplat}/csCaseExec/filterListPage',//全部
            plbjurl: '/{vpplat}/csCaseExec/listCasePage',//执行页面
            tableHeader: [],//用例表头
            plbjtableHeader: [],//执行页表头
            iid: '',//点击的用例IID
            showYLRightBox: false,//显示用例属性页
            maxHeight: 200,//执行页面表格高度
            showQXRightBox: false,//显示缺陷新建页
            data: [],
            flag: false,
            istatusidval: '',
            childrenBugClass2: [], // 不包括初始状态的 状态

            classList: [],
            defaultparam: {
                currentclassid: '',
                viewcode: '',
            },
            row_entityid: 62,
            row_id: ''
        }
    }
    callBack = (data) => {
        this.state.data.push(data);
    }
    componentWillMount() {
        //执行用例表头
        const _this = this;
        let tableHeader = [];
        vpAdd("/{vpplat}/vfrm/entity/editGrids", { entityid: 62, viewcode: 'editlist' }).then((res) => {
            res.data.fields.map((item, index) => {
                if (item.iconstraint >= 0) {
                    switch (item.field_name) {
                        case 'dcreatordate':
                            tableHeader.push({
                                title: item.field_label,
                                dataIndex: item.field_name,
                                fixed: item.fixed,
                                width: 150,
                                edit_col: item.edit_col,
                                widget: item.widget,
                                render: (text, record) => {
                                    return (<div title={formatDateTime(new Date(text))}>{formatDateTime(new Date(text))}</div>)
                                }
                            })
                            break;
                        case 'dmodified':
                            tableHeader.push({
                                title: item.field_label,
                                dataIndex: item.field_name,
                                fixed: item.fixed,
                                width: 150,
                                edit_col: item.edit_col,
                                widget: item.widget,
                                render: (text, record) => {
                                    return (<div title={formatDateTime(new Date(text))}>{formatDateTime(new Date(text))}</div>)
                                }
                            })
                            break;
                        case 'dsjrq':
                            tableHeader.push({
                                title: item.field_label,
                                dataIndex: item.field_name,
                                fixed: item.fixed,
                                width: 150,
                                edit_col: item.edit_col,
                                widget: item.widget,
                                render: (text, record) => {
                                    return (<div title={formatDateTime(new Date(text))}>{formatDateTime(new Date(text))}</div>)
                                }
                            })
                            break;
                        case 'dzxsj':
                            tableHeader.push({
                                title: item.field_label,
                                dataIndex: item.field_name,
                                fixed: item.fixed,
                                width: 150,
                                edit_col: item.edit_col,
                                widget: item.widget,
                                render: (text, record) => {
                                    return (<div title={formatDateTime(new Date(text))}>{formatDateTime(new Date(text))}</div>)
                                }
                            })
                            break;

                        case 'scode':
                            tableHeader.push({
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
                        case 'iassignto':
                            tableHeader.push({
                                title: '执行人',
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
                            tableHeader.push({
                                title: "执行状态",
                                dataIndex: item.field_name,
                                fixed: item.fixed,
                                width: 105,
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
                        default:
                            let width = 150;
                            switch (item.field_name) {
                                case 'iassignto':
                                    width = 100;
                                    break;
                                case 'sname':
                                    width = 180;
                                    break;
                            }
                            tableHeader.push({
                                title: item.field_label,
                                dataIndex: item.field_name,
                                fixed: item.fixed,
                                width,
                                edit_col: item.edit_col,
                                widget: item.widget,
                                render: (text, record) => {
                                    let newText = text;
                                    if (item.widget && item.widget.load_template) {
                                        item.widget.load_template.forEach(item => {
                                            if (item.value == text) {
                                                newText = item.label
                                            }
                                        });
                                    }
                                    return (
                                        <div key={newText} title={newText}>
                                            {newText}
                                        </div>
                                    )
                                }
                            });
                            break;
                    }
                }
            })
            tableHeader.push({
                title: '操作', fixed: 'right', width: 200, render: (text, record) => {
                    return (
                        <div onClick={(ev) => ev.stopPropagation()}>
                            {
                                this.state.childrenBugClass2.length > 0 ?
                                    this.state.childrenBugClass2.filter(item => {
                                        if (item.scode && item.scode.indexOf('-s-') != -1) {
                                            return true;
                                        }
                                        return false;
                                    }).map(item => {
                                        let iconType = null;
                                        let color = null;
                                        if (item.scode.indexOf('success') != -1) {
                                            iconType = "icon-checkcircleo";
                                            color = "#52c41a";
                                        } else if (item.scode.indexOf('fail') != -1) {
                                            iconType = "icon-crosscircleo";
                                            color = "#f5222d";
                                        }
                                        if (iconType && record.istatusidval && record.istatusidval != item.value) {
                                            return (<VpTooltip placement="top"
                                                title={item.label}
                                                key={item.value}>
                                                <VpIcon className={"cursor m-lr-xs f16 blue " + iconType}
                                                    type={iconType}
                                                    style={{ color }}
                                                    onClick={() => this.changeBugStatus(record, item.value)} />
                                            </VpTooltip>)
                                        }
                                    }) : ""
                            }
                            <VpTooltip placement="top" title="执行记录">
                                <VpIcon className="cursor m-lr-xs f16 blue" type="vpicon-lishijilu" onClick={() => this.showZXJL(record, false)} />
                            </VpTooltip>
                            {
                                //this.getAddBugReact([record.iid])
                            }
                            { <VpTooltip placement="top" title="新增缺陷">
                                <VpIcon className="cursor m-lr-xs f16 blue" type="vpicon-bug" onClick={(ev) => this._Newdefects([record.iid], false)} />
                            </VpTooltip> }
                        </div>
                    )
                }
            });
            //设置执行用例表头
            this.setState({
                loading: false,
                selectedRowKeys: [],
                tableHeader
            }, () => {
                setTimeout(() => {
                    if (this.state.maxHeight == 200) {
                        let theight = vp.computedHeight(0, ".entityTable2") - 30
                        $(".ant-table-placeholder").css("maxHeight", theight + "px");
                    }
                }, 800)
            })
        })


    }

    changeBugStatus = (record, status) => {
        vpQuery('/{vpplat}/csCaseExec/updateStatus', {
            ids: record.iid,
            status: status
        }).then((res) => {
            this.table.getTableData();
            VpAlertMsg({
                message: "成功提示",
                description: "修改成功！",
                type: "success",
                closeText: "关闭",
                showIcon: true
            })
        })
    }

    //渲染缺陷新建
    renderNewForm = () => {
        const { defaultparam } = this.state
        return (
            <DynamicTabs
                param={{
                    entityid: 64,
                    entitytype: 3,
                    iid: '',
                    type: true,
                    viewtype: '',
                    // entitytype: '2',
                    defaultActiveKey: "entity64_attrtab",
                    formType: 'tabs', //分辨出这个实体挂在tab页的，还是一级实体
                    mainentity: 62,  //从左边导航点进来的实体ID
                    mainentityiid: this.state.iid, //主实体的当前行数据ID
                    stabparam: 'rglcsyl',
                }}
                //defaultparam={defaultparam}
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

    componentWillReceiveProps(nextProps) {

    }
    componentDidMount() {
        this.selectStatus()
        this.queryclassList()
    }

    /**
     * 查询实体类别，绑定表单
     */
    queryclassList = () => {
        vpQuery('/{vpplat}/vfrm/tasks/classList', {
            entityid: 64,
        }).then((response) => {
            let classList = response.data
            this.setState({
                classList
            })
        })
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
                                    {
                                        //this.getAddBugReact([record.iid])
                                    }
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
    //用例选择框
    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({
            selectedRowKeys: selectedRowKeys
        });
    }
    //执行按钮方法
    implementAll = () => {
        if (this.state.selectedRowKeys.length >= 1) {
            this.setState({
                implement_visible: true
            })
        } else {
            VpAlertMsg({
                message: "消息提示",
                description: "请选择一条用例记录！",
                type: "info",
                closeText: "关闭",
                showIcon: true
            })
        }
    }
    //新增缺陷方法
    Newdefects = (ex = {}) => {
        if (this.state.selectedRowKeys.length == 0 || this.state.selectedRowKeys.length > 1) {
            VpAlertMsg({
                message: "消息提示",
                description: "请选择一行用例记录",
                type: "info",
                closeText: "关闭",
                showIcon: true
            })
        } else {
            this._Newdefects(this.state.selectedRowKeys, false, ex);
        }
    }

    handleNewFormClick = (e, iid) => {
        console.log(e, iid)
        let viewcode = e.key.split(",")[1]
        let currentclassid = e.key.split(",")[0]
        // let currentclassname = e.domEvent.currentTarget.innerText
        const params = {
            isFat: currentclassid == 334,
            defaultparam: {
                currentclassid,
                viewcode,
            },
        }
        if (iid) {
            this._Newdefects(iid, false, params)
            return
        }
        this.Newdefects(params)
    }

    // //新增
    // _Newdefects = (iid, flag, ex) => {
    //     //判断用例是否FAT类别
    //     vpQuery('/{vpplat}/csCaseExec/isFat', { iid: iid }).then((res) => {
    //         this.setState({
    //             isFat: res.data
    //         })
    //     })
    //     //显示缺陷新增
    //     this.setState({
    //         showQXRightBox: true,
    //         implement_visible: false,
    //         flag,
    //         iid: iid,
    //         ...ex,
    //     })
    // }

    //新增
  _Newdefects = (iid, flag) => {
    //判断用例是否FAT类别
    vpQuery('/{vpplat}/csCaseExec/isFat', { iid: iid }).then((res) => {
      this.setState({
        isFat: res.data
      })
    })
    
    vpQuery('/{vppm}/dlbank/three/queryBugClassByCase', { iid: iid }).then((res) => {
        this.setState({
        currentclassid: res.data,
        //显示缺陷新增
        showQXRightBox: true,
        implement_visible: false,
        flag,
        iid: iid
        })
    })
      
    // //显示缺陷新增
    // this.setState({
    //   showQXRightBox: true,
    //   implement_visible: false,
    //   flag,
    //   iid: iid
    // })
  }
    //列表刷新
    Refresh = () => {
        this.table.getTableData();
    }
    //列表分页、排序、筛选变化时触发
    tableChange = (pagination, filters, sorter) => {
        this.setState({
            selectedRowKeys: []
        });
    }
    //用例单击事件
    onRowClick = (record) => {
        //判断用例是否FAT类别
        // vpQuery('/{vpplat}/csCaseExec/isFat', { iid: record.iid }).then((res) => {
        //     this.setState({
        //         isFat: res.data
        //     })
        // })
        this.setState({
            showYLRightBox: true,
            implement_visible: false,
            flag: false,
            iid: record.iid,
            row_entityid: 62,
            row_id: record.iid,
            defaultActiveKey: 'entity62_attrtab'
        })
    }
    //查看执行记录
    showZXJL = (record, flag) => {
        this.setState({
            showYLRightBox: true,
            implement_visible: false,
            flag: flag,
            iid: record.iid,
            defaultActiveKey: 'entity62_exectab'
        })
    }
    //用例右滑关闭
    closeRightModal = () => {
        this.setState({
            showYLRightBox: false,//关闭用例属性
            implement_visible: this.state.flag
        }, () => {
            try {
                this.table.getTableData();
            } catch (error) { }

        })
    }
    //缺陷右划关闭
    closeQXRightModal = () => {
        this.setState({
            showQXRightBox: false,//关闭用例属性
            implement_visible: this.state.flag
        })
    }
    /**
   * 3.实际开始日期=点击“执行”按钮的操作时间
     4.实际完成日期=点击“执行”按钮，且执行状态=“运行通过”的操作时间（即执行记录执行结果=“运行通过”的执行日期）
   * @param {chenxl} values 
   */
  updateTestCaseInfo = (values) => {
    vpAdd('/{vppm}/testManageRest/updateTestCaseInfo', { sparam: JSON.stringify(values) }).then((res) => {
     
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
            this.table.getTableData();
            VpAlertMsg({
                message: "成功提示",
                description: "保存成功！",
                type: "success",
                closeText: "关闭",
                showIcon: true
            })
        })
    }
    //执行用例取消
    implementCancelModal = () => {
        this.setState({ implement_visible: false });
    }

    getAddBugReact = (iid = null) => {
        const classList = (
            <VpMenu onClick={(data) => this.handleNewFormClick(data, iid)}>
                {
                    this.state.classList.map((item, index) => {
                        return <VpMenuItem key={item.iid + ',' + item.scode}><VpIconFont type={item.icon} /> {item.sname}</VpMenuItem>
                    })

                }
            </VpMenu>
        )
        return (
            <VpTooltip placement="top" title="新增缺陷">
                <VpDropdown
                    trigger={['click']}
                    overlay={classList}
                >
                    <VpButton type="primary" shape="circle" type="vpicon-bug" className="bug">
                        <VpIconFont type="vpicon-bug" />
                    </VpButton>
                </VpDropdown>
            </VpTooltip>
        )
    }

    render() {
        //用例选择
        const rowSelection = { onChange: this.onSelectChange, selectedRowKeys: this.state.selectedRowKeys };
        //执行页操作按钮
        const options = [
            {
                title: '执行',
                icon: "vpicon-ecutive",
                type: "vpicon-ecutive",
                onClick: this.implementAll
            },
            //  {
            //     title: '新增缺陷',
            //     icon: "vpicon-bug",
            //     type: "vpicon-bug",
            //     // onClick: this.Newdefects,
            //     render: this.getAddBugReact,
            // },
             {
                title: '刷新',
                icon: "vpicon-reload",
                type: "vpicon-reload",
                onClick: this.Refresh
            }]
        return (
            <div className="guo_vtmcasesetexec autoHeight" >
                <div className='text-right'>
                    <VpWidgetGroup widgets={options} />
                </div>
                <VpTable
                    ref={(dom) => { this.table = dom }}
                    onChange={this.tableChange}
                    queryMethod='GET'
                    loading={this.state.loading}
                    rowSelection={rowSelection}
                    columns={this.state.tableHeader}
                    dataUrl={this.props.radioValue != 1 ? this.state.fiturl : this.state.url}
                    params={{
                        entityid: this.props.entityid,
                        scodeOrName: this.props.quickvalue,
                        zxbz: this.props.radioValue,
                        nodeId: this.props.nodeId,
                        model_code: this.props.model_code,
                        selectvalues: this.props.selectvalues,
                        selectPersonvalues: this.props.selectPersonvalues
                    }}
                    className="entityTable2"
                    scroll={{ y: this.state.maxHeight, x: 600 }}
                    waitParam={this.props.waitParam}
                    rowKey="iid"
                    onRowClick={this.onRowClick}
                    bindThis={this}
                    resize
                    controlAddButton={(numPerPage, resultList) => {
                        let theight = vp.computedHeight(resultList.length, ".entityTable2") - 30
                        this.setState({
                            maxHeight: theight,
                            selectedRowKeys: []
                        })
                    }}
                    customPagination={{
                        pageSizeOptions: ['10', '20', '30', '40']
                    }}
                    defaultNumPerPage={10}
                />
                <RightBox
                    max={false}
                    button={
                        <div className="icon p-xs" onClick={this.closeRightModal}>
                            <VpTooltip placement="top" title=''>
                                <VpIcon type="right" />
                            </VpTooltip>
                        </div>}
                    show={this.state.showYLRightBox}>
                    {this.state.showYLRightBox ? 
                    <DynamicTabs
                        param={{
                            entityid:62,
                            iid: this.state.iid,
                            type: false,
                            viewtype: this.state.viewtype,
                            entitytype: this.state.entitytype,
                            defaultActiveKey: this.state.defaultActiveKey,
                            formType: 'tabs', //分辨出这个实体挂在tab页的，还是一级实体
                            mainentity:62,
                            mainentityiid:this.state.iid,
                            issubitem: '0',
                            sfrom:'csexec'
                        }}
                    defaultparam={{
                        currentclassid: this.state.currentclassid,
                        viewcode: this.state.viewcode
                    }}
                    setBreadCrumb={(sname) => { }}
                    data={{
                        currentclassid: '',
                        viewcode: ''
                    }}
                    closeRightModal={() => this.closeRightModal()}
                    refreshList={() => this.tableRef.getTableData()}
                />

                : null}
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
                    {
                        this.state.showQXRightBox ?
                            this.renderNewForm()
                            :
                            null
                    }
                </RightBox>
                <VpModal
                    width="80%"
                    style={{ height: "700px" }}
                    title="执行"
                    visible={this.state.implement_visible}
                    onOk={this.implementOkModal}
                    onCancel={this.implementCancelModal}
                    wrapClassName={"ant-modal-mask"}>
                    <div className="full-height ant-table-visible x-cscaseexec-table">
                        <VpTable
                            ref={(dom) => { this.plbjtable = dom }}
                            queryMethod='GET'
                            columns={this.state.plbjtableHeader}
                            dataUrl={this.state.plbjurl}
                            params={{ iids: this.state.selectedRowKeys.join(',') }}
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
export default Accessory = VpFormCreate(Accessory);