function formeven(param, fun) {
  if (isExitsFunction(fun)) {
    var result = eval(fun + "(" + JSON.stringify(param) + ")");
    return result;
  } else {
    if (fun != undefined) {
      console.log("表单中'" + fun + "'方法未定义！")
    }
  }
}

function onChangeEvent(eventname, param) {
  if (isExitsFunction(eventname)) {
    var result = eval(eventname + "(" + JSON.stringify(param) + ")");
    return result;
  } else {
    if (eventname != undefined) {
      console.log("onchange中'" + eventname + "'方法未定义！")
    }
  }
}

function isExitsFunction(funcName) {
  try {
    if (typeof (eval(funcName)) == "function") {
      return true;
    }
  } catch (e) { }
  return false;
}

/**
 * 高级查询onLoad事件
 * @param entityid
 * @param groups
 * @returns
 */
function searchFormOnLoad(entityid, groups) {
  var eventname = "searchFormLoad" + entityid;
  if (isExitsFunction(eventname)) {
    var result = eval(eventname + "(" + JSON.stringify({ entityid, groups }) + ")");
    return result;
  } else {
    if (eventname != undefined) {
      console.log("onload中'" + eventname + "'方法未定义！")
    }
  }
}

/**
 * 高级查询onChange事件
 * @param entityid
 * @param groups
 * @param value
 * @param field_name
 * @param changedata
 * @returns
 */
function searchFormOnChange(entityid, groups, value, field_name, changedata) {
  var eventname = "searchFormChange" + entityid;
  if (isExitsFunction(eventname)) {
    var result = eval(eventname + "(" + JSON.stringify({ entityid, groups, value, field_name, changedata }) + ")");
    return result;
  } else {
    if (eventname != undefined) {
      console.log("onchange中'" + eventname + "'方法未定义！")
    }
  }
}

