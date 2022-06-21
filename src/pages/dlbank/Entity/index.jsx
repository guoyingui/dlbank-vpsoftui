import React, { Component } from 'react'
import {
    VpMenu,
    VpMenuItem,
    VpDropdown,
    VpIcon,
    VpTooltip,
    VpTabs,
    VpModal,
    VpTabPane,
    VpButton,
    VpRow,
    VpCol,
    VpFormCreate,
    VpIconFont,
    vpDownLoad,
    vpQuery,
    vpAdd,
    VpIframe,
    VpSubMenu,
    VpRadioButton,
    VpRadioGroup,
    VpInputUploader,
    VpPopconfirm,
    VpSpin,
    VpUploader,
    VpTag,
    VpAlertMsg,
    VpProgress,
    EditTableCol,
    VpTable,
    VpConfirm
} from 'vpreact'
import {
    SeachInput,
    QuickCreate,
    FindCheckbox,
    RightBox,
    VpDynamicForm
} from 'vpbusiness'
import { NotFind } from 'vplat'
import { requireFile, endWithStr,formatDateTime } from 'utils/utils'
import { getPjTreeHeader } from './data.js'
import './index.less'
const SearchForm = requireFile('vfm/DynamicForm/SearchForm');
const DocumentList = requireFile('vfm/Document/documentList');
const InputSearchName = requireFile('vfm/DynamicForm/InputSearchName');
const ExportForm = requireFile('dlbank/Common/exportForm');
class Entity extends Component {

    /**
    * @param {Boolean} hasScreen 是否需要筛选
    */
    static defaultProps = {
        statusFiltersVisible: false, // 是否需要展示状态筛选
        tableOptions: {},
        hasScreen: true,

        updateList: true,
    }

    constructor(props) {
        super(props)
        // 2019-10-8 修改
        let {
            params,
            entityid = '',
            viewtype = '',
            toolbar = {},
            rowbar = [],
        } = props
        let sparam = {}
        let functionid = ''
        if (params) {
            entityid = params.entityid
            viewtype = (params.type === 'tree' ? 'tree' : params.viewtype)
            functionid = params.functionid
            sparam = params.sparam
        }
        this.state = {
            filters: [],
            visible: false,
            showRightBox: false,
            table_headers: [],
            table_array: [],
            total_rows: 0,
            cur_page: 1,
            num_perpage: 10, //每页记录数
            pagination: {},
            // filtervalue: '0', //过滤器值
            quickvalue: '', //快速搜索内容
            increaseData: [], // 新增动态数据
            tabs_array: [],
            filterDropdownVisible: false,
            isAdd: false,
            entityid,
            iids: '',
            row_id: '',
            row_entityid: '',
            entityiid: '',
            add: true,
            addType: 'primary', // 新建时的类型
            statusList: [],//状态变迁
            formvalue: {},//表单数据储存
            varilsForm: {},
            viewtype,
            entityrole: false,//实体是否有可读或者可写权限
            exShow: false,
            exList: [],
            entityVisible: false,
            toolbar,
            rowbar,
            SearchFormData: {},
            searchData: [],
            importLable: "",
            importValue: "",
            searchFormValues: {},//搜索表单值
            loading: false,
            expandedRowKeys: [],
            tableHeight: '',
            tips: '',
            defaultActiveKey: '0',
            activeKey: '0',
            shrinkShow: true,
            openKeys: ['filter0'],
            view: 'list', //看板视图切换参数
            entityList: [], //有权限新建的实体s

            classFilters: [],
            myfilters: [],
            currentkey: 'filter0',
            scode: '',
            sname: '',
            subItemProjectId: '',
            entitytype: false, //实体类型是否为流程
            spinning: false,
            editrowdata: {},//需要保存的编辑数据
            tableloading: true,
            VpUploader: false,
            filearr: {},
            doctypelist: [],//编辑类表上传文档类型数据源
            selectType: '',
            isClickMenu: false,
            classList: [],
            functionid,//功能点id
            sparam,
            fromtype: this.props.skey == undefined ? 'func' : 'tabs',
            searchkey: 1, //强行触发渲染,置空快速搜索框
            isaddflag: 0,
            isdeleteflag: 0,
            isimportflag: 0,
            isexportflag: 0,
            conditionVisibleFlag: false,
            // 2020-7-13 状态整合处理，优化
            statusFilters: [], // getConfig获取的状态筛选值
            statusDefauleValue: 0,
        }

        /**
         * 重大改动
         * 接收由外部传入的dynamicFormChange方法用于处理不同场景下的业务需求
         * 具体反映在vfm/dynamic/DynamicForm/dynamic的组件中,可搜索此路径在此文件中找到实现过程
         * 
         * 接收由外部传入的dynamicFormDidMount方法用于处理不同场景下的业务需求
         * 具体反映在vfm/dynamic/DynamicForm/dynamic的组件中,可搜索此路径在此文件中找到实现过程
         */

        this.state.dynamicFormChange = props.dynamicFormChange || null
        this.state.dynamicFormDidMount = props.dynamicFormDidMount || null
        this.state.dynamicFormLoaded = props.dynamicFormLoaded || null

        this.objectid = 0;
        this.closeRightModal = this.closeRightModal.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleVisibleChange = this.handleVisibleChange.bind(this);
        this.onRowClick = this.onRowClick.bind(this);
        this.dropVisbleChange = this.dropVisbleChange.bind(this);
        this.getHeader = this.getHeader.bind(this);
        this.addNewDom = this.addNewDom.bind(this);
        this.getDynamicTabs = this.getDynamicTabs.bind(this);
        this.cancelModal = this.cancelModal.bind(this);
        this.exTypeData = this.exTypeData.bind(this);
        this.handleMenuClick = this.handleMenuClick.bind(this);
        this.onExpand = this.onExpand.bind(this);
        this.handleDropDown = this.handleDropDown.bind(this);

        /**
         * 页面类型 
         * primary 普通的列表形式
         * form 直接表单形式
         * */
        this.pageType = 'primary'
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.updateList) {
            let theight = vp.computedHeight(0, '.entityTable')
            this.setState({
                tableloading: false,
                tableHeight: theight,
                pagination: {
                    total: 0,
                    current: 1,
                    pageSize: 10,
                    onShowSizeChange: this.onShowSizeChange,
                    showSizeChanger: true,
                    showQuickJumper: true,
                }
            });
            return
        }
        if (nextProps.params) {
            if (nextProps.params.entityid != this.props.params.entityid
                || nextProps.params.sparam != this.props.params.sparam) {
                let searchData = undefined;//清除高级搜索缓存
                this.setState({
                    entityid: nextProps.params.entityid,
                    showRightBox: false,
                    viewtype: nextProps.params.type,
                    functionid: nextProps.params.functionid,
                    sparam: nextProps.params.sparam,
                    tabs_array: [],
                    quickvalue: '',
                    currentclassname: '',
                    searchkey: ++this.state.searchkey,
                    searchData,
                    sortfield: '',
                    sorttype: '',
                }, () => {
                    this.getHeader()
                    this.querySearchFormData()
                    this.queryentityList()
                    this.getConfig()
                    this.queryEntityType()
                    this.queryclassList()
                    //清除高级搜索
                    this.handleSearchForm()
                    //调用子组件，清空子组件的查询值
                    if (this.child) {
                        this.child.clearSearch()
                    }
                })
            }
            else if (nextProps.params.type != this.props.params.type
                || nextProps.params.functionid != this.props.params.functionid) {
                this.setState({
                    viewtype: nextProps.params.type,
                    showRightBox: false,
                    tabs_array: [],
                    functionid: nextProps.params.functionid,
                    quickvalue: '',
                    currentclassname: '',
                    searchkey: ++this.state.searchkey,
                    sortfield: '',
                    sorttype: '',
                }, () => {
                    this.getHeader()
                    this.querySearchFormData()
                    this.queryentityList()
                    this.getConfig()
                    this.queryEntityType()
                    this.queryclassList()
                    //清除高级搜索
                    this.handleSearchForm()

                })
            } else if ('tabs' == nextProps.formType && 'rylkfl' == nextProps.stabparam) {//切换测试用例库分类,把查询条件清空  add by chenxl 20200723
                let searchData = undefined;//清除高级搜索缓存

                let importValue = nextProps.mainentityiid
                let importLable = nextProps.stabparam
                this.setState({ searchData, importValue: importValue, importLable: importLable })
            }
        } else {
            this.setState({
                viewtype: nextProps.viewtype,
                entityid: nextProps.entityid,
                toolbar: nextProps.toolbar,
                rowbar: nextProps.rowbar,
                showRightBox: false,
                functionid: nextProps.functionid,
                sparam: nextProps.sparam,
                tabs_array: [],
                quickvalue: '',
                currentclassname: '',
                searchkey: ++this.state.searchkey,
                sortfield: '',
                sorttype: '',
            }, () => {
                this.getHeader()
                this.getConfig()
                this.queryEntityType()
                this.queryclassList()
            })
        }
    }

    componentDidMount() {
        $('.search').find('input').attr('maxlength', 400)
        //优化tabs宽度
        if ($(".ant-tabs-nav-scroll .ant-tabs-nav").width() < $(".ant-tabs-content").width()) {
            $(".ant-tabs-nav-container").removeClass("ant-tabs-nav-container-scrolling")
            $(".ant-tabs-tab-prev").hide()
            $(".ant-tabs-tab-next").hide()
        }

        if (this.pageType !== 'form') {
            this.getHeader()
            this.exTypeData()
            this.querySearchFormData()
            this.getConfig()

            this.queryentityList()
            this.queryEntityType()
            this.loadDocType()
            this.queryclassList()
        }
    }

    componentWillUnmount() {
        //重写组件的setState方法，直接返回空
        this.setState = (state, callback) => {
            return;
        };
    }

    // 获取表格数据
    getData = (params = {}) => {
        this.setState({
            table_array: [],
            tableloading: true,
        })
        let {
            entityid,
            currentkey,
            searchData,
            filtervalue,
            functionid,
            sparam,
            quickvalue: quickSearch,
            viewtype,
            timestamp: _k,

            cur_page: currentPage,
            num_perpage: pageSize,
            sortfield: sortfield,
            sorttype,
        } = this.state

        if (searchData == undefined) {
            searchData = []
        }
        if (this.state.fromtype == 'tabs') {
            searchData.push({
                "field_name": this.props.stabparam
                , "field_value": this.props.iid || '0', "expression": "eq"
            })
        }
        //测试用例库分类关联测试用例库列表进入,把关联的测试用例库分类写入到查询条件中  add by chenxl 20200723
        if (this.props.formType == 'tabs' && 'rylkfl' === this.props.stabparam) {
            //searchData = [...searchData, ...params, ...this.state.rylkflsearchData]
            params = [...searchData, ...this.props.par]
            this.setState({ searchData: params })

        }
        // else {
        //     searchData.map(item => {
        //         console.log(item)
        //     })
        // }
        let viewcode = ''
        if('114'==this.state.entityid){ // 软、硬件任务屏蔽新建、导入按钮
            let ss = this.state.sparam
            if(ss && ss.indexOf('iclassid:118')>-1){// 测试任务定制列表
                viewcode = 'testlist'
            }
            
        }
        vpAdd('/{vpplat}/vfrm/entity/dynamicListData',
            {
                entityid,
                currentkey,
                condition: JSON.stringify([...searchData, ...params]),
                filtervalue,
                functionid,
                sparam,
                quickSearch,
                viewtype: viewtype == 'edit' ? 'initeditlist' : viewtype,
                datafilter: 'auth',//权限过滤需要加这个参数
                _k,
                currentPage,
                pageSize,
                sortfield,
                sorttype,
                viewcode
            }
        ).then((res) => {
            //entityTable
            let data = res.data;
            let theight = vp.computedHeight(data.resultList.length, '.entityTable')
            let showTotal = () => {
                return '共' + data.totalRows + '条'
            }
            this.setState({
                tableloading: false,
                table_array: data.resultList,
                total_rows: data.totalRows,
                cur_page: data.currentPage,
                num_perpage: data.numPerPage,
                tableHeight: theight,
                pagination: {
                    total: data.totalRows,
                    showTotal: showTotal,
                    current: data.currentPage,
                    pageSize: data.numPerPage,
                    onShowSizeChange: this.onShowSizeChange,
                    showSizeChanger: true,
                    showQuickJumper: true,
                }
            });
        })
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
            cur_page: pagination.current || this.state.cur_page,
            num_perpage: pagination.pageSize || this.state.num_perpage,
            sortfield: sorter.field,
            sorttype,
        }, () => {
            this.getData()
        })
    }

    onShowSizeChange(value) {

    }
    /**
     * 查询实体类别，绑定表单
     */
    queryclassList = () => {
        vpQuery('/{vpplat}/vfrm/tasks/classList', {
            entityid: this.state.entityid,
            sparam: this.state.sparam
        }).then((response) => {
            let classList = response.data
            this.setState({
                classList
            })
            if (this.state.entityid == 2) {
                if (classList.length == 1) {
                    let viewcode = classList[0].scode
                    let currentclassid = classList[0].iid
                    this.setState({
                        viewcode,
                        currentclassid
                    });
                }
            }
        })
    }

    //编辑列表获取上传文档类型
    loadDocType = () => {
        vpQuery('/{vpplat}/vfrm/entity/doctype', {
            entityid: this.state.entityid
        }).then((response) => {
            this.setState({
                doctypelist: response.data,
                selectType: response.data.length > 0 && response.data[0].value || ''
            })
        })
    }
    queryEntityType = () => {
        let _this = this
        vpQuery('/{vpplat}/vfrm/entity/entitytype', {
            entityid: this.state.entityid
        }).then((response) => {
            let filtervalue = '0'
            let currentkey = 'filter0'
            if (_this.props.location == undefined || _this.props.location.state == undefined || _this.props.location.state.param == undefined || _this.props.location.state.param.filter == undefined) {
                /* let flowtype = response.data.flowtype
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

            } else {
                let urlparam = _this.props.location.state.param
                filtervalue = urlparam.filter
                currentkey = urlparam.currentkey
                this.setState({
                    filtervalue: filtervalue,
                    currentkey: currentkey,
                    openKeys: [currentkey],
                })
            }
            this.setState({
                entitytype: response.data.entitytype
            })
        })
    }
    querySearchFormData = () => {
        vpQuery('/{vpplat}/vfrm/entity/searchForm', {
            entityid: this.state.entityid, scode: 'search'
        }).then((response) => {
            // 成本定义->资源管理 第一次不加载数据问题
            if (this.props.fromtype == 'resource') {
                this.getData()
            }
            this.setState({
                SearchFormData: response.data.form
            })
        })
    }
    // 返回参数给父层控制是否关闭下拉层
    chooseModalVisible = (visible) => {
        this.chooseVisible = visible
    }

    getEditHeader = () => {
        let _this = this;
        let param = {
            entityid: _this.state.entityid,
            viewcode: 'initeditlist',
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
                                    width: _field_width,
                                    key: data_index,
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
                        title: '操作', fixed: 'right', width: (vp.config.vpplat != undefined && vp.config.vpplat.operation != undefined && vp.config.vpplat.operation.width != undefined ? vp.config.vpplat.operation.width : 100), key: 'operation', render: (text, record) => (
                            <span>
                                <VpTooltip placement="top" title="附件">
                                    <VpIconFont onClick={() => _this.openupload(record)} className="text-primary m-lr-xs cursor" type="vpicon-paperclip" />
                                </VpTooltip>
                                {record.istatusflag == '0' && _this.state.entityaddrole && (record.principal != '0' || _this.state.entityid == '2') ?
                                    <VpTooltip placement="top" title="删除">
                                        <VpPopconfirm title="确定要删除这条信息吗？" onConfirm={() => _this.confirm(record.ientityid, record.iid)} onCancel={_this.cancel}>
                                            <VpIconFont className="cursor m-lr-xs text-danger" type="vpicon-shanchu" />
                                        </VpPopconfirm>
                                    </VpTooltip>
                                    : null
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

    openupload = (record) => {
        let iid = record.iid
        this.state.editrowdata[iid] = record
        this.setState({
            VpUploader: true,
            currentiid: record.iid,
            editrowdata: this.state.editrowdata
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

    //编辑表格新增
    handleEditAdd = () => {
        this.tableRef.addTableRow({ iid: this.objectid-- });
        let theight = vp.computedHeight(1);
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
            // this.tableRef.getTableData()
            this.state.editrowdata = {}
            this.state.filearr = {}
            this.getData()
        })
    }
    //编辑表格刷新
    handleReload = () => {
        this.state.tableloading = true
        // this.tableRef.getTableData()
        this.getData()
    }

    getOptionList = (record) => {
        let list = []
        if (record.ientityid == '6' || record.ientityid == '7') {
            list.push({
                key: 'summary',
                sname: '计算汇总',
                classname: 'cursor m-r-xs f16 text-primary',
                type: 'vpicon-see-o'
            })
        }
        if (record.ientityid == '7') {
            list.push({
                key: 'weekreport',
                sname: '生成周报',
                classname: 'cursor m-r-xs f16 text-primary',
                type: 'vpicon-progress'
            })
        }
        if (record.action) {
            record.action.map((item, index) => {
                list.push({
                    key: item.skey,
                    sname: 'item.sname',
                    classname: 'cursor m-r-xs f16 text-primary',
                    type: 'item.icontype'
                })
            })
        }
        return list;
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
        let viewcode = ''
        if('114'==this.state.entityid){ // 软、硬件任务屏蔽新建、导入按钮
            let ss = this.state.sparam
            if(ss && ss.indexOf('iclassid:118')>-1){// 测试任务定制列表
                viewcode = 'testlist'
            }
            
        }
        vpQuery('/{vpplat}/vfrm/entity/getheaders', {
            entityid: _this.state.entityid,
            scode:viewcode
        }).then(function (data) {
            if (data) {
                if (data.hasOwnProperty('data')) {
                    let isaddflag = data.data.addflag == undefined ? 0 : data.data.addflag
                    let isimportflag = data.data.importflag == undefined ? 0 : data.data.importflag
                    let isexportflag = data.data.exportflag == undefined ? 0 : data.data.exportflag
                    if (_this.state.entityid == 163) { // 预算条目屏蔽新建、导入导出按钮
                        isaddflag = 0
                        // isimportflag = 0
                        //isexportflag = 0
                    }
                    
                    if('114'==_this.state.entityid){ // 软、硬件任务屏蔽新建、导入按钮
                        let ss = _this.state.sparam
                        if(ss && ss.indexOf('iclassid:118')<0){// 测试任务不屏蔽新建、导入按钮
                            isaddflag = 0
                            isimportflag = 0
                        }
                        
                      }
                      if (_this.state.entityid == 41) { // 用户需求屏蔽新建按钮
                        isaddflag = 0
                        
                    }
                    _this.setState({
                        loading: false,
                        isdeleteflag: data.data.delflag == undefined ? 0 : data.data.delflag,
                        isaddflag: isaddflag,
                        isimportflag: isimportflag,
                        isexportflag: isexportflag,
                        entityaddrole: data.data.addflag == 1 ? true : false
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
                                            fixed: _fixed,
                                            width: _field_width,
                                            sorter: data_index == 'inamerole' || data_index == 'irolegroupid' ? false : true //命名角色不排序
                                        });
                                    }
                                }
                            });
                            if (_this.state.view == 'pjtree') {
                                _header = getPjTreeHeader()
                            }
                            //指示灯类型
                            const indiclass = ['bg-success', 'bg-warning', 'bg-danger']
                            const lights = (
                                _this.state.entityid == 8 ?
                                    <div>
                                        <VpTooltip title="进度"><VpIconFont type="vpicon-tip" className="m-r-xs text-success" /></VpTooltip>
                                    </div>
                                    :
                                    <div>
                                        <VpTooltip title="进度"><VpIconFont type="vpicon-tip" className="m-r-xs text-success" /></VpTooltip>
                                        <VpTooltip title="成本"><VpIconFont type="vpicon-tip" className="m-r-xs text-primary" /></VpTooltip>
                                        <VpTooltip title="质量"><VpIconFont type="vpicon-tip" className="m-r-xs text-warning" /></VpTooltip>
                                        <VpTooltip title="风险"><VpIconFont type="vpicon-tip" className="m-r-xs text-danger" /></VpTooltip>
                                        {/*  <VpTooltip title="管控模式"><VpIconFont type="vpicon-sitemap" className="m-r-xs text-danger" /></VpTooltip> */}
                                    </div>
                            )
                            const columns = {
                                title: lights, width: (_this.state.entityid == 8 ? 40 : 95), dataIndex: 'indicator', key: 'indicator',
                                render: (value, record) => {
                                    let ischedule = record.ischeduleindicator || 0
                                    let icost = record.icostindicator
                                    let irisk = record.iriskindicator
                                    let iquality = record.iqualityindicator
                                    return (
                                        _this.state.entityid == 8 ?
                                            <div className="indic-wrapper">
                                                <span key={0} className={indiclass[ischedule]}></span>
                                            </div>
                                            :
                                            <div className="indic-wrapper">
                                                <span key={0} className={indiclass[ischedule]}></span>
                                                <span key={1} className={indiclass[icost]}></span>
                                                <span key={2} className={indiclass[irisk]}></span>
                                                <span key={3} className={indiclass[iquality]}></span>
                                                {/* <VpTooltip title={record.icontroltype == '2'?'敏捷':"瀑布"}>
                                            <VpIconFont type={record.icontroltype == '2'?"vpicon-milestone":"vpicon-milepost"} className="m-r-xs text-danger" />
                                            </VpTooltip> */}
                                            </div>
                                    )
                                }
                            }
                            let _headerNew = _header

                            let { entityid } = _this.state

                            if (entityid == 6 || entityid == 7 || entityid == 8) {
                                _headerNew.unshift(columns)
                            }
                            _headerNew.map((item, index) => {
                                if (item.key == 'icontrolmode') {
                                    const pop = (
                                        <div className="inline-display">
                                            管控模式
                                        </div>
                                    )
                                    item.title = pop
                                    item.render = (
                                        (text, record) => {
                                            return (
                                                <div className="indic-wrapper">
                                                    {record.icontroltype == '2' ? <VpTag color="blue" className="vp-btn-br p-lr-lg">{record.icontrolmode}</VpTag>
                                                        : <VpTag color="yellow" className="vp-btn-br p-lr-lg">{record.icontrolmode}</VpTag>}
                                                </div>
                                            )
                                        }
                                    )
                                } else if (item.key == 'istatusid') {
                                    item.render = (
                                        (text, record) => {
                                            return (
                                                <div className="indic-wrapper">
                                                    <VpIconFont type={record.istatusflag == '0' ? "vpicon-circle-o text-primary" : "vpicon-circle-o text-primary"} className="m-r-xs" />
                                                    {text}
                                                </div>
                                            )
                                        }
                                    )
                                } else if (item.key == 'iclassid') {
                                    item.render = (
                                        (text, record) => {
                                            return (
                                                <div className="indic-wrapper">
                                                    {
                                                        text
                                                    }
                                                </div>
                                            )
                                        }
                                    )
                                } else if (item.key == 'scurrentphase') {
                                    item.render = (
                                        (text, record) => {
                                            return (
                                                <div className="indic-wrapper">
                                                    {
                                                        text != '' ?
                                                            <VpTag color={record.phasetype == '1' ? 'green' : 'gray'} className="vp-btn-br p-lr-lg">{text}</VpTag>
                                                            : null
                                                    }
                                                </div>
                                            )
                                        }
                                    )
                                }
                                else if (item.key == 'iactualcomplete') {
                                    const statusstr = ['normal', 'active', 'exception']
                                    item.render = (
                                        (text, record) => {
                                            return (
                                                <div>
                                                    <VpProgress percent={record.iactualcomplete == '' ? 0 : parseFloat(record.iactualcomplete)}
                                                        status={statusstr[record.ischeduleindicator]}
                                                        strokeWidth={10} />
                                                </div>
                                            )
                                        }
                                    )
                                }
                            })
                            _headerNew.push({
                                title: '操作', fixed: 'right', width: (vp.config.vpplat != undefined && vp.config.vpplat.operation != undefined && vp.config.vpplat.operation.width != undefined ? vp.config.vpplat.operation.width : 100), key: 'operation',
                                render: (text, record) => {
                                    let optionlist = []
                                    let delflag = false
                                    if (record.istatusflag == '0' && _this.state.isdeleteflag == 1
                                        && (record.inamerolevpval == vp.cookie.getTkInfo().userid || record.principal == vp.cookie.getTkInfo().userid)
                                        && (record.principal != '0' || _this.state.entityid == '2')) {
                                        delflag = true
                                    }

                                    { // 增加config参数控制操作是否显示，以及显示顺序   add by oyq
                                        (_this.state.fromtype != 'tabs' && vp.config.vpplat != undefined && vp.config.vpplat.operation != undefined && vp.config.vpplat.operation.oprlist != undefined) ?
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
                                                else if (item.key == 'copy') {
                                                    let stitle = item.sname == undefined ? "复制" : item.sname
                                                    optionlist.push({
                                                        key: 'copy',
                                                        sname: stitle,
                                                        classname: 'text-primary m-lr-xs cursor',
                                                        type: "vpicon-copy"
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

                                    if (_this.state.fromtype != 'tabs' && optionlist.length == 0) {
                                        optionlist.push({
                                            key: 'collect',
                                            sname: record.ilike == 0 ? "关注" : '取消关注',
                                            classname: 'text-primary m-lr-xs cursor',
                                            type: record.ilike == 0 ? "vpicon-star-o" : "vpicon-star"
                                        })
                                        // optionlist.push({
                                        //     key: 'copy',
                                        //     sname: '复制',
                                        //     classname: 'text-primary m-lr-xs cursor',
                                        //     type: 'vpicon-copy'
                                        // })
                                        // optionlist.push({
                                        //     key: 'discuss',
                                        //     sname: '评论',
                                        //     classname: 'text-primary m-lr-xs cursor',
                                        //     type: 'vpicon-pinglun'
                                        // })

                                        if (delflag == true) {
                                            optionlist.push({
                                                key: 'delete',
                                                sname: "删除",
                                                classname: 'cursor m-r-xs f16 text-danger',
                                                type: "vpicon-shanchu"
                                            });
                                        }
                                    }
                                    else if (_this.state.fromtype == 'tabs' && optionlist.length == 0) {
                                        optionlist.push({
                                            key: 'edit',
                                            sname: "编辑",
                                            classname: 'cursor m-r-xs f16 text-primary',
                                            type: "edit"
                                        });
                                        if (delflag == true) {
                                            optionlist.push({
                                                key: 'delete',
                                                sname: "删除",
                                                classname: 'cursor m-r-xs f16 text-danger',
                                                type: "vpicon-shanchu"
                                            });
                                        }
                                    }

                                    _this.getOptionList(record).map((item, i) => {
                                        optionlist.push(item)
                                    })

                                    let moreOplit = []
                                    let ishow = (vp.config.vpplat != undefined && vp.config.vpplat.operation != undefined && vp.config.vpplat.operation.count != undefined) ? vp.config.vpplat.operation.count : 2
                                    
                                    return (
                                        <span>
                                            {
                                                optionlist.map((item, i) => {
                                                    if (i < ishow) {
                                                        return (
                                                            item.key == 'edit' ?
                                                                (
                                                                    <VpTooltip key={item.key} placement="top" title={item.sname}>
                                                                        <VpIcon onClick={(e) => _this.barEvent(item.key, e, record.ientityid, record.iid, record)}
                                                                            className={item.classname} type={item.type} />
                                                                    </VpTooltip>
                                                                )
                                                                :
                                                                item.key == 'delete' ?
                                                                // 用户需求屏蔽列表删除按钮
                                                                41== _this.state.entityid?null:
                                                                    (
                                                                        <VpTooltip key={item.key} placement="top" title="删除">
                                                                            <VpPopconfirm title="确定要删除吗？" onConfirm={() => _this.confirm(record.ientityid, record.iid)}>
                                                                                <VpIconFont onClick={(e) => { e.stopPropagation() }} className={item.classname} type={item.type} />
                                                                            </VpPopconfirm>
                                                                        </VpTooltip>
                                                                    )
                                                                    :
                                                                    (
                                                                        <VpTooltip key={item.key} placement="top" title={item.sname}>
                                                                            <VpIconFont onClick={(e) => _this.barEvent(item.key, e, record.ientityid, record.iid, record)}
                                                                                className={item.classname} type={item.type} />
                                                                        </VpTooltip>
                                                                    )
                                                        )
                                                    }
                                                    else {
                                                        moreOplit.push(item)
                                                    }
                                                })

                                            }

                                            {
                                                moreOplit.length > 0 ?
                                                    <VpTooltip key='vpmore' placement="top" title="更多">
                                                        {
                                                            _this.state.isClickMenu ? null :
                                                                <VpDropdown overlay={(
                                                                    <VpMenu onClick={(e) => _this.menuClick(e, record.ientityid, record.iid, record)}>

                                                                        {
                                                                            moreOplit.map((item, index) => {

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
                                        // <span>
                                        //     {/* {(record.ientityid == '8') ?
                                        //     <VpTooltip placement="top" title="关联文档">
                                        //         <VpIconFont onClick={(e) => _this.documentList(e, record.ientityid, record.iid)} className="text-primary m-lr-xs cursor" type="vpicon-paperclip" />
                                        //     </VpTooltip>
                                        //     :
                                        //     ''
                                        // } */}
                                        //     <VpTooltip placement="top" title={record.ilike == 0 ? "关注" : '取消关注'}>
                                        //         <VpIconFont onClick={(e) => _this.handleLike(e, record.ientityid, record.iid, record)}
                                        //             className="text-primary m-lr-xs cursor" type={record.ilike == 1 ? "vpicon-star" : "vpicon-star-o"} />
                                        //     </VpTooltip>
                                        //     {
                                        //         _this.state.entityid != 127 ?
                                        //             <VpTooltip placement="top" title="评论">
                                        //                 <VpIconFont onClick={(e) => _this.discuss(e, record.ientityid, record.iid)} className="text-primary m-lr-xs cursor" type="vpicon-pinglun" />
                                        //             </VpTooltip>
                                        //             : null
                                        //     }
                                        //     {/* record.istatusflag == '0' && _this.state.entityaddrole && (record.principal != '0' || _this.state.entityid == '2') ?
                                        //         <VpTooltip placement="top" title="删除">
                                        //             <VpPopconfirm title="确定要删除这条信息吗？" onConfirm={() => _this.confirm(record.ientityid, record.iid)} onCancel={_this.cancel}>
                                        //                 <VpIconFont onClick={(e) => e.stopPropagation()} className="cursor m-lr-xs text-danger" type="vpicon-shanchu" />
                                        //             </VpPopconfirm>
                                        //         </VpTooltip>
                                        //         : null */
                                        //     }
                                        //     {
                                        //         optionlist.length || record.action || record.ientityid == '6' || record.ientityid == '7' ?
                                        //             <VpTooltip placement="top" title="更多">
                                        //                 {
                                        //                     _this.state.isClickMenu ? null :
                                        //                         <VpDropdown overlay={(
                                        //                             <VpMenu onClick={(e) => _this.menuClick(e, record.ientityid, record.iid)}>
                                        //                                 {
                                        //                                     optionlist.map((item, index) => {
                                        //                                         if (item.key == "delete") {
                                        //                                             return (
                                        //                                                 <VpMenuItem key={item.key}>
                                        //                                                     <VpIconFont className="cursor  m-r-xs f16 text-danger" type="vpicon-shanchu" />
                                        //                                                     删除
                                        //                                                 </VpMenuItem>
                                        //                                             )
                                        //                                         } else {
                                        //                                             return (
                                        //                                                 <VpMenuItem key={item.key}>
                                        //                                                     <VpIconFont className={item.classname} type={item.type} />
                                        //                                                     {item.sname}
                                        //                                                 </VpMenuItem>
                                        //                                             )
                                        //                                         }
                                        //                                     })
                                        //                                 }
                                        //                             </VpMenu>
                                        //                         )}
                                        //                             trigger={['click']}
                                        //                             getPopupContainer={() => document.body}
                                        //                         >
                                        //                             <VpIconFont data-id={record.iid} className="cursor m-lr-xs f16" type='vpicon-wait-y'
                                        //                                 onClick={(e) => e.stopPropagation()}
                                        //                             />
                                        //                         </VpDropdown>
                                        //                 }

                                        //             </VpTooltip>

                                        //             : null
                                        //     }
                                        //</span>
                                    )
                                }
                            });

                            _this.setState({ table_headers: _headerNew, tableloading: false });

                        }
                    }
                }
            }

        }).catch(function (err) {
            console.log(err);
        });
    }

    getConfig = () => {
        //获取导航数据
        vpQuery('/{vpplat}/vfrm/entity/getConfig', {
            entityid: this.state.entityid,
            functionid: this.props.params.functionid,
        }).then((data) => {
            if (data.hasOwnProperty('data')) {
                if (data.data.hasOwnProperty('search')) {
                    let { search, lastview: filtervalue } = data.data
                    let filtervalue1 = '';
                    filtervalue = filtervalue == "" || filtervalue == undefined ? '0' : filtervalue
                    let currentkey = 'filter0'
                    let filters = search.filters
                    if (filters && filters instanceof Array) {
                        filters.filter(function (item) {
                            if (filtervalue == item.value) {
                                filtervalue1 = filtervalue;
                                return;
                            }
                        });
                        if ('' == filtervalue1) {
                            filtervalue1 = filters[0].value
                        }
                    }

                    this.setState({
                        filtervalue: filtervalue1,
                        currentkey: currentkey,
                        openKeys: [currentkey],
                        filters: filters,
                        statusFilters: search.statusFilters || [],
                        classFilters: search.classFilters || [],
                        myfilters: search.myfilters || [],
                        cur_page: 1,
                        num_perpage: 10, //每页记录数
                        pagination: {}

                    }, () => {
                        if (this.props.updateList) {
                            this.getData()
                        }
                    });
                }
                if (data.data.hasOwnProperty('toolbar')) {
                    if (data.data.hasOwnProperty('entityrole')) {
                        this.setState({ entityaddrole: data.data.entityrole });
                    }
                }
                this.setState({ formurl: data.data.formurl })
            }
        })
    }

    //排序
    sorter = (a, b) => {

    }

    barEvent = (key, e, entityid, iid, recond) => {
        let _this = this
        if (key == 'summary') {
            this.setState({ isClickMenu: true })
            // 增加参数配置实现的汇总请求地址 oyq
            let url = '/{vpplat}/vfrm/entity/summary'
            if (window.vp.config.vpm != undefined && window.vp.config.vpm.calculateUrl != undefined) {
                url = window.vp.config.vpm.calculateUrl
            }
            vpAdd(url, {
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
                this.getData()
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
            VpConfirm({
                title: '您是否确认要删除这条信息',
                content: <div><div>{recond.scode ? '编号：' + recond.scode : ''}</div><div>{recond.sname ? '名称：' + recond.sname : ''}</div></div>,
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
        // 复制动作
        else if (key == 'copy') {
            this.addNewAttr(e, iid, 'copy')
        }
        else {
            if (entityid == '7' && this.state.viewtype == 'pjtree') {
                iid = iid.substr(0, iid.length - 1);
            }
            this.jumpTabs(key, entityid, iid)
        }
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
        this.getDynamicTabs(true, ientityid, iids)
        this.setState({
            defaultActiveKey: skey + 'tab',
            activeKey: skey + 'tab',
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
        this.getDynamicTabs(true, ientityid, iids)

        vpQuery('/{vppm}/project/getProjectBySub', {
            subiid: iids,
        }).then((response) => {
            this.setState({
                defaultActiveKey: skey + 'tab',
                activeKey: skey + 'tab',
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
        /* if (this.state.viewtype == 'pjtree' && record.ientityid == '7' && expanded) {
            let iid = record.iid
            vpAdd('/{vpplat}/vfrm/entity/subList', {
                iid: iid.substr(0, iid.length - 1)
            }).then((response) => {
                record.children.splice(0)
                let sublist = response.data
                record.children.push(...sublist)
            })
        } */
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
            this.setState({
                exList: repsonse.data
            })
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
                if (item.hasOwnProperty('children')) {
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
            s_visible: false,
            cur_page: 1,
            timestamp: new Date().getTime()
        }, () => {
            //  this.getData();
            this.getConfig();
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

    //tabs页签
    getDynamicTabs(type, ientityid, iids) {
        if (type) {
            setTimeout(() => {
                vpAdd('/{vpplat}/vfrm/entity/dynamicTabs', {
                    entityid: this.state.viewtype == 'pjtree' ? ientityid : this.state.entityid
                    , iid: iids,
                    functionid: this.state.functionid,
                    sparam: this.state.sparam
                }).then((response) => {
                    const tabs = response.data.tabs;
                    this.setState({
                        tabs_array: tabs
                    }, () => {
                        //优化tabs宽度
                        if ($(".ant-tabs-nav-scroll .ant-tabs-nav").width() < $(".ant-tabs-content").width()) {
                            $(".ant-tabs-nav-container").removeClass("ant-tabs-nav-container-scrolling")
                            $(".ant-tabs-tab-prev").hide()
                            $(".ant-tabs-tab-next").hide()
                        }
                    })
                })
            }, 200);
        } else {
            this.setState({
                tabs_array: []
            })
        }
    }

    dropVisbleChange(visible) {
        this.setState({ filterDropdownVisible: visible })
    }

    // 搜索框确定事件
    handlesearch = (value) => {
        this.state.cur_page = 1
        this.getData()
    }
    changesearch = (value) => {
        const quickvalue = $.trim(value)
        this.state.quickvalue = quickvalue
    }

    //删除数据确认事件
    confirm = (entityid, iid) => {
        vpAdd('/{vpplat}/vfrm/entity/deleteData', {
            iid: iid,
            entityid: entityid
        }).then(() => {
            // this.tableRef.getTableData()
            this.getData()
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
    closeRightModal = (entityid, iid, sname) => {
        if (typeof iid == 'number') {
            this.setState({
                showRightBox: true,
                add: false,
                currentclassname: '',
                entityiid: iid,
                row_entityid: entityid,
                row_id: iid,
                s_visible: false,
                sname: sname
            }, () => {
                // this.tableRef.getTableData()
                if (this.state.showRightBox) {
                    try {
                        this.props.setBreadCrumb(sname)
                    }
                    catch (e) { }
                    this.getDynamicTabs(true, entityid, iid)
                }
                else {
                    try {
                        this.props.setBreadCrumb('')
                    }
                    catch (e) { }
                }
            })
        }
        else {
            this.state = {
                ...this.state,
                showRightBox: false,
                add: false,
                currentclassname: '',
                entityiid: 0,
                row_entityid: 0,
                row_id: 0,
                s_visible: false,
                sname: '',
                tabs_array: [],
            }
            this.getData()

            try {
                this.props.setBreadCrumb('')
            }
            catch (e) { }
        }
    }
    // 新增实体 后续需要理解用途
    addNewAttr(e, srcid = '', addType = 'primary') {
        try {
            e.stopPropagation();
        }
        catch (e) { }
        let viewcode = ''
        let currentclassid = ''
        let { classList, entityid } = this.state

        if (classList.length == 1) {
            viewcode = classList[0].scode
            currentclassid = classList[0].iid
        }

        let row_id = ''
        let params = {
            entityid,
        }

        if (addType === 'copy') {
            params.srcid = srcid
            row_id = srcid
        }
        
        this.formevent(this.state.entityid, "", viewcode)
        let formurl = this.state.formurl
        this.setState({
            showRightBox: true,
            add: true,
            addType,
            entityiid: '',
            row_id,
            statusList: [],
            defaultActiveKey: '0',
            activeKey: '0',
            viewcode,
            currentclassid,
            formurl,
            currentclassname: $(".ant-breadcrumb>span:last>span>a>span").text()
        });
    }
    // 新增实体--带当前行数据
    addNewAttrparam(e) {
        const _this = this;
        let row_id = e.record.iid;
        this.setState({
            showRightBox: true,
            add: true,
            entityiid: '',
            row_id: row_id,
            statusList: []
        });

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
                    showIcon: true,
                    s_visible: true
                }, 5)
            }
        }
    }

    onRowClick(record, index) {
        let iids = record.iid
        let sname = record.sname
        let scode = record.scode
        let ientityid = record.ientityid
        if ((ientityid == '7' || ientityid == '8') && this.state.viewtype == 'pjtree') {
            iids = iids.substr(0, iids.length - 1);
        }
        vpQuery('/{vpplat}/vfrm/entity/EntityCaseExists', {
            entityid: ientityid, iid: iids
        }).then((data) => {
            let flag = data.data
            if (flag) {
                this.setState({
                    showRightBox: true,
                    subItemProjectId: record.iprojectid,
                    add: false,
                    entityiid: iids,
                    row_entityid: ientityid,
                    row_id: iids,
                    s_visible: false,
                    defaultActiveKey: "entity7_generaltab",
                    activeKey: 'entity7_generaltab',
                    sname: sname,
                    scode: scode
                }, () => {
                    this.getDynamicTabs(true, ientityid, iids);
                    this.formevent(ientityid, iids, "");
                });
                try {
                    this.props.setBreadCrumb(sname)
                }
                catch (e) { }
            } else {
                VpAlertMsg({
                    message: "消息提示",
                    description: '该数据已经被删除！',
                    type: "error",
                    closeText: "关闭",
                    showIcon: true
                }, 5)
                // this.tableRef.getTableData()
                this.getData()
            }
        })
    }

    //查询表单onsave，onload方法
    formevent = (ientityid, iid, viewtype) => {
        vpQuery('/{vpplat}/vfrm/entity/getformevent', {
            entityid: ientityid, iid, viewtype
        }).then((response) => {
            this.setState({
                eventmap: response.data
            })
        })
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
    //点击内容跳转tab
    goToActive(data) {
        //判断传入的值是否为空或者不存在
        if (data && data != undefined && data != null) {
            this.setState({
                activeKey: data + ''
            })
        }
    }
    //点击切换tab
    onTabClick(data) {
        this.setState({
            activeKey: data + ''
        })
    }

    // 直接渲染的页面
    directForm = (path, options) => {
        let Tabs = requireFile(path)

        return (
            <Tabs
                {...this.buildParams(options)}
            />
        )
    }

    // 参数统一处理
    buildParams = (data) => {
        return {
            setBreadCrumb: (sname) => this.props.setBreadCrumb(sname),
            closeRightModal: () => this.closeRightModal(),
            // refreshList: () => this.tableRef.getTableData(),
            refreshList: () => this.getData(),
            goToActive: this.goToActive.bind(this),
            ...data,
        }
    }

    addNewDom = () => {
        const {
            entityid,
            entityiid,
            entityrole,
            currentclassid,
            viewcode,

            entitytype,
            eventmap,
            sname: entityname,
            row_entityid,
            row_id,
            viewtype,
            tabs_array,

            dynamicFormChange,
            dynamicFormDidMount,
            dynamicFormLoaded,
        } = this.state
        const { stabparam = {} } = this.props
        let params = {
            iid: entityiid,
            entityrole,
            data: {
                currentclassid: currentclassid,
                viewcode: viewcode,
            },
        }
        let { formurl } = this.state
        if (formurl == '' || formurl == undefined) {
            formurl = 'vfm/DynamicForm/dynamic'
        }
        let NewForm = requireFile(formurl) || NotFind
        console.log(this.props)
        // if (this.pageType === 'form') {
        //     return this.directForm('vfm/Team/team', {
        //         entitytype, //实体发起类型
        //         eventmap, //表单onsave，onload方法
        //         add: false,
        //         entityname,
        //         params,
        //         entityid,
        //         iid: '1',
        //         irelationid: '248',
        //         imainentity: null,
        //         irelationentity: null,
        //         row_entityid,
        //         skey: 'entity6_team',
        //         issubitem: '0',
        //         row_id,
        //         viewtype,
        //         iaccesslevel: '1',
        //         entityrole: true,
        //         stabparam: '',
        //         doctype: "3",
        //         tabsArray: tabs_array,

        //         formChange: dynamicFormChange,
        //         formDidMount: dynamicFormDidMount,
        //         formLoaded: dynamicFormLoaded
        //     })
        // }
        return (
            <VpTabs
                defaultActiveKey={this.state.defaultActiveKey}
                activeKey={this.state.activeKey}
                onTabClick={this.onTabClick.bind(this)}
                destroyInactiveTabPane
            >
                {
                    tabs_array.length ?
                        tabs_array.map((item, idx) => {
                            if (item.staburl) {
                                if (item.ilinktype == '1') {
                                    return (
                                        <VpTabPane tab={item.sname} key={item.skey + 'tab'} >
                                            <VpIframe url={item.staburl + "?entityid=" + this.state.entityid + "&iid=" + this.state.entityiid} />
                                        </VpTabPane>
                                    )
                                } else {
                                    let tabUrl = item.staburl.split('?')
                                    let staburl = tabUrl[0]
                                    let stabparam = ''
                                    if (tabUrl.length > 1) {
                                        stabparam = tabUrl[1]
                                    }
                                    let skey = item.skey;
                                    let skeyentity = "entity" + this.state.entityid + "_doclist";
                                    if (skey != skeyentity) {
                                        let Tabs = requireFile(staburl) || NotFind
                                        const {
                                            iid: irelationid,
                                            imainentity,
                                            irelationentity,
                                            skey,
                                            issubitem,
                                            iaccesslevel,
                                        } = item
                                        const entityrole = iaccesslevel === '1' ? true : false
                                        return (
                                            <VpTabPane tab={item.sname} key={item.skey == undefined ? idx : item.skey + 'tab'} >
                                                <Tabs
                                                    {
                                                    ...this.buildParams({
                                                        add: false,
                                                        doctype: '3',
                                                        entitytype,
                                                        entityrole,
                                                        eventmap,
                                                        entityname,
                                                        entityid,
                                                        iid: entityiid,
                                                        row_entityid,
                                                        row_id,
                                                        viewtype,
                                                        stabparam,
                                                        tabsArray: tabs_array,

                                                        // item中的参数
                                                        irelationid,
                                                        imainentity,
                                                        irelationentity,
                                                        skey,
                                                        issubitem,
                                                        iaccesslevel,

                                                        params,

                                                        formChange: dynamicFormChange,
                                                        formDidMount: dynamicFormDidMount,
                                                        formLoaded: dynamicFormLoaded,
                                                    })
                                                    }
                                                />
                                            </VpTabPane>
                                        )
                                    } else {
                                        let Tabs = requireFile(staburl)
                                        return <VpTabPane tab={item.sname} key={item.skey == undefined ? idx : item.skey + 'tab'} >
                                            <DocumentList doctype="3"
                                                iaccesslevel={item.iaccesslevel} //(0:读 1:写)
                                                entityrole={item.iaccesslevel == '1' ? true : false}
                                                irelentityid={this.state.row_entityid}
                                                irelobjectid={this.state.row_id}
                                                mainentityid="7"
                                                mainiid={this.state.subItemProjectId} />
                                        </VpTabPane>
                                    }
                                }
                            }

                            return (
                                <VpTabPane tab={item.sname} key={idx + 'tabs'} >

                                </VpTabPane>
                            )
                        })
                        :
                        <VpTabPane tab='基本信息' key={'0'} >
                            {
                                this.state.add ?
                                    <NewForm
                                        setBreadCrumb={(sname) => this.props.setBreadCrumb ? this.props.setBreadCrumb(sname + this.state.currentclassname) : ""}
                                        params={params}
                                        formChange={dynamicFormChange}
                                        formDidMount={dynamicFormDidMount}
                                        formLoaded={dynamicFormLoaded}
                                        entitytype={this.state.entitytype} //实体发起类型
                                        eventmap={this.state.eventmap} //表单onsave，onload方法
                                        add={true}
                                        addType={this.state.addType}
                                        entityrole={true}
                                        closeRightModal={(entityid, iid, sname) => this.closeRightModal(entityid, iid, sname)}
                                        // refreshList={() => this.tableRef.getTableData()}
                                        refreshList={this.getData}
                                        row_id={row_id}
                                        entityid={this.state.entityid}
                                        row_entityid={this.state.entityid}
                                        mainentity={this.props.mainentity || this.props.row_entityid}
                                        mainentityiid={this.props.mainentityiid || this.props.row_id}
                                        formType={this.props.formType} // 当'tabs'处理，表单初始化出关联测试案例库分类rylkfl
                                        //关联实体参数
                                        stabparam={stabparam}
                                    />
                                    :
                                    null
                            }
                        </VpTabPane>
                }
            </VpTabs>
        );
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
                let viewcode = 'expexcel';
                if('114'==this.state.entityid){ 
                    let ss = this.state.sparam
                    if(ss && ss.indexOf('iclassid:118')>-1){// 测试任务定制导出模板
                        viewcode = 'testexpexcel'
                    }
                    
                }
                vpDownLoad("/{vppm}/dlbank/ent/exportfile", {
                    quickvalue: this.state.quickvalue,
                    ientityid: this.state.entityid,
                    type: 'expdata',
                    viewcode: viewcode,
                    filtervalue: this.state.filtervalue,
                    currentkey: this.state.currentkey,
                    condition: JSON.stringify(this.state.searchData)?[]:JSON.stringify(this.state.searchData),
                    custparam:this.state.sparam
                })
            }
        })
    }
    zbhandleMenuClick = () => {
       
        var conSql = "select iid from vpm_task where sname is not null and iflag=0";
        var url = "vfm/ChooseEntity/ChooseEntity"
        let urlparam = "condition=" + JSON.stringify([{
            field_name: 'iid',
            field_value: encodeURIComponent(conSql),
            expression: 'in' // 支持between（日期、数字类型字段）、in、gt、egt、eq、lt、elt等数字操作符；
        }])
        let makeForm = {
            "groups": [{
                "group_type": 3,
                "group_label": "变迁",
                "fields": [
                    {
                        "field_name": "reportname", "field_label": "日期", "all_line": 4,
                        "validator": { "message": "输入内容不能为空！", required: true },
                        "widget_type": "date", "widget": { "default_value": "", "default_label": "" },
                        "readonly": false, "disabled": false
                    }
                    // ,
                    // {
                    //     "field_name": "itaskids", "field_label": "测试任务", "all_line": 2,
                    //     "validator": { "message": "测试任务不能为空!", required: true },
                    //     "widget_type": "multiselectmodel", "widget": { "default_value": "", "default_label": "" },
                    //     "irelationentityid": 114, "url": url, "urlparam": urlparam
                    // }
                ]
            }]
        }

        this.setState({
            makeForm: makeForm,
            chosenVisible: true
        })
    }
    okModel = (values) => {debugger
        let _this = this
        if (values) {
            _this.setState({
                chosenVisible: false
            })
            let reportdate = values.startday
                vpQuery('/{vppm}/dlbank/export/preExportReport', {
                    quickvalue: _this.state.quickvalue,
                    ientityid: _this.state.entityid,
                    type: 'expdata',
                    viewcode: 'expexcel',
                    filtervalue: _this.state.filtervalue,
                    currentkey: _this.state.currentkey,
                    condition: JSON.stringify(_this.state.searchData),
                    reportdate:formatDateTime(reportdate)
                }).then(function (data) {
                    if(data.data.flag){
                        vpDownLoad("/{vppm}/dlbank/export/exportReport", {
                            quickvalue: _this.state.quickvalue,
                            ientityid: _this.state.entityid,
                            type: 'expdata',
                            viewcode: 'expexcel',
                            filtervalue: _this.state.filtervalue,
                            currentkey: _this.state.currentkey,
                            condition: JSON.stringify(_this.state.searchData),
                            reportdate:formatDateTime(reportdate)
                        },()=>{
                           
                        })
                    }else{
                        VpAlertMsg({
                            message: "消息提示",
                            description: data.data.msg,
                            type: "error",
                            
                            closeText: "关闭",
                            showIcon: true
                          }, 5)
                    }
                })    
        }
    }
    cancelModel = () => {
        this.setState({
            chosenVisible: false
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
        this.state.entityVisible = false
        this.getData()
        // this.setState({
        //     entityVisible: false
        // }, () => this.tableRef.getTableData())
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

    handleLike = (e, ientityid, iid, record) => {
        try {
            e.stopPropagation();
        }
        catch (e) { }
        vpAdd('/{vpplat}/vfrm/entity/handleLike', {
            ientityid,
            iid,
            record: JSON.stringify(record)
        }).then((data) => {
            this.getData()
            // this.tableRef.getTableData()
        })
    }

    //左侧伸缩
    shrinkLeft = (e) => {
        this.setState({
            shrinkShow: !this.state.shrinkShow
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
            this.setState({
                filtervalue,
                openKeys,
                currentkey,
                cur_page: 1
            }, this.getData)
        }
    }

    onStatusClick = (e) => {
        const field_value = e.target.value
        const searchData = []

        if (field_value != 0) {
            searchData.push({
                field_name: "istatusid",
                field_value,
            })
        }

        this.setState({
            searchData,
        }, this.getData)
    }

    onToggle = (info) => {
        this.setState({
            openKeys: info.open ? info.keyPath : info.keyPath.slice(1),
        });
    }

    //看板视图切换
    handleViewChange = (e) => {
        this.setState({
            view: e.target.value,
            viewtype: e.target.value
        }, () => {
            this.getHeader()
        })
    }

    queryentityList = () => {
        vpQuery('/{vpplat}/vfrm/entity/entityList', {

        }).then((response) => {
            this.setState({
                entityList: response.data
            })
        })
    }

    /**
           * 子组件注册到父组件中
    */
    onRef = (ref) => {
        this.child = ref;
    }

    handleNewClick = (e) => {
        this.queryentityRole(e.key, '')
        this.setState({
            showRightBox: true,
            add: true,
            entityiid: '',
            statusList: [],
            entityid: e.key,
            defaultActiveKey: '0'
        })
    }

    controlAddButton = (numPerPage, resultList) => {
        let theight = vp.computedHeight(resultList.length, '.entityTable')
        if (this.props.fromtype == 'resource') {
            theight = theight - 50
        }
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
    handleNewFormClick = (e) => {
        let viewcode = e.key.split(",")[1]
        let currentclassid = e.key.split(",")[0]
        let currentclassname = e.domEvent.currentTarget.innerText
        this.formevent(this.state.entityid, "", viewcode);
        let formurl = this.state.formurl
        this.setState({
            showRightBox: true,
            row_entityid: this.state.entityid,
            row_id: '',
            add: true,
            entityiid: '',
            statusList: [],
            defaultActiveKey: '0',
            activeKey: '0',
            viewcode,
            currentclassid,
            formurl,
            currentclassname
        });
    }
    render() {
        const _this = this
        const classList = (
            <VpMenu onClick={this.handleNewFormClick}>
                {
                    this.state.classList.map((item, index) => {
                        return <VpMenuItem key={item.iid + ',' + item.scode}><VpIconFont type={item.icon} /> {item.sname}</VpMenuItem>
                    })

                }
            </VpMenu>
        )
        let options = []
        if (this.state.viewtype == 'edit' && this.state.entityaddrole) {
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
                { //(this.state.isimportflag == 1 || this.state.isexportflag == 1))
                    _this.state.exList.map((item, index) => {
                        if (item.scode == 'expexcel' && this.state.isexportflag == 1) {
                            return <VpMenuItem key={item.iid} type={item.iviewtype}>{item.sname}</VpMenuItem>;
                        }
                        else if (item.scode == 'impexcel' && this.state.isimportflag == 1) {
                            return <VpMenuItem key={item.iid} type={item.iviewtype}>{item.sname}</VpMenuItem>;
                        }
                    })
                }
            </VpMenu>
        )

        const menu = (
            <div className="search-form bg-white ant-dropdown-menu">
                {
                    _this.state.s_visible ?
                        <SearchForm
                            onRef={this.onRef}
                            chooseModalVisible={this.chooseModalVisible}
                            cancelSearch={this.cancelSearch}
                            handleSearchForm={this.handleSearchForm}
                            defaultSearchValues={this.state.searchFormValues}
                            entityid={this.props.params.entityid}
                            functionid={this.state.functionid}
                            formData={this.state.SearchFormData}
                            inputNameFlag={this.inputNameFlag}
                        />
                        : null
                }
            </div>
        )
        const entityList = (
            <VpMenu onClick={this.handleNewClick}>
                {
                    this.state.entityList.map((item, index) => {
                        return <VpMenuItem key={item.entityid}>{item.sname}</VpMenuItem>
                    })

                }
            </VpMenu>
        )

        // custFilter属性目前只且仅支持filter类别
        let vpplat = window.vp.config.vpplat
        let custFilter = []

        if (vpplat == undefined || vpplat.custFilter == undefined) {
            if (_this.state.entityid == 3 || _this.state.entityid == 205) {
                custFilter = ["filter"]//, "class", "status"
            } else {
                custFilter = ["filter"]
            }

        } else {
            custFilter = vpplat.custFilter || []
        }

        let {
            viewtype, entityid, table_array, fromtype,
            shrinkShow, isaddflag,

            statusFilters, statusDefauleValue,
        } = this.state
        const { statusFiltersVisible, hasScreen, screenReactFn, entityData } = this.props
        let screenSpan = 0
        let contentSpan = 24
        if (hasScreen) {
            screenSpan = fromtype !== 'resource' ? custFilter.length && shrinkShow ? '4' : '0' : '0'
            contentSpan = fromtype !== 'resource' ? custFilter.length && shrinkShow ? '20' : '24' : '24'
        }
        return (
            <div className="business-container pr full-height entity">
                <div className="subAssembly b-b bg-white" style={this.props.style}>
                    <VpRow gutter={10}>
                        <VpCol className="gutter-row" span={4}>
                            <div className="m-b-sm search entitysearch" >
                                <SeachInput placeholder="请输入名称或编号" key={this.state.searchkey} onSearch={this.handlesearch} onChange={this.changesearch} />
                            </div>
                        </VpCol>

                        <VpCol className="gutter-row text-right" span={20}>
                            <VpCol span={18} className="text-left" >
                                {
                                    statusFiltersVisible &&
                                    statusFilters instanceof Array &&
                                    statusFilters.length > 0 && (
                                        <VpRadioGroup className="m-b-sm" showType="button" defaultValue={statusDefauleValue} onChange={this.onStatusClick} >
                                            <VpRadioButton value={0}>全部</VpRadioButton>
                                            {
                                                statusFilters.map(item => {
                                                    return <VpRadioButton key={item.value} value={item.value}>{item.name}</VpRadioButton>
                                                })
                                            }
                                        </VpRadioGroup>
                                    )
                                }
                            </VpCol>
                            <VpCol span={6}>
                                {this.props.titleActionReact}
                                {

                                    isaddflag == 1 ?
                                        viewtype == 'pjtree' ?
                                            this.state.entityList.length > 0 ?
                                                <VpTooltip placement="top" title="快速创建">
                                                    <VpDropdown
                                                        trigger={['click']}
                                                        overlay={entityList}
                                                    >
                                                        <div style={{ display: 'inline-block' }}>
                                                            <VpButton type="primary" shape="circle" icon="plus" className="m-l-xs" />
                                                        </div>
                                                    </VpDropdown>
                                                </VpTooltip>
                                                : ''
                                            :

                                            this.state.classList.length > 1 && isaddflag == 1 ?
                                                <VpTooltip placement="top" title="快速创建">
                                                    <VpDropdown
                                                        trigger={['click']}
                                                        overlay={classList}
                                                    >
                                                        <div style={{ display: 'inline-block' }}>
                                                            <VpButton type="primary" shape="circle" icon="plus" className="m-l-xs" />
                                                        </div>
                                                    </VpDropdown>
                                                </VpTooltip> : <div style={{ display: 'inline-block' }} onClick={_this.addNewAttr.bind(_this)}><QuickCreate /></div>
                                        : ''
                                }

                                {
                                    (this.state.entityid != 204 && (this.state.isimportflag == 1 || this.state.isexportflag == 1)) ?
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
                                        : null
                                }

                                {
                                    (vp.config.vpplat != undefined && vp.config.vpplat.toolbar != undefined
                                        && vp.config.vpplat.toolbar.search == false) ?
                                        null
                                        :
                                        <VpDropdown
                                            onClick={this.handleVisibleChange}
                                            trigger={['click']}
                                            overlay={menu}
                                            onVisibleChange={this.handleVisibleChange}
                                            visible={this.state.s_visible}>
                                            <div style={{ display: 'inline-block' }} id="searchbox">
                                                <FindCheckbox />
                                            </div>
                                        </VpDropdown>
                                }

                                {
                                    (this.state.entityid == 7 ) ?
                                    <VpTooltip placement="top" title="导出周报">
                                        <VpButton className="vp-btn-br" type="ghost" shape="circle" style={{ margin: "0 3px" }} onClick={() => this.zbhandleMenuClick()}>
                                            <VpIconFont type="vpicon-download" />
                                        </VpButton>
                                    </VpTooltip>
                                    : null
                                }

                                <div className="fr m-l-xs">
                                    <VpRadioGroup defaultValue="list" className="radio-tab" onChange={this.handleViewChange}>
                                        {
                                            (vp.config.vpplat != undefined && vp.config.vpplat.viewlist != undefined && vp.config.vpplat.viewlist.tree == true)
                                                && (this.state.entityid == '6' || this.state.entityid == '7' || this.state.entityid == '8') ?
                                                <VpRadioButton value="pjtree">
                                                    <VpTooltip placement="top" title="树表视图">
                                                        <VpIconFont type="vpicon-file-tree" />
                                                    </VpTooltip>
                                                </VpRadioButton> :
                                                null
                                        }

                                        {
                                            vp.config.vpplat != undefined && vp.config.vpplat.viewlist != undefined && vp.config.vpplat.viewlist.list == true ?
                                                <VpRadioButton value={this.state.entityid == 1 ? "tree" : "list"}>
                                                    <VpTooltip placement="top" title="列表视图">
                                                        <VpIconFont type="vpicon-navlist" />
                                                    </VpTooltip>
                                                </VpRadioButton>
                                                : null
                                        }

                                        {
                                            vp.config.vpplat != undefined && vp.config.vpplat.viewlist != undefined && vp.config.vpplat.viewlist.editList == true ?
                                                <VpRadioButton value="edit">
                                                    <VpTooltip placement="top" title="编辑视图">
                                                        <VpIconFont type="vpicon-demand" />
                                                    </VpTooltip>
                                                </VpRadioButton>
                                                : null
                                        }
                                    </VpRadioGroup>
                                </div>
                            </VpCol>
                        </VpCol>
                    </VpRow>
                </div>

                <div className="business-wrapper p-t-sm full-height" id="table">
                    <div className="bg-white p-sm entity-list full-height">
                        <VpRow gutter={16} className="full-height">
                            <VpCol
                                span={screenSpan}
                                className="full-height menuleft"
                            >
                                {
                                    entityData &&
                                        entityData instanceof Function ?
                                        entityData(this) : null
                                }

                                {
                                    screenReactFn &&
                                        screenReactFn instanceof Function ?
                                        screenReactFn(this)
                                        :
                                        <VpMenu className="full-height scroll-y entity-left-css" onClick={this.handleClick}
                                            openKeys={this.state.openKeys}
                                            onOpen={this.onToggle}
                                            onClose={this.onToggle}
                                            selectedKeys={[this.state.filtervalue]}
                                            mode="inline"
                                        >
                                            {
                                                custFilter.map(item => {
                                                    if (item == "filter") {
                                                        return (
                                                            this.state.myfilters.map((filterinfo, index) => {
                                                                return (
                                                                    <VpSubMenu key={"filter" + index}
                                                                        title={
                                                                            <span><VpIconFont type={filterinfo.icon || "vpicon-filter"} className="m-r-xs" /><span>{filterinfo.name}</span></span>
                                                                        }
                                                                    >
                                                                        {
                                                                            filterinfo.children.map((item, index) => {
                                                                                return <VpMenuItem key={item.value} className="menu-text-overflow">{item.name}</VpMenuItem>
                                                                            })
                                                                        }
                                                                    </VpSubMenu>
                                                                )
                                                            })
                                                        )
                                                    } else if (item == "class") {
                                                        return (
                                                            <VpSubMenu key="class" title={<span><VpIconFont type="vpicon-fenlei" className="m-r-xs" /><span>类别</span></span>}>
                                                                {
                                                                    this.state.classFilters.map((item, index) => {
                                                                        return <VpMenuItem key={item.value} className="menu-text-overflow">{item.name}</VpMenuItem>
                                                                    })
                                                                }
                                                                <VpMenuItem key='0'>全部</VpMenuItem>
                                                            </VpSubMenu>
                                                        )
                                                    } else if (item == "status") {
                                                        return (
                                                            <VpSubMenu key="status" title={<span><VpIconFont type="vpicon-loading" className="m-r-xs" /><span>状态</span></span>}>
                                                                {
                                                                    this.state.statusFilters.map((item, index) => {
                                                                        return <VpMenuItem key={item.value} className="menu-text-overflow">{item.name}</VpMenuItem>
                                                                    })
                                                                }
                                                                <VpMenuItem key='0'>全部</VpMenuItem>
                                                            </VpSubMenu>
                                                        )
                                                    }
                                                })
                                            }
                                        </VpMenu>
                                }
                            </VpCol>
                            <VpCol span={contentSpan} className="full-height scroll-y pr">

                                {
                                    hasScreen && (
                                        <div className="togglebar cursor text-center" onClick={this.shrinkLeft}>
                                            <VpIconFont className="f12" type={`${shrinkShow ? 'vpicon-caret-left-s' : 'vpicon-caret-right-s'}`} />
                                        </div>
                                    )
                                }


                                <VpSpin spinning={this.state.spinning} size="large">

                                    <div id="vp-entity-drown" className={this.state.viewtype == 'edit' ? "batch-table" : ""}>
                                        <VpTable
                                            key={entityid}
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
                                            /**dataUrl关乎table组件的getTableData方法是否起效 */
                                            //dataUrl={'/{vpplat}/vfrm/entity/dynamicListData'}
                                            dataSource={table_array}
                                            pagination={this.state.viewtype == 'tree' ? false : this.state.pagination}
                                            onChange={this.tableChange}
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
                                                _k: this.state.timestamp,
                                                sortfield: this.state.sortfield,
                                                sorttype: this.state.sorttype,
                                            }}
                                            className="entityTable"
                                            expandIconColumnIndex={
                                                entityid == 6 || entityid == 7 || entityid == 8 || entityid == 114 ? 1 : 0}
                                            columns={this.state.table_headers}
                                            onRowClick={this.state.viewtype == 'edit' ? null : this.onRowClick}
                                            tableOptions={options}
                                            bindThis={this}
                                            functionid={this.state.functionid}
                                            sparam={this.state.sparam}
                                            rowKey={this.state.viewtype == 'edit' ? 'iid' : 'key'}
                                            showTotal={this.state.viewtype == 'tree' || this.state.viewtype == 'pjtree' ? true : false}
                                            resize={true}
                                            scroll={{ y: this.state.tableHeight }}
                                            {...this.props.tableOptions}
                                        />
                                    </div>

                                </VpSpin>
                            </VpCol>
                        </VpRow>
                    </div>
                </div>
                <RightBox
                    max={this.state.fromtype == 'func'}
                    button={
                        <div className="icon p-xs" onClick={this.closeRightModal}>
                            <VpTooltip placement="top" title=''>
                                <VpIcon type="rollback" />
                            </VpTooltip>
                        </div>}
                    show={this.state.showRightBox}>
                    {this.state.showRightBox ? this.addNewDom() : null}
                </RightBox>
                <VpModal
                    title='数据导入'
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
                                        // 增加测试任务－〉用例导入直接关联
                                        upload_url: "/{vpplat}/vfrm/ent/importfile?entityid=" + this.state.entityid
                                            + '&stabparam=' + (this.state.importLable || this.props.stabparam)
                                            + '&mainentityiid=' + this.state.importValue
                                            + "&irelobjectid=" + this.props.irelobjectid,
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
                                server="/{vpplat}/file/uploadfile"
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

                <VpModal
                    title='导出项目周报'
                    visible={this.state.chosenVisible}
                    onCancel={() => this.cancelModel()}
                    width={'30%'}
                    height={'50%'}
                    footer = {null}
                    wrapClassName='ant-modal-wrap'
                >
                    {
                        this.state.chosenVisible  ?
                            <ExportForm
                                onCancel={this.cancelModel}
                                onOk={this.okModel}
                            />
                            : null
                    }
                </VpModal>
            </div>
        );
    }
}


export default Entity = VpFormCreate(Entity);