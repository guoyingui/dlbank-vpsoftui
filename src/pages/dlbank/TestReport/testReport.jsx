import React from 'react';
import {
    VpRow,
    VpCol,
    VpForm,
    VpFormCreate,
    VpIconFont,
    VpFCollapse,
    VpPanel,
    FormItem,
    VpInput,
    VpTable,
    vpQuery,
    VpButton,
    VpMSuccess,
    VpAlertMsg,
    VpModal,
    vpDownLoad
} from 'vpreact';
import { SeachInput, VpDynamicForm } from 'vpbusiness';
import './testReport.less';
import echarts from 'echarts';
import 'vpstatic/plugins/echarts.theme';
class TestReport extends React.Component {
    state = {
        reportList: [],
        iid: 0,
        dreportdate: '',
        ireportuserid: '',
        stestdesc: '',
        sapprdesc: '',
        testReqList: [],
        testTaskList: [],
        caseCountList: [],
        bugCountList: [],
        caseExeList: [],
        bugRepairList: [],
        bugLevelList: [],
        bugRemainList: [],
        loading: false,
        shrinkShow: true,
        chosenVisible: false,
        makeForm: {},
        visible: false,
        nameForm: {},
        searchValue: ''
    }
    componentWillMount() {
        this.getReportList(0, '')
    }
    componentDidMount() {

    }
    /**
     * 获取报告列表
     */
    getReportList = (iid, searchValue) => {
        let _this = this;
        vpQuery('/{vppm}/dlbank/testReport/getTestReportList', {
            iid: iid, searchValue: searchValue
        }).then(function (data) {
            if (data) {
                _this.setState({
                    reportList: data.data.reportList,
                    iid: data.data.iid
                }, () => {
                    _this.queryTestReport(data.data.iid)
                })
            }
        }).catch(function (err) {
            console.log(err)
        });
    }
    /**
     * 获取指定版本的报告
     */
    queryTestReport = (iid) => {
        this.setState({
            loading: false
        })
        let _this = this;
        if (iid > 0) { // 已经生成报告
            vpQuery('/{vppm}/dlbank/testReport/getTestReport', {
                iid: iid
            }).then(function (res) {
                if (res.data) {
                    let stestdesc = res.data.stestdesc
                    if (stestdesc == '' || stestdesc == undefined) {
                        stestdesc = '\r\r\r\t\t\t\t\t\t\t\t\t\t系统测试员：\t\t\t\t\t日期：\t\t\t\t\t'
                    }
                    let sapprdesc = res.data.sapprdesc
                    if (sapprdesc == '' || sapprdesc == undefined) {
                        sapprdesc = '\r\r\r\t\t\t\t\t\t\t\t\t\t 技术经理：\t\t\t\t\t日期：\t\t\t\t\t'
                    }
                    _this.setState({
                        loading: false,
                        iid: iid,
                        dreportdate: res.data.dreportdate,
                        ireportuserid: res.data.ireportuserid,
                        testReqList: res.data.testReqList,
                        testTaskList: res.data.testTaskList,
                        caseCountList: res.data.caseCountList,
                        bugCountList: res.data.bugCountList,
                        caseExeList: res.data.caseExeList,
                        bugRepairList: res.data.bugRepairList,
                        bugLevelList: res.data.bugLevelList,
                        bugRemainList: res.data.bugRemainList,
                        stestdesc: stestdesc,
                        sapprdesc: sapprdesc
                    }, () => {
                        _this.pieEchart(_this.refs.pieCase, '用例执行情况', res.data.pieDataList)
                        _this.pieEchart(_this.refs.pieBug1, '缺陷修复情况', res.data.pieDataList1)
                        _this.pieEchart(_this.refs.pieBug2, '缺陷严重程度分布', res.data.pieDataList2)
                    })
                }
            }).catch(function (err) {
                _this.setState({ loading: false })
                console.log(err)
            });
        }
    }
    chosenTaskAndName = () => {
        var conSql = "select iid from vpm_task where sname is not null and iflag=0 and iclassid=118 and ( iparent= 0 or iparent is null)";
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
                        "field_name": "reportname", "field_label": "报告名称", "all_line": 2,
                        "validator": { "message": "请输入1~400个字符!", "max": 400, required: true },
                        "widget_type": "text", "widget": { "default_value": "", "default_label": "" },
                        "readonly": false, "disabled": false
                    },
                    {
                        "field_name": "itaskids", "field_label": "测试任务", "all_line": 2,
                        "validator": { "message": "测试任务不能为空!", required: true },
                        "widget_type": "multiselectmodel", "widget": { "default_value": "", "default_label": "" },
                        "irelationentityid": 114, "url": url, "urlparam": urlparam
                    }
                ]
            }]
        }

        this.setState({
            makeForm: makeForm,
            chosenVisible: true
        })
    }
    okModel = (values) => {
        if (values) {
            let reportname = values.reportname
            let itaskids = values.itaskids
            if (reportname == '' || reportname.replace(/\s+/g, "") == '' || itaskids == '') {
                VpAlertMsg({
                    message: "消息提示",
                    description: '名称或任务不能为空！',
                    type: "error",
                    closeText: "关闭",
                    showIcon: true
                }, 5)
            } else {
                this.addTestReport(itaskids, reportname)
            }
        }
    }
    cancelModel = () => {
        this.setState({
            chosenVisible: false
        })
    }
    /**
     * 生成新的报告
     */
    addTestReport = (itaskids, reportname) => {
        this.setState({
            loading: true,
            iid: 0
        })
        let _this = this;
        vpQuery('/{vppm}/dlbank/testReport/addTestReport', {
            itaskids: itaskids,
            reportname: reportname
        }).then(function (data) {
            if (data.data.success) {
                _this.setState({
                    loading: false,
                    chosenVisible: false
                }, _this.getReportList(0, _this.state.searchValue));
                VpMSuccess({
                    title: '提示',
                    content: '新报告生成成功！'
                });
            } else {
                _this.setState({ loading: false })
                VpAlertMsg({
                    message: "错误提示",
                    description: data.data.msg,
                    type: "error",
                    onClose: _this.onClose,
                    closeText: "关闭"
                }, 5)
            }
        });
    }
    /**
     * 导出测试报告
     */
    exportTestReport =()=>{
        vpDownLoad("/{vppm}/dlbank/testExport/testExport", {
            iid: this.state.iid
        })
    }
    /**
     * 保存填写的报告分析结果
     */
    saveTestReport = () => {
        let iid = this.state.iid
        const _this = this
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }
            values.iid = iid
            _this.setState({
                loading: true,
                iid: 0
            })
            vpQuery('/{vpplat}/testReport/saveTestReport', values).then(function (data) {
                if (data.data.success) {
                    _this.getReportList(iid, _this.state.searchValue)
                    VpMSuccess({
                        title: '提示',
                        content: '测试保证报告保存成功!'
                    });
                } else {
                    _this.setState({ loading: false })
                    VpAlertMsg({
                        message: "错误提示",
                        description: data.data.msg,
                        type: "error",
                        onClose: _this.onClose,
                        closeText: "关闭"
                    }, 5)
                }
            }).catch(function (err) {
                _this.setState({ loading: false })
                console.log(err)
            });
        });
    }

    pieEchart = (pie, text, pieDataList) => { // pie:this.refs.pie
        let pie_myChart = echarts.init(pie, 'vpT1');
        let pie_option = {
            backgroundColor: 'white', // 背景颜色
            textStyle: {
                color: '#2c343c', // 文本颜色
                fontSize: 12 // 文本带下
            },
            title: {
                text: text, // 标题
                x: 'center', // 位置
                textStyle: {
                    color: '#2c343c', // 标题颜色
                    fontSize: 13 // 标题大小
                },
                padding: [5, 5, 5, 5] // 通过padding对标题定为
            },
            series: [
                {
                    type: 'pie', // 指定图表为饼图
                    radius: '75%', // 饼图相对于容器的大小
                    center: ['50%', '55%'], // 饼图相对于容器的位置[左右， 上下]
                    label: {
                        normal: {
                            formatter: "{b}: {c} ({d}%)", // 文字类型 {a}=> 标题 ，{b} => data中的name，{c} => data中的value，{d} => 百分比
                        },
                    },
                    data: pieDataList
                }
            ]
        };
        pie_myChart.setOption(pie_option);
        pie_myChart.on('click', function (params) {
            console.log(params.name, params.data)
        })
    }

    //左侧伸缩
    shrinkLeft = (e) => {
        console.log(e)
        this.setState({
            shrinkShow: !this.state.shrinkShow
        })
    }
    moveChangeColor = (e, item) => {
        e = e || event;
        e.preventDefault();
        let moveli = e.target.id
        if (!this.state.moveLi && moveli && moveli.indexOf('moveli') >= 0) {
            optMenu.style.display = "none";
            this.setState({
                moveiid: item.iid,
                moveLi: true
            })
        }
    }
    outChangeColor = (e, item) => {
        e = e || event;
        e.preventDefault();
        let moveli = e.target.id
        if (this.state.moveLi && moveli && moveli.indexOf('moveli') >= 0) {
            this.setState({
                moveiid: 0,
                moveLi: false
            })
        }
    }
    showOptMenu = (e, item) => {
        e = e || event;
        e.preventDefault();
        optMenu.style.display = "block";
        let scrollTop = leftMenu.scrollTop;
        let liWidth = e.target.clientWidth - 55;
        optMenu.style.left = e.target.offsetLeft + liWidth + "px";
        //当滑动滚动条时也能准确获取菜单位置
        //console.log(scrollTop, liWidth);
        optMenu.style.top = e.target.offsetTop - scrollTop + 5 + "px";
        this.setState({ optiid: item.iid, optname: item.sname })
    }
    showModifyModel = () => {
        optMenu.style.display = "none";
        let nameForm = {
            "groups": [{
                "group_type": 3,
                "group_label": "变迁",
                "fields": [
                    {
                        "field_name": "reportname", "field_label": "报告名称", "all_line": 2,
                        "validator": { "message": "请输入1~400个字符!", "max": 400, required: true },
                        "widget_type": "text", "widget": { "default_value": this.state.optname, "default_label": this.state.optname },
                        "readonly": false, "disabled": false
                    }
                ]
            }]
        }
        this.setState({
            nameForm: nameForm,
            visible: true
        })
    }
    okModifyModel = (values) => {
        let _this = this
        if (values) {
            let reportname = values.reportname
            if (reportname == '' || reportname.replace(/\s+/g, "") == '') {
                VpAlertMsg({
                    message: "消息提示",
                    description: '名称不能为空！',
                    type: "error",
                    closeText: "关闭",
                    showIcon: true
                }, 5)
            } else {
                values.iid = _this.state.optiid
                vpQuery('/{vpplat}/testReport/updateTestReportName', values).then(function (data) {
                    if (data.data.success) {
                        _this.setState({
                            loading: false,
                            visible: false
                        }, _this.getReportList(_this.state.iid, _this.state.searchValue));
                        VpMSuccess({
                            title: '提示',
                            content: '测试保证报告保存成功!'
                        });
                    } else {
                        _this.setState({ loading: false })
                        VpAlertMsg({
                            message: "错误提示",
                            description: data.data.msg,
                            type: "error",
                            onClose: _this.onClose,
                            closeText: "关闭"
                        }, 5)
                    }
                }).catch(function (err) {
                    _this.setState({ loading: false })
                    console.log(err)
                });
            }
        }
    }
    cancelModifyModel = () => {
        this.setState({
            visible: false
        })
    }
    searchRpt = (value) => {
        const searchValue = $.trim(value)
        this.setState({
            searchValue
        }, this.getReportList(this.state.iid, searchValue))
    }

    render() {
        const { getFieldProps } = this.props.form;
        let formItemLayoutAllLine = {
            labelCol: { span: 3 },
            wrapperCol: { span: 21 } 
        };
        const columnsTestReq = [
            { title: '需求编号', width: 130, dataIndex: 'sreqcode', key: 'sreqcode' },
            { title: '需求名称', width: 400, dataIndex: 'sreqname', key: 'sreqname' }
        ];
        const columnsTestTask = [
            { title: '测试任务编号', dataIndex: 'staskcode', key: 'staskcode' },
            { title: '测试任务名称', dataIndex: 'staskname', key: 'staskname', },
            { title: '计划开始时间', dataIndex: 'dplanstartdate', key: 'dplanstartdate' },
            { title: '计划结束时间', dataIndex: 'dplanenddate', key: 'dplanenddate' },
            { title: '实际开始时间', dataIndex: 'dactualstartdate', key: 'dactualstartdate' },
            { title: '实际结束时间', dataIndex: 'dactualenddate', key: 'dactualenddate' },
            { title: '负责人', dataIndex: 'itaskfzr', key: 'itaskfzr' },
            { title: '参与人', dataIndex: 'staskcyr', key: 'staskcyr' }
        ];
        const columnsCaseCount = [
            { title: '用例总数', dataIndex: 'icasetotal', key: 'icasetotal' },
            { title: '需执行用例数', dataIndex: 'icasepenging', key: 'icasepenging' },
            { title: '实际执行用例数', dataIndex: 'icaseexecuted', key: 'icaseexecuted' },
            { title: '用例执行率(%)', dataIndex: 'icaseexerate', key: 'icaseexerate' },
            { title: '执行通过用例数', dataIndex: 'icasepassed', key: 'icasepassed' },
            { title: '用例通过率(%)', dataIndex: 'icasepassrate', key: 'icasepassrate' }
        ];
        const columnsBugCount = [
            { title: '缺陷总数', dataIndex: 'ibugtotal', key: 'ibugtotal' },
            { title: '已关闭缺陷数', dataIndex: 'ibugclose', key: 'ibugclose' },
            { title: '遗留缺陷数', dataIndex: 'ibugremain', key: 'ibugremain' },
            { title: '遗留缺陷率(%)', dataIndex: 'iremainrate', key: 'iremainrate' },
            { title: '遗留严重级别以上缺陷数', dataIndex: 'iremainserious', key: 'iremainserious' }
        ];
        const columnsCaseExe = [
            { title: '状态', dataIndex: 'statusname', key: 'statusname' },
            { title: '数量', dataIndex: 'icasenum', key: 'icasenum' },
            { title: '占比(%)', dataIndex: 'icaserate', key: 'icaserate' }
        ];
        const columnsBugRepair = [
            { title: '状态', dataIndex: 'statusname', key: 'statusname' },
            { title: '数量', dataIndex: 'ibugnum', key: 'ibugnum' },
            { title: '占比(%)', dataIndex: 'ibugrate', key: 'ibugrate' }
        ];
        const columnsBugLevel = [
            { title: '严重程度', dataIndex: 'slevelname', key: 'slevelname' },
            { title: '数量', dataIndex: 'ibugnum', key: 'ibugnum' },
            { title: '占比(%)', dataIndex: 'ibugrate', key: 'ibugrate' }
        ];
        const columnsBugRemain = [
            { title: '缺陷编码', dataIndex: 'sbugcode', key: 'sbugcode' },
            { title: '缺陷标题', dataIndex: 'sbugname', key: 'sbugname' },
            { title: '严重程度', dataIndex: 'iseverity', key: 'iseverity' },
            { title: '遗留原因', dataIndex: 'sremaindesc', key: 'sremaindesc' }
        ];
        return (
            <div className='reportContainer full-height'>
                <VpRow gutter={24} className='bg-white p-sm full-height '>
                    <VpCol span={this.state.shrinkShow ? '5' : '0'} className="full-height b-r menuleft" style={{ paddingLeft: 1, paddingRight: 1 }}>
                        <h3 className="p-b-sm fw b-b" style={{ paddingBottom: 15 }}>测试报告</h3>
                        <dev>
                            <SeachInput key={'searchRpt'} placeholder="请输入报告或任务名称" onSearch={this.searchRpt} />
                        </dev>
                        <ul className="left-ul scroll" id="leftMenu">
                            {this.state.reportList.map((item, index) => {
                                let rptBg = 'cursor bg-gray'
                                if (item.iid == this.state.iid || item.iid == this.state.moveiid) { // 当前显示的报告
                                    rptBg = 'cursor bg-info'
                                }
                                return (
                                    <li key={index} className={rptBg} id={'moveli' + item.iid}
                                        onClick={() => this.queryTestReport(item.iid)}
                                        onMouseMove={(e) => this.moveChangeColor(e, item)}
                                        onMouseOut={(e) => this.outChangeColor(e, item)}
                                        onContextMenu={(e) => this.showOptMenu(e, item)}>
                                        {item.sname}
                                    </li>
                                )
                            })}
                        </ul>
                        <div id="optMenu">
                            <ul>
                                <li className="cursor ">
                                    <VpButton key="editName" size="small" onClick={() => this.showModifyModel()}>编辑</VpButton>
                                </li>
                            </ul>
                        </div>
                        <div className="tip-txt f12" style={{ paddingTop: 10 }}>
                            <p className=""><VpIconFont className="text-warning p-r-xs" type="vpicon-tip" />温馨提示 </p>
                            <ul className="tip-ul text-muted" >
                                <li className="p-t-xs"><span className="m-r-xs inline-display bg-info"></span>当前展示的测试报告</li>
                            </ul>
                        </div>


                    </VpCol>

                    <VpCol span={this.state.shrinkShow ? '19' : '24'} className="full-height scroll-y pr">
                        <div className="togglebar cursor text-center" onClick={this.shrinkLeft}>
                            <VpIconFont className="f12" type={`${this.state.shrinkShow ? 'vpicon-caret-left-s' : 'vpicon-caret-right-s'}`} />
                        </div>
                        {this.state.iid > 0 ?
                            <VpFCollapse className="dynamic-form-wrapper" defaultActiveKey={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']}>
                                <VpPanel header="测试报告基本信息" key="1">
                                    <VpRow>
                                        <VpCol className="height-30" span={12}>
                                            <VpCol className="text-right label" span={5}>报告人</VpCol>
                                            <VpCol span={18} className="b-b p-l-xs height-30">{this.state.ireportuserid}</VpCol>
                                        </VpCol>
                                        <VpCol className="height-30" span={12}>
                                            <VpCol className="text-right label" span={5}>报告日期</VpCol>
                                            <VpCol span={18} className="b-b p-l-xs height-30">{this.state.dreportdate}</VpCol>
                                        </VpCol>
                                    </VpRow>
                                </VpPanel>
                                <VpPanel header="测试范围" key="2">
                                    <VpTable
                                        columns={columnsTestReq}
                                        dataSource={this.state.testReqList}
                                        pagination={false}
                                        rowKey='ireqid'
                                        resize
                                    />
                                </VpPanel>
                                <VpPanel header="测试任务" key="3">
                                    <VpTable
                                        columns={columnsTestTask}
                                        dataSource={this.state.testTaskList}
                                        pagination={false}
                                        rowKey='itaskid'
                                        resize
                                    />
                                </VpPanel>
                                <VpPanel header="用例统计情况" key="4">
                                    <VpTable
                                        columns={columnsCaseCount}
                                        dataSource={this.state.caseCountList}
                                        pagination={false}
                                        rowKey='iid'
                                        resize
                                    />
                                </VpPanel>
                                <VpPanel header="缺陷统计情况" key="5">
                                    <VpTable
                                        columns={columnsBugCount}
                                        dataSource={this.state.bugCountList}
                                        pagination={false}
                                        rowKey='iid'
                                        resize
                                    />
                                </VpPanel>
                                <VpPanel header="用例执行情况" key="6">
                                    <VpTable
                                        columns={columnsCaseExe}
                                        dataSource={this.state.caseExeList}
                                        pagination={false}
                                        rowKey='istatusid'
                                        resize
                                    />
                                    <div className="content p-tb-sm" id="pieCase">
                                        <div ref="pieCase" className="m-b-sm text-center" style={{ height: 300 }}></div>
                                    </div>
                                </VpPanel>
                                <VpPanel header="缺陷修复情况" key="7">
                                    <VpTable
                                        columns={columnsBugRepair}
                                        dataSource={this.state.bugRepairList}
                                        pagination={false}
                                        rowKey='istatusid'
                                        resize
                                    />
                                    <div className="content p-tb-sm" id="pieBug1">
                                        <div ref="pieBug1" className="m-b-sm text-center" style={{ height: 300 }}></div>
                                    </div>
                                </VpPanel>
                                <VpPanel header="缺陷严重程度分布" key="8">
                                    <VpTable
                                        columns={columnsBugLevel}
                                        dataSource={this.state.bugLevelList}
                                        pagination={false}
                                        rowKey='ilevelid'
                                        resize
                                    />
                                    <div className="content p-tb-sm" id="pieBug2">
                                        <div ref="pieBug2" className="m-b-sm text-center" style={{ height: 300 }}></div>
                                    </div>
                                </VpPanel>
                                <VpPanel header="遗留严重及以上级别缺陷" key="9">
                                    <VpTable
                                        columns={columnsBugRemain}
                                        dataSource={this.state.bugRemainList}
                                        pagination={false}
                                        rowKey='ibugid'
                                        resize
                                    />
                                </VpPanel>
                                <VpPanel header="测试结论" key="10">
                                    {
                                        this.state.iid > 0
                                            ? <VpForm className="p-t-sm">
                                                <FormItem label="测试结论" {...formItemLayoutAllLine}>
                                                    <VpInput type="textarea" autosize={{ minRows: 4, maxRows: 10 }}
                                                        {...getFieldProps("stestdesc", {
                                                            rules: [
                                                                { required: true, message: '测试结论不能为空' },
                                                            ],
                                                            initialValue: this.state.stestdesc
                                                        })} />
                                                </FormItem>
                                                <FormItem label="审批意见" {...formItemLayoutAllLine}>
                                                    <VpInput type="textarea" autosize={{ minRows: 4, maxRows: 10 }}
                                                        {...getFieldProps("sapprdesc", {
                                                            rules: [
                                                                { required: true, message: '审批意见不能为空' },
                                                            ],
                                                            initialValue: this.state.sapprdesc
                                                        })} />
                                                </FormItem>
                                            </VpForm>
                                            : ''
                                    }
                                </VpPanel>
                            </VpFCollapse>
                            :
                            <VpCol span={this.state.shrinkShow ? 24 : 19} className='full-height scroll p-static'>
                                <div className="tip-box text-center">
                                    <div className="tip-icon text-warning"><VpIconFont type="vpicon-warning" /></div>
                                    <div id="shit3" className="tip f30 p-b-sm">唔，暂未生成任何测试报告！！！</div>
                                </div>
                            </VpCol>
                        }
                    </VpCol>
                </VpRow>
                {this.state.iid > 0
                    ?
                    <div className="footer-button-wrap ant-modal-footer">
                        <VpButton key="makeBtn" type="primary" loading={this.state.loading} size="large" onClick={() => this.chosenTaskAndName()}>生成新报告</VpButton>
                        <VpButton key="saveBtn" type="primary" loading={this.state.loading} size="large" onClick={() => this.saveTestReport()} >保存测试结论</VpButton>
                        <VpButton key="exportBtn" type="primary" loading={this.state.loading} size="large" onClick={() => this.exportTestReport()} >导出测试报告</VpButton>
                    </div>
                    :
                    <div className="footer-button-wrap ant-modal-footer">
                        <VpButton key="makeBtn" type="primary" loading={this.state.loading} size="large" onClick={() => this.chosenTaskAndName()}>生成新报告</VpButton>
                    </div>
                }
                <VpModal
                    title='生成新的报告'
                    visible={this.state.chosenVisible}
                    onCancel={() => this.cancelModel()}
                    width={'75%'}
                    height={'55%'}
                    maskClosable={false}
                    footer={null}
                >
                    {
                        this.state.chosenVisible && this.state.makeForm.groups ?
                            <VpDynamicForm
                                formData={this.state.makeForm}
                                bindThis={this}
                                handleOk={(values) => this.okModel(values)}
                                handleCancel={() => this.cancelModel()}
                                loading={this.state.loading}
                                okText="生 成" />
                            : null
                    }
                </VpModal>
                <VpModal
                    title='修改报告名称'
                    visible={this.state.visible}
                    onCancel={() => this.cancelModifyModel()}
                    width={'50%'}
                    height={'30%'}
                    maskClosable={false}
                    footer={null}
                >
                    {
                        this.state.visible && this.state.nameForm.groups ?
                            <VpDynamicForm
                                formData={this.state.nameForm}
                                bindThis={this}
                                handleOk={(values) => this.okModifyModel(values)}
                                handleCancel={() => this.cancelModifyModel()}
                                loading={this.state.loading}
                                okText="保 存" />
                            : null
                    }
                </VpModal>
            </div>

        )
    }
}
export default TestReport = VpFormCreate(TestReport);