//表单change事件js统一写在此文件内
function handleCondition(param) {
    debugger
    var formkey = window.flowtabs.props.formkey
    var groups = window.flowtabs.dynamic.props.formData.groups;
    var spjg = param.field_value.target.value;
    if (formkey == "form2gongdan" || formkey == "form2xiangmu") {
        for (var i = 0; i < groups.length; i++) {
            if (spjg == "SYSA" && groups[i].group_code == "10001") {
                groups[i].group_type = 4;
                var sbfhxms = getField(groups, "sbfhxms");
                if (sbfhxms) {
                    sbfhxms.validator = {}
                }
                var dqxscrq = getField(groups, "dqxscrq");
                if (dqxscrq) {
                    dqxscrq.validator = {}
                }
                var ibfhxlx = getField(groups, "ibfhxlx");
                if (ibfhxlx) {
                    ibfhxlx.validator = {}
                }
                var sqxts = getField(groups, "sqxts");
                if (sqxts) {
                    sqxts.validator = {}
                }

            }
            if (spjg == "SYSR" && groups[i].group_code == "10001") {
                groups[i].group_type = 1
                var fields = groups[i].fields;
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
        }
    }
}

function getVpproviderUrl(provider, path) {
    if (path.indexOf("/") == 0 || path.indexOf("\\") == 0) {
        if (window.vp.config.URL.devflag) {
            if (provider == 'vpplat') {
                return window.vp.config.URL.devMode.proxy.vppm + path;
            } else if (provider == 'vpmprovider') {
                return window.vp.config.URL.devMode.proxy.vppm + path;
            }

        }
        if (provider == 'vpplat') {
            return window.vp.gateway.handleGateWay("/" + window.vp.config.SETTING.vpplat + path);
        } else if (provider == 'vpmprovider') {
            return window.vp.gateway.handleGateWay("/" + window.vp.config.SETTING.vppm + path);
        }

    } else {
        if (window.vp.config.URL.devflag) {
            return window.vp.config.URL.devMode.proxy.vrmprovider + "/" + path;
        }
        return window.vp.gateway.handleGateWay("/" + window.vp.config.SETTING.vpvrm + "/" + path);
    }
}

function findFieldByName(groups, fieldName) {
    if (groups && groups.length) {
        for (var i = 0; i < groups.length; i++) {
            var fields = groups[i].fields;
            if (fields && fields.length) {
                for (var j = 0; j < fields.length; j++) {
                    var field = fields[j];
                    if (field.field_name == fieldName) {
                        return {
                            groupIndex: i,
                            fieldIndex: j,
                            field: field
                        };
                    }
                }
            }
        }
    }
    return null;
}
/**
 * 文档选择实体进行实体类型级联
 * @param {*} param 
 */
function setStlx(param) {
    var valueObj = param.field_value[0];
    var entityid = '';
    if (valueObj.iid != undefined) {
        entityid = valueObj.iid;
    }
    var url = getVpproviderUrl("vpplat", "/document/getEntityType"); //选择实体对应的类型
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
            var form1 = window.form.dynamic;
            var form2 = window.formlib.dynamic;
            if (null == form1 || undefined == form1) {
                form1 = form2;
            }
            if (null != form1 && undefined != form1) {
                let data = form1.props.formData.groups;
                let istlxField = findFieldByName(data, "istlx"); //选择实体类型
                // && istlxField.field.widget.load_template
                if (res && res.data && istlxField) {
                    istlxField.field.widget.load_template = res.data;
                    if (res.data.length > 0) {
                        istlxField.field.widget.default_value = res.data[0].value;
                    }
                }
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("请求失败,请联系管理员！");
        }
    });
}


function setIndexItem(param) {
    var quotalist = findFieldByName(window.form.dynamic.props.formData.groups, "slink_quotalist");
    quotalist.field.param.urlparam = '{"rquotalibrary":"' + param.field_value[0].iid + '"}';
}

function setQAItem(param) {
    var quotalist = findFieldByName(window.form.dynamic.props.formData.groups, "schecklist");
    quotalist.field.param.urlparam = '{"rquotalibrary":"' + param.field_value[0].iid + '"}';
}
/**
 * 风险中根据发生概率、影响程度计算风险等级
 * @param {*} param 
 */
function fxXxcd(param) {
    var iriskimpact = param.field_value;
    //iriskprobability
    var iriskprobability = '';
    var pField = findFieldByName(window.form.dynamic.props.formData.groups, "iriskprobability");
    if (pField) {
        iriskprobability = pField.field.widget.default_value;
    }
    //console.log('fxXxcd',window.form.dynamic.props.formData.groups);
    //console.log('fxXxcd',iriskprobability);
    var aa = getEffect(iriskprobability, iriskimpact);
    var bb = getEffectValue(aa);
    //console.log(aa);
    var ffxdjzField = findFieldByName(window.form.dynamic.props.formData.groups, "ffxdjz");
    if (ffxdjzField) {
        ffxdjzField.field.widget.default_value = aa;
    }
    var sfxdjField = findFieldByName(window.form.dynamic.props.formData.groups, "sfxdj");
    if (sfxdjField) {
        window.textSetValue({
            'sfxdj': bb
        })
    }
}
/**
 * 风险中根据发生概率、影响程度计算风险等级
 * @param {*} param 
 */
function fxFsgl(param) {
    var iriskprobability = param.field_value;
    //iriskprobability
    var iriskimpact = '';
    var pField = findFieldByName(window.form.dynamic.props.formData.groups, "iriskimpact");
    if (pField) {
        iriskimpact = pField.field.widget.default_value;
    }
    //console.log('fxXxcd',window.form.dynamic.props.formData.groups);
    //console.log('fxXxcd',iriskprobability);
    var aa = getEffect(iriskprobability, iriskimpact);
    var bb = getEffectValue(aa);
    var ffxdjzField = findFieldByName(window.form.dynamic.props.formData.groups, "ffxdjz");
    if (ffxdjzField) {
        ffxdjzField.field.widget.default_value = aa;
    }
    var sfxdjField = findFieldByName(window.form.dynamic.props.formData.groups, "sfxdj");
    if (sfxdjField) {
        window.textSetValue({
            'sfxdj': bb
        })
    }
}
// 计算风险影响
function getEffect(i, j) {
    //i，发生概率值，j，影响程度值
    var effect = new Array(6);
    effect[0] = new Array(0, 0, 0, 0, 0);
    effect[1] = new Array(1, 1, 3, 6, 10);
    effect[2] = new Array(2, 2, 5, 9, 14);
    effect[3] = new Array(4, 4, 8, 13, 17);
    effect[4] = new Array(7, 7, 12, 16, 19);
    effect[5] = new Array(11, 11, 15, 18, 20);
    // alert((i/1+1)+''+(j/1+1));
    return effect[i / 1][j / 1];
}
//判断风险等级
function getEffectValue(m) {
    var value = '低';
    if (m >= 8 && m <= 14) {
        value = '中';
    } else if (m > 14) {
        value = '高';
    }
    return value;
}

/**
 * 需求排期-选择投产窗口时，设置开发，测试，投产完成时间
 */
function reqschedule_roperate(param) {
    var iroperate = 0;
    if (param.field_value != undefined && param.field_value.length > 0) {
        iroperate = param.field_value[0].iid;
    }
    var url = getVpproviderUrl("vpplat", "/vpreq/getroperateinfo"); //获取投产窗口信息
    $.ajax({
        type: "post",
        url: url,
        data: {
            "iid": iroperate
        },
        cache: false,
        async: false,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + vp.cookie.getToken()); //获取Token 
        },
        success: function (res, textStatus, jqXHR) {
            var kssjd = window.form.dynamic.getFieldValue('dd_finishtime');
            window.form.dynamic.setFieldsValue({
                'dd_finishtime': res.data.ddfinishtime,
                'dt_finishtime': res.data.dpfinishtime,
                'do_finishtime': res.data.dcfinishtime
            })

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("请求失败,请联系管理员！");
        }
    });

}

/*
 * 缺陷流程中项目和阶段联动
 */
function changeQXLC(param) {
    var iprjid = param.field_value[0].iid;
    var rpjphase = findFieldByName(window.flowtabs.dynamic.props.formData.groups, "rpjphase");
    rpjphase.field.widget.default_value = '';
    rpjphase.field.widget.default_label = '';
    rpjphase.field.exparams = {
        condition: JSON.stringify([{
            "field_name": "rprjid",
            "field_value": iprjid || '0',
            "expression": "eq"
        }]),
        iprojectid: iprjid || '0', // 需要保留，有其它条件
    }
}

/**
 * 功能点 产品需求onchange事件
 * @author 廖李闯 20201014
 * 
 * */
function pointFormOnChange(param) {
    debugger;
    var valueObj = param.field_value[0];
    if (valueObj == undefined || valueObj == null) {
        return;
    }
    var entityid = '';
    if (valueObj.iid != undefined) {
        entityid = valueObj.iid;
    }

    var url = getVpproviderUrl("vpmprovider", "/productRequireRest/getProductRequireInfo"); //选择实体对应的类型
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
            debugger
            if (res == undefined || res == null) {
                return;
            }
            //硬件变更类型
            //   var iyjbglx = findFieldByName(window.form.dynamic.props.formData.groups, "iyjbglx");
            //   var inamerole = findFieldByName(window.form.dynamic.props.formData.groups, "roleid20");
            //   var rkfzzr = findFieldByName(window.form.dynamic.props.formData.groups, "rkfzzr");
            //   var rgsproj = findFieldByName(window.form.dynamic.props.formData.groups, "rprojectid");
            //   iyjbglx.field.widget.default_value =  res.data.ivalue
            //   iyjbglx.field.widget.default_label =  res.data.stext
            //   inamerole.field.widget.default_value =  res.data.rkffzr
            //   inamerole.field.widget.default_label =  res.data.kfsname
            //   rkfzzr.field.widget.default_value =  res.data.pmoid
            //   rkfzzr.field.widget.default_label =  res.data.pmoname
            //   rgsproj.field.widget.default_value =  res.data.rgsproj
            //   rgsproj.field.widget.default_label =  res.data.rgsprojname
            var groupsData = window.form.dynamic.props.formData.groups;
            // let str = "antzone";
            // console.log([...str]);
            // str = '2,3,4'
            // console.log('abc',[...str]);
            var filed = getField(groupsData, "iyjbglx");
            if (filed) {
                var bb = [...res.data.ivalue]
                bb.forEach(function (item, index, arr) {
                    if (item === ',') {
                        arr.splice(index, 1);
                    }
                });
                window.form.dynamic.setFields({
                    iyjbglx: {
                        value: bb,
                    },
                    iyjbglx_label: {
                        value: res.data.stext
                    }
                })
                //  filed.widget.default_value =  res.data.ivalue
                //  filed.widget.default_label =  res.data.stext
            }
            filed = getField(groupsData, "roleid20");
            if (filed) {
                window.form.dynamic.setFields({
                    roleid20: {
                        value: res.data.rkffzr,
                    },
                    roleid20_label: {
                        value: res.data.kfsname
                    }
                })
            }
            filed = getField(groupsData, "rkfzzr");
            if (filed) {
                window.form.dynamic.setFields({
                    rkfzzr: {
                        value: res.data.pmoid,
                    },
                    rkfzzr_label: {
                        value: res.data.pmoname
                    }
                })
            }
            filed = getField(groupsData, "rprojectid");
            if (filed) {
                window.form.dynamic.setFields({
                    rprojectid: {
                        value: res.data.rgsproj,
                    },
                    rprojectid_label: {
                        value: res.data.rgsprojname
                    }
                })
            }
            filed = getField(groupsData, "ryyxt");
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
            filed = getField(groupsData, "idepartmentid");
            if (filed) {
                window.form.dynamic.setFields({
                    idepartmentid: {
                        value: res.data.idepartmentid,
                    },
                    idepartmentid_label: {
                        value: res.data.deptname
                    }
                })
            }
            window.textSetValue({
                "scode": res.data.scode,
                "sname": res.data.sname,
                "sdescription": res.data.sdescription,
                "dproposetime": new Date()
            })
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("请求失败,请联系管理员！");
        }
    });


}

/**
 *预算条目表单onChange事件
 * 
 * @author 邵东红 20200916
 * @param {*}
 *            param
 */
function budgetFormOnChange(param) {
    debugger;
    var field_name = param.field_name;
    var field_value = param.field_value;
    var form = window.flowtabs;
    var formdata = null;
    var flow = null;
    if (form == undefined || form.dynamic == undefined) {
        form = window.form;
        formdata = form.dynamic.props.formData;
        flow = false;
    } else {
        formdata = form.state.formData;
        flow = true;
    }
    var groupsData = formdata.groups;
    if (field_name == 'ixmlx0') {
        var fbndjzfje = 0;
        var fbudget_amount = 0;
        var xmlxArr = field_value;
        if (xmlxArr != null && xmlxArr.length > 0) {
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
                        var tmp1 = form.dynamic.getFieldValue('fnzfje' + group_scode.replace('lx', ''));
                        if (tmp1 && parseFloat(tmp1) > 0) {
                            fbndjzfje = fbndjzfje + parseFloat(tmp1);
                        }
                        var tmp2 = form.dynamic.getFieldValue('fxmysje' + group_scode.replace('lx', ''));
                        if (tmp2 && parseFloat(tmp2) > 0) {
                            fbudget_amount = fbudget_amount + parseFloat(tmp2);
                        }
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
            formdata.groups = newGroupsData;
        }
        form.dynamic.setFieldsValue({
            'fbndjzfje': fbndjzfje + '',
            'fbudget_amount': fbudget_amount + '',
        })
    } else if (field_name.indexOf('fnzfje') == 0) { // 拟支付金额
        // 所有“类型”节下面的“拟支付金额汇总”到“预算执行”节下面的“拟支付金额”
        var oldValue = form.dynamic.getFieldValue(field_name);
        if (!(oldValue && parseFloat(oldValue) > 0)) {
            oldValue = 0;
        }
        var curValue = form.dynamic.getFieldValue("fbndjzfje");
        if (!(curValue && parseFloat(curValue) > 0)) {
            curValue = 0;
        }
        if (!(field_value && parseFloat(field_value) > 0)) {
            field_value = 0;
        }
        var fbndjzfje = curValue - oldValue + field_value;
        form.dynamic.setFieldsValue({
            'fbndjzfje': fbndjzfje + ""
        })
    } else if (field_name.indexOf('fxmysje') == 0) { // 项目预算金额
        // 所有“类型”节下面的“项目预算金额”汇总到“预算执行”节下面的“项目预算金额”
        var oldValue = form.dynamic.getFieldValue(field_name);
        if (!(oldValue && parseFloat(oldValue) > 0)) {
            oldValue = 0;
        }
        var curValue = form.dynamic.getFieldValue("fbudget_amount");
        if (!(curValue && parseFloat(curValue) > 0)) {
            curValue = 0;
        }
        if (!(field_value && parseFloat(field_value) > 0)) {
            field_value = 0;
        }
        var fbudget_amount = curValue - oldValue + field_value;
        form.dynamic.setFieldsValue({
            'fbudget_amount': fbudget_amount + ""
        })
    }
    if (flow) {
        form.state.formData = formdata;
    } else {
        form.dynamic.props.formData = formdata;
    }

    form.forceUpdate();
}

/**
 * @description 产品需求-选择 用户需求onchange事件
 * @author guoyg
 * @date 07/07/2022
 * @param {*} param
 */
function vrm_systemreq_rbusreqonchange(param) {
    var iid = window.form.props.iid;
    // //提出人部门
    // var rtcrbm = findFieldByName(window.form.dynamic.props.formData.groups, "rtcrbm");

    // //需求提出人
    // var rxqtcr = findFieldByName(window.form.dynamic.props.formData.groups, "rxqtcr");
    //需求持续时间
    var valueObj = param.field_value[0];
    var entityid = '';
    if (valueObj.iid != undefined) {
        entityid = valueObj.iid;
    }
    var url = getVpproviderUrl("vpmprovider", "/productRequireRest/getUserRequireInfo"); //选择实体对应的类型
    $.ajax({
        type: "post",
        url: url,
        data: {
            "entityid": entityid,
            "iid": iid
        },
        cache: false,
        async: false,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + vp.cookie.getToken()); //获取Token 
        },
        success: function (res, textStatus, jqXHR) {
            debugger
            var groupsData = window.form.dynamic.props.formData.groups;
            //提出人部门
            var filed = getField(groupsData, "rtcrbm");
            if (filed) {
                window.form.dynamic.setFields({
                    rtcrbm: {
                        value: res.data.idepartmentid,
                    },
                    rtcrbm_label: {
                        value: res.data.deptname
                    }
                })
            }
            //需求提出人
            filed = getField(groupsData, "rxqtcr");
            if (filed) {
                window.form.dynamic.setFields({
                    rxqtcr: {
                        value: res.data.rsupplier,
                    },
                    rxqtcr_label: {
                        value: res.data.sname
                    }
                })
            }
            // rtcrbm.field.widget.default_value =  res.data.idepartmentid
            // rtcrbm.field.widget.default_label =  res.data.deptname
            // rxqtcr.field.widget.default_value = res.data.rsupplier
            // rxqtcr.field.widget.default_label = res.data.sname
            window.textSetValue({
                "sdescription": res.data.sdescription,
                "fxqcxsj": res.data.fxqcxsj,
                "ststcyy": res.data.ssxrqsm
            })
            if (res.data.scode != undefined) {
                window.textSetValue({
                    "scode": res.data.scode
                })
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("请求失败,请联系管理员！");
        }
    });
}

/**
 * @description 产品需求 当“实际状态”为“第三方依赖、排队中、其他、主管部门要求暂停”时，异常原因该字段为必填项
 * @author guoyg
 * @date 07/07/2022
 * @param {*} param
 * @returns {*} 
 */
function vrm_systemreq_isjztonchange(param) {
    var requires = [];
    var unrequires = [];
    var hidden = [];
    var value = param.field_value
    if (value == "6" || value == "7" || value == "8" || value == "9") {
        requires.push("sycyy") //必填
    } else {
        unrequires.push("sycyy")
        var groupsData = window.form.dynamic.props.formData.groups;
        var filed = getField(groupsData, "sycyy");
        if (filed) {
            filed.blurdata = {}
        }
    }

    return {
        reloadform: true,
        hidden: hidden,
        unrequires: unrequires,
        requires: requires
    }
}


/**
 * @description 测试任务 选择用户需求 
 * @author guoyg
 * @date 07/07/2022
 * @param {*} param
 */
function vpm_testtask_userrequire_onChange(param) {
    //用户需求id
    var valueObj = param.field_value[0];
    var userRequireId = valueObj.iid
    var url = getVpproviderUrl("vpmprovider", "/testManageRest/getUserRequireInfo");
    $.ajax({
        type: "post",
        url: url,
        data: {
            "iid": userRequireId
        },
        cache: false,
        async: false,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + vp.cookie.getToken()); //获取Token 
        },
        success: function (res, textStatus, jqXHR) {
            window.textSetValue({
                "dforecaststartdate": res.data.duatksrq,
                "dforecastenddate": res.data.duatwcrq,
                "djhsxsj": res.data.dexponlinedate,
                "sname": res.data.sname
            })
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("请求失败,请联系管理员！");
        }
    });
}
/**
 * 硬件投产计划选择产品需求 onchange事件
 * @param {chenxl} param 
 */
function investFormOnChangeYj(param) {
    param.entityid = 110;
    investFormOnChange(param)
}
/**
 * 软件投产计划选择产品需求 onchange事件
 * @param {chenxl} param 
 */
function investFormOnChange(param) {
    console.log('param', param);
    var valueObj = param.field_value[0];
    if (valueObj == undefined || valueObj == null) {
        return;
    }
    var iid = '',
        entityid = 115;
    if (valueObj.iid != undefined) {
        iid = valueObj.iid;
    }
    if (param.entityid) {
        entityid = param.entityid
    }

    var url = getVpproviderUrl("vpmprovider", "/dlbank/invest/getCpxqInfo");
    $.ajax({
        type: "post",
        url: url,
        data: {
            "iid": iid,
            entityid
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
            var groupsData = window.form.dynamic.props.formData.groups;
            if (res.data.success) {
                var data = res.data.info
                var filed = getField(groupsData, "igdlx");
                if (filed && 110 !== entityid) { // 硬件投产计划工单类型不取产品需求的对应值
                    // filed.widget.default_value = data.ilx
                    // filed.widget.default_label = data.lxname
                    window.form.dynamic.setFields({
                        igdlx: {
                            value: data.ilx,
                        },
                        igdlx_label: {
                            value: data.lxname
                        }
                    })
                }
                filed = getField(groupsData, "sname");
                if (filed) {
                    // filed.widget.default_value = data.sname
                    // filed.widget.default_label = data.sname
                    window.form.dynamic.setFields({
                        sname: {
                            value: data.sname,
                        },
                        sname_label: {
                            value: data.sname
                        }
                    })
                }
                filed = getField(groupsData, "rsystem");
                if (filed) {
                    // filed.widget.default_value = data.sysid
                    // filed.widget.default_label = data.sysname
                    window.form.dynamic.setFields({
                        rsystem: {
                            value: data.sysid,
                        },
                        rsystem_label: {
                            value: data.sysname
                        }
                    })
                }

                filed = getField(groupsData, "igdzt");
                if (filed) {
                    // filed.widget.default_value = data.isjzt
                    // filed.widget.default_label = data.sjztname
                    window.form.dynamic.setFields({
                        igdzt: {
                            value: data.isjzt,
                        },
                        igdzt_label: {
                            value: data.sjztname
                        }
                    })
                }
                filed = getField(groupsData, "rhfpm");
                if (filed) {
                    // filed.widget.default_value = data.hfpmid
                    // filed.widget.default_label = data.hfpmname
                    window.form.dynamic.setFields({
                        rhfpm: {
                            value: data.hfpmid,
                        },
                        rhfpm_label: {
                            value: data.hfpmname
                        }
                    })
                }
                filed = getField(groupsData, "idepartmentid");
                if (filed) {
                    // filed.widget.default_value = data.hfpmid
                    // filed.widget.default_label = data.hfpmname
                    window.form.dynamic.setFields({
                        idepartmentid: {
                            value: data.ideptid,
                        },
                        idepartmentid_label: {
                            value: data.ideptname
                        }
                    })
                }
                //rywtcdw
                filed = getField(groupsData, "rywtcdw"); // 业务提出单位
                if (filed) {
                    window.form.dynamic.setFields({
                        rywtcdw: {
                            value: data.rtcrbm,
                        },
                        rywtcdw_label: {
                            value: data.dptname
                        }
                    })
                }

                if (data.field_name) {
                    filed = getField(groupsData, data.field_name);
                    filed.widget.default_value = data.pmoid
                    filed.widget.default_label = data.pmoname
                }
                filed = getField(groupsData, "rywlxr"); // 软件投产计划的‘业务联系人’
                if (filed) {
                    // filed.widget.default_value = data.rxqtcr
                    // filed.widget.default_label = data.xqtcrname
                    window.form.dynamic.setFields({
                        rywlxr: {
                            value: data.rxqtcr,
                        },
                        rywlxr_label: {
                            value: data.xqtcrname
                        }
                    })
                }

                filed = getField(groupsData, "rywyzry"); // 硬件投产计划的‘业务验证人员’
                if (filed) {
                    window.form.dynamic.setFields({
                        rywyzry: {
                            value: data.rxqtcr,
                        },
                        rywyzry_label: {
                            value: data.xqtcrname
                        }
                    })
                }
                filed = getField(groupsData, "iyjbglx");
                if (filed) {
                    // filed.widget.default_value = data.iyjbglx
                    // filed.widget.default_label = data.yjbglxname
                    var bb = [...data.iyjbglx]
                    bb.forEach(function (item, index, arr) {
                        if (item === ',') {
                            arr.splice(index, 1);
                        }
                    });
                    window.form.dynamic.setFields({
                        iyjbglx: {
                            value: bb,
                        },
                        iyjbglx_label: {
                            value: data.yjbglxname
                        }
                    })
                }

                window.textSetValue({
                    "sgdh": data.scode,
                    "sdescription": data.sdescription,
                    "sycyysm": data.sycyy,
                    "ststcyy": data.ststcyy,
                    "sgdnrjs": data.sdescription
                })
                //dywtcsj
                filed = getField(groupsData, "dywtcsj"); //业务提出时间
                if (filed) {
                    window.textSetValue({
                        "dywtcsj": data.dcreatordate
                    })
                }
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("请求失败,请联系管理员！");
        }
    });
}
/**
 * 配置库权限申请选择变更目标系统时，名称”自动默认“变更目标系统”+“配置库权限申请”+当前日期（yyyy-MM-dd）
 * @param {chenxl} param 
 */
function appreposFormOnchange(param) {
    debugger;
    console.log('param', param);
    var valueObj = param.field_value[0];
    if (valueObj == undefined || valueObj == null) {
        return;
    }
    var sname = valueObj.sname + '_配置库权限申请' + dateyyyymmdd(new Date())
    window.textSetValue({
        "sname": sname
    })

}
/**
 * 工单、项目审计选择产品需求onchange事件
 * @param {chenxl} param 
 */
function sjCpxqOnchange(param) {

    console.log('param', param);
    var valueObj = param.field_value[0];
    if (valueObj == undefined || valueObj == null) {
        return;
    }
    var iid = '',
        sname = '',
        entityid = 428;
    if (valueObj.iid != undefined) {
        iid = valueObj.iid;
        sname = valueObj.sname;
    }

    if ('rxqglxmsj' == param.field_name) {
        entityid = 429
    }
    var url = getVpproviderUrl("vpmprovider", "/dlbank/invest/getCpxqInfo");
    $.ajax({
        type: "post",
        url: url,
        data: {
            "iid": iid,
            entityid
        },
        cache: false,
        async: false,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + vp.cookie.getToken()); //获取Token 
        },
        success: function (res, textStatus, jqXHR) {

            if (res == undefined || res == null) {
                return;
            }
            var groupsData = window.form.dynamic.props.formData.groups;
            if (res.data.success) {
                var data = res.data.info

                var filed = getField(groupsData, "rbjszxt");
                if (filed) {
                    // filed.widget.default_value = data.sysid
                    // filed.widget.default_label = data.sysname
                    window.form.dynamic.setFields({
                        rbjszxt: {
                            value: data.sysid,
                        },
                        rbjszxt_label: {
                            value: data.sysname,
                        }
                    })
                }
                if (data.field_name) {
                    filed = getField(groupsData, data.field_name);
                    filed.widget.default_value = data.pmoid
                    filed.widget.default_label = data.pmoname
                }
                filed = getField(groupsData, "rkfgs");
                if (filed) {
                    // filed.widget.default_value = data.rgysmc
                    // filed.widget.default_label = data.gysmc
                    window.form.dynamic.setFields({
                        rkfgs: {
                            value: data.rgysmc,
                        },
                        rkfgs_label: {
                            value: data.gysmc,
                        }
                    })
                }
                filed = getField(groupsData, "rbjfzr");
                if (filed) {
                    //filed.widget.default_value = data.rkffzr
                    //filed.widget.default_label = data.kffzr
                    window.form.dynamic.setFields({
                        rbjfzr: {
                            value: data.rkffzr,
                        },
                        rbjfzr_label: {
                            value: data.kffzr,
                        }
                    })
                }
                var v, isjzt_value = '',
                    ientityid = 428,
                    suff = '工单审计'
                filed = getField(groupsData, "isjjd"); //审计阶段
                debugger
                if (window.form.dynamic.fields.isjjd) {
                    isjzt_value = window.form.dynamic.fields.isjjd.value
                } else {
                    if (filed) {
                        isjzt_value = filed.widget.default_label
                    }
                }

                if (filed) {
                    ientityid = filed.ientityid
                    if (429 == ientityid) {
                        suff = '项目审计'
                    }
                    var arr = filed.widget.load_template
                    v = arr.find((value, index) => {
                        console.log(value, index);
                        if (isjzt_value == value.value) {
                            return value
                        }

                    })
                    console.log('vvv', v)
                }
                filed = getField(groupsData, "sname");
                if (v) {
                    sname = sname + '_' + v.label + '_' + suff
                }
                if (filed) {
                    filed.widget.default_value = sname
                    filed.widget.default_label = sname
                }

                window.textSetValue({
                    "sxqbjh": data.scode,
                    "sywjs": data.ssname,
                    "dsxrqn": data.dyjsxrq,
                    "ststcyy": data.ststcyy,
                    "dtjsjrq": dateyyyymmddload(new Date()),
                    "sname": sname
                })

            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("请求失败,请联系管理员！");
        }
    });
    var form = window.form;
    form.forceUpdate();
}

/**
 * 审计，选择审计阶段进行sname取值
 * @param {chenxl} param 
 */
function sjjdOnchange(param) {
    console.log('param111', param);
    var field_value = param.field_value
    var groupsData = window.form.dynamic.props.formData.groups;
    var v, sname = '',
        rglgdsj_label = '',
        ientityid = 428,
        suff = '工单审计'
    var filed = getField(groupsData, "isjjd");
    console.log('param111', filed, groupsData, window.form.dynamic);
    if (filed) {
        ientityid = filed.ientityid
        if (429 == ientityid) {
            suff = '项目审计'
        }
    }
    if (428 == ientityid && window.form.dynamic.fields.rglgdsj_label) {
        rglgdsj_label = window.form.dynamic.fields.rglgdsj_label.value
    } else if (429 == ientityid && window.form.dynamic.fields.rxqglxmsj_label) {
        rglgdsj_label = window.form.dynamic.fields.rxqglxmsj_label.value
    } else {
        var ff = getField(groupsData, "rglgdsj");
        if (ff) {
            rglgdsj_label = ff.widget.default_label
        }
        ff = getField(groupsData, "rxqglxmsj");
        if (ff) {
            rglgdsj_label = ff.widget.default_label
        }
    }
    if (filed) {
        var arr = filed.widget.load_template
        v = arr.find((value, index) => {
            console.log(value, index);
            if (field_value == value.value) {
                return value
            }

        })
        console.log('vvv', v)
    }
    filed = getField(groupsData, "sname");
    if (v) {
        sname = rglgdsj_label + '_' + v.label + '_' + suff
    }
    if (filed) {
        filed.widget.default_value = sname
        filed.widget.default_label = sname
    }
    window.textSetValue({
        "sname": sname
    })
    var form = window.form;
    form.forceUpdate();
}


//业务单送审 选择产品需求 自动带出值
function bodl_busorder_rxqglywdssOnChange(param) {
    //用户需求id
    var valueObj = param.field_value[0];
    var productId = valueObj.iid
    var url = getVpproviderUrl("vpmprovider", "/taskRestss/bodl_Busorder_RxqglywdssOnChange");
    var groupsData = window.form.dynamic.props.formData.groups;


    $.ajax({
        type: "post",
        url: url,
        data: {
            "iid": productId,
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

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("请求失败,请联系管理员！");
        }
    });

    var form = window.form;
    form.forceUpdate();
}
//测试任务  设置预测日期
function setforecastdate(param) {
    var groupsData = window.form.dynamic.props.formData.groups;
    var field_name = param.field_name;
    var field_value = param.field_value;
    var dforecastenddate = getField(groupsData, "dforecaststartdate");
    if ("duatksrq" == field_name && dforecastenddate) {
        dforecastenddate.widget.default_value = dateyyyymmddload(field_value);
        dforecastenddate.widget.default_label = dateyyyymmddload(field_value);
    }
    var dforecastenddate = getField(groupsData, "dforecastenddate");
    if ("duatwcrq" == field_name && dforecastenddate) {
        dforecastenddate.widget.default_value = dateyyyymmddload(field_value);
        dforecastenddate.widget.default_label = dateyyyymmddload(field_value);
    }
    var form = window.form;
    form.forceUpdate();
}

/**
 * 测试用例表单页面测试任务onchange事件
 * @param {chenxl} param 
 */
function caseTestTaskOnchange(param) {
    debugger;
    //测试任务id
    var valueObj = param.field_value[0];
    var mainentityiid = valueObj.iid
    var formdata = param.value
    var url = getVpproviderUrl("vpmprovider", "/testManageRest/getTestTaskInfo");
    $.ajax({
        type: "post",
        url: url,
        data: {
            mainentityiid: mainentityiid
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
}
/**
 * 责任部门=归属项目中技术经理的归属部门,
 * 项目=空，那么还是原来的部门
 * 任务 归属中心=归属项目中技术经理的归属部门
 * 硬件投产计划 部门=行方PM人员的归属部门
 * 软件投产计划 归属中心=行方PM人员的归属部门
 * xgy
 */
function systemOnchange (param) {
    // debugger;
    console.log(window.form.state, param);
    var iid = ''; //项目id
    var id = ''; //实例id
    var pmid='';
    var entityid=window.form.state.entityid;
    if (param.field_value.length > 0) {
        var valueObj = param.field_value[0];
        var iid = valueObj.iid;
        pmid=param.field_value[0].iid;
    } else {
        id = window.form.dynamic.props.params.iid;
    }
    var tcjhid=window.form.dynamic.props.params.iid
    var url = getVpproviderUrl("vpmprovider", "/TaskDealPerson/systemOnchange");
    $.ajax({
        type: "post",
        url: url,
        data: {
            id: id,
            iid: iid,
            entityid,
            pmid,
            tcjhid
        },
        cache: false,
        async: false,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + vp.cookie.getToken()); //获取Token
        },
        success: function (res, textStatus, jqXHR) {
            console.log("window.form.dynamic.props:", window.form.dynamic.props);
            var departmentid = res.data.departmentid;
            var departmentname = res.data.departmentname;
            var groupsData = findFieldByName(window.form.dynamic.props.formData.groups, 'idepartmentid')
            console.log("groupsData:", groupsData);

            groupsData.field.widget.default_value = departmentid;
            groupsData.field.widget.default_label = departmentname;
            var form = window.form;
            form.forceUpdate();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            // alert("请求失败,请联系管理员！");
        }
    });

}

/**
 * 功能点页面生产系统字段onchange事件
 * xgy
 */
function systemOnchange2(param) {
    debugger;
    console.log(param);
    var valueObj = param.field_value[0];
    var iid = valueObj.iid;
    var url = getVpproviderUrl("vpmprovider", "/TaskDealPerson/systemOnchange");
    $.ajax({
        type: "post",
        url: url,
        data: {
            iid: iid
        },
        cache: false,
        async: false,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + vp.cookie.getToken()); //获取Token
        },
        success: function (res, textStatus, jqXHR) {
            console.log("res:", res);
            console.log("window.form.dynamic.props:", window.form.dynamic.props);
            var departmentid = res.data.departmentid;
            var departmentname = res.data.departmentname;
            var groupsData = window.form.dynamic.props.formData.groups[1].fields[6];
            if ("idepartmentid" == groupsData.field_name) {
                groupsData.widget.default_value = departmentid;
                groupsData.widget.default_label = departmentname;
            }
            var form = window.form;
            form.forceUpdate();

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            // alert("请求失败,请联系管理员！");
        }
    });
}

/**
 * 产品需求，负责部门字段取值条件：归属项目非空时其项目的技术经理所在部门
 * 功能点，部门字段取值条件：归属项目非空时其项目的技术经理所在部门
 * 任务，归属字段取值条件：归属项目非空时其项目的技术经理所在部门
 * 软件投产计划，归属中心字段取值条件：行方PM人员的归属部门
 * 硬件投产计划，部门字段取值条件：行方PM人员的归属部门
 * @param {*} param 
 */
function getDeptForParamOnChange(param) {
    var ientityid = window.form.state.entityid;
    var iid = param.field_value[0].iid;
    var url = getVpproviderUrl("vpmprovider", "/dlbank/event/getDeptForParam");
    $.ajax({
        type: "post",
        url: url,
        data: {
            ientityid: ientityid,
            iid: iid
        },
        cache: false,
        async: false,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + vp.cookie.getToken()); //获取Token
        },
        success: function (res, textStatus, jqXHR) {
            // var idepartmentid = findFieldByName(window.form.dynamic.props.formData.groups, "idepartmentid");
            // idepartmentid.field.widget.default_value =  res.data.ideptid
            // idepartmentid.field.widget.default_label =  res.data.ideptname
            window.form.dynamic.setFields({
                idepartmentid: {
                    value: res.data.ideptid,
                },
                idepartmentid_label: {
                    value: res.data.ideptname
                }
            })
            var form = window.form;
            form.forceUpdate();

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            // alert("请求失败,请联系管理员！");
        }
    });
}