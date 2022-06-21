import { vpFormatDate } from 'vpreact';

export function anyToSting(obj, arrayKeys = [], format = 'YYYY-MM-DD HH:mm:ss') {
    let newobj = {};

    for (let key in obj) {
        if (typeof obj[key] === 'number') {
            if (obj[key].toString().length !== 13) {
                newobj[key] = obj[key].toString();
            } else {
                newobj[key] = vpFormatDate(obj[key], format);
            }
        } else if (obj[key] instanceof Array) {
            newobj[key] = obj[key].map(item => item.toString()).join(',')
        } else {
            newobj[key] = obj[key];
        }
    }
    arrayKeys.map(item => {
        newobj[item] = newobj[item].split(',');
    })
    return newobj
}
export function calculateTimeDiff(begindate,entdate){
    var begindate =vpFormatDate(begindate,'YYYY-MM-DD')
    var begindate = new Date(begindate); 
    //  var begindate = new Date(Date.parse(begindate.replace(/-/g, "/"))); 
    var startDate = begindate.getTime();
    // var entdate = new Date(Date.parse(entdate.replace(/-/g, "/")));
    var entdate =vpFormatDate(entdate,'YYYY-MM-DD')
    var entdate = new Date(entdate); 
    var endDate = entdate.getTime(); //将结束日期转换成毫秒  
    return parseInt((endDate-startDate));
}
