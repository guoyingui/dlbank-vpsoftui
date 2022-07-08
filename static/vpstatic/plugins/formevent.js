//状态变迁onload事件  不要删掉了这个方法!!!!
function varilsFormHandler(param) {
    var entityid = param.entityid;
    var iid = param.iid;
    var variid = param.variid
    var k03;
    var k04;
    var url = getVpproviderUrl("vpmprovider", "/taskRestss/getDevTaskStatusChange");
    $.ajax({
        type: "post",
        url: url,
        data: {},
        cache: false,
        async: false,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + vp.cookie.getToken()); //获取Token
        },
        success: function (res, textStatus, jqXHR) {
            // 获取“SIT测试完成”、“送测完成” 的id
            k03 = findStatusIdByScode(res.data, 'k03')
            k04 = findStatusIdByScode(res.data, 'k04')
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("请求失败,请联系管理员！");
        }
    });
    //开发任务状态变迁
    if ("114" == entityid) {
        vpmTaskStatusChange(variid, iid)
        if (variid != k03 && variid != k04) {
            return {
                "iid": vp.cookie.getTkInfo().userid,
                "sname": vp.cookie.getTkInfo().nickname
            }
        }
    }

}

//开发任务状态变迁
function vpmTaskStatusChange(variid, iid) {
    //获取开发任务状态变迁状态
    var url = getVpproviderUrl("vpmprovider", "/taskRestss/getDevTaskStatusChange");
    $.ajax({
        type: "post",
        url: url,
        data: {

        },
        cache: false,
        async: false,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + vp.cookie.getToken()); //获取Token
        },
        success: function (res, textStatus, jqXHR) {
            // 需求分析完成日期”=点击“保存并提交/开发开始”操作日期
            var k01 = findStatusIdByScode(res.data, 'k01')
            var d01 = findStatusIdByScode(res.data, 'd01')
            //3.“设计开发完成日期”=点击“开发完成”操作日期
            var k02 = findStatusIdByScode(res.data, 'k02')
            var d02 = findStatusIdByScode(res.data, 'd02')
            //3.“设计开发完成日期”=点击“开发完成”操作日期
            var k03 = findStatusIdByScode(res.data, 'k03')
            //5.“送测日期”=点击“送测完成”操作日期
            var k04 = findStatusIdByScode(res.data, 'k04')
            //硬件任务 3.“测试完成日期”=点击“测试完成”操作日期
            var d3 = findStatusIdByScode(res.data, 'd3')
            //测试任务  测试完成  “实际完成日期”=点击“测试完成”操作日期
            var t2 = findStatusIdByScode(res.data, 't2')
            //测试任务  测试开始  4.“预计开始日期”=“UAT预计开始日期” 5.“预计完成日期”=“UAT预计完成日期”
            var t1 = findStatusIdByScode(res.data, 't1')
            if (variid == k01 || variid == d01) {
                window.textSetValue({
                    'drxwcrq': new Date()
                })
            } else if (variid == k02 || variid == d02) {
                window.textSetValue({
                    'dsjwcrq': new Date()
                })
            } else if (variid == k03) {
                window.textSetValue({
                    'dcswcrq': new Date()
                })
            } else if (variid == k04) {
                window.textSetValue({
                    'duatcswcrq': new Date(),
                    'dactualenddate': new Date()
                })

            } else if (variid == d3) {
                window.textSetValue({
                    'dcswcsj': new Date(),
                    'dactualenddate': new Date()
                })
            } else if (variid == t2) {
                window.textSetValue({
                    'dactualenddate': new Date()
                })
                // 测试任务 测试开始
            }
            // else if (variid == t1){
            //     var duatksrq =  window.form.dynamic.getFieldValue("duatksrq")
            //     var duatwcrq =  window.form.dynamic.getFieldValue("duatwcrq")
            //     window.textSetValue({
            //         'dforecaststartdate':duatksrq,
            //         'dforecastenddate' : duatwcrq
            //     })
            // }   
            updateVpmTaskTimeByFile(iid)
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("请求失败,请联系管理员！");
        }
    });

}

function findStatusIdByScode(statausList, statusCode) {
    for (var i = 0; i < statausList.length; i++) {
        if (statausList[i].scode == statusCode) {
            return statausList[i].iid
        }
    }
}

//指定字段更新时间
function updateVpmTaskTimeByFile(iid) {
    var url = getVpproviderUrl("vpmprovider", "/taskRestss/updateVpmTaskTimeByFile");
    $.ajax({
        type: "post",
        url: url,
        data: {
            "iid": iid
        },
        cache: false,
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + vp.cookie.getToken()); //获取Token
        },
        success: function (res, textStatus, jqXHR) {},
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("请求失败,请联系管理员！");
        }
    });
}

/**
 * 获取开发任务状态变迁状态
 */
function queryDevTaskStatusChange() {
    var data = ""
    var url = getVpproviderUrl("vpmprovider", "/taskRestss/getDevTaskStatusChange");
    $.ajax({
        type: "post",
        url: url,
        data: {

        },
        cache: false,
        async: false,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + vp.cookie.getToken()); //获取Token
        },
        success: function (res, textStatus, jqXHR) {
            return res.data;


        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("请求失败,请联系管理员！");
        }
    });

}


//poc 表单onload事件
function pjpoc(param) {
    var fields = param.value.form.groups[0].fields;
    var flag = false;
    var index = -1;
    for (var i = 0; i < fields.length; i++) {
        if (fields[i].field_name == 'iissub' && fields[i].widget.default_value == '0') {
            flag = true;
        }
        if (fields[i].field_name == 'rrelprj') {
            index = i;
        }
    }
    if (index != -1 && flag) {
        param.value.form.groups[0].fields[index].disabled = true;
    }
    return param.value;
}

function saveevent(param) {
    alert('onsave')
    return 1 < 2;
}

function onload(param) {
    alert("onload")
    return param.value;
}

function flowload(param) {
    top.window.branch = 'sflow_flag';
    return param.value;
}

function flowload1(param) {
    top.window.branch = 'scode';
    return param.value;
}

/*
 * 产品平台7.4.1版本增加，实体表单发起流程提交分支条件到流程中  魏洋
 * 7.4.4修改，传递单值模式
 */
function setEntityFlowCondition(oparam) {
    //流程时，将表单中代表分支条件值的字段存放在window里
    var fieldname = oparam["scon_fieldname"];
    var scondition = '';
    try {
        scondition = window.form.dynamic.getFieldValue(fieldname);
    } catch (e) {
        console.log('未在表单中找到属性' + fieldname);
    }

    top.window['scondition'] = scondition;
    return true;
}

/*
 * 产品平台7.4.4版本增加，实体表单发起流程提交分支条件到流程中  魏洋
 * 传递多条件属性值
 */
function setEntityFlowConditionJson(oparam) {
    //流程时，将表单中代表分支条件值的字段存放在window里
    var fieldname = oparam["scon_fieldname"];
    var scondition = {};
    try {
        scondition[fieldname] = window.form.dynamic.getFieldValue(fieldname);
    } catch (e) {
        console.log('未在表单中找到属性' + fieldname);
    }

    top.window.scondition = scondition;
    return true;
}

/*
 * 产品平台7.4.1版本增加，工作流表单中条件分支提交到服务端  魏洋
 */
function setFlowCondition(oparam) {
    //流程时，将表单中代表分支条件值的字段存放在window里
    return oparam.value;
}
/**
 * 风险中根据发生概率、影响程度计算风险等级
 * @param {*} param 
 */
function fxOnload(param) {
    var fields = param.value.form.groups[0].fields;
    var pField = findFieldByName(param.value.form.groups, "iriskimpact");
    var iriskimpact = '';
    if (pField) {
        iriskimpact = pField.field.widget.default_value;
    }
    var iriskprobability = '';
    var ppField = findFieldByName(param.value.form.groups, "iriskprobability");
    if (ppField) {
        iriskprobability = ppField.field.widget.default_value;
    }
    var aa = getEffect(iriskprobability, iriskimpact);
    var bb = getEffectValue(aa);
    console.log(aa);
    var ffxdjzField = findFieldByName(param.value.form.groups, "ffxdjz");
    if (ffxdjzField) {
        ffxdjzField.field.widget.default_value = aa;
    }
    var sfxdjField = findFieldByName(param.value.form.groups, "sfxdj");
    if (sfxdjField) {
        window.textSetValue({
            'sfxdj': bb
        })
    }
    console.log('iriskimpact', iriskimpact);
    return param.value;
}
/**
 * 需求提出流程--需求评估步骤提交校验
 * @param {*} param 
 */
function xqtcsllc_save(param) {
    var sflag = false,
        msg = "";
    var url = getVpproviderUrl("vpplat", "/vpreq/getreqstatus");
    $.ajax({
        type: "post",
        url: url,
        data: {
            reqiid: param.iobjectid
        },
        cache: false,
        async: false,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + vp.cookie.getToken()); //获取Token
        },
        success: function (res, textStatus, jqXHR) {
            var dd = res.data;
            if (dd.success) {
                sflag = true;
            } else {
                msg = dd.msg;
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("请求失败,请联系管理员！");
        }
    });
    return {
        submit: sflag,
        message: msg
    };
}

/**
 * 测试任务关联tab页，新建测试用例、缺陷根据测试任务属性进行初始化
 * @param {*} param 
 */
function initValueByTestTask(param) {
    console.log('paramparamparam', param);
    if (param.iid) { //新建时候进行初始化
        return param.value;
    }
    var formdata = param.value
    var groupsData = formdata.form.groups;
    var sflag = false,
        msg = "",
        mainentityiid = '',
        ssf = '';
    var array = param.mainentityiid
    var mainentity = param.mainentity
    if (array instanceof Array) {
        mainentityiid = array[0];
        ssf = '1'
    } else {
        mainentityiid = array;
    }
    if ('62' == param.mainentity && '64' == param.entityid) {
        ssf = '1'
    }
    if ('62' == param.entityid || '64' == param.entityid) { // 测试用例/缺陷  1.新增时测试人员=当前用户

        var filed = getField(groupsData, "iassignto"); //处理人
        if (filed) {
            window.form.dynamic.setFields({
                iassignto: {
                    value: vp.cookie.getTkInfo().userid,
                },
                iassignto_label: {
                    value: vp.cookie.getTkInfo().nickname
                }
            })
        }

    }
    if (!mainentityiid) {
        return param.value;
    }
    var url = getVpproviderUrl("vpmprovider", "/testManageRest/getTestTaskInfo");
    $.ajax({
        type: "post",
        url: url,
        data: {
            mainentityiid: mainentityiid,
            ssf: ssf
        },
        cache: false,
        async: false,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + vp.cookie.getToken()); //获取Token
        },
        success: function (res, textStatus, jqXHR) {
            var dd = res.data;
            if (dd.success) {
                var fields = param.value.form.groups[0].fields;
                var pField = findFieldByName(param.value.form.groups, "rsubreq"); //测试需求、测试用例表单中归属子需求
                var pFieldrglxt = findFieldByName(param.value.form.groups, "ryyxt"); //测试用例表单中应用系统
                var pFieldrglxm = findFieldByName(param.value.form.groups, "rglxm"); //测试用例表单中归属项目
                var pFieldrglxq = findFieldByName(param.value.form.groups, "rglxq"); //测试用例表单中关联需求

                if (pFieldrglxq && dd.data) { //关联需求
                    pFieldrglxq.field.widget.default_value = dd.data.reqiid;
                    pFieldrglxq.field.widget.default_label = dd.data.reqsname;
                }
                if (pField && dd.data) { //归属子需求
                    pField.field.widget.default_value = dd.data.reqiid;
                    pField.field.widget.default_label = dd.data.reqsname;
                }
                // if (pFieldrglxt && dd.data && pFieldrglxt.field.widget && !pFieldrglxt.field.widget.default_value) { //应用系统
                //     pFieldrglxt.field.widget.default_value = dd.data.rlinksystem;
                //     pFieldrglxt.field.widget.default_label = dd.data.rlinksystemname;
                // }
                // if (pFieldrglxm && dd.data && pFieldrglxm.field.widget && !pFieldrglxm.field.widget.default_value) { //归属项目
                //     pFieldrglxm.field.widget.default_value = dd.data.iprojectid;
                //     pFieldrglxm.field.widget.default_label = dd.data.iprojectidname;
                // }

                var pField = findFieldByName(param.value.form.groups, "rssal"); //缺陷表单中所属案例
                if (pField && dd.data) { //所属案例
                    pField.field.widget.default_value = dd.data.caseiid;
                    pField.field.widget.default_label = dd.data.casename;
                }
                pField = findFieldByName(param.value.form.groups, "rbcxt"); //缺陷表单中被测系统
                if (pField && dd.data) { //被测系统
                    pField.field.widget.default_value = dd.data.ryyxt;
                    pField.field.widget.default_label = dd.data.yyxtname;
                }
                // pField = findFieldByName(param.value.form.groups, "rprjid"); //缺陷表单中归属项目
                // if (pField && dd.data) { //归属项目
                //     pField.field.widget.default_value = dd.data.iprojectid;
                //     pField.field.widget.default_label = dd.data.iprojectidname;
                // }
                // pField = findFieldByName(param.value.form.groups, "rpphase"); //缺陷表单中项目阶段
                // if (pField && dd.data) {
                //     pField.field.widget.default_value = dd.data.rpjphase;
                //     pField.field.widget.default_label = dd.data.rpjphasename;
                // }
                pField = findFieldByName(param.value.form.groups, "rcsrw"); //缺陷表单中测试任务
                if (pField && dd.data) { //测试任务
                    pField.field.widget.default_value = dd.data.ywid;
                    pField.field.widget.default_label = dd.data.ywidname;
                }
                window.textSetValue({
                    'dproposetime': dd.data.dforecaststartdate,
                    'dfinishtime': dd.data.dforecastenddate
                })
            } else {
                msg = dd.msg;
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            // alert("请求失败,请联系管理员！");
        }
    });

    return param.value;
}
/**
 * 测试缺陷
 * 1.新增时处理人=当前用户
    2.从测试执行中创建测试缺陷时；所属案例=当前执行的测试用例；所属需求=测试用例的用户需求；被测系统=测试用例的应用系统；缺陷类别=测试用例的类别
    3.从测试需求中创建时，选择所属案例后，所属需求=测试用例的用户需求；被测系统=测试用例的应用系统；
 * @param {chenxl} param 
 */
function initValueByTestCase(param) {
    if (param.iid) { //新建时候进行初始化
        return param.value;
    }
    var formdata = param.value
    var groupsData = formdata.form.groups;
    var sflag = false,
        msg = "",
        mainentityiid = '',
        ssf = '';
    var array = param.mainentityiid
    if (array instanceof Array) {
        mainentityiid = array[0];
        ssf = '1'
    } else {
        mainentityiid = array;
    }
    if ('62' == param.mainentity && '64' == param.entityid) {
        ssf = '1'
    }
    // 测试用例  1.新增时测试人员=当前用户

    var filed = getField(groupsData, "iassignto"); //处理人
    if (filed) {
        window.form.dynamic.setFields({
            iassignto: {
                value: vp.cookie.getTkInfo().userid,
            },
            iassignto_label: {
                value: vp.cookie.getTkInfo().nickname
            }
        })
    }


    if (!mainentityiid) {
        return param.value;
    }
    var url = getVpproviderUrl("vpmprovider", "/testManageRest/getTestTaskInfo");
    $.ajax({
        type: "post",
        url: url,
        data: {
            mainentityiid: mainentityiid,
            ssf: ssf
        },
        cache: false,
        async: false,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + vp.cookie.getToken()); //获取Token
        },
        success: function (res, textStatus, jqXHR) {
            var dd = res.data;
            if (dd.success) {
                var fields = param.value.form.groups[0].fields;
                var pFieldrglxq = findFieldByName(param.value.form.groups, "rglxq"); //测试用例表单中关联需求
                var pField = findFieldByName(param.value.form.groups, "rsubreq"); //测试需求、测试用例表单中归属子需求
                var pFieldrglxt = findFieldByName(param.value.form.groups, "ryyxt"); //测试用例表单中应用系统
                var pFieldrglxm = findFieldByName(param.value.form.groups, "rglxm"); //测试用例表单中归属项目
                if (pFieldrglxq && dd.data) { //关联需求
                    pFieldrglxq.field.widget.default_value = dd.data.reqiid;
                    pFieldrglxq.field.widget.default_label = dd.data.reqsname;
                }
                if (pField && dd.data) { //归属子需求
                    pField.field.widget.default_value = dd.data.rlinkzxq;
                    pField.field.widget.default_label = dd.data.rlinkzxqname;
                }
                if (pFieldrglxt && dd.data && pFieldrglxt.field.widget && !pFieldrglxt.field.widget.default_value) { //应用系统
                    pFieldrglxt.field.widget.default_value = dd.data.rlinksystem;
                    pFieldrglxt.field.widget.default_label = dd.data.rlinksystemname;
                }
                if (pFieldrglxm && dd.data && pFieldrglxm.field.widget && !pFieldrglxm.field.widget.default_value) { //归属项目
                    pFieldrglxm.field.widget.default_value = dd.data.iprojectid;
                    pFieldrglxm.field.widget.default_label = dd.data.iprojectidname;
                }

                var pField = findFieldByName(param.value.form.groups, "rgszxq"); //缺陷表单中归属子需求
                if (pField && dd.data) { //归属子需求
                    pField.field.widget.default_value = dd.data.rlinkzxq;
                    pField.field.widget.default_label = dd.data.rlinkzxqname;
                }
                pField = findFieldByName(param.value.form.groups, "rsysid"); //缺陷表单中应用系统
                if (pField && dd.data) { //归属应用系统
                    pField.field.widget.default_value = dd.data.rlinksystem;
                    pField.field.widget.default_label = dd.data.rlinksystemname;
                }
                pField = findFieldByName(param.value.form.groups, "rprjid"); //缺陷表单中归属项目
                if (pField && dd.data) { //归属项目
                    pField.field.widget.default_value = dd.data.iprojectid;
                    pField.field.widget.default_label = dd.data.iprojectidname;
                }
                pField = findFieldByName(param.value.form.groups, "rpphase"); //缺陷表单中项目阶段
                if (pField && dd.data) {
                    pField.field.widget.default_value = dd.data.rpjphase;
                    pField.field.widget.default_label = dd.data.rpjphasename;
                }
                pField = findFieldByName(param.value.form.groups, "rcsrw"); //缺陷表单中测试任务
                if (pField && dd.data) { //测试任务
                    pField.field.widget.default_value = dd.data.ywid;
                    pField.field.widget.default_label = dd.data.ywidname;
                }
                window.textSetValue({
                    'dproposetime': dd.data.dforecaststartdate,
                    'dfinishtime': dd.data.dforecastenddate
                })
            } else {
                msg = dd.msg;
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            // alert("请求失败,请联系管理员！");
        }
    });

    return param.value;
}
/*
 * 缺陷流程中项目和阶段联动
 * 注意：必须return param.value;
 */
function initQXLC(param) {
    var rproject = findFieldByName(param.value.form.groups, "rproject"); // 缺陷流程表单中的归属项目
    var rpjphase = findFieldByName(param.value.form.groups, "rpjphase");
    rpjphase.field.exparams = {
        condition: JSON.stringify([{
            "field_name": "rprjid",
            "field_value": rproject.field.widget.default_value || '0',
            "expression": "eq"
        }]),
        iprojectid: rproject.field.widget.default_value || '0', // 需要保留，有其它条件
    }
    return param.value;
}

/**
 * 获取外包人员结算信息
 */
function initWBPeople(param) {

    var djsstartdate = findFieldByName(param.value.form.groups, "djsstartdate");
    var djsenddate = findFieldByName(param.value.form.groups, "djsenddate");
    var rsupplier = findFieldByName(param.value.form.groups, "rsupplier");
    var rwbpeople = findFieldByName(param.value.form.groups, "rwbpeople");

    var djsstartdatestr = '';
    var djsenddatestr = '';
    var rsupplieriid = '0';
    if (djsstartdate != undefined) {
        djsstartdatestr = dateyyyymmdd(djsstartdate.field.widget.default_value)
    }
    if (djsenddate != undefined) {
        djsenddatestr = dateyyyymmdd(djsenddate.field.widget.default_value)
    }
    if (rsupplier != undefined && rsupplier.field.widget.default_value != undefined) {
        rsupplieriid = rsupplier.field.widget.default_value
    }

    rwbpeople.field.item = {
        fromtype: 6,
        gysiid: rsupplieriid,
        startdate: djsstartdatestr,
        enddate: djsenddatestr
    }
    return param.value;
}

function dateyyyymmdd(d) {
    if (!d instanceof Date || d == 'Invalid Date' || d == undefined || d == '') {
        return '';
    }
    var date = new Date(d + "");
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    minute = minute < 10 ? ('0' + minute) : minute;
    var second = date.getSeconds();
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d;
};

/**
 * 根据字段名称获取字段数据
 * 
 * @author 邵东红 20200916
 * @param formData
 * @param fieldName
 */
var getField = function (formData, filedName) {
    for (var i = 0; i < formData.length; i++) {
        var groupRow = formData[i];
        var fields = groupRow.fields;
        if (fields && fields.length) {
            for (var j = 0; j < fields.length; j++) {
                var fieldRow = fields[j];
                if (fieldRow.field_name == filedName) {
                    return fieldRow;
                }
            }
        }
    }
    return null;
}

/**
 * 根据节编号设置节隐藏及节下面字段非必填
 * 
 * @author 邵东红 20200916
 * @param groupRow
 * @param filedName
 */
var setTypeGroupHide = function (groupRow) {
    if (groupRow && groupRow.fields) {
        groupRow.group_type = 4 // 设置节及字段不显示
        var fields = groupRow.fields;
        if (fields && fields.length) {
            for (var j = 0; j < fields.length; j++) {
                var fieldRow = fields[j];
                if (fieldRow.iconstraint == 0) {
                    fieldRow.iconstraint = 2; // 隐藏节里面的必填字段设置为只读
                    if (fieldRow.validator && fieldRow.validator.rMax > 0) {
                        fieldRow.widget.default_value = '0'; // 设置默认值为0，避免隐藏后校验数据规则
                    }
                }
            }
        }
        return groupRow;
    } else {
        return null;
    }
}
/**
 * 根据节编号设置节下面字段,项目预算金额、拟支付金额必填，类型节中的类型自动填充且只读
 * 
 * @author 邵东红 20200916
 * @param groupRow
 * @param filedName
 */
var setTypeGroupField = function (groupRow) {
    if (groupRow && groupRow.fields) {
        groupRow.group_type = 1 // 设置节及字段不显示
        var fields = groupRow.fields;
        if (fields && fields.length) {
            for (var j = 0; j < fields.length; j++) {
                var fieldRow = fields[j];
                if (fieldRow.field_name && fieldRow.field_name.indexOf('ixmlx') == 0) { // 项目类型
                    fieldRow.iconstraint = 2 // 项目类型字段设置为只读
                    fieldRow.readonly = true;
                    fieldRow.disabled = true;
                    fieldRow.widget.default_value = fieldRow.field_name.replace('ixmlx', '');
                } else if (fieldRow.field_name && (fieldRow.field_name.indexOf('fnzfje') == 0 || fieldRow.field_name.indexOf('fxmysje') == 0)) {
                    fieldRow.iconstraint = 0 // 项目预算金额、拟支付金额字段必填
                    fieldRow.validator.required = true
                }
            }
        }
        return groupRow;
    } else {
        return null;
    }
}
var getGroupTypeByCode = function (scode, xmlxArr) {
    if (scode && xmlxArr && scode.indexOf('lx') == 0) {
        var isSelecet = false;
        var codeIdx = scode.replace('lx', ''); //节编号为‘lx’+数字 的规则
        for (var i = 0; i < xmlxArr.length; i++) {
            if (xmlxArr[i] == codeIdx) { // 选中了此类型类型
                isSelecet = true;
            }
        }
        if (!isSelecet) { // 未选中此类型
            return 1; //隐藏节
        } else {
            return 2; //需特殊设置节中的字段
        }
    }
    return 0; // 节不做任何处理
}
/**
 *预算条目表单onload事件
 * 
 * @author 邵东红 20200916
 * @param {*}
 *            param
 */
function budgetFormOnLoad(param) {
    debugger;
    var formdata = param.value;
    var groupsData = formdata.form.groups;
    // 项目类型字段联动设置类型节及其下面的字段 start
    var ixmlx0Field = getField(groupsData, "ixmlx0"); // 项目类型多选字段
    var ixmlx0 = ixmlx0Field && ixmlx0Field.widget.default_value ? ixmlx0Field.widget.default_value : '';
    var xmlxArr = [];
    if (ixmlx0 != '') {
        xmlxArr = ixmlx0.split(',');
    }
    if (xmlxArr != null && xmlxArr.length >= 0) {
        var newGroupsData = [];
        var newGroup = {};
        for (var i = 0; i < groupsData.length; i++) {
            if (groupsData[i]) {
                var group_scode = groupsData[i].group_scode;
                if (group_scode == undefined) {
                    group_scode = groupsData[i].group_code;
                }
                var setGroupType = getGroupTypeByCode(group_scode, xmlxArr);
                if (setGroupType == 1) { // 节不显示
                    newGroup = setTypeGroupHide(groupsData[i]); // 设置节及其字段不显示
                } else if (setGroupType == 2) { // 项目类型节定制显示
                    newGroup = setTypeGroupField(groupsData[i]); // 设置项目类型节字段设置
                    // 类型1-11等页面不显示数字
                    var ggcode = newGroup.group_scode
                    var ggcodenum = ''
                    if (ggcode) {
                        ggcodenum = ggcode.slice(2, ggcode.length);
                    }
                    var fields = newGroup.fields
                    if (fields) {
                        for (var j = 0; j < fields.length; j++) {

                            var ff = fields[j].field_label
                            fields[j].field_label = ff.replace(ggcodenum, '');
                        }
                    }
                } else {
                    newGroup = groupsData[i];
                }
                newGroupsData.push(newGroup);
            }
        }
        formdata.form.groups = newGroupsData;
    }
    // 项目类型字段联动设置类型节及其下面的字段 end
    var syearField = getField(groupsData, "syear"); // 预算条目年度字段
    if (syearField) {
        var rbudgetpoolField = getField(groupsData, "rbudgetpool"); // 部门年度预算字段
        var rbudgetpool = '';
        if (rbudgetpoolField) {
            rbudgetpool = rbudgetpoolField.widget.default_value;
        }
        var url = getVpproviderUrl("vpmprovider", "/dlbank/budget/getDeptYearBudgetInfo");
        $.ajax({
            type: "post",
            url: url,
            data: {
                iid: rbudgetpool,
                ientityid: 168
            },
            cache: false,
            async: false,
            dataType: "json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + vp.cookie.getToken()); //获取Token
            },
            success: function (res, textStatus, jqXHR) {
                var data = res.data;
                if (data) {
                    syearField.widget.default_value = data.syear
                    syearField.widget.default_label = data.syear
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("请求失败,请联系管理员！");
            }
        });
    }
    // 设置年度字段的默认值

    var field = getField(groupsData, "fbudget_amount"); //项目预算金额
    if (field) {
        field.disabled = true
    }
    field = getField(groupsData, "fbndjzfje"); //拟支付金额
    if (field) {
        field.disabled = true
    }
    field = getField(groupsData, "fapprovedamount"); //项目立项金额
    if (field) {
        field.disabled = true
    }
    return formdata;
}

/**
 * 预算外预算审核、部门年度预算审核流程“部门负责人”步骤预设处理人
    表单单独拉出来一个onload事件budgetFormOnLoadFirst
 * @param {chenxl} param 
 */
function budgetFormOnLoadFirst(param) {
    debugger;
    var formdata = param.value;
    var groupsData = formdata.form.groups;
    // 项目类型字段联动设置类型节及其下面的字段 start
    var ixmlx0Field = getField(groupsData, "ixmlx0"); // 项目类型多选字段
    var ixmlx0 = ixmlx0Field && ixmlx0Field.widget.default_value ? ixmlx0Field.widget.default_value : '';
    var xmlxArr = [];
    if (ixmlx0 != '') {
        xmlxArr = ixmlx0.split(',');
    }
    if (xmlxArr != null && xmlxArr.length >= 0) {
        var newGroupsData = [];
        var newGroup = {};
        for (var i = 0; i < groupsData.length; i++) {
            if (groupsData[i]) {
                var group_scode = groupsData[i].group_scode;
                if (group_scode == undefined) {
                    group_scode = groupsData[i].group_code;
                }
                var setGroupType = getGroupTypeByCode(group_scode, xmlxArr);
                if (setGroupType == 1) { // 节不显示
                    newGroup = setTypeGroupHide(groupsData[i]); // 设置节及其字段不显示
                } else if (setGroupType == 2) { // 项目类型节定制显示
                    newGroup = setTypeGroupField(groupsData[i]); // 设置项目类型节字段设置
                    // 类型1-11等页面不显示数字
                    var ggcode = newGroup.group_scode
                    var ggcodenum = ''
                    if (ggcode) {
                        ggcodenum = ggcode.slice(2, ggcode.length);
                    }
                    var fields = newGroup.fields
                    if (fields) {
                        for (var j = 0; j < fields.length; j++) {

                            var ff = fields[j].field_label
                            fields[j].field_label = ff.replace(ggcodenum, '');
                        }
                    }
                } else {
                    newGroup = groupsData[i];
                }
                newGroupsData.push(newGroup);
            }
        }
        formdata.form.groups = newGroupsData;
    }
    // 项目类型字段联动设置类型节及其下面的字段 end
    var syearField = getField(groupsData, "syear"); // 预算条目年度字段
    if (syearField) {
        var rbudgetpoolField = getField(groupsData, "rbudgetpool"); // 部门年度预算字段
        var rbudgetpool = '';
        if (rbudgetpoolField) {
            rbudgetpool = rbudgetpoolField.widget.default_value;
        }
        var url = getVpproviderUrl("vpmprovider", "/dlbank/budget/getDeptYearBudgetInfo");
        $.ajax({
            type: "post",
            url: url,
            data: {
                iid: rbudgetpool,
                ientityid: 168
            },
            cache: false,
            async: false,
            dataType: "json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + vp.cookie.getToken()); //获取Token
            },
            success: function (res, textStatus, jqXHR) {
                var data = res.data;
                if (data) {
                    syearField.widget.default_value = data.syear
                    syearField.widget.default_label = data.syear
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("请求失败,请联系管理员！");
            }
        });
    }
    // 设置年度字段的默认值

    var field = getField(groupsData, "fbudget_amount"); //项目预算金额
    if (field) {
        field.disabled = true
    }
    field = getField(groupsData, "fbndjzfje"); //拟支付金额
    if (field) {
        field.disabled = true
    }
    field = getField(groupsData, "fapprovedamount"); //项目立项金额
    if (field) {
        field.disabled = true
    }
    // 预算外预算审核流程对部门负责人审核预设处理人
    var rbudgetpoolField = getField(groupsData, "rbudgetpool"); // 部门年度预算字段
    var rbudgetpool = '';
    if (rbudgetpoolField) {
        rbudgetpool = rbudgetpoolField.widget.default_value;
        url = getVpproviderUrl("vpmprovider", "/dlbank/second/getDptYsld");
        $.ajax({
            type: "post",
            url: url,
            data: {
                entityid: 168,
                iid: rbudgetpool
            },
            cache: false,
            async: false,
            dataType: "json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + vp.cookie.getToken()); //获取Token
            },
            success: function (res, textStatus, jqXHR) {
                var dd = res.data;
                if (dd) {
                    var handlers = formdata.handlers
                    if (handlers) {
                        handlers[0].ids = dd.userid
                        handlers[0].names = dd.sname
                    }
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("请求失败,请联系管理员！");
            }
        });
    }

    return formdata;
}

function dateyyyymmddload(d) {
    console.log("********************" + d);
    if (!d instanceof Date || d == 'Invalid Date' || d == '') {
        return;
    }
    var date = new Date(d + "");
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    minute = minute < 10 ? ('0' + minute) : minute;
    var second = date.getSeconds();
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d;
};

function dateyyyymmdd(d) {
    console.log("********************" + d);
    if (!d instanceof Date || d == 'Invalid Date' || d == '') {
        return;
    }
    var date = new Date(d + "");
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    minute = minute < 10 ? ('0' + minute) : minute;
    var second = date.getSeconds();
    second = second < 10 ? ('0' + second) : second;
    return y + '' + m + '' + d;
};

/**
 * 预算条目实体 form表单 onsave事件 
 */
function budgetFormOnSave(param) {
    //项目拟支付金额小于等于项目预算金额
    console.log('budgetFormOnSave', param);

    var fbudget_amount = param.value.fbudget_amount // 项目预算金额
    var fbndjzfje = param.value.fbndjzfje // 项目拟支付金额
    var sflag = false,
        msg = "";
    if (parseFloat(fbudget_amount) < parseFloat(fbndjzfje)) {
        msg = '拟支付金额须小于等于项目预算金额'
    } else {
        sflag = true
    }
    var dxmqsrq = param.value.dxmqsrq //项目起始日期
    var dxmjsrq = param.value.dxmjsrq //项目结束日期
    var sxmjj = param.value.sxmjj // 项目简介
    var sdescription = param.value.sdescription // 备注
    if (sflag) {
        dxmqsrq = dateyyyymmddload(dxmqsrq);
        dxmjsrq = dateyyyymmddload(dxmjsrq);
        if ('' != dxmqsrq && '' != dxmjsrq) {
            if (dxmqsrq > dxmjsrq) {
                msg = '项目起始日期不能大于项目结束日期'
                sflag = false
            }
        }
    }
    // if(sflag){
    //     if(null!=sxmjj && ''!=sxmjj){
    //         if(sxmjj.length>1000){
    //             msg = '项目简介长度不能超过1000！'
    //             sflag = false
    //         }
    //     }
    // }
    // if(sflag){
    //     if(null!=sdescription && ''!=sdescription){
    //         if(sdescription.length>=400){
    //             msg = '备注长度应小于400！'
    //             sflag = false
    //         }
    //     }
    // }
    return {
        submit: sflag,
        message: msg
    };

}

/**
 * 预算条目流程 form表单 onsave事件 
 */
function budgetFlowFormOnSave(param) {
    //项目拟支付金额小于等于项目预算金额
    var form = window.flowtabs;

    console.log('budgetFlowFormOnSave', param, window.flowtabs.dynamic.fields, window.flowtabs.dynamic.fields.fbudget_amount);

    var fbudget_amount = 0 // 项目预算金额
    var fbndjzfje = 0 // 项目拟支付金额
    var field = window.flowtabs.dynamic.fields.fbudget_amount;
    if (field) {
        fbudget_amount = field.value
    }
    field = window.flowtabs.dynamic.fields.fbndjzfje;
    if (field) {
        fbndjzfje = field.value
    }
    var sflag = false,
        msg = "";
    if (parseFloat(fbudget_amount) < parseFloat(fbndjzfje)) {
        msg = '拟支付金额须小于等于项目预算金额'
    } else {
        sflag = true
    }
    var dxmqsrq = '',
        dxmjsrq = '',
        sdescription = '',
        sxmjj = '';
    field = window.flowtabs.dynamic.fields.dxmqsrq //项目起始日期
    if (field) {
        dxmqsrq = field.value
    }
    field = window.flowtabs.dynamic.fields.dxmjsrq //项目结束日期
    if (field) {
        dxmjsrq = field.value
    }
    field = window.flowtabs.dynamic.fields.sxmjj // 项目简介
    if (field) {
        sxmjj = field.value
    }
    var field = window.flowtabs.dynamic.fields.sbz // 备注
    if (field) {
        sdescription = field.value
    }
    if (sflag) {
        dxmqsrq = dateyyyymmddload(dxmqsrq);
        dxmjsrq = dateyyyymmddload(dxmjsrq);
        if ('' != dxmqsrq && '' != dxmjsrq) {
            if (dxmqsrq > dxmjsrq) {
                msg = '项目起始日期不能大于项目结束日期'
                sflag = false
            }
        }
    }
    // if(sflag){
    //     if(null!=sxmjj && ''!=sxmjj){
    //         if(sxmjj.length>=1000){
    //             msg = '项目简介长度应小于1000！'
    //             sflag = false
    //         }
    //     }
    // }
    // if(sflag){
    //     if(null!=sdescription && ''!=sdescription){
    //         if(sdescription.length>=400){
    //             msg = '备注长度应小于400！'
    //             sflag = false
    //         }
    //     }
    // }

    return {
        submit: sflag,
        message: msg
    };

}

/**
 * 年度预算 form表单 onsave事件 
 */
function vpm_annualreq_onsave(param) {
    //验证一个部门一年度只有一条数据
    var deptName = param.value.idepartmentid_label
    var deptId = param.value.idepartmentid
    var year = param.value.syear
    var iid = param.iid
    var entityid = param.entityid


    var sflag = false,
        msg = "";
    var url = getVpproviderUrl("vpmprovider", "/annualReqController/verifyAnnualFormData");
    $.ajax({
        type: "post",
        url: url,
        data: {
            deptId: deptId,
            deptName: deptName,
            year: year,
            iid: iid,
            entityid: entityid
        },
        cache: false,
        async: false,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + vp.cookie.getToken()); //获取Token
        },
        success: function (res, textStatus, jqXHR) {
            var dd = res.data;
            if (dd.success) {
                sflag = true;
            } else {
                msg = dd.msg;
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("请求失败,请联系管理员！");
        }
    });
    return {
        submit: sflag,
        message: msg
    };

}


/**
 * 年度预算 form表单 onload事件
 */
function vpm_annualreq_onload(param) {
    var ientityid = param.entityid
    //部门 默认信息科技部
    var idepartmentid = findFieldByName(param.value.form.groups, "idepartmentid");
    //新增
    //年度 默认当前年+1
    var syear = findFieldByName(param.value.form.groups, "syear");

    var url = getVpproviderUrl("vpmprovider", "/annualReqController/getDeptInfo");
    if (ientityid == "60") {
        $.ajax({
            type: "post",
            url: url,
            data: {},
            cache: false,
            async: false,
            dataType: "json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + vp.cookie.getToken()); //获取Token
            },
            success: function (res, textStatus, jqXHR) {
                if (syear.field.widget.default_label == "" && syear.field.widget.default_value == "") {
                    idepartmentid.field.widget.default_label = res.data.sname
                    idepartmentid.field.widget.default_value = res.data.iid
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("请求失败,请联系管理员！");
            }
        });
    }
    if (syear.field.widget.default_label == "" && syear.field.widget.default_value == "") {
        var date = new Date()
        var year = date.getFullYear() + 1
        syear.field.widget.default_label = year + ""
        syear.field.widget.default_value = year + ""
    }
    return param.value;
}
/**
 * 年度预算部门经理审批保存意见
 */

function vpm_annualreq_flowonsave(param) {

    //验证一个部门一年度只有一条数据
    var iid = param.iobjectid
    var sdescription = window.flowtabs.dynamic.getFieldValue("sdescription")
    debugger
    var sflag = false,
        msg = "";
    var url = getVpproviderUrl("vpmprovider", "/dlbank/second/savedptbugetmsg");
    $.ajax({
        type: "post",
        url: url,
        data: {
            sdescription: sdescription,
            iid: iid
        },
        cache: false,
        async: false,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + vp.cookie.getToken()); //获取Token
        },
        success: function (res, textStatus, jqXHR) {
            var dd = res.data;
            if (dd.success) {
                sflag = true;
            } else {
                msg = dd.msg;
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("请求失败,请联系管理员！");
        }
    });
    return {
        submit: sflag,
        message: msg
    };

}
/**
 * 部门年度预算、年度预算进行流程审批时候，实时去计算重新计算部门年度预算、年度预算的资本项目预算金额、 资本拟支付金额和费用项目预算金额 、费用拟支付金额
 * @param {chenxl} param 
 */
function calDptBudget(param) {
    console.log('calDptBudget', param)
    //验证一个部门一年度只有一条数据
    var iid = param.iid
    var entityid = param.iobjectentityid
    var formdata = param.value
    var groupsData = formdata.form.groups;
    var url = getVpproviderUrl("vpmprovider", "/dlbank/second/updateNddptBudget");
    $.ajax({
        type: "post",
        url: url,
        data: {
            entityid: entityid,
            iid: iid
        },
        cache: false,
        async: false,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + vp.cookie.getToken()); //获取Token
        },
        success: function (res, textStatus, jqXHR) {
            var dd = res.data;
            if (dd.data) {
                var sfield = getField(groupsData, "fzbxmysje"); // 资本项目预算金额
                if (sfield) {
                    sfield.widget.default_value = dd.data.fzbxmysje
                }
                sfield = getField(groupsData, "fzbnzfje"); // 资本项目拟支付金额
                if (sfield) {
                    sfield.widget.default_value = dd.data.fzbnzfje
                }
                sfield = getField(groupsData, "ffyxmysje"); // 费用项目预算金额
                if (sfield) {
                    sfield.widget.default_value = dd.data.ffyxmysje
                }
                sfield = getField(groupsData, "ffynzfje"); // 费用项目拟支付金额
                if (sfield) {
                    sfield.widget.default_value = dd.data.ffynzfje
                }
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("请求失败,请联系管理员！");
        }
    });

    if ('168' == entityid) { // 部门年度预算，部门预算发起对部门负责人审核进行预设处理人
        url = getVpproviderUrl("vpmprovider", "/dlbank/second/getDptYsld");
        $.ajax({
            type: "post",
            url: url,
            data: {
                entityid: entityid,
                iid: iid
            },
            cache: false,
            async: false,
            dataType: "json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + vp.cookie.getToken()); //获取Token
            },
            success: function (res, textStatus, jqXHR) {
                var dd = res.data;
                if (dd) {
                    var handlers = formdata.handlers
                    if (handlers) {
                        handlers[0].ids = dd.userid
                        handlers[0].names = dd.sname
                    }
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("请求失败,请联系管理员！");
            }
        });
    }
    return param.value;
}
/**
 * 从产品需求关联的功能点进行新建时候，需要根据产品需求信息填充到功能点表单
 * @param {chenxl} param 
 */
function vrmPoint_Onload(param) {
    console.log('vrmPoint_Onload', param)
    var iid = param.iid
    var formdata = param.value
    var groupsData = formdata.form.groups;
    var sfield = getField(groupsData, "rcpxq"); // 产品需求
    var rcpxq
    if (sfield) {
        rcpxq = sfield.widget.default_value

        //3.新建功能点时选择产品需求应该为非关闭状态产品需求
        var urlparam
        //按钮弹出框增加过滤条件示例
        var sql = "select iid from cfg_entity_status ss where ss.iparentid=42 and ss.iflag=0 and ss.istatus<2"
        urlparam = "condition=" + JSON.stringify([{
            field_name: 'istatusid',
            field_value: encodeURIComponent(sql),
            expression: 'in' //支持between（日期、数字类型字段）、in、gt、egt、eq、lt、elt等数字操作符；
        }])
        sfield.urlparam = urlparam
    }
    if ((null == iid || '' == iid || '0' == iid) && (null != rcpxq && '' != rcpxq)) {
        var url = getVpproviderUrl("vpmprovider", "/productRequireRest/getProductRequireInfo"); //选择实体对应的类型
        $.ajax({
            type: "post",
            url: url,
            data: {
                "entityid": rcpxq
            },
            cache: false,
            async: false,
            dataType: "json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + vp.cookie.getToken()); //获取Token 
            },
            success: function (res, textStatus, jqXHR) {
                debugger
                if (res == undefined || res == null) {
                    return;
                }
                //硬件变更类型
                var iyjbglx = getField(groupsData, "iyjbglx");
                var inamerole = getField(groupsData, "roleid20");
                var rkfzzr = getField(groupsData, "rkfzzr");
                var rprojectid = getField(groupsData, "rprojectid");
                rprojectid.widget.default_value = res.data.rgsproj
                rprojectid.widget.default_label = res.data.rgsprojname
                iyjbglx.widget.default_value = res.data.ivalue
                iyjbglx.widget.default_label = res.data.stext
                inamerole.widget.default_value = res.data.rkffzr
                inamerole.widget.default_label = res.data.kfsname
                rkfzzr.widget.default_value = res.data.pmoid
                rkfzzr.widget.default_label = res.data.pmoname
                var filed = getField(groupsData, "ryyxt");
                if (filed) {
                    window.form.dynamic.setFields({
                        ryyxt: {
                            value: res.data.yyxtid,
                        },
                        ryyxt_label: {
                            value: res.data.yyxtname
                        }
                    })
                }
                window.textSetValue({
                    "scode": res.data.scode,
                    "sname": res.data.sname,
                    //"rgsproj": res.data.rgsproj,
                    "sdescription": res.data.sdescription,
                    "dproposetime": new Date()
                })
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("请求失败,请联系管理员！");
            }
        });
    }
    return param.value;
}

//产品需求 onload 带出
function vrmSystemreq_onload(param) {
    console.log('aaaa', param);
    var unrequires = [];
    var requires = [];
    var hidden = [];
    var formdata = param.value
    var groupsData = formdata.form.groups;
    var sfield = getField(groupsData, "iclassid");
    if (sfield) {
        var aa = []
        var default_value = sfield.widget.default_value
        var default_label = sfield.widget.default_label
        sfield = getField(groupsData, "ilx");
        if (sfield) {
            if (24 == default_value || '软件类' == default_label) {
                aa = sfield.widget.load_template.splice(0, 5)
            } else {
                aa = sfield.widget.load_template.splice(6, 2)
                requires = ['iyjbglx']
            }
            sfield.widget.load_template = aa
            console.log(aa)
        }
    }
    sfield = getField(groupsData, "rbusreq"); //2.新建产品需求时选择用户需求应该为非关闭状态用户需求
    if (sfield) {
        var urlparam
        //按钮弹出框增加过滤条件示例
        var sql = "select iid from cfg_entity_status ss where ss.iparentid=41 and ss.iflag=0 and ss.istatus<2"
        urlparam = "condition=" + JSON.stringify([{
            field_name: 'istatusid',
            field_value: encodeURIComponent(sql),
            expression: 'in' //支持between（日期、数字类型字段）、in、gt、egt、eq、lt、elt等数字操作符；
        }])
        sfield.urlparam = urlparam
    }

    var entityid = param.mainentityiid
    //区分是从页签 还是从属性页面
    var iid = param.iid
    if (iid != "" || entityid == undefined) {
        return {
            formdata: param.value,
            requires: requires,
            unrequires: unrequires,
            hidden: hidden
        };
    }
    //提出人部门
    var rtcrbm = findFieldByName(param.value.form.groups, "rtcrbm");

    //需求提出人
    var rxqtcr = findFieldByName(param.value.form.groups, "rxqtcr");
    //需求持续时间


    var url = getVpproviderUrl("vpmprovider", "/productRequireRest/getUserRequireInfo"); //选择实体对应的类型
    $.ajax({
        type: "post",
        url: url,
        data: {
            "entityid": entityid
        },
        cache: false,
        async: false,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + vp.cookie.getToken()); //获取Token 
        },
        success: function (res, textStatus, jqXHR) {
            if (null != res.data) {
                rtcrbm.field.widget.default_value = res.data.idepartmentid
                rtcrbm.field.widget.default_label = res.data.deptname
                rxqtcr.field.widget.default_value = res.data.rsupplier
                rxqtcr.field.widget.default_label = res.data.sname
                window.textSetValue({
                    "sdescription": res.data.sdescription,
                    "scode": res.data.scode,
                    "fxqcxsj": res.data.fxqcxsj,
                    "ststcyy": res.data.ssxrqsm
                })
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("请求失败,请联系管理员！");
        }
    });

    return {
        formdata: param.value,
        requires: requires,
        unrequires: unrequires,
        hidden: hidden
    };
}

/**
 * 产品需求变更流程表单更新PMO用户到实体表单命名角色PMO中
 * @param {chenxl} param 
 */
function cpReqBglcOnsave(param) {

    //验证一个部门一年度只有一条数据
    var iid = param.iobjectid
    var rnamerole = window.flowtabs.dynamic.getFieldValue("rnamerole") // pmo
    var rxqtcr = window.flowtabs.dynamic.getFieldValue("rxqtcr") // 需求提出人
    var rgsproj = window.flowtabs.dynamic.getFieldValue("rgsproj") // 归属项目
    debugger

    var sflag = false,
        msg = "";
    var url = getVpproviderUrl("vpmprovider", "/dlbank/userReqAction/vrmSystemReqBglcOnSave");
    $.ajax({
        type: "post",
        url: url,
        data: {
            rnamerole: rnamerole,
            id: iid,
            rxqtcr,
            rgsproj
        },
        cache: false,
        async: false,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + vp.cookie.getToken()); //获取Token
        },
        success: function (res, textStatus, jqXHR) {
            var dd = res.data;
            if (dd.flag) {
                sflag = true;
            } else {
                msg = dd.msg;
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("请求失败,请联系管理员！");
        }
    });
    return {
        submit: sflag,
        message: msg
    };

}
/**
 * 配置库权限申请 新建时，“申请日期”是当前日期
 * @param {chenxl} param 
 */
function appreposFormOnload(param) {
    var iid = param.iid
    if (iid != "") {
        return param.value;
    }
    window.textSetValue({
        "dsqrq": dateyyyymmddload(new Date())
    })
    return param.value;
}

function sjFormOnload(param) {
    console.log('paramparam', param);
    var iid = param.iid
    var entityid = param.entityid
    var formdata = param.value
    var groupsData = formdata.form.groups;
    var sfield = getField(groupsData, "rglgdsj"); // 产品需求
    var rcpxq
    if (sfield) {
        rcpxq = sfield.widget.default_value
    }
    var suff = '工单审计'
    if (429 == entityid) {
        suff = '项目审计'
        sfield = getField(groupsData, "rxqglxmsj");
        if (sfield) {
            rcpxq = sfield.widget.default_value
        }
    }
    if ((null == iid || '' == iid || '0' == iid) && (null != rcpxq && '' != rcpxq)) {
        var url = getVpproviderUrl("vpmprovider", "/dlbank/invest/getCpxqInfo");
        $.ajax({
            type: "post",
            url: url,
            data: {
                "iid": rcpxq,
                entityid
            },
            cache: false,
            async: false,
            dataType: "json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + vp.cookie.getToken()); //获取Token 
            },
            success: function (res, textStatus, jqXHR) {

                if (res.data.success) {
                    var data = res.data.info

                    var filed = getField(groupsData, "rbjszxt");
                    if (filed) {
                        filed.widget.default_value = data.sysid
                        filed.widget.default_label = data.sysname
                    }

                    filed = getField(groupsData, "rkfgs");
                    if (filed) {
                        filed.widget.default_value = data.rgysmc
                        filed.widget.default_label = data.gysmc
                    }
                    filed = getField(groupsData, "rbjfzr");
                    if (filed) {
                        filed.widget.default_value = data.rkffzr
                        filed.widget.default_label = data.kffzr
                    }
                    window.textSetValue({
                        "sxqbjh": data.scode,
                        "sywjs": data.ssname,
                        "dsxrqn": data.dyjsxrq,
                        "ststcyy": data.ststcyy,
                        "dtjsjrq": dateyyyymmddload(new Date()),
                    })

                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("请求失败,请联系管理员！");
            }
        });
    }
    return param.value;
}

/**
 * 工单审计-【流程】定制
 * @param {zc} param 
 */
function workorderFlowOnload(param) {
    var spjg = param.value.form.groups[0].fields[0].widget.default_value
    // if (spjg == "SYSA" && param.value.form.groups[1].group_code == "10001") {
    //     param.value.form.groups[1].group_type = 4
    // }
    var groups = param.value.form.groups;
    for (var i = 0; i < groups.length; i++) {
        if (spjg == "SYSA" && groups[i].group_code == "10001") {
            groups[i].group_type = 4;
        }
    }
    if (spjg == "SYSR" && param.value.form.groups[1].group_code == "10001") {
        param.value.form.groups[1].group_type = 1
        var fields = param.value.form.groups[1].fields;
        for (var j = 0; j < fields.length; j++) {
            if (fields[j].field_name == "sbfhxms") {
                fields[j].validator.required = true;
                fields[j].validator.message = "必填项不能为空!";
            }
            if (fields[j].field_name == "dqxscrq") {
                fields[j].validator.required = true;
                fields[j].validator.message = "必填项不能为空!";
            }
            if (fields[j].field_name == "ibfhxlx") {
                fields[j].validator.required = true;
                fields[j].validator.message = "必填项不能为空!";
            }
            if (fields[j].field_name == "sqxts") {
                fields[j].validator.required = true;
                fields[j].validator.message = "必填项不能为空!";
            }
        }
    }
    return param.value;
}

//外包人员 onsave事件 1.“身份证号”、“手机”位数验证
function vpm_people_onsave(param) {
    debugger
    var scard = window.form.dynamic.getFieldValue("scard")
    var ssj = window.form.dynamic.getFieldValue("ssj")
    var msg = "";
    var sflag = true
    if (scard != undefined && scard.length != 18) {
        sflag = false
        msg = "身份证号位数应该为18位!";
    } else if (ssj != undefined && ssj.length != 11) {
        sflag = false
        msg = "手机号位数应该为11位!";
    }
    return {
        submit: sflag,
        message: msg
    };
}

//功能点提交流程表单保存
function gndtjlc_onsave(param) {
    debugger
    var iobjectid = param.iobjectid
    var taskid = param.curtask.taskId
    var rnamerole = window.flowtabs.dynamic.getFieldValue("rnamerole") //开发负责人
    var rkfzzr = window.flowtabs.dynamic.getFieldValue("rkfzzr") // PMO
    console.log("param:" + param, rnamerole)

    var url = getVpproviderUrl("vpmprovider", "/dlbank/functionPointRest/flowFormOnSave");
    $.ajax({
        type: "post",
        url: url,
        data: {
            iobjectId: iobjectid,
            taskId: taskid,
            rnamerole,
            rkfzzr
        },
        cache: false,
        async: false,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + vp.cookie.getToken()); //获取Token
        },
        success: function (res, textStatus, jqXHR) {
            return {
                submit: true,
                message: ""
            };
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("请求失败,请联系管理员！");
        }
    });
}
//用户需求 时间校验
function vrm_businessreq_onsave(param) {
    var duatksrq = window.form.dynamic.getFieldValue("duatksrq")
    var duatwcrq = window.form.dynamic.getFieldValue("duatwcrq")
    if (duatksrq && duatwcrq) {
        if (dateyyyymmdd(duatksrq) > dateyyyymmdd(duatwcrq)) {
            return {
                'message': "完成时间不能小于开始时间"
            }
        }
    }
}

//用户需求 需求编号字段只读
function vrm_businessreq_onload(param) {
    debugger;
    var formdata = param.value
    var groupsData = formdata.form.groups;
    var scode = getField(groupsData, "scode");
    scode.readonly = true;
    scode.disabled = true;
    return formdata;

}

//功能点 时间校验
function vrm_doc_art_onsave(param) {
    var dkfksrq = window.form.dynamic.getFieldValue("dkfksrq")
    var dkfwcrq = window.form.dynamic.getFieldValue("dkfwcrq")
    if (dkfksrq && dkfwcrq) {
        if (dateyyyymmdd(dkfksrq) > dateyyyymmdd(dkfwcrq)) {
            return {
                'message': "完成时间不能小于开始时间"
            }
        }
    }

    var dsitksrq = window.form.dynamic.getFieldValue("dkfksrq")
    var dsitwcrq = window.form.dynamic.getFieldValue("dsitwcrq")
    if (dsitksrq && dsitwcrq) {
        if (dateyyyymmdd(dsitksrq) > dateyyyymmdd(dsitwcrq)) {
            return {
                'message': "SIT完成时间不能小于SIT开始时间"
            }
        }
    }
}
/**
 * 软、硬件投产计划状态变迁提交进行选择产品需求附件大小校验
 * 软件投产计划  归属中心=行方PM人员的归属部门
 * 硬件投产计划  部门=行方PM人员的归属部门
 * @param {chenxl} param 
 */
function tcFlowOnsave(param) {
    debugger;
    console.log('param', param)
    var entityid = param.entityid;
    var iid2 = param.iid;
    var rhfpm=param.value.rhfpm;
    var url2 = getVpproviderUrl("vpmprovider", "/TaskDealPerson/tcjhOnsave");
    $.ajax({
        type: "post",
        url: url2,
        data: {
            iid2,
            entityid,
            rhfpm
        },
        cache: false,
        async: false,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + vp.cookie.getToken()); //获取Token
        },
        success: function (res, textStatus, jqXHR) {},
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("请求失败,请联系管理员！");
        }
    });


    var item = param.item
    if (item && '001' == item.scode) {
        var iid = param.value.rcpxq
        var entityid = param.entityid
        var sflag = false,
            msg = "";
        var url = getVpproviderUrl("vpmprovider", "/dlbank/invest/valCpxqFile");
        $.ajax({
            type: "post",
            url: url,
            data: {
                iid,
                entityid
            },
            cache: false,
            async: false,
            dataType: "json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + vp.cookie.getToken()); //获取Token
            },
            success: function (res, textStatus, jqXHR) {
                var dd = res.data;
                if (dd.success) {
                    sflag = true;
                } else {
                    msg = dd.msg;
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("请求失败,请联系管理员！");
            }
        });
        return {
            submit: sflag,
            message: msg
        };
    } else {
        return {
            submit: true
        };
    }

}


/**
 * 从产品需求tab页新建业务单送审
 * @param {chenxl} param 
 */
function bodl_busorder_rxqglywdssOnLoad(param) {
    console.log('paramparam', param);
    //用户需求id
    var formdata = param.value
    var groupsData = formdata.form.groups;
    var sfield = getField(groupsData, "rxqglywdss"); // 产品需求
    var rxqglywdss
    if (sfield) {
        rxqglywdss = sfield.widget.default_value
    }
    var url = getVpproviderUrl("vpmprovider", "/taskRestss/bodl_Busorder_RxqglywdssOnChange");


    $.ajax({
        type: "post",
        url: url,
        data: {
            "iid": rxqglywdss,
            "entityid": 430
        },
        cache: false,
        async: false,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + vp.cookie.getToken()); //获取Token 
        },
        success: function (res, textStatus, jqXHR) {
            window.textSetValue({
                "sxqh": res.data.sxqh,
                "sywjs": res.data.sywjs,
                "dsqrq": res.data.dsqrq
            })
            var filed = getField(groupsData, "rmbxt");
            if (filed) {
                // filed.widget.default_value = res.data.rmbxt
                // filed.widget.default_label = res.data.rmbxtname
                window.form.dynamic.setFields({
                    rmbxt: {
                        value: res.data.rmbxt,
                    },
                    rmbxt_label: {
                        value: res.data.rmbxtname
                    }
                })
            }
            filed = getField(groupsData, "rhfxmjl");
            if (filed) {
                // filed.widget.default_value = res.data.iuserid
                // filed.widget.default_label = res.data.susername
                window.form.dynamic.setFields({
                    rhfxmjl: {
                        value: res.data.iuserid,
                    },
                    rhfxmjl_label: {
                        value: res.data.susername
                    }
                })
            }
            if (res.data.field_name) {
                filed = getField(groupsData, res.data.field_name);
                filed.widget.default_value = res.data.pmoid
                filed.widget.default_label = res.data.pmoname
            }
            filed = getField(groupsData, "sname");
            if (filed && ('' === filed.widget.default_value || null === filed.widget.default_value)) {
                filed.widget.default_value = 1
                filed.widget.default_label = 1
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("请求失败,请联系管理员！");
        }
    });
    return param.value;
}
/**
 * 考勤管理 考勤管理申请人员只读（当前用户），工作单位只读（当前用户关联外包人员的工作单位），项目组只读（当前用户关联外包人员的参与项目）
 * @param {chenxl} param 
 */
function leaveOnload(param) {
    console.log('paramparam', param);
    var iid = param.iid
    var entityid = param.entityid
    var formdata = param.value
    var groupsData = formdata.form.groups;
    var url = getVpproviderUrl("vpmprovider", "/dlbank/three/leaveOnloadPeopleInfo");
    $.ajax({
        type: "post",
        url: url,
        data: {

        },
        cache: false,
        async: false,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + vp.cookie.getToken()); //获取Token 
        },
        success: function (res, textStatus, jqXHR) {

            if (res.data) {
                var data = res.data
                var filed = getField(groupsData, "rsupplier"); //工作单位
                if (filed) {
                    if (null == filed.widget.default_value || '' == filed.widget.default_value) {
                        filed.widget.default_value = data.rgysry
                        filed.widget.default_label = data.dptname

                    }
                }
                filed = getField(groupsData, "rssxm");
                if (filed) {
                    if (null == filed.widget.default_value || '' == filed.widget.default_value) {
                        filed.widget.default_value = data.rblproject
                        filed.widget.default_label = data.proname

                    }
                }
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("请求失败,请联系管理员！");
        }
    });

    return param.value;
}

function bodl_virtualOnload(param) {
    console.log('paramparam', param);
    var unrequires = [];
    var requires = [];
    var hidden = [];
    var formdata = param.value
    var groupsData = formdata.form.groups;
    var filed = getField(groupsData, "iclassid"); //申请类别
    if (filed) {
        var vv = filed.widget.default_value
        if ('464' !== vv) { //台式机申请类型隐藏虚拟桌面负责人意见
            hidden = ['sxnzmfzryj']
        }
    }
    return {
        formdata: formdata,
        requires: requires,
        unrequires: unrequires,
        hidden: hidden
    };
}
/**
 * 虚拟桌面负责人意见覆盖至虚拟桌面负责人意见文本框，在台式机申请流程中外包负责人意见覆盖至外包负责人意见文本框
 * @param {chenxl} param 
 */
function xnzmsqlcFzrOnsave(param) {
    param.stype = '2'
    xnzmsqlcOnsave(param)
}
/**
 * 虚拟桌面申请流程中将外包负责人意见覆盖至外包负责人意见文本框，
虚拟桌面负责人意见覆盖至虚拟桌面负责人意见文本框，在台式机申请流程中外包负责人意见覆盖至外包负责人意见文本框
 * @param {chenxl} param 
 */
function xnzmsqlcOnsave(param) {
    console.log('paramparam', param);
    var iid = param.iobjectid
    var sdescription = window.flowtabs.dynamic.getFieldValue("sdescription")
    var stype = param.stype
    if (!stype) {
        stype = '1';
    }
    debugger
    var sflag = false,
        msg = "";
    var url = getVpproviderUrl("vpmprovider", "/dlbank/three/savemsg");
    $.ajax({
        type: "post",
        url: url,
        data: {
            sdescription: sdescription,
            iid: iid,
            stype: stype
        },
        cache: false,
        async: false,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + vp.cookie.getToken()); //获取Token
        },
        success: function (res, textStatus, jqXHR) {
            var dd = res.data;
            if (dd.success) {
                sflag = true;
            } else {
                msg = dd.msg;
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("请求失败,请联系管理员！");
        }
    });
    return {
        submit: sflag,
        message: msg
    };
}
/**
 * 测试任务 1.新增时任务处理人=当前用户
 * @param {chenxl} param 
 */
function testTaskOnload(param) {
    console.log('paramparam', param);
    var iid = param.iid
    // 新建时候初始化
    if (null == iid || "" == iid) {
        var formdata = param.value
        var groupsData = formdata.form.groups;
        var filed = getField(groupsData, "iassignto"); //处理人
        if (filed) {
            // filed.widget.default_value = vp.cookie.getTkInfo().userid
            // filed.widget.default_label = vp.cookie.getTkInfo().nickname
            window.form.dynamic.setFields({
                iassignto: {
                    value: vp.cookie.getTkInfo().userid,
                },
                iassignto_label: {
                    value: vp.cookie.getTkInfo().nickname
                }
            })
        }
        filed = getField(groupsData, "szz"); //主子
        if (filed) {
            filed.widget.default_value = '主'
            filed.widget.default_label = '主'
        }
    }

    return param.value;
}
/**
 * 任务点击“测试完成”时应校验其下所有子任务全部测试完成后才能进行测试完成操作，否则提示“该测试任务存在子任务未测试完成，请先完成子任务！”
 * @param {chenxl} param 
 */
function testTaskCswcOnsave(param) {
    console.log('paramparam', param);
    var iid = param.iid
    var item = param.item
    if (item && 't2' == item.scode) { // “测试完成”时候校验
        debugger
        var sflag = false,
            msg = "";
        var url = getVpproviderUrl("vpmprovider", "/dlbank/three/testTaskCswcVal");
        $.ajax({
            type: "post",
            url: url,
            data: {
                iid: iid,
            },
            cache: false,
            async: false,
            dataType: "json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + vp.cookie.getToken()); //获取Token
            },
            success: function (res, textStatus, jqXHR) {
                var dd = res.data;
                if (dd.success) {
                    sflag = true;
                } else {
                    msg = dd.msg;
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("请求失败,请联系管理员！");
            }
        });
        return {
            submit: sflag,
            message: msg
        };
    } else {
        return {
            submit: true
        };
    }
}


/**
 * 测试用例 1.新增时测试人员=当前用户
 * @param {chenxl} param 
 */
function testCaseOnload(param) {
    console.log('paramparam', param);
    var iid = param.iid
    // 新建时候初始化
    if (null == iid || "" == iid) {
        var formdata = param.value
        var groupsData = formdata.form.groups;
        var filed = getField(groupsData, "iassignto"); //处理人
        if (filed) {

            window.form.dynamic.setFields({
                iassignto: {
                    value: vp.cookie.getTkInfo().userid,
                },
                iassignto_label: {
                    value: vp.cookie.getTkInfo().nickname
                }
            })
        }
    }

    return param.value;
}

/**
 * 通知公告 1.新增时发布人=当前用户
 * @param {chenxl} param 
 */
function adviceOnload(param) {
    console.log('paramparam', param);
    var iid = param.iid
    // 新建时候初始化
    if (null == iid || "" == iid) {
        var formdata = param.value
        var groupsData = formdata.form.groups;
        var filed = getField(groupsData, "iassignto"); //处理人
        if (filed) {

            window.form.dynamic.setFields({
                iassignto: {
                    value: vp.cookie.getTkInfo().userid,
                },
                iassignto_label: {
                    value: vp.cookie.getTkInfo().nickname
                }
            })
        }
    }

    return param.value;
}

