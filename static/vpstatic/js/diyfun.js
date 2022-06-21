/*
* 全局自定义事件方法
* author jiangsw
* date 2018-08-02
*/ 
// 获取样式currentStyle getComputedStyle兼容处理
function getStyle(obj, attr) {
    if(obj.currentStyle) {
        return obj.currentStyle[attr];
    } else {
        return getComputedStyle(obj, false)[attr];
    }
}

function getPagePath() {
	return vp.gateway.handleGateWay('{vpui}') + "/vpweb";
}
function getFlowPagePath() {
	return vp.gateway.handleGateWay('{vpui}') + "/vpflow";
}

function loadjs(id, url) {
    var xmlHttp = null;
    if (window.ActiveXObject) { //IE  
        try {
            //IE6以及以后版本中可以使用  
            xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            //IE5.5以及以后版本可以使用  
            xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
    } else if (window.XMLHttpRequest) {
        //Firefox，Opera 8.0+，Safari，Chrome  
        xmlHttp = new XMLHttpRequest();
    }
    //采用同步加载  
    xmlHttp.open("GET", url, false);
    //发送同步请求，如果浏览器为Chrome或Opera，必须发布后才能运行，不然会报错  
    xmlHttp.send(null);
    //4代表数据发送完毕  
    if (xmlHttp.readyState == 4) {
        //0为访问的本地，200到300代表访问服务器成功，304代表没做修改访问的是缓存  
        if ((xmlHttp.status >= 200 && xmlHttp.status < 300) || xmlHttp.status == 0 || xmlHttp.status == 304) {
            var myBody = document.getElementsByTagName("body")[0];
            var myScript = document.createElement("script");
                myScript.language = "javascript";
                myScript.type = "text/javascript";
                myScript.id = id;
            try {
                //IE8以及以下不支持这种方式，需要通过text属性来设置  
                myScript.appendChild(document.createTextNode(xmlHttp.responseText));
            } catch (ex) {
                myScript.text = xmlHttp.responseText;
            }
            myBody.appendChild(myScript);
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

/*
 * @function 动态加载css文件
 * @param {string} options.url -- css资源路径
 * @param {function} options.callback -- 加载后回调函数
 * @param {string} options.id -- link标签id
 */
function loadCss(options) {
    var url = options.url,
        callback = typeof options.callback == "function" ? options.callback : function () {},
        id = options.id,
        node = document.createElement("link"),
        supportOnload = "onload" in node,
        isOldWebKit = +navigator.userAgent.replace(/.*(?:AppleWebKit|AndroidWebKit)\/?(\d+).*/i, "$1") < 536, // webkit旧内核做特殊处理
        protectNum = 300000; // 阈值10分钟，一秒钟执行pollCss 500次

    node.rel = "stylesheet";
    node.type = "text/css";
    node.href = url;
    if (typeof id !== "undefined") {
        node.id = id;
    }
    document.getElementsByTagName("head")[0].appendChild(node);

    // for Old WebKit and Old Firefox
    if (isOldWebKit || !supportOnload) {
        // Begin after node insertion
        setTimeout(function () {
            pollCss(node, callback, 0);
        }, 1);
        return;
    }

    if (supportOnload) {
        node.onload = onload;
        node.onerror = function () {
            // 加载失败(404)
            onload();
        }
    } else {
        node.onreadystatechange = function () {
            if (/loaded|complete/.test(node.readyState)) {
                onload();
            }
        }
    }

    function onload() {
        // 确保只跑一次下载操作
        node.onload = node.onerror = node.onreadystatechange = null;

        // 清空node引用，在低版本IE，不清除会造成内存泄露
        node = null;

        callback();
    }

    // 循环判断css是否已加载成功
    /*
     * @param node -- link节点
     * @param callback -- 回调函数
     * @param step -- 计步器，避免无限循环
     */
    function pollCss(node, callback, step) {
        var sheet = node.sheet,
            isLoaded;

        step += 1;

        // 保护，大于10分钟，则不再轮询
        if (step > protectNum) {
            isLoaded = true;

            // 清空node引用
            node = null;

            callback();
            return;
        }

        if (isOldWebKit) {
            // for WebKit < 536
            if (sheet) {
                isLoaded = true;
            }
        } else if (sheet) {
            // for Firefox < 9.0
            try {
                if (sheet.cssRules) {
                    isLoaded = true;
                }
            } catch (ex) {
                // 火狐特殊版本，通过特定值获知是否下载成功
                // The value of `ex.name` is changed from "NS_ERROR_DOM_SECURITY_ERR"
                // to "SecurityError" since Firefox 13.0. But Firefox is less than 9.0
                // in here, So it is ok to just rely on "NS_ERROR_DOM_SECURITY_ERR"
                if (ex.name === "NS_ERROR_DOM_SECURITY_ERR") {
                    isLoaded = true;
                }
            }
        }

        setTimeout(function () {
            if (isLoaded) {
                // 延迟20ms是为了给下载的样式留够渲染的时间
                callback();
            } else {
                pollCss(node, callback, step);
            }
        }, 20);
    }
}

function initscript() {
    var weblist = window.vp.config.weblist;
    for (var i = 0; i < weblist.length; i++) {
        var jsonurl = "../" + weblist[i] + "/json.js";
        loadjs(weblist[i], jsonurl);
        var fnName = weblist[i] + 'js'
        if (typeof window[fnName] !== 'function') return
        var urlobj = window[fnName]();
        var jslist = urlobj["js"];
        var csslist = urlobj["css"];
        for (var j = 0; j < jslist.length; j++) {
            loadjs(weblist[i] + "js" + j, jslist[j]);
        };
        for (var k = 0; k < csslist.length; k++) {
            var options = {};
            options.url = csslist[k];
            loadCss(options);
        };
    };
}


//打印页面
function FormPrint() {
    // console.log(window)
    $('.layout-sider.full-height.fl').hide()
    $('.main-container.full-height').addClass('marginLeft0')
    $('.drawer-box.drawer-show.max').addClass('left0')
    $('.drawer-box.drawer-show.max').addClass('top0')
    $('.drawer-box-head.b-b.m-b-sm').hide()
    $('.footFixed.p-sm.b-t.text-center').hide()
    window.print();
    $('.layout-sider.full-height.fl').show()
    $('.main-container.full-height').removeClass('marginLeft0')
    $('.drawer-box.drawer-show.max').removeClass('left0')
    $('.drawer-box.drawer-show.max').removeClass('top0')
    $('.drawer-box-head.b-b.m-b-sm').show()
    $('.footFixed.p-sm.b-t.text-center').show()
}

//在列表中有合并单元格的使单元格内容能显示完整
function computecolspan(){
    var tdArr = document.getElementsByTagName('td');
        for (var i=0;i<tdArr.length;i++) {
            if(tdArr[i].getAttribute('colspan')>1){
                tdArr[i].children('.cell-w').style.width = '100% !important'
            }
        }
}
// 判断当前浏览器内核  // 使用方法 var mb = myBrowser(); if ("Chrome" == mb) { alert("我是 Chrome");}
function myBrowser(){
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isOpera = userAgent.indexOf("Opera") > -1;
    if (isOpera) {
        return "Opera"
    }; //判断是否Opera浏览器
    if (userAgent.indexOf("Firefox") > -1) {
        return "FF";
    } //判断是否Firefox浏览器
    if (userAgent.indexOf("Chrome") > -1){
        return "Chrome";
    }
    if (userAgent.indexOf("Safari") > -1) {
        return "Safari";
    } //判断是否Safari浏览器
    if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
        return "IE";
    }; //判断是否IE浏览器
}
function smoney(s, n) {  //s:传入的float数字 ，n:返回小数点后几位
    if (s == undefined) {
        s = "0";
    }
	n = n > 0 && n <= 20 ? n : 2; 
	s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + ""; 
	var l = s.split(".")[0].split("").reverse(), 
	r = s.split(".")[1]; 
	t = ""; 
	for(i = 0; i < l.length; i ++ ) 
	{ 
		t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : ""); 
	} 
	return t.split("").reverse().join("") + "." + r; 
} 
function fmoney(s) { 
	return parseFloat(s.replace(/[^\d\.-]/g, "")); 
}


//登出时调用方法
function doCustDefin() {
    let gatway = 'http://127.0.0.1:8080/vpgatway';
    if(window.vp.config.URL.devflag) {
      gatway = window.vp.config.URL.localHost;
    }else{
      gatway = window.vp.gateway.handleGateWay(window.vp.config.SETTING.vpgatway);
    }
    parent.window.location.href=gatway+'/logout';
  }
  
  
//校验密码
function validatePassword(value) {
    let result = {};
    result.success = true;
    if (''!=value&& undefined!=value && null!=value) {
        if (value.length < 8) {
            result.success = false;
            result.msg = '密码不能少于8位!';
        }else if (value.length > 16) {
          result.success = false;
          result.msg = '密码不能大于16位!';
        } 
        // else if(!/^(?=.*?[a-z)(?=.*>[A-Z])(?=.*?[0-9])[a-zA_Z0-9]{6,10}$/.test(value)){
        //     result.success = false;
        //     result.msg = '密码必须包含数字、字母!';
        // }
        else{
            var pattern_char = /[a-zA-Z]/g;
            var pattern_num = /[0-9]/g;
            var pattern_tszf = /\W|[_]/;
            var pass1 = value.replace(/(.)(?=.*\1)/g,"")// 密码去重
            
            var ls = 0,ls2 = 0,ls3 = 0;
            var a = 0;
            var b = 0;
            if(pass1.match(pattern_char)!=null){ ls++; a = pass1.match(pattern_char).length;} // 必须有字母
            if(pass1.match(pattern_num)!=null){ ls2++; b = pass1.match(pattern_num).length;}// 必须有数字
            if(pass1.match(pattern_tszf)!=null){ ls3++; b = pass1.match(pattern_tszf).length;}// 必须有特殊字符
            
            if (ls==0 || ls2==0 || ls3==0) {
                result.success = false;
                result.msg = '密码必须包含数字、字母和特殊字符!';
            } 
            if(a+b==pass1.length && pass1.length<4){
                result.success = false;
                result.msg = '弱密码，请重新输入!';
            }
        }
    }else{
      result.success = false;
      result.msg = '密码不能为空!';
    }
    return result;
  }