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
    VpAlertMsg,
    VpPopconfirm
} from 'vpreact';
import { SeachInput } from 'vpbusiness';
import { formatDateTime } from 'utils/utils';

function getHeader() {
    var header = [

        {
            title: '类型',
            dataIndex: 'lb',
            key: 'lb',
            width: '',
            fixed: ''
        },
        {
            title: '编号',
            dataIndex: 'scode',
            key: 'scode',
            width: '',
            fixed: ''
        },
        {
            title: '名称',
            dataIndex: 'sname',
            key: 'sname',
            width: '',
            fixed: ''
        },
        {
            title: '需求/投产状态',
            dataIndex: 'statusname',
            key: 'statusname',
            width: '',
            fixed: ''
        },
        {
            title: '创建时间',
            dataIndex: 'dcreatedate',
            key: 'dcreatedate',
            width: '',
            fixed: ''
        },
        {
            title: '记录状态',
            dataIndex: 'sstatus',
            key: 'sstatus',
            width: '',
            fixed: ''
        },
        {
            title: '修改时间',
            dataIndex: 'dmodifydate',
            key: 'dmodifydate',
            width: '',
            fixed: ''
        },
        {
            title: '原因描述',
            dataIndex: 'smsg',
            key: 'smsg',
            width: '',
            fixed: ''
        }
    ];
    return header;
}

function getHeader2() {
    var header = [

        {
            title: '描述',
            dataIndex: 'sdesc',
            key: 'sdesc',
            width: '',
            fixed: ''
        },
        
        {
            title: '创建时间',
            dataIndex: 'dcreatetime',
            key: 'dcreatetime',
            width: '',
            fixed: ''
        },
        {
            title: '记录状态',
            dataIndex: 'sstatus',
            key: 'sstatus',
            width: '',
            fixed: ''
        },
        {
            title: '请求参数',
            dataIndex: 'sparam',
            key: 'sparam',
            width: '',
            fixed: ''
        },
        {
            title: '结束时间',
            dataIndex: 'dendtime',
            key: 'dendtime',
            width: '',
            fixed: ''
        },
        {
            title: '原因描述',
            dataIndex: 'smsg',
            key: 'smsg',
            width: '',
            fixed: ''
        }
    ];
    return header;
}

class itsmPushLog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            filter: '0',
            max: false,
            showRightBox: false,
            title: "",
            row_id: '',
            ientityid: '',
            tableHeader: [],
            tabledata: [],
            tableHeader2: [],
            tabledata2: [],
            formdata: [],
            iid: '',
            pagination: {},
            currentPage: 1,
            numPerPage: 10,
            total_rows: 0,
            selectedRowKeys: [],
            loading: false,
            famount: 0,
            surl:'/{vppm}/dlbank/three/toITSMPushList'
        }
        this.handleConfirm = this.handleConfirm.bind(this);
        this.handlesearch = this.handlesearch.bind(this);
    }
    componentWillMount() {
        this.getData();
    }
    componentDidMount() {
        //$('.contractDetail').find('.ant-table-body').height($(window).height() - 255)
    }
    queryListData = () => {
        let url  = this.state.surl
        vpQuery(url, {
            currentPage: this.state.currentPage,
            numPerPage: this.state.numPerPage,
            quicksearch: this.state.quickvalue
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

    handleChange = (value) => {
        this.setState({
            filter: value
        })
    }

    closeRightModal = () => {
        this.setState({
            showRightBox: false,
            formdata: {}
        })
    }

    // 搜索框确定事件
    handlesearch(value) {
        const searchVal = $.trim(value)
        this.setState({
            quickvalue: searchVal,
            currentPage: 1
        }, () => {
            this.queryListData()
        })
    }
    //删除数据事件
    handleConfirm(e) {
        e.stopPropagation();
        let row_id = e.target.dataset.id;
        let lb = e.target.dataset.lb;
        this.setState({ row_id,lb });

    }
    handledelete = () => {
        console.log('thissss', this.state)
        vpQuery('/{vppm}/dlbank/three/toRePush', {
            iid: this.state.row_id,
            lb:this.state.lb
        }).then((response) => {
            let data = response.data
            if (data && data.success) {
                this.queryListData()
            } else {
                VpAlertMsg({
                    message: "消息提示",
                    description: '重新推送/接收异常',
                    type: "error",
                    closeText: "关闭",
                    showIcon: true
                }, 5)

            }

        })
    }
    callback = (key) => {
        console.log(key);
        this.getData(key);
    }
    getData =(key) =>{
        if(1==key){
            let tableHeader2 = getHeader2()
            let _this = this;
            tableHeader2.push({
                title: '操作', fixed: 'right', width: 120, key: 'operation', render: (text, record) => (
                    <span>

                        <VpTooltip placement="top" title="重新接收">
                            <VpPopconfirm title="确定要PPM重新接收这条记录吗？" data-id={record.iid} onConfirm={_this.handledelete} onCancel={_this.cancel}>
                                <VpIcon onClick={_this.handleConfirm} data-id={record.iid} data-lb={2} className="m-l-sm cursor text-danger" type="reload" />
                            </VpPopconfirm>
                        </VpTooltip>

                    </span>
                )
            });
            let url = '/{vppm}/dlbank/three/itsmPush2PPM'
            this.setState({surl:url,currentPage:1,tableHeader2},()=>{
                this.queryListData();
            })
        }else{
            let tableHeader = getHeader()
            let _this = this;
            tableHeader.push({
                title: '操作', fixed: 'right', width: 120, key: 'operation', render: (text, record) => (
                    <span>
    
                        <VpTooltip placement="top" title="重新推送">
                            <VpPopconfirm title="确定要重新推送这条记录给ITSM吗？" data-id={record.iid} onConfirm={_this.handledelete} onCancel={_this.cancel}>
                                <VpIcon onClick={_this.handleConfirm} data-id={record.iid} data-lb={1} className="m-l-sm cursor text-danger" type="reload" />
                            </VpPopconfirm>
                        </VpTooltip>
    
                    </span>
                )
            });
            let url = '/{vppm}/dlbank/three/toITSMPushList'
            this.setState({surl:url,currentPage:1,tableHeader},()=>{
                this.queryListData();
            })
        }
    }
    render() {
        const _this = this


        return (
          
                <VpTabs defaultActiveKey="0" onChange={this.callback}>
                    <VpTabPane tab='ITSM2PPM' key={'0'}>
                        <div className="subAssembly b-b bg-white" >
                            <VpRow gutter={10}>

                                <VpCol className="gutter-row" span={4}>

                                    <SeachInput onSearch={_this.handlesearch} />
                                </VpCol>
                            </VpRow>
                        </div>
                        <div className="business-wrapper p-t-sm full-height">
                            <div className="bg-white p-sm full-height entity-bsreqlist">
                                <VpRow gutter={16} className="full-height">
                                    <VpCol className="full-height scroll-y" id="tables">
                                        <VpTable

                                            columns={this.state.tableHeader}
                                            dataSource={this.state.tabledata}
                                            pagination={this.state.pagination}
                                            //onRowClick={this.onRowClick}
                                            onChange={this.tableChange}
                                            // rowKey={record => record.iid}
                                            //rowSelection={rowSelection}
                                            resize
                                        // bordered
                                        />
                                    </VpCol>
                                </VpRow>
                            </div>
                        </div>
                    </VpTabPane>
                    <VpTabPane tab='ITSM2PPM' key={'1'}>
                        <div className="subAssembly b-b bg-white" >
                            <VpRow gutter={10}>

                                <VpCol className="gutter-row" span={4}>

                                    <SeachInput onSearch={_this.handlesearch} />
                                </VpCol>
                            </VpRow>
                        </div>
                        <div className="business-wrapper p-t-sm full-height">
                            <div className="bg-white p-sm full-height entity-bsreqlist">
                                <VpRow gutter={16} className="full-height">
                                    <VpCol className="full-height scroll-y" id="tables">
                                        <VpTable

                                            columns={this.state.tableHeader2}
                                            dataSource={this.state.tabledata}
                                            pagination={this.state.pagination}
                                            //onRowClick={this.onRowClick}
                                            onChange={this.tableChange}
                                            // rowKey={record => record.iid}
                                            //rowSelection={rowSelection}
                                            resize
                                        // bordered
                                        />
                                    </VpCol>
                                </VpRow>
                            </div>
                        </div>
                    </VpTabPane>
                </VpTabs>
        )
    }
}


export default itsmPushLog = VpFormCreate(itsmPushLog);;
