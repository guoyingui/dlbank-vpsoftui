//格式化数字显示方式，也可以用于对数字重定精度。
function formatNumber(number,pattern){
    var str= number.toString();
    if(!isFloat(str)){
       return str;
    }
    var strInt;
    var strFloat;
    var formatInt;
    var formatFloat;
    if(/\./g.test(pattern)){
        formatInt= pattern.split('.')[0];
        formatFloat= pattern.split('.')[1];
    }else{
        formatInt= pattern;
        formatFloat= null;
    }

    if(/\./g.test(str)){
        if(formatFloat!=null){
            var tempFloat= Math.round(parseFloat('0.'+str.split('.')[1])*Math.pow(10,formatFloat.length))/Math.pow(10,formatFloat.length);
            strInt= (Math.floor(number)+Math.floor(tempFloat)).toString();
            strFloat= /\./g.test(tempFloat.toString())?tempFloat.toString().split('.')[1]:'0';
        }else{
            strInt= Math.round(number).toString();
            strFloat= '0';
        }
    }else{
        strInt= str;
        strFloat= '0';
    }
    if(formatInt!=null){
        var outputInt= '';
        var zero= formatInt.match(/0*$/)[0].length;
        var comma= null;
        if(/,/g.test(formatInt)){
            comma= formatInt.match(/,[^,]*/)[0].length-1;
        }
        var newReg= new RegExp('(\\d{'+comma+'})','g');

        if(strInt.length<zero){
            outputInt= new Array(zero+1).join('0')+strInt;
            outputInt= outputInt.substr(outputInt.length-zero,zero)
        }else{
            outputInt= strInt;
        }

        var
        outputInt= outputInt.substr(0,outputInt.length%comma)+outputInt.substring(outputInt.length%comma).replace(newReg,(comma!=null?',':'')+'$1')
        outputInt= outputInt.replace(/^,/,'');

        strInt= outputInt;
    }

    if(formatFloat!=null){
        var outputFloat= '';
        var zero= formatFloat.match(/^0*/)[0].length;

        if(strFloat.length<zero){
            outputFloat= strFloat+new Array(zero+1).join('0');
            //outputFloat= outputFloat.substring(0,formatFloat.length);
            var outputFloat1= outputFloat.substring(0,zero);
            var outputFloat2= outputFloat.substring(zero,formatFloat.length);
            outputFloat= outputFloat1+outputFloat2.replace(/0*$/,'');
        }else{
            outputFloat= strFloat.substring(0,formatFloat.length);
        }

        strFloat= outputFloat;
    }else{
        if(pattern!='' || (pattern=='' && strFloat=='0')){
            strFloat= '';
        }
    }

    return strInt+(strFloat==''?'':'.'+strFloat);
}
//替换字符串
function replaceAll(str,regex,replacement){
   while(str.indexOf(regex)!=-1){
      str=str.replace(regex,replacement);
   }
   return str;
}
//验证是否是浮点数
function isFloat(str){
 if(str.match("\^[-]?[0-9]+([.][0-9]*)?\$")){
        return true;
 }else{
        return false;
 }
}
/*
测试
alert(formatNumber(0,''));
alert(formatNumber(12432.21,'#,###'));
alert(formatNumber(12432.21,'#,###.000#'));
alert(formatNumber(12432,'#,###.00'));
alert(formatNumber('12432.415','#,###.0#'));
*/
