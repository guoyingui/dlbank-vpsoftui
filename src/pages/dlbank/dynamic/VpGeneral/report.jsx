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
    VpSelect,
    vpQuery,
    VpButton,
    VpOption,
    VpTooltip,
    VpMSuccess,
    vpDownLoad,
    VpAlertMsg
} from 'vpreact';
import './report.less';

const indiclass = ['indic-info', 'indic-warning', 'indic-danger']
class Report extends React.Component {
    state = {
        dateList: [],
        reportflag: false,
        startdate: '',
        enddate: '',
        daymonth: '',
        scode: '',
        sname: '',
        sdepartmentname: '',
        sphasename: '',
        sstatusname: '',
        ischeduleindicator: 0,
        icostindicator: 0,
        iriskindicator: '',
        iqualityindicator: '',
        dplanstartdate: '',
        dplanenddate: '',
        dactualstartdate: '',
        dreprotdate: '',
        dforecaststartdate: '',
        dforecastenddate: '',
        pmname: '',
        iplancomplete: '',
        iactualcomplete: '',
        phase: [],
        curtask: [],
        nexttask: [],
        projectrisk:[],
        max: false,
        progress: '1',
        reportdesc: '',
        nextplan: '',
        remark: '',
        first: true,//是否第一次加载
        date: '',
        status: '',
        entityrole:true
    }
    changeShow = () => {
        this.setState({
            max: !this.state.max
        })
    }
    componentWillMount() {
        //this.queryentityRole("7",this.props.iid);
        this.queryDataList(0)
    }
    componentDidMount() {
    }
    queryDataList(addmonth) {
        let _this = this;
        vpQuery('/{vppm}/weekport/getdatalist', {
            projectid: this.props.iid,
            addmonth: addmonth,
            daymonth: _this.state.daymonth,
            date: _this.state.date
        }).then(function (data) {
            if (data) {
                _this.setState({
                    dateList: data.data.datalist,
                    daymonth: data.data.daymonth
                }, () => {
                    let { first } = _this.state
                    if (first) {
                        let itemobj = null;
                        data.data.datalist.forEach((item, i) => {
                            if (item.checkwwek!=null &&item.checkwwek=='true') {
                                itemobj=item;
                            } 
                        })


                        if(itemobj==null){
                            itemobj=_this.state.dateList[0];
                        }

                        _this.queryWeekReport(itemobj.end, itemobj.status, itemobj.startdate, itemobj.enddate)
                    }
                })
            }
        }).catch(function (err) {
        });
    }
    addWeekReport() {
        let _this = this;
        let { date, status, startdate, enddate } = _this.state
        vpQuery('/{vppm}/dlbank/weekport/addweekreport', {
            projectid: this.props.iid,
            startdate: _this.state.startdate,
            enddate: _this.state.enddate
        }).then(function (data) {
            const dateList = _this.state.dateList;
            dateList.map((item, index) => {
                if (item.end == date) {
                    item.newstatus = 1;
                    item.status = 1
                } else {
                    item.newstatus = 0;
                }
            })
            _this.setState({
                reportflag: true,
                startdate: startdate,
                enddate: enddate,
                date,
                status,
                dateList
            }, () => {
                _this.queryDataList(0)
                _this.afterAdd()
            })
        })

    }
    
    exportWeekReport() {
        let _this = this;
        let { date, status, startdate, enddate } = _this.state
        
        vpDownLoad("/{vppm}/dlbank/export/rptExport", {
            projectid: this.props.iid,
            daymonth: this.state.daymonth,
            enddate: this.state.date
        })

    }

    afterAdd = () => {
        const _this = this
        vpQuery('/{vppm}/dlbank/weekport/getweekreport', {
            projectid: this.props.iid,
            daymonth: this.state.daymonth,
            enddate: this.state.date
        }).then(function (data) {
            if (data) {
                _this.setState({
                    scode: data.data.scode,
                    sname: data.data.sname,
                    sdepartmentname: data.data.sdepartmentname,
                    sphasename: data.data.sphasename,
                    sstatusname: data.data.sstatusname,
                    ischeduleindicator: data.data.ischeduleindicator,
                    icostindicator: data.data.icostindicator,
                    iriskindicator: data.data.iriskindicator,
                    iqualityindicator: data.data.iqualityindicator,
                    dplanstartdate: data.data.dplanstartdate,
                    dplanenddate: data.data.dplanenddate,
                    dactualstartdate: data.data.dactualstartdate,
                    dreprotdate: data.data.dreprotdate,
                    dforecaststartdate: data.data.dforecaststartdate,
                    dforecastenddate: data.data.dforecastenddate,
                    pmname: data.data.pmname,
                    iplancomplete: data.data.iplancomplete,
                    iactualcomplete: data.data.iactualcomplete,
                    phase: data.data.phase,
                    curtask: data.data.curtask,
                    projectrisk: data.data.risk,
                    nexttask: data.data.nexttask,
                    progress: data.data.indicatorvalue,
                    reportdesc: data.data.reportdesc,
                    nextplan: data.data.nextplan,
                    remark: data.data.remark
                }
                )
            }
        })
    }

    saveWeekReport() {
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }
            let _this = this;
            vpQuery('/{vppm}/dlbank/weekport/saveweekreport', {
                projectid: this.props.iid,
                startdate: _this.state.startdate,
                enddate: _this.state.enddate,
                reportdesc: values.reportdesc,
                nextplan: values.nextplan,
                remark: values.remark,
                indicatorvalue: values.indicatorvalue
            }).then(function (data) {
                if (data.data > 0) {
                    VpMSuccess({
                        title: '提示',
                        content: '周报提交成功!'
                    });
                    _this.queryDataList(0)
                }
            }).catch(function (err) {
                console.log(err)
            });

        });



    }
    queryentityRole = (entityid, iid) => {
        let entityrole = this.props.entityrole
        debugger
        if (entityrole == '') {//新建时默认为true
            tabsformrole = true
            this.setState({
                entityrole: tabsformrole
            })
                vpQuery('/{vpplat}/vfrm/entity/entityRole', {
                    entityid, iid
                }).then((response) => {
                    tabsformrole = response.data.entityRole
                    this.setState({
                        entityrole: tabsformrole
                    })
                })
            
        }
    }
    queryWeekReport(date, status, startdate, enddate) {
        let _this = this;
        if (status == 0) {
            this.setState({
                first: false
            })
        } else if (status == 3) {
            const dateList = _this.state.dateList;
            dateList.map((item, index) => {
                if (item.end == date) {
                    item.newstatus = 1;
                } else {
                    item.newstatus = 0;
                }

            })
            _this.setState({
                dateList: dateList,
                reportflag: false,
                startdate: startdate,
                enddate: enddate,
                first: false,
                date,
                status
            })
        } else {
            const dateList = _this.state.dateList;
            let reportflag = true
            dateList.map((item, index) => {
                if (item.end == date) {
                    item.newstatus = 1;
                } else {
                    item.newstatus = 0;
                }
                if (this.state.first && item.status == 1) { // 默认显示上周
                    //item.newstatus = 1
                }
            })
            if (status == 1) {
                reportflag = false
            }

            vpQuery('/{vppm}/dlbank/weekport/getweekreport', {
                projectid: this.props.iid,
                daymonth: this.state.daymonth,
                enddate: date
            }).then(function (data) {
                if (data) {
                    _this.setState({
                        dateList: dateList,
                        scode: data.data.scode,
                        sname: data.data.sname,
                        sdepartmentname: data.data.sdepartmentname,
                        sphasename: data.data.sphasename,
                        sstatusname: data.data.sstatusname,
                        ischeduleindicator: data.data.ischeduleindicator,
                        icostindicator: data.data.icostindicator,
                        iriskindicator: data.data.iriskindicator,
                        iqualityindicator: data.data.iqualityindicator,
                        dplanstartdate: data.data.dplanstartdate,
                        dplanenddate: data.data.dplanenddate,
                        dactualstartdate: data.data.dactualstartdate,
                        dreprotdate: data.data.dreprotdate,
                        dforecaststartdate: data.data.dforecaststartdate,
                        dforecastenddate: data.data.dforecastenddate,
                        pmname: data.data.pmname,
                        iplancomplete: data.data.iplancomplete,
                        iactualcomplete: data.data.iactualcomplete,
                        phase: data.data.phase,
                        curtask: data.data.curtask,
                        projectrisk: data.data.risk,
                        nexttask: data.data.nexttask,
                        progress: data.data.indicatorvalue,
                        reportdesc: data.data.reportdesc,
                        nextplan: data.data.nextplan,
                        remark: data.data.remark,
                        reportflag: reportflag,
                        startdate: startdate,
                        enddate: enddate,
                        first: false,
                        date,
                        status
                    })
                }
            }).catch(function (err) {
                console.log(err)
                this.setState({
                    reportflag: reportflag,
                    startdate: startdate,
                    enddate: enddate,
                    first: false,
                    date,
                    status
                })
            });
        }

    }
    progressChange = (value) => {
        console.log(value)
        this.setState({
            progress: value
        })
    }
    render() {
        const _curdate = this.state.date;
        const { getFieldProps } = this.props.form;
        let formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 7 }
        };
        let formItemLayoutAllLine = {
            labelCol: { span: 3 },
            wrapperCol: { span: 21 }
        };
        const columnsphase = [
            {
                title: '指示灯', dataIndex: 'schdindicator', key: 'schdindicator',
                render: (value, record) => {
                    return <span className={indiclass[value]}></span>
                }
            },
            { title: '里程碑', dataIndex: 'sname', key: 'sname' },
            { title: '类型', dataIndex: 'phasetype', key: 'phasetype', },
            { title: '计划完成时间', dataIndex: 'dplanenddate', key: 'dplanenddate' },
            { title: '实际完成时间', dataIndex: 'dactualenddate', key: 'dactualenddate' },
            { title: '状态', dataIndex: 'sstatusname', key: 'sstatusname' },
            { title: '备注', dataIndex: 'sdescription', key: 'sdescription' }
        ];
        const columnstask = [
            {
                title: '指示灯', dataIndex: 'schdindicator', key: 'schdindicator',
                render: (value, record) => {
                    return <span className={indiclass[value]}></span>
                }
            },
            { title: '任务名称', dataIndex: 'sname', key: 'sname' },
            { title: '负责/参与人', dataIndex: 'sperson', key: 'sperson', },
            { title: '计划开始时间', dataIndex: 'dplanstartdate', key: 'dplanstartdate' },
            { title: '计划完成时间', dataIndex: 'dplanenddate', key: 'dplanenddate' },
            { title: '实际完成度', dataIndex: 'icompletepercent', key: 'icompletepercent',
            render: (value, record) => {
                if(value.indexOf('.')==0){
                    return '0'+value;
                }else{
                    return value;
                }
                
            } },
            { title: '实际开始时间', dataIndex: 'dactualstartdate', key: 'dactualstartdate' },
            { title: '实际完成时间', dataIndex: 'dactualenddate', key: 'dactualenddate' }
        ];

        const columnsnexttask = [
            {
                title: '指示灯', dataIndex: 'schdindicator', key: 'schdindicator',
                render: (value, record) => {
                    return <span className={indiclass[value]}></span>
                }
            },
            { title: '任务名称', dataIndex: 'sname', key: 'sname' },
            { title: '负责/参与人', dataIndex: 'sperson', key: 'sperson', },
            { title: '计划开始时间', dataIndex: 'dplanstartdate', key: 'dplanstartdate' },
            { title: '计划完成时间', dataIndex: 'dplanenddate', key: 'dplanenddate' },
            { title: '计划完成度', dataIndex: 'icompletepercent', key: 'icompletepercent',
                    render: (value, record) => {
                        if(value.indexOf('.')==0){
                            return '0'+value;
                        }else{
                            return value;
                        }
                        
                    }
            },
            { title: '实际开始时间', dataIndex: 'dactualstartdate', key: 'dactualstartdate' },
            { title: '实际完成时间', dataIndex: 'dactualenddate', key: 'dactualenddate' },
            { title: '状态', dataIndex: 'sstatusname', key: 'sstatusname' }
        ];

        const columnsrisk = [
           
            { title: '风险名称', dataIndex: 'sname', key: 'sname' },
            { title: '风险描述', dataIndex: 'sdesc', key: 'sdesc', },
            { title: '提出日期', dataIndex: 'tcrq', key: 'tcrq' },
            { title: '持续时间', dataIndex: 'cxsj', key: 'cxsj' },
            { title: '计划解决日期', dataIndex: 'jhjjrq', key: 'jhjjrq' },
            { title: '责任人', dataIndex: 'zrrname', key: 'zrrname' },
            { title: '处理人', dataIndex: 'clrname', key: 'clrname' },
            { title: '当前进展', dataIndex: 'dqjz', key: 'dqjz' }
        ];
        return (
            <div className='reportContainer full-height'>

                <VpRow gutter={24} className='full-height scroll'>
                    <VpCol span={this.state.max ? 0 : 5} className="full-height b-r">
                        <h4 className="text-center">
                            <VpIconFont type="vpicon-left" className="fl cursor" onClick={() => this.queryDataList(-1)} />
                            <span>{this.state.daymonth}</span>
                            <VpIconFont type="vpicon-right" className="fr cursor" onClick={() => this.queryDataList(1)} />
                        </h4>
                        <ul className="calendar-ul">
                            {this.state.dateList.map((item, index) => {
                                let rptBg = 'cursor '
                                if (item.newstatus == 1 || item.end == _curdate) { //要显示的周报
                                    rptBg = 'cursor bg-info'
                                } else if (item.status == 0) { // 未开始
                                    rptBg = 'cursor bg-gray'
                                } else if (item.status == 2) { // 未提交
                                    rptBg = 'cursor bg-warning'
                                } else if (item.status == 4) { // 已提交
                                    rptBg = 'cursor bg-success'
                                } else {
                                    rptBg = 'cursor bg-danger'
                                }
                                return <li key={index}
                                    onClick={() => this.queryWeekReport(item.end, item.status, item.startdate, item.enddate)}
                                    className={rptBg}>
                                    第{index + 1}周 {item.start}-{item.end}
                                </li>
                            })}
                        </ul>
                        <div className="tip-txt m-t-lg f12">
                            <p className=""><VpIconFont className="text-warning p-r-xs" type="vpicon-tip" />温馨提示 </p>
                            <ul className="tip-ul text-muted">
                                <li className="p-t-xs"><span className="m-r-xs inline-display bg-success"></span>已生成周报并提交周总结</li>
                                <li className="p-t-xs"><span className="m-r-xs inline-display bg-warning"></span>已生成周报无周总结</li>
                                <li className="p-t-xs"><span className="m-r-xs inline-display bg-danger"></span>无周报无周总结</li>
                                <li className="p-t-xs"><span className="m-r-xs inline-display bg-info"></span>当前周周报</li>
                                <li className="p-t-xs"><span className="m-r-xs inline-display bg-gray"></span>未开始的周报</li>
                            </ul>
                        </div>
                    </VpCol>
                    {this.state.reportflag == true ?
                        <VpCol span={this.state.max ? 24 : 19} className='full-height p-static'>
                            <VpFCollapse className="dynamic-form-wrapper" defaultActiveKey={['1', '2', '3', '4', '5']}>
                                <VpPanel header="基本信息" key="1">
                                    <VpRow>
                                        <VpCol className="height-30" span={8}>
                                            <VpCol className="text-right label" span={9}>项目编号</VpCol>
                                            <VpCol span={14} className="b-b p-l-xs height-30">{this.state.scode}</VpCol>
                                        </VpCol>
                                        <VpCol className="height-30" span={8}>
                                            <VpCol className="text-right label" span={9}>项目名称</VpCol>
                                            <VpCol span={14} className="b-b p-l-xs height-30">{this.state.sname}</VpCol>
                                        </VpCol>
                                        <VpCol className="height-30" span={8}>
                                            <VpCol className="text-right label" span={9}>负责开发室</VpCol>
                                            <VpCol span={14} className="b-b p-l-xs height-30">{this.state.sdepartmentname}</VpCol>
                                        </VpCol>
                                        <VpCol className="height-30" span={8}>
                                            <VpCol className="text-right label" span={9}>项目所处阶段</VpCol>
                                            <VpCol span={14} className="b-b p-l-xs height-30">{this.state.sphasename}</VpCol>
                                        </VpCol>
                                        <VpCol className="height-30" span={8}>
                                            <VpCol className="text-right label" span={9}>项目状态</VpCol>
                                            <VpCol span={14} className="b-b p-l-xs height-30">{this.state.sstatusname}</VpCol>
                                        </VpCol>
                                        <VpCol className="height-30" span={8}>
                                            <VpCol className="text-right label" span={9}>指示灯</VpCol>
                                            <VpCol span={14} className="b-b p-l-xs height-30">进度<span className={indiclass[this.state.ischeduleindicator]}></span> 成本<span className={indiclass[this.state.icostindicator]}></span> 质量<span className={indiclass[this.state.iqualityindicator]}></span> 风险<span className={indiclass[this.state.iriskindicator]}></span></VpCol>
                                        </VpCol>
                                        <VpCol className="height-30" span={8}>
                                            <VpCol className="text-right label" span={9}>计划开始日期</VpCol>
                                            <VpCol span={14} className="b-b p-l-xs height-30">{this.state.dplanstartdate}</VpCol>
                                        </VpCol>
                                        <VpCol className="height-30" span={8}>
                                            <VpCol className="text-right label" span={9}>计划完成日期</VpCol>
                                            <VpCol span={14} className="b-b p-l-xs height-30">{this.state.dplanenddate}</VpCol>
                                        </VpCol>
                                        <VpCol className="height-30" span={8}>
                                            <VpCol className="text-right label" span={9}>报告日期</VpCol>
                                            <VpCol span={14} className="b-b p-l-xs height-30">{this.state.dreprotdate}</VpCol>
                                        </VpCol>
                                        <VpCol className="height-30" span={8}>
                                            <VpCol className="text-right label" span={9}>实际开始日期</VpCol>
                                            <VpCol span={14} className="b-b p-l-xs height-30">{this.state.dactualstartdate}</VpCol>
                                        </VpCol>
                                        <VpCol className="height-30" span={8}>
                                            <VpCol className="text-right label" span={9}>预测完成日期</VpCol>
                                            <VpCol span={14} className="b-b p-l-xs height-30">{this.state.dforecastenddate}</VpCol>
                                        </VpCol>
                                        <VpCol className="height-30" span={8}>
                                            <VpCol className="text-right label" span={9}>项目经理</VpCol>
                                            <VpCol span={14} className="b-b p-l-xs height-30">{this.state.pmname}</VpCol>
                                        </VpCol>
                                        <VpCol className="height-30" span={8}>
                                            <VpCol className="text-right label" span={9}>计划完成百分比</VpCol>
                                            <VpCol span={14} className="b-b p-l-xs height-30">{this.state.iplancomplete}%</VpCol>
                                        </VpCol>
                                        <VpCol className="height-30" span={8}>
                                            <VpCol className="text-right label" span={9}>实际完成百分比</VpCol>
                                            <VpCol span={14} className="b-b p-l-xs height-30">{this.state.iactualcomplete}%</VpCol>
                                        </VpCol>
                                        <VpCol className="height-30" span={8}>
                                            <VpCol className="text-right label" span={9}>汇报周期</VpCol>
                                            <VpCol span={14} className="b-b p-l-xs height-30">{this.state.startdate} ~ {this.state.enddate}</VpCol>
                                        </VpCol>
                                    </VpRow>
                                </VpPanel>
                                <VpPanel header="项目周工作总结" key="2">
                                    <VpForm className="p-t-sm">
                                        <FormItem label="总结报告" {...formItemLayoutAllLine}>
                                            <VpInput type="textarea" row={4} {...getFieldProps("reportdesc", {
                                                rules: [
                                                    { required: true, message: '总结报告不能为空' },
                                                ],
                                                initialValue: this.state.reportdesc
                                            })} />
                                        </FormItem>
                                        <FormItem label="本周进度" {...formItemLayout}>
                                            <VpSelect {...getFieldProps("indicatorvalue", {
                                                rules: [
                                                    { required: true, message: '本周进度不能为空' },
                                                ],
                                                initialValue: this.state.progress,
                                                onChange: this.progressChange,
                                            })} getPopupContainer={() => document.body}>
                                                <VpOption value="1">进展顺利</VpOption>
                                                <VpOption value="2">进展拖延</VpOption>
                                                <VpOption value="3">毫无进展</VpOption>
                                            </VpSelect>
                                        </FormItem>
                                        {
                                            this.state.progress !== '1' && (
                                                <FormItem label="原因" {...formItemLayoutAllLine}>
                                                    <VpInput type="textarea" row={4} {...getFieldProps("remark", {
                                                        rules: [
                                                            { required: true, message: '原因不能为空' },
                                                        ],
                                                        initialValue: this.state.remark,
                                                        onChange: this.progressChange,
                                                    })} />
                                                </FormItem>
                                            )
                                        }
                                        <FormItem label="下周计划" {...formItemLayoutAllLine}>
                                            <VpInput type="textarea" row={4} {...getFieldProps("nextplan", {
                                                rules: [
                                                    { required: true, message: '下周计划不能为空' },
                                                ],
                                                initialValue: this.state.nextplan
                                            })} />
                                        </FormItem>
                                    </VpForm>
                                </VpPanel>
                                <VpPanel header="项目里程碑状况" key="3">
                                    <VpTable
                                        columns={columnsphase}
                                        dataSource={this.state.phase}
                                        pagination={false}
                                        resize
                                    />
                                </VpPanel>
                                <VpPanel header="本周工作完成情况" key="4">
                                    <VpTable
                                        columns={columnstask}
                                        dataSource={this.state.curtask}
                                        pagination={false}
                                        resize
                                    />
                                </VpPanel>
                                <VpPanel header="项目风险" key="5">
                                    <VpTable
                                        columns={columnsrisk}
                                        dataSource={this.state.projectrisk}
                                        pagination={false}
                                        resize
                                    />
                                </VpPanel>
                            </VpFCollapse>
                            <span className={`${this.state.max ? 'left-10' : ''} vertical-center cursor bg-white `}>
                                <VpTooltip placement="top" title={this.state.max ? "展开" : "收起"}>
                                    <VpIconFont type={this.state.max ? "vpicon-right" : "vpicon-left"} onClick={this.changeShow} />
                                </VpTooltip >
                            </span>
                        </VpCol>
                        :
                        <VpCol span={this.state.max ? 24 : 19} className='full-height scroll p-static'>
                            <div className="tip-box text-center">
                                <div className="tip-icon text-warning"><VpIconFont type="vpicon-warning" /></div>
                                <div id="shit3" className="tip f30 p-b-sm">唔，暂未生成本周周报！！！</div>
                                {/* <VpButton type="primary">手动生成周报</VpButton> */}
                            </div>
                        </VpCol>
                    }
                </VpRow>
                <div className="footer-button-wrap ant-modal-footer">
                    {(this.state.reportflag == true && this.state.startdate != '' && this.state.entityrole) ?
                        <VpButton key="confirmBtn" type="primary" size="large" onClick={() => this.saveWeekReport()} >提交总结报告</VpButton>
                        : ''
                    }
                    {(this.state.reportflag == true && this.state.startdate != '' && this.state.entityrole) ?
                        <VpButton key="exportBtn" type="primary" size="large" onClick={() => this.exportWeekReport()} >导出周报</VpButton>
                        : ''
                    }
                    {(this.state.reportflag == false && this.state.startdate != '' && this.state.entityrole) ?
                        <VpButton key="cancelBtn" type="primary" size="large" onClick={() => this.addWeekReport()}>手动生成周报</VpButton>
                        : ''}
                   
                </div>
            </div>

        )
    }
}
export default Report = VpFormCreate(Report);