import React, { Component } from 'react';
import {
    VpRow,
    VpCol,
    VpButton,
    VpTable,
    VpTag,
    vpQuery
} from 'vpreact';
import logopic from 'vpstatic/images/logosm.jpg';
import {
    SeachInput
} from 'vpbusiness';

//import './ChooseEntity.less';
import ztree from 'ztree';
import 'ztree/css/zTreeStyle/zTreeStyle.css';
//import 'ztree/css/metroStyle/zTreeStyle.css';

export const urlParamToObject = (paramStr) => {
    let params = {};
    let paramNameAndVals = paramStr.split("&"); //参数对
    for (var i = 0; i < paramNameAndVals.length; i++) {
        let paramNameAndVal = paramNameAndVals[i];
        if (paramNameAndVal.trim() == '') {
            //如果是空字符串
            continue;
        }
        let paramNameAndValArray = paramNameAndVal.split("=");
        if (paramNameAndValArray.length == 1) {
            //没有等号的参数，即只有参数名的
            params[paramNameAndValArray[0]] = null;
        } else {
            params[paramNameAndValArray[0]] = unescape(paramNameAndValArray[1]);
        }
    }
    return params;
}

class ChooseEntity extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            table_headers: [],
            selectItem: [],
            table_array: [],
            cur_page: 1,
            page: 1,
            pagination: {},
            limit: 10, //每页记录数
            quickvalue: '',
            idepartmentid: '',
            item: this.props.item,
            params: this.props.params || {},
            setting: {
                view: {
                    showIcon: this.showIconForTree,
                    showLine: true,
                    fontCss: { color: "#666" }
                },
                check: {
                    enable: false,//显示复选框  
                    chkStyle: "checkbox"
                },
                async: { //异步
                    enable: true,
                    type: "get",
                    // headers: { "Authorization": 'Bearer ' + vp.cookie.getToken() },
                    autoParam: ["iid", "key"],
                    url: vp.config.URL.localHost + "/" + vp.config.SETTING.vpplat
                        + '/model/getDepartment?access_token=' + vp.cookie.getToken()
                        + '&ilevel=' + ((vp.config.vpplat != undefined
                            && vp.config.vpplat.chooseTreeOpenLevel != undefined) ?
                            vp.config.vpplat.chooseTreeOpenLevel : 3)
                },
                data: {
                    simpleData: {
                        enable: true,
                        idKey: "iid",
                        pIdKey: "pid",
                        rootPId: 0
                    }
                },
                callback: {
                    onClick: this.zTreeOnClick.bind(this),
                    onAsyncSuccess: this.zTreeOnAsyncSuccess.bind(this)  //add by leiyf 20190727 树所加载后拦截事件,用来实现机构树自动定位到当前用户所在部门,
                }
            }
        }
        this.onRowClick = this.onRowClick.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleSelectAll = this.handleSelectAll.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
        this.onOk = this.onOk.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.tableChange = this.tableChange.bind(this);
        this.onShowSizeChange = this.onShowSizeChange.bind(this);
        this.getListData = this.getListData.bind(this);
        this.getListHeader = this.getListHeader.bind(this);
        this.getDptTreeData = this.getDptTreeData.bind(this);
        this.handlesearch = this.handlesearch.bind(this);
        this.onRowClicks = this.onRowClicks.bind(this);
    }

    /**
     * add by leiyf 20190727
     * 树所加载后拦截事件,用来实现机构树自动定位到当前用户所在部门,
     */
    zTreeOnAsyncSuccess(event, treeId, treeNode, msg) {
        var treeObj = $.fn.zTree.getZTreeObj(treeId);
        var node;
        if (vp.config.vpplat == undefined || vp.config.vpplat.chooseEntityShowFirstDepart != true) {
            node = treeObj.getNodeByParam("id", vp.cookie.getTkInfo().idepartmentid, null);
        } 
        else {
            //返回一个根节点 
            node = treeObj.getNodesByFilter(function (node) { return node.ilevel == 1 }, true); 
        }
        
        if (node) {
            treeObj.selectNode(node);
            $("#" + node.tId + "_span").trigger("click"); //由于列表数据加载是根据onClick触发，所以需要手动触发click事件
        }
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.visible) {
            let initValue = nextProps.initValue
            let selectsValues = initValue[0] != undefined ? initValue[0].iid == "" ? [] : initValue : []
            this.setState({
                params: nextProps.params,
                selectItem: selectsValues,
                selectedRowKeys: selectsValues.map((item, i) => {
                    return item.iid
                })
            }, () => {
                this.getDptTreeData()
                this.getListHeader()
                // this.getListData()
            })
        }
    }
    componentWillMount() {
        let initValue = this.props.initValue
        let selectsValues = initValue[0] != undefined ? initValue[0].iid == "" ? [] : initValue : []
        this.setState({
            item: this.props.item,
            selectItem: selectsValues,
            selectedRowKeys: selectsValues.map((item, i) => {
                return item.iid
            })
        }, () => {
            this.getDptTreeData()
            this.getListHeader()
            // this.getListData()
        })

    }
    componentDidMount() {
        $('.search').find('input').attr('maxlength', 400);
    }
    getDptTreeData() {
        $.fn.zTree.init($("#" + (this.props.item.field_name == undefined ? 'rel' + this.props.irelationentityid : this.props.item.field_name)), this.state.setting, null);
    }
    getListHeader() {
        vpQuery('/{vpplat}/vfrm/entity/getlistHeader', {
            irelentityid: this.state.item.irelationentityid,
            scode: 'modelList'
        }).then((response) => {
            const table_headers = this.initHeaders(response.data.grid.fields);
            this.setState({
                table_headers
            })
        })
    }
    getListData = () => {
        debugger
        const { cur_page: currentPage, limit: pageSize, item, quickvalue: quickSearch, idepartmentid } = this.state;
        const params = this.state.params;
        let roleid = '';
        let key = item.field_name
        let condition = ''
        let ientityid = item.ientityid
        const { exparams = {}, irelationentityid: irelentityid } = item
        let custparam = item.custparam
        const idpttype = item.idpttype != 1 ? 0 : 1
        if (params.hasOwnProperty('phaserelentityid') && params.phaserelentityid == '9') {
            ientityid = params.phaserelentityid
            condition = params.rowid ? params.rowid : ''
        }else if (item.urlparam) {
            let urlParamObj = urlParamToObject(item.urlparam);
            condition = urlParamObj.condition || '';
        }
        if (params.hasOwnProperty('custparam') && custparam == undefined) {
            custparam = params.custparam
        }
        if (key != undefined && key.indexOf('roleid') == 0) {
            roleid = key.substring(6)
        }
        //获取父entityid
        let propsentityid =  this.props.propsentityid
        let propsiid =  this.props.propsiid
        // 代码结构优化 by jy
        let sparam = {
            currentPage,
            pageSize,
            ientityid,
            irelentityid,
            iid: params.iid || item.iid,
            idpttype,
            idepartmentid,
            condition,
            viewcode: 'modelList',
            quickSearch,
            custparam,
            propsentityid,
            propsiid,
            ...exparams,
            
        }
        if (this.props.item.irelationentityid == -2) {
            vpQuery('/{vpflow}/rest/flowgroup/pagechosen2', {
                sparam: JSON.stringify(sparam)
            }).then((datas) => {
                let data = datas.data;
                let showTotal = () => {
                    return '共' + data.totalRows + '条'
                }
                this.setState({
                    table_array: data.resultList,
                    cur_page: data.currentPage,
                    total_rows: data.totalRows,
                    num_perpage: data.numPerPage,
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
        } else {
            // 删除命名角色用户集过滤，否则必须配置功能和数据的负责人绑定才能选择到用户  modify by oyq
            // sparam.roleid = roleid
            sparam.roleid = 0
            vpQuery('/{vpvrm}/modelRests/dynamiclistdata', {
                sparam: JSON.stringify(sparam)
            }).then((datas) => {
                let data = datas.data;
                let showTotal = () => {
                    return '共' + data.totalRows + '条'
                }
                this.setState({
                    table_array: data.resultList,
                    cur_page: data.currentPage,
                    total_rows: data.totalRows,
                    num_perpage: data.numPerPage,
                    pagination: {
                        total: data.totalRows,
                        showTotal: showTotal,
                        current: data.currentPage,
                        pageSize: data.numPerPage,
                        onShowSizeChange: this.onShowSizeChange,
                        showSizeChanger: true,
                        showQuickJumper: true,
                    }
                })
            })
        }
    }
    // 初始化表头信息
    initHeaders(table_headers) {
        const _this = this;
        let headers = table_headers.map((item, i) => {
            let column = { title: item.field_label, width: item.width, dataIndex: item.field_name, key: i }
            if (item.sort) {
                column.sorter = true;
            }
            return column
        })
        return headers;
    }

    changesearch = (value) => {
        const searchVal = value.replace(/(^\s*)|(\s*$)/g, "");
        this.state.quickvalue = searchVal
    }
    // 搜索框确定事件
    handlesearch(value) {
        const searchVal = value.replace(/(^\s*)|(\s*$)/g, "");
        this.setState({
            quickvalue: searchVal,
            cur_page: 1,
            currentPage: 1
        }, () => {
            this.getListData()
        })
    }

    // 表格的变动事件
    tableChange(pagination, filters, sorter) {
        let sorttype = ''
        if (sorter.order === 'descend') {
            sorttype = 'desc';
        } else if (sorter.order === 'ascend') {
            sorttype = 'asc';
        }
        this.setState({
            cur_page: pagination.current || this.state.cur_page,
            sortfield: sorter.field,
            sorttype,
            limit: pagination.pageSize || this.state.limit,
        }, () => {
            this.getListData()
        })
    }

    onShowSizeChange(value) {
    }

    onRowClick(record, index) {
        this.setState({
            idepartmentid: record.iid,
            cur_page: 1,
            currentPage: 1
        }, () => {
            this.getListData()
        })
    }
    onExpandedRowsChange(expandedRows) {
    }
    onExpand(expanded, record) {
    }
    onClose(item, i) {
        let newList = [...this.state.selectItem.slice(0, i), ...this.state.selectItem.slice(i + 1)];
        this.setState({
            selectItem: newList,
            selectedRowKeys: newList.map((item, i) => {
                return item.iid
            })
        })
    }
    handleSelect(record, selected, selectedRows) {
        let idx = 0;
        if (this.props.item.widget_type == 'selectmodel') {
            if (selected) {
                this.setState({
                    selectItem: [record]
                })
            }
        } else {
            if (selected) {
                this.setState({
                    selectItem: [...this.state.selectItem, record]
                })
            } else {
                this.state.selectItem.forEach((element, i) => {
                    if (element.iid === record.iid) {
                        idx = i
                    }
                });
                this.setState({
                    selectItem: [...this.state.selectItem.slice(0, idx), ...this.state.selectItem.slice(idx + 1)]
                })
            }
        }


    }

    //点击当前行选中
    onRowClicks(record, index) {
        const selectedIdx = this.state.selectItem.findIndex((item) => record.iid === item.iid)
        if (selectedIdx != -1) {
            this.setState({
                selectItem: [
                    ...this.state.selectItem.slice(0, selectedIdx),
                    ...this.state.selectItem.slice(selectedIdx + 1)
                ],
                selectedRowKeys: [
                    ...this.state.selectedRowKeys.slice(0, selectedIdx),
                    ...this.state.selectedRowKeys.slice(selectedIdx + 1)
                ]

            })
        } else {
            if (this.props.item.widget_type == 'selectmodel') {
                this.setState({
                    selectedRowKeys: [record.iid],
                    selectItem: [record]
                })
            } else {
                this.setState({
                    selectItem: [
                        ...this.state.selectItem.slice(0),
                        record
                    ],
                    selectedRowKeys: [
                        ...this.state.selectedRowKeys.slice(0),
                        record.iid
                    ],
                })
            }
        }
    }

    onSelectChange(selectedRowKeys) {
        this.setState({ selectedRowKeys });
    }
    handleSelectAll(selected, selectedRows, changeRows) {
        this.setState({
            selectItem: selectedRows
        })
    }
    onOk() {
        this.props.onOk(this.state.selectItem);
        this.setState({
            selectItem: [],
            idepartmentid: 0
        })
    }
    onCancel() {
        this.props.onCancel();
        this.setState({
            selectItem: this.props.initValue,
        })
    }
    onRowDoubleClick = (record, index) => {
        let widget_type = this.props.item.widget_type
        if (widget_type == 'selectmodel') {
            this.props.onOk([record]);
            this.setState({
                selectItem: [],
                idepartmentid: 0
            })
        }
    }

    showIconForTree(treeId, treeNode) {
        return !treeNode.isParent;
    }
    zTreeOnClick(event, treeId, treeNode) {
        this.setState({
            idepartmentid: treeNode.id,
            cur_page: 1,
            currentPage: 1
        }, () => {
            this.getListData()
        })
    }

    render() {
        const { selectedRowKeys } = this.state;
        let type = this.props.item.widget_type == 'selectmodel' ? 'radio' : 'checkbox';
        const rowSelection = {
            type: type,
            onSelect: this.handleSelect,
            onSelectAll: this.handleSelectAll,
            selectedRowKeys,
            onChange: this.onSelectChange,
        }
        return (
            <div className="bg-gray vpselectentity" >
                <div className="p-sm">
                    <VpRow gutter={10}>
                        <VpCol span={8} className="treetablebox">
                            <div className="bg-white full-height">
                                <div className="p-sm full-height scroll">
                                    <ul id={this.props.item.field_name == undefined ? 'rel' + this.props.irelationentityid : this.props.item.field_name} className="ztree" ></ul>
                                </div>
                            </div>
                        </VpCol>
                        <VpCol span={16}>
                            <div className="bg-white full-height">
                                <div className="p-sm fw bg-white">
                                    <SeachInput onSearch={this.handlesearch} onChange={this.changesearch}/>
                                </div>
                                <div className={this.state.table_array.length ? "p-sm p-t-none hasdata" : "p-sm p-t-none"}>
                                    <VpTable
                                        columns={this.state.table_headers}
                                        size="small"
                                        dataSource={this.state.table_array}
                                        rowSelection={rowSelection}
                                        onChange={this.tableChange}
                                        onRowClick={this.onRowClicks}
                                        onDoubleClick={this.onRowDoubleClick}
                                        pagination={this.state.pagination}
                                        rowKey={record => record.iid}
                                    />
                                </div>
                            </div>
                        </VpCol>
                    </VpRow>
                    <VpRow>
                        <VpCol span={24}>
                            <div className="bg-white m-t-sm p-sm selected-data">
                                {
                                    this.state.selectItem && this.state.selectItem.length > 0 ?
                                        this.state.selectItem.map((item, i) => {
                                            return (
                                                <VpTag className='tag-select' key={item.iid} closable onClose={this.onClose.bind(this, item, i)}>
                                                    <img src={logopic} alt="" />
                                                    {item.sname}
                                                </VpTag>)
                                        })
                                        : null
                                }
                            </div>
                        </VpCol>
                    </VpRow>
                </div>
                <div className="footer-button-wrap ant-modal-footer">
                    <VpButton type="primary" className="vp-btn-br" onClick={this.onOk}>确定</VpButton>
                    <VpButton type="ghost" className="vp-btn-br" onClick={this.onCancel}>取消</VpButton>
                </div>
            </div>
        )
    }
}

export default ChooseEntity;

