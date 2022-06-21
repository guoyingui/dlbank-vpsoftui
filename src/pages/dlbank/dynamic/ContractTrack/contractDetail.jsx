import React, { Component } from 'react';
import {
    VpRow,
    VpFormCreate,
    VpTable,
    VpCol,
    VpTooltip,
    VpButton,
    VpIcon,
    VpTabs,
    VpTabPane,
    vpQuery,
    vpAdd,
    VpAlertMsg
} from 'vpreact';
import { QuickCreate, RightBox, VpDynamicForm } from 'vpbusiness';
import { formatDateTime } from 'utils/utils';
//计划
function contractplan() {
    var header = [
        // {
        //     title: '名称',
        //     dataIndex: 'sname',
        //     key: 'sname',
        //     width: '',
        //     fixed: ''
        // },
        {
            title: '收款方',
            dataIndex: 'sdescription',
            key: 'sdescription',
            width: '',
            fixed: ''
        },
        {
            title: '计划付款日期',
            dataIndex: 'dplandate',
            key: 'dplandate',
            width: '',
            fixed: ''
        },
        {
            title: '金额（元）',
            dataIndex: 'iplannedamount',
            key: 'iplannedamount',
            width: '',
            fixed: ''
        },
        // {
        //     title: '计划比例（%）',
        //     dataIndex: 'iplanpercent',
        //     key: 'iplanpercent',
        //     width: '',
        //     fixed: ''
        // },
        // {
        //     title: '结算方式',
        //     dataIndex: 'ssettlementway',
        //     key: 'ssettlementway',
        //     width: '',
        //     fixed: ''
        // },
        // {
        //     title: '收款条件',
        //     dataIndex: 'sincomeconditions',
        //     key: 'sincomeconditions',
        //     width: '',
        //     fixed: ''
        // },
      
        {
            title: '备注',
            dataIndex: 'sremark',
            key: 'sremark',
            width: '',
            fixed: ''
        }
    ];
    return header;
}
//实际
function contractactual() {
    var header = [
        
        {
            title: '收款方',
            dataIndex: 'sdescription',
            key: 'sdescription',
            width: '',
            fixed: ''
        },
        {
            title: '项目类型',
            dataIndex: 'fylx_label',
            key: 'fylx_label',
            width: '',
            fixed: ''
        },
        {
            title: '实际付款日期',
            dataIndex: 'dactualdate',
            key: 'dactualdate',
            width: '',
            fixed: ''
        },
        {
            title: '付款金额（元）',
            dataIndex: 'iactualamount',
            key: 'iactualamount',
            width: '',
            fixed: ''
        },
        {
            title: '摘要凭证',
            dataIndex: 'sremark',
            key: 'sremark',
            width: '',
            fixed: ''
        },
        
    ];
    return header;
}
//开票
function contractinvoice() {
    var header = [
        {
            title: '发票号',
            dataIndex: 'sname',
            key: 'sname',
            width: '',
            fixed: ''
        },
        {
            title: '付款方名称',
            dataIndex: 'spaymentname',
            key: 'spaymentname',
            width: '',
            fixed: ''
        },
        {
            title: '付款方经办人',
            dataIndex: 'spaymentnum',
            key: 'spaymentnum',
            width: '',
            fixed: ''
        },
        {
            title: '收款方名称',
            dataIndex: 'sreceivablesname',
            key: 'sreceivablesname',
            width: '',
            fixed: ''
        },
        {
            title: '收款方经办人',
            dataIndex: 'sreceivablesnum',
            key: 'sreceivablesnum',
            width: '',
            fixed: ''
        },
        {
            title: '发票金额（元）',
            dataIndex: 'iinvoicevalue',
            key: 'iinvoicevalue',
            width: '',
            fixed: ''
        },
        {
            title: '开票日期',
            dataIndex: 'dinvoicedate',
            key: 'dinvoicedate',
            width: '',
            fixed: ''
        },
        {
            title: '开票人',
            dataIndex: 'iinvoiceuser_name',
            key: 'iinvoiceuser_name',
            width: '',
            fixed: ''
        },
        {
            title: '备注',
            dataIndex: 'sremark',
            key: 'sremark',
            width: '',
            fixed: ''
        }
    ];
    return header;
}

//比较结束时间和开始时间
function validateDate(value, key) {
    let result = {};
    result.flag = true;
    let start = "";
    let end = "";
    if (value[key] != null || value[key] != '') {
        end = value[key];
        if (end != '') {
            if (key == 'dforecastenddate') {
                //formatDateTime
                start = value.dforecaststartdate;
                if (start > end) {
                    result.flag = false;
                    result.msg = '预测开始时间不能大于预测结束时间！';
                }
            } else if (key == 'dplanenddate') {
                start = value.dplanstartdate;
                if (start > end) {
                    result.flag = false;
                    result.msg = '计划开始时间不能大于预测结束时间！';
                }
            } else {
                start = value.dactualstartdate;
                if (start > end) {
                    result.flag = false;
                    result.msg = '实际开始时间不能大于实际结束时间！';
                }
            }
        }
    }
    return result;
}


class contractDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            filter: '0',
            max: false,
            showRightBox: false,
            title: "",
            viewtype: this.props.skey,
            tableHeader: [],
            tabledata: [],
            formdata: [],
            iid: '',
            pagination: {},
            currentPage: 1,
            numPerPage: 10,
            total_rows: 0,
            selectedRowKeys: [],
            loading: false,
            famount:0
        }

    }
    componentWillMount() {
        let skey = this.props.skey
        let tableHeader = "";
        if (skey == "invoice") {
            tableHeader = contractinvoice()
        } else if (skey == "actual") {
            tableHeader = contractactual()
        } else {
            tableHeader = contractplan()
        }
        this.setState({
            tableHeader
        })
        this.queryListData()
    }
    componentDidMount() {
        $('.contractDetail').find('.ant-table-body').height($(window).height() - 255)
    }
    queryListData = () => {
        vpQuery('/{vppm}/dlbank/contract/page', {
            contractid: this.props.contractid,
            viewtype: this.props.skey,
            currentPage: this.state.currentPage,
            numPerPage: this.state.numPerPage,
        }).then((response) => {
            let data = response.data.list
            let showTotal = () => {
                return '共' + data.totalRows + '条'
            }
            this.setState({
                tabledata: data.resultList,
                currentPage: data.currentPage,
                total_rows: data.totalRows,
                numPerPage: data.numPerPage,
                entityrole: response.data.entityrole,
                pagination: {
                    total: data.totalRows,
                    showTotal: showTotal,
                    pageSize: data.numPerPage,
                    onShowSizeChange: this.onShowSizeChange,
                    showSizeChanger: true,
                    showQuickJumper: true,
                }
            })
        })
    }

    onShowSizeChange = (value) => {
    }
    // 表格的变动事件
    tableChange = (pagination, filters, sorter) => {
        let sorttype = ''
        if (sorter.order === 'descend') {
            sorttype = 'desc';
        } else if (sorter.order === 'ascend') {
            sorttype = 'asc';
        }
        this.setState({
            currentPage: pagination.current || this.state.currentPage,
            sortfield: sorter.field,
            sorttype,
            numPerPage: pagination.pageSize || this.state.numPerPage,
        }, () => {
            this.queryListData()
        })
    }
    queryFormData = () => {
        vpQuery('/{vppm}/dlbank/contract/getform', {
            viewtype: this.props.skey,
            iids: this.state.iid,
            contractid: this.props.contractid
        }).then((response) => {
            console.log("*****"+response.data.famount);
            this.setState({
                formdata: response.data.form,
                famount:response.data.famount
            })
        })
    }
    handleChange = (value) => {
        this.setState({
            filter: value
        })
    }
    setplanpercent = (value) => {
        const { setFieldsValue } = this.dynamic
        let  iplanpercent= 0;
        const _this=this;
        // if(value>_this.state.famount){
        //     setFieldsValue({ 'iplannedamount': 0})
        //     VpAlertMsg({
        //         message: "消息提示",
        //         description: "计划金额不能大于合同金额",
        //         type: "error",
        //         onClose: this.onClose,
        //         closeText: "关闭",
        //         showIcon: true
        //     }, 5)
           
        //     return
        // }

        if(_this.state.famount>0){
            iplanpercent= Math.round(parseFloat(value/_this.state.famount*100) * 100) / 100;
        }
        setFieldsValue({ 'iplanpercent': iplanpercent})
    }
    setactualpercent = (value) => {
        const { setFieldsValue } = this.dynamic
        let  iactualpercent= 0;
        const _this=this;
        // if(value>_this.state.famount){
        //     VpAlertMsg({
        //         message: "消息提示",
        //         description: "实际金额不能大于合同金额",
        //         type: "error",
        //         onClose: this.onClose,
        //         closeText: "关闭",
        //         showIcon: true
        //     }, 5)
        //     setFieldsValue({ 'iactualamount': 0})
        //     return
        // }
        if(_this.state.famount>0){
            iactualpercent= Math.round(parseFloat(value/_this.state.famount*100) * 100) / 100;
        }
        setFieldsValue({ 'iactualpercent': iactualpercent})
    }
    closeRightModal = () => {
        this.setState({
            showRightBox: false,
            formdata: {}
        })
    }
    onRowClick = (record, index) => {
        this.setState({
            showRightBox: true,
            title: "合同收付款",
            iid: record.iid
        }, () => {
            this.queryFormData()
        })
    }
    addNewAttr = () => {
        this.setState({
            showRightBox: true,
            title: "新建",
            iid: ''
        }, () => {
            this.queryFormData()
        })
    }
    handledelete = () => {
        let ids = this.state.selectedRowKeys.join(",")
        vpQuery('/{vppm}/contract/delete', {
            iids: ids,
            contractid: this.props.contractid,
            viewtype: this.props.skey
        }).then((response) => {
            this.setState({
                selectedRowKeys: []
            }, () => {
                this.queryListData()
            })
        })
    }
    saveRowData = (value, statusid) => {debugger
        // this.setState({
        //     loading: true
        // })
        const _this = this
        let vae = {}
        let success = true;
        Object.keys(value).forEach((key, i) => {
            if (value[key] == undefined) {
                value[key] = ''
            } else if (value[key] == null) {
                value[key] = 0
            } else if (value[key] instanceof Date) {
                value[key] = formatDateTime(value[key])
            }
            if (key == 'dforecastenddate' || key == 'dplanenddate' || key == 'dactualenddate') {
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
            if(key =='iplannedamount'||key=='iactualamount'){
                if(value[key]>parseFloat(_this.state.famount) ){
                    VpAlertMsg({
                        message: "消息提示",
                        description: "计划/实际金额不能大于合同金额",
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
        })
        if(success==false){
        	return;
        }
        vpAdd('/{vppm}/dlbank/contract/save', {
            sparam: JSON.stringify(vae),
            viewtype: this.props.skey,
            contractid: this.props.contractid,
            iid: this.state.iid
        }).then((response) => {
            _this.setState({
                showRightBox: false,
                formdata: {},
                loading: false,
            }, () => {
                _this.queryListData()
            })
        }).catch((err) => {
            _this.setState({
                loading: false
            })
        })
    }
    handleCancel = () => {
        this.setState({
            showRightBox: false,
            formdata: {}
        })
    }
    render() {
        const _this = this
        const { selectedRowKeys } = this.state
        const rowSelection = {
            onChange(selectedRowKeys, selectedRows) {
                _this.setState({
                    selectedRows,
                    selectedRowKeys
                })
            },
            onSelect(record, selected, selectedRows) {

            },
            onSelectAll(selected, selectedRows, changeRows) {

            },
            selectedRowKeys
        };

        return (
            <div className="business-container pr full-height" >
                <div className="subAssembly b-b bg-white" >
                    <VpRow gutter={10}>
                        <VpCol className="gutter-row" span={12}>
                        </VpCol>
                        <VpCol className="gutter-row text-right" span={12}>
                            <div style={{ display: 'inline-block' }} onClick={this.addNewAttr}><QuickCreate /></div>
                            <VpTooltip placement="top" title="删除">
                                <VpButton onClick={this.handledelete} style={{ marginLeft: '5' }} type="primary" shape="circle" icon="delete" />
                            </VpTooltip>
                        </VpCol>
                    </VpRow>
                </div>
                <div className="business-wrapper p-t-sm full-height">
                    <div className="p-sm bg-white">
                        <VpTable
                            className='contractDetail'
                            columns={this.state.tableHeader}
                            dataSource={this.state.tabledata}
                            pagination={this.state.pagination}
                            onRowClick={this.onRowClick}
                            onChange={this.tableChange}
                            rowKey={record => record.iid}
                            rowSelection={rowSelection}
                            resize
                            // bordered
                        />
                    </div>
                </div>
                <RightBox
                    max={this.state.max}
                    button={
                        <div className="icon p-xs" onClick={this.closeRightModal}>
                            <VpTooltip placement="top" title=''>
                                <VpIcon type="right" />
                            </VpTooltip>
                        </div>}
                    show={this.state.showRightBox}
                >
                    <VpTabs defaultActiveKey="0" >
                        <VpTabPane tab='属性' key={'0'}>
                            <VpDynamicForm
                                className="p-sm full-height scroll p-b-xxlg p-b-xxlg"
                                formData={this.state.formdata}
                                handleOk={this.state.entityrole ? this.saveRowData : ''}
                                handleCancel={this.handleCancel}
                                loading={this.state.loading}
                                okText="保 存" 
                                ref={(node) => this.dynamic = node}
                                bindThis={this}
                                />
                        </VpTabPane>
                    </VpTabs>
                </RightBox>
            </div>
        )
    }
}


export default contractDetail = VpFormCreate(contractDetail);;
