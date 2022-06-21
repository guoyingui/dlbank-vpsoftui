import React, { Component } from 'react'
import {
    vpQuery,
    vpAdd,
    VpTable,
    VpIcon,
    VpRadioGroup,
    VpRadioButton,
    VpTooltip,
    VpModal,
    VpButton,
    VpRow,
    VpCol,
    VpFormCreate,
    VpPopconfirm,
    VpMenu,
    VpIconFont,
    VpDropdown,
    VpMenuItem
} from 'vpreact';
import './relEntity.less';
import { requireFile } from 'utils/utils';
const Choosen = requireFile('vfm/ChooseEntity/ChooseEntity');
const DynamicTabs = requireFile('vfm/DynamicTabs/dynamictabs');
import {
    RightBox,
    SeachInput,
    QuickCreate
} from 'vpbusiness';

class relEntity2Ystm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            filters: [],
            visible2: false,
            targetKeys: [],
            showRightBox: false,
            widget_show_none: '',
            widget_show_none_tool: '',
            filter_data: [],
            table_headers: [],
            table_array: [],
            cur_page: 1,
            page: 1,
            pagination: {},
            filtervalue: '', //过滤器值
            limit: 10, //每页记录数
            quickvalue: '', //快速搜索内容
            sortfield: '', //排序列key
            sorttype: '', //排序方式
            multipleData: [], //多条件搜索数据
            activeKey: '1',
            increaseData: [], // 新增动态数据
            tabs_array: [],
            tabs: null,
            filterDropdownVisible: false,
            isAdd: false,
            formSearch_data: [],
            form_data: [],
            formdata: [],
            entityid: '',
            iids: '',
            row_id: '',
            entityiid: '',
            add: true,
            irelationid: '',
            irelationentity: '',
            imainentity: '',
            irelationentityiid: '',
            visible: false,
            mainentityid: '',
            mainentityiid: '',
            showRightBox2: false,
            max: false,
            addReal: false,
            initValue: [],
            loading: false,
            statusList: [],
            varilsForm: {},
            variid: '',
            formvalue: {},
            entityrole: false,
            defaultActiveKey: '',
            entitytype: '',
            viewtype: '',
            tableHeight: 0,
            classList: [],
            isaddflag: 0,
            iseditflag: 0,
            isdeleteflag: 0
        }
        this.handlesearch = this.handlesearch.bind(this);
        this.tableChange = this.tableChange.bind(this);
        this.filterChange = this.filterChange.bind(this);
        this.multipleSearch = this.multipleSearch.bind(this);
        this.tabsChange = this.tabsChange.bind(this);
        this.onRowClick = this.onRowClick.bind(this);
        this.getHeader = this.getHeader.bind(this);
        this.getData = this.getData.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);
        this.confirm = this.confirm.bind(this);
        this.closeRightModal = this.closeRightModal.bind(this);
        this.addRealtion = this.addRealtion.bind(this);
        this.cancelChoosen = this.cancelChoosen.bind(this);
        this.submitChoosen = this.submitChoosen.bind(this);
        if (this.props.skey == 'entity326_zljc') { // 项目关联质量检查时，传递参数到form
            this.state.custparam = { iclassid: 1 }
        }
    }

    /*  componentWillReceiveProps(nextProps) {
         if(nextProps.params.entityid != this.props.params.entityid){
             this.setState({
                 entityid: nextProps.params.entityid
             }, () => {
                 this.getHeader()
                 this.getData()
             })
         }
     } */
    componentWillMount() {
        this.setState({
            mainentityid: this.props.entityid,//主实体id（可能不是，具体看配置是1:n还是m:n）
            mainentityiid: this.props.iid,//主实体iid
            irelationid: this.props.irelationid,//关联关系ID
            irelationentity: this.props.irelationentity,//关联实体的ID
            imainentity: this.props.imainentity,//关系表中主实体ID
            isTab: this.props.isTab,
            stabparam: this.props.stabparam,
            issubitem: this.props.issubitem,
            urlparam: this.props.urlparam
        }, () => {
            this.getHeader()
            this.getData()
            this.queryentityRole(this.props.irelationentity, '')
            this.queryEntityType()
            this.queryclassList()
        })

    }
    componentDidMount() {
        this.queryentityRole(this.props.irelationentity, '')
    }

    queryEntityType = () => {
        vpQuery('/{vpplat}/vfrm/entity/entitytype', {
            entityid: this.state.irelationentity
        }).then((response) => {
            this.setState({
                entitytype: response.data.entitytype
            })
        })
    }

    //查询实体权限
    queryentityRole = (entityid, iid) => {
        let _this = this
        _this.setState({
            entityrole: true//_this.props.entityrole
        })
    }

    //获取表头数据
    getHeader() {
        let _this = this;
        vpQuery('/{vpplat}/vfrm/entity/getheaders', {
            entityid: _this.state.irelationentity, scode: 'list'
        }).then((data) => {
            if (data && data.hasOwnProperty('data')) {
                console.log('_this.props',_this.props,_this.state);
                let isaddflag = data.data.addflag == undefined ? 0 : (_this.props.issubitem == 1 ? 1 : data.data.addflag);
                if (isaddflag == 1 && _this.props.isAddBtn == false) { // 隐藏新增按钮
                    isaddflag = 0
                }
                let isdeleteflag = data.data.delflag == undefined ? 0 : (_this.props.issubitem == 1 ? 1 : data.data.delflag);
                if (isdeleteflag == 1 && _this.props.isDelBtn == false) { // 隐藏操作栏删除按钮
                    isdeleteflag = 0
                }
                let iseditflag = 1
                if (_this.props.isEditBtn == false) {// 隐藏操作栏编辑按钮
                    iseditflag = 0
                }
                _this.setState({
                    loading: false,
                    isaddflag,
                    isdeleteflag,
                    iseditflag
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
                                    });
                                }
                            }
                        });
                        if (_this.state.iseditflag == 1 || _this.state.isdeleteflag == 1) { // 操作列有任何按钮要显示时，展示操作列，否则隐藏操作列
                            _header.push({
                                title: '操作', fixed: 'right', width: 120, key: 'operation', render: (text, record) => (
                                    <span>
                                        {
                                            _this.state.iseditflag == 1 ?
                                                <VpTooltip placement="top" title="编辑">
                                                    <VpIcon data-id={record.id} className="cursor text-primary" type="edit" />
                                                </VpTooltip>
                                                :
                                                <span className="m-lr-xs anticon" style={{ width: 16 }}></span>
                                        }

                                        {
                                            _this.state.entityrole && _this.state.isdeleteflag == 1 ?
                                                <VpTooltip placement="top" title="删除关联">
                                                    <VpPopconfirm title="确定要删除这条关联关系吗？" data-id={record.iid} onConfirm={_this.confirm} onCancel={_this.cancel}>
                                                        <VpIcon onClick={_this.handleConfirm} data-id={record.iid} className="m-l-sm cursor text-danger" type="delete" />
                                                    </VpPopconfirm>
                                                </VpTooltip>
                                                :
                                                <span className="m-lr-xs anticon" style={{ width: 16 }}></span>
                                        }
                                    </span>
                                )
                            });
                        }
                        _this.setState({ table_headers: _header });
                    }
                }
            }
        }).catch(function (err) {
            console.log(err);
        });

        //获取导航数据
        vpQuery('/{vpplat}/vfrm/entity/getConfig', {
            entityid: _this.state.irelationentity
        }).then(function (data) {
            if (data.hasOwnProperty('data')) {
                if (data.data.hasOwnProperty('search')) {
                    _this.setState({
                        widget_show_none: data.data.search,
                        filters: data.data.search.filters
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
                }
                _this.setState({ formurl: data.data.formurl })
            }
        })
    }

    /**
     * 预算条目下的合同金额汇总到预算条目中
     */
    sumCount = () => {
        vpAdd('/{vpplat}/budget/updateBudgetMount', {
            entityid: this.state.mainentityid,
            iid: this.state.mainentityiid
        }).then((response) => {

        })
    }
    /**
     * 预算池下的预算条目金额汇总到预算池的对应金额中
     */
    sumpoolCount = (ientityid, iids) => {
        vpAdd('/{vpplat}/budget/updateBudgetPool', {
            entityid: this.state.mainentityid,
            iid: this.state.mainentityiid
        }).then((response) => {

        })
    }

    getDynamicListData(sparam) {
        return vpAdd('/{vpplat}/vfrm/entity/dynamicListData', sparam)
    }
    // 获取表格数据

    getData() {
        const { filtervalue, cur_page, limit, quickvalue, irelationentity,
            sortfield, sorttype, irelationid, mainentityid, mainentityiid, isTab, stabparam
        } = this.state;
        //预算条目下的合同金额汇总到预算条目中
        if (mainentityid == 163 && irelationentity == 91) {
            this.sumCount()
        }
        //预算池下的预算条目金额汇总到预算池的对应金额中
        if (mainentityid == 168 && irelationentity == 163) {
            this.sumpoolCount()
        }
        const sparam = {
            entityid: irelationentity,//关联关系实体ID
            currentPage: cur_page,
            pageSize: limit,
            quickSearch: quickvalue,
            irelationid: irelationid,//关联实体关联关系ID
            ientityid: mainentityid,  //从左边导航点进来的实体ID
            iid: mainentityiid,       //主实体的当前行数据ID
            isTab: isTab,
            skey: this.props.skey,
            stabparam: stabparam,
            datafilter: 'auth'//权限过滤需要加这个参数
        }
        this.getDynamicListData(sparam).then((response) => {
            const { data } = response
            let showTotal = () => {
                return '共' + data.totalRows + '条'
            }
            let theight = vp.computedHeight(data.totalRows, '.relentity', 250)
            this.setState({
                tableHeight: theight,
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
        }).catch((e) => {
            if (!(typeof e == 'function')) {
                console.log('Error:' + e)
            } else {
                e();
            }
        })
    }
    // 获取行详情
    getRowData(id) {
        vpQuery('/{vpplat}/cfgent/getdata', { id }).then((response) => {
        })
    }

    //关闭右侧滑出
    closeRightModal() {
        if (this.state.showRightBox2) {
            $(".ant-table-row").css("background", "")
        }
        this.setState({
            showRightBox2: false
        }, () => this.getData())
    }

    // 搜索框确定事件
    handlesearch(value) {
        const searchVal = $.trim(value)
        this.setState({
            quickvalue: searchVal,
            cur_page: 1
        }, () => {
            this.getData()
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
            this.getData()
        })
    }

    onShowSizeChange(value) {

    }
    /**
     * 在删除关系前
     */
    onBeforeDeleteRel(sparam) {

    }
    /**
     * 删除关系
     * @param sparam
     */
    onDeleteRel(sparam) {
        if (sparam.irelationentity == '11') {
            const _this = this;
            return vpAdd('/{vpplat}/vfrm/entity/deleteData', {
                iid: sparam.irelationentityiid,
                entityid: sparam.irelationentity,
                type: 'relation',
                mainentityid: sparam.mainentityid,
                mainentityiid: sparam.mainentityiid,
            });
        } else {
            return vpAdd('/{vpplat}/vfrm/entity/deleteRelation', {
                sparam: JSON.stringify(sparam)
            });
        }
    }
    confirm() {
        const _this = this;
        const { mainentityid,
            mainentityiid,
            irelationid,
            irelationentity,
            row_id
        } = _this.state
        let sparam = {
            irelationentityiid: row_id,
            mainentityid: mainentityid,
            mainentityiid: mainentityiid,
            irelationid: irelationid,
            irelationentity: irelationentity,
            stabparam: this.props.stabparam
        }
        let beforeResult = this.onBeforeDeleteRel(sparam);
        Promise.resolve(beforeResult).then((flag) => {
            if (flag !== false) {
                //只有返回false时，才认为不往下执行，其它情况视往下执行
                _this.onDeleteRel(sparam).then(function (data) {
                    _this.getData();
                })
            }
        });
    }

    //删除数据事件
    handleConfirm(e) {
        e.stopPropagation();
        let row_id = e.target.dataset.id;
        this.setState({ row_id });

    }
    // 过滤器事件
    filterChange(e) {
        this.setState({
            filtervalue: e.target.value
        }, () => {
            this.getData()
        })
    }
    // 多条件搜索
    multipleSearch(e) {
        e.preventDefault();
        let validateFields = [];
        this.state.multipleData[0].fields.forEach(item => {
            validateFields.push(item.field_name)
        });
        this.props.form.validateFields(validateFields, (errors, values) => {
            if (!!errors) {
                console.log(errors);
                return;
            }
            this.setState({
                s_visible: false
            })
            this.getData(values);
        });
    }

    onBeforeNewRel(sparam) {

    }
    // 新增实体
    addNewAttr(e) {
        const _this = this
        const { mainentityid,
            mainentityiid,
            irelationentity,
            classList
        } = _this.state
        let sparam = {
            mainentityid: mainentityid,
            mainentityiid: mainentityiid,
            irelationentity: irelationentity,
            stabparam: this.props.stabparam,
            classList: classList
        }
        let beforeResult = this.onBeforeNewRel(sparam);
        Promise.resolve(beforeResult).then((flag) => {
            if (flag !== false) {
                //只有返回false时，才认为不往下执行，其它情况视往下执行
                _this.setState({
                    increaseData: {},
                    add: true,
                    entityiid: '',
                    irelationentityiid: '',
                    showRightBox2: true,
                    loading: false
                });
            }
        });

    }

    tabsChange(tabs) {

    }
    onRowClick(record, index) {
        if (!this.state.showRightBox2) {
            $(".ant-table-row." + record.iid).css("background", "#eaf8fe")
        }
        let iids = record.iid
        this.setState({
            increaseData: {},
            irelationentityiid: iids,
            showRightBox2: true,
            loading: false,
            sname: record.sname,
            scode: record.scode,
            add: false
        });
        //this.props.setBreadCrumb(sname)
    }

    //弹出选择关联实体
    addRealtion() {
        this.setState({
            addReal: true
        })
    }

    /**
     * 保存关系后台
     */
    onSaveReal(sparam) {
        return vpAdd('/{vpplat}/vfrm/entity/addReal', {
            sparam: JSON.stringify(sparam)
        });
    }
    //关闭选择实体
    submitChoosen(selectItem) {
        const _this = this
        let param = {
            selectitem: selectItem,
            irealid: this.state.irelationid,
            curentity: this.state.mainentityid,
            mainentityiid: this.state.mainentityiid,
            irelationentity: this.props.irelationentity,
            isTab: this.props.isTab,
            stabparam: this.props.stabparam,
            issubitem: this.props.issubitem
        }
        this.onSaveReal(param).then((response) => {
            _this.setState({
                addReal: false
            }, () => {
                _this.getData()
            })
        })
    }

    //关闭选择实体
    cancelChoosen() {
        this.setState({
            addReal: false
        })
    }

    /**
     * 获取实体类别列表
     */
    getClassList(entityid, mainentityid, mainentityiid) {
        return vpQuery('/{vpplat}/vfrm/tasks/classList', {
            entityid, mainentityid, mainentityiid
        })
    }

    /**
     * 查询实体类别，绑定表单
     */
    queryclassList = () => {
        let _this = this
        const { irelationentity, mainentityid, mainentityiid } = this.state
        this.getClassList(irelationentity, mainentityid, mainentityiid).then((response) => {
            let classList = response.data
            if (classList.length == 1) {
                let viewcode = classList[0].scode
                let currentclassid = classList[0].iid
                _this.setState({
                    viewcode,
                    currentclassid,
                    classList
                });
            } else {
                _this.setState({
                    classList
                })
            }
        })
    }


    /**
     * 新增下拉点击事件
     */
    handleNewFormClick = (e) => {
        let viewcode = e.key.split(",")[1]
        let currentclassid = e.key.split(",")[0]
        let currentclassname = e.domEvent.currentTarget.innerText
        //this.formevent(this.state.entityid, "", viewcode);
        this.setState({
            increaseData: {},
            add: true,
            entityiid: '',
            irelationentityiid: '',
            loading: false,
            showRightBox2: true,
            viewcode,
            currentclassid,
            currentclassname
        });
    }

    render() {
        const _this = this;
        const classList = (
            <VpMenu onClick={this.handleNewFormClick}>
                {
                    this.state.classList.map((item, index) => {
                        return <VpMenuItem key={item.iid + ',' + item.scode}><VpIconFont type={item.icon} /> {item.sname}</VpMenuItem>
                    })
                }
            </VpMenu>
        )
        return (
            <div className="business-container pr full-height">
                <div className="subAssembly b-b bg-white" style={this.props.style}>
                    <VpRow gutter={10} >
                        <VpCol className="gutter-row" span={4}>
                            {_this.state.widget_show_none.hasOwnProperty('search') ?
                                _this.state.widget_show_none.search ? <SeachInput onSearch={_this.handlesearch} /> : '' :
                                ''
                            }
                        </VpCol>
                            {
                                console.log('this.state.classList.length',this.state.classList.length,this.state.isaddflag)
                            }
                                <VpCol className="gutter-row text-right" span={20}>
                                    {
                                        this.state.classList.length > 1 && this.state.isaddflag == 1 ?
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
                                            :
                                            this.state.isaddflag == 1 ?
                                                <div style={{ display: 'inline-block' }} onClick={_this.addNewAttr.bind(_this)}><QuickCreate /></div>
                                                :
                                                null
                                    }
                                    {
                                        this.props.isRelBtn == 0
                                            ? null
                                            : <VpTooltip placement="top" title="关联">
                                                <VpButton onClick={_this.addRealtion} icon="team" type="primary" shape="circle" className="m-l-xs">
                                                </VpButton>
                                            </VpTooltip>
                                    }
                                    {
                                        this.props.isTask && this.props.isProject &&
                                        <VpRadioGroup
                                            defaultValue="list"
                                            className="radio-tab"
                                            onChange={this.props.handleViewChange}
                                            style={{ marginLeft: '10px' }}
                                        >
                                            <VpRadioButton value="gantt">
                                                <VpTooltip placement="top" title="甘特图">
                                                    <VpIconFont type="vpicon-task" />
                                                </VpTooltip>
                                            </VpRadioButton>
                                            <VpRadioButton value="card">
                                                <VpTooltip placement="top" title="看板视图">
                                                    <VpIconFont type="vpicon-fenlei" />
                                                </VpTooltip>
                                            </VpRadioButton>
                                            <VpRadioButton value="list">
                                                <VpTooltip placement="top" title="列表视图">
                                                    <VpIconFont type="vpicon-file-tree" />
                                                </VpTooltip>
                                            </VpRadioButton>
                                        </VpRadioGroup>
                                    }
                                </VpCol> 
                    </VpRow>
                </div>
                <div className="business-wrapper p-t-sm full-height">
                    <div className="bg-white" >
                        <VpTable
                            className="relentity"
                            columns={this.state.table_headers}
                            dataSource={this.state.table_array}
                            onChange={this.tableChange}
                            onRowClick={this.onRowClick}
                            pagination={this.state.pagination}
                            resize
                            scroll={{ y: this.state.tableHeight }}
                            rowKey="iid"
                            rowClassName={record => record.iid}
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
                    tips={
                        <div className="tips p-xs">
                            <VpTooltip placement="top" title={this.state.sname + '(' + this.state.scode + ')'}>
                                <VpIcon type="exclamation-circle text-muted m-r-xs" />
                            </VpTooltip>

                        </div>
                    }
                    show={this.state.showRightBox2}
                >
                    {
                        this.state.showRightBox2 ?
                            <DynamicTabs
                                param={{
                                    entityid: this.state.irelationentity,
                                    iid: this.state.irelationentityiid,
                                    type: this.state.add,
                                    viewtype: this.state.viewtype,
                                    entitytype: this.state.entitytype,
                                    defaultActiveKey: this.state.defaultActiveKey,
                                    formType: 'tabs', //分辨出这个实体挂在tab页的，还是一级实体
                                    mainentity: this.state.mainentityid,  //从左边导航点进来的实体ID
                                    mainentityiid: this.state.mainentityiid,       //主实体的当前行数据ID
                                    stabparam: this.props.stabparam,
                                    issubitem: this.props.issubitem
                                }}
                                formurl={this.state.formurl}
                                urlparam={JSON.stringify(this.state.custparam)}
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
                                refreshList={() => this.getData()}
                            />

                            : null}
                </RightBox>
                <VpModal
                    title='关联实体'
                    visible={this.state.addReal}
                    width={'70%'}
                    height={'80%'}
                    footer={null}
                    style={{ overflow: 'auto' }}
                    wrapClassName='modal-no-footer'
                    onCancel={() => _this.cancelChoosen()}
                >
                    {
                        this.state.addReal ?
                            <Choosen
                                item={{
                                    ientityid: this.props.entityid, iid: this.props.iid,
                                    irelationentityid: this.state.irelationentity,
                                    irelid: this.state.irelationid,
                                    urlparam: this.state.urlparam
                                }}
                                initValue={_this.state.initValue}
                                params={{}}
                                onCancel={() => _this.cancelChoosen()}
                                onOk={(selectItem) => _this.submitChoosen(selectItem)}
                            />
                            : ''
                    }

                </VpModal>
            </div>
        );
    }
}

/**
 * 方便二次开发人员继承用
 * 二次开发时,先申明类，并继承XX.Component,然后再调用xx.createClass,
 * 例子：
 * class CustomComponent extends XX.Component {
 *
 * }
 * CustomComponent = XX.createClass(CustomComponent);
 * @param newClass
 */
let createClass = function (sourceClass) {
    let wrapClass = VpFormCreate(sourceClass);
    wrapClass.createClass = createClass;
    wrapClass.Component = sourceClass;
    return wrapClass;
}

export default createClass(relEntity2Ystm);
