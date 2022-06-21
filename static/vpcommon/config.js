!function () {
    if(!window.vp){
        window.vp = {};
    }

	var result = document.location.href.split("/"); 
	var shttp = result[0];
	var shostport = result[2].split(":");
	var sport = 80;
	var shost = shostport[0];
	if (shostport.length == 2) {
		sport = shostport[1];
	}
	var srootpath = '';
	var devflag = true;		                                                  // 网关开关， 是否开发模式，true表为是，false表为否
	var gatWayUrl = "";
	var devhost = shttp + "//" + shost + ":" + sport;
	var odmurl = "";

	if (devflag) {
		gatWayUrl = "http://dlyh.vpsoft.cn:8888/vpgatway";		                      // 开发时，同一个应用服务中可以启用这个模式  http://vpsoft.iok.la:16108
		// sport = 8101;										                      // 开发时，指向本地的react工程端口
		odmurl = "http://localhost:9099";
		// 增加报表服务访问地址配置（注意不能以/结尾）
		window.rpthost = window.location.protocol+"//"+window.location.host;
	}else {
		//gatWayUrl = devhost + "/vpgatway";  
		gatWayUrl = "http://127.0.0.1:8080/vpgatway";	// 服务和网关在一个服务器上时
		odmurl = "http://127.0.0.1:9099";
		window.rpthost = devhost;
		//gatWayUrl = "http://127.0.0.1:8080/vpgatway";		
		//odmurl = "http://odm.dev.yf.vpsoft.cn";		
		//window.rpthost = "http://report.dev.yf.vpsoft.cn";		             // 增加报表服务访问地址配置（注意不能以/结尾）			                  
		//srootpath = '/valm';                                                   // 部署工作流访问UI界面需要
	}

    window.vp.config = { 
        "URL": {
            "localHost": gatWayUrl,
			"jsonHost": devhost,
			"console": false,                                                     // 是否开启前端控制台日志输出和全局异常捕获
			"devflag": devflag,
			"rootpath": srootpath,
			"timeout": 180000,                            // 毫秒单位
            "upload": gatWayUrl + "/zuul/{vpplat}/file/uploadfile",
            "download": gatWayUrl + "/zuul/{vpplat}/file/downloadfile",
			"odm_websocket": odmurl,
			'workFlow': 'vpflow',
			'systemtitle': 'D2-Visual ALM', 
			"devMode": {
				"enabled": devflag,                                               // 网关开关
				"proxy": {                                                        // 网关转开发服务器(注意：上传附件时，需要将网关服务器bootstrap.yml中地址指向对应的开发服务器才行)
					'vtmprovider': 'http://152.136.130.139:8888'
					,'vrmprovider': 'http://152.136.130.139:8888/vrmprovider'	          // 示例
					,'odmprovider': 'http://152.136.130.139:8888/vpmprovider'
					,'vpmprovider': 'http://152.136.130.139:8888/vpmprovider'
					,'vpflowprovider': 'http://152.136.130.139:8888/vpflowprovider'
					,'vpmprovider': 'http://152.136.130.139:8888/vpmprovider'
					,'vppm': 'http://152.136.130.139:8888/vpmprovider'
				}
			},
			'errormsg': {
                title: "",                                                        // 不填会显示默认
                content: "<p class='m-t-sm'>联系：XXX</p><p>电话：010-567822255</p><p>邮箱：support@gmail.com</p>"
            },
        },
        "SETTING": {
			'vpcloud-auth'      :   '',
			'vpplat'            :   'vpmprovider',						      // 网关假名，对应网关应用中的bootstrap.yml
			'vpflow'            :   'vpflowprovider',							  // 网关假名，对应网关应用中的bootstrap.yml
            'vppm'              :   'vpmprovider',							      // 网关假名，对应网关应用中的bootstrap.yml
            'vpmprovider'       :   'vpmprovider',							      // 网关假名，对应网关应用中的bootstrap.yml
			'vtm'               :   'vtmprovider',
			'vpodm'				:	'vpmprovider',
			'vpvrm'				:	'vpmprovider',
			'vpgatway'			:   gatWayUrl,
			'vpui'              :   devhost                                       //指向根应用
        },
		"weblist":[   // 应用集合，注意frameweb入口工程放在第一位；如果各应用都有首页 ,最后一个应用优先级最高
			'vpplatweb', 'vpmweb'
		],
		"vpframe":{
			"isDefaultOpen": true // 左侧导航展开true 收缩false 
		},
		"vpm": {
			"projectHideManual": true,
			"clearWBS": true,
			"calculateUrl": "/{vppm}/project/summary"
		},
		"themeId": "themeid", //全局菜单主题颜色自定义 id
		"isOpenMenu": 0 ,     // 0: 左侧菜单; 1: 头部菜单; 2: 左侧头部菜单
		"requireFileType": 1, // dynamic是否在同一个目录中（分开构建0、统一构建1 ）
		"pagination":{
			'defaultPageSize': 10,                                                // 初始的每页条数Number 默认10
			'pageSizeOptions': []                                                 // 自定义每页可以显示多少条 默认['10', '20', '30', '40']
		},
		"initFooterText":{
			'okText': '',
			'cancelText': ''
		},
		"fileViewOptions":{
			"fileView": true, // 全局附件预览开关值(true|false)
			"fileCheck": false, // 判断文档是否存在(true|false)，是否后台物理删除或丢失
			"fileType": "doc,docx,xls,xlsx,ppt,pptx,pdf,png,tiff,jpg,gif,bmp", // 支持预览文件格式
			"fileInfoUrl": gatWayUrl + "/vpmprovider/vfrm/api/filePreview", // 获取预览文件信息，请求参数：fileid
			"viewUrl": devhost + srootpath + "/vpweb/vfm/pdfjs/filePreview.html" // 预览服务请求地址
		},
		"fileEditOptions":{
			"fileEdit":true, //全局文件编辑开关
			"fileEditCheck":false,   // 是否物理删除
			"fileEditType": "doc,docx",//可编辑文件类型
			"editDocUrl": gatWayUrl + "/vpmprovider/api/odm/queryOdmFile",//取odm对应的文件id
			"editUrl": devhost + srootpath + "/vpword/index.html?authcode=brdoc_edit"// 打开url
		},
		"dynamicFormOptions":{
			"formErrorTips":true      // 动态表单校验是否以信息提示的方式展示 默认显示
		},
		"showtoken":true,           // iframe中的url以及下载中URL是否需要在URL上拼接token, 默认true是拼上，false不拼
		"ajaxoptions":{
			"title":"",                   //提示服务异常时的提示标题 默认 服务异常
			"description":"",            // 提示服务异常时的提示内容 默认 服务端调用异常，请与系统管理员联系！
			"setLocalStorage":false      // 提示服务异常时是否写入localStorage
		},
		"vpflow":{
			"showZb":false      // 流程表单是否显示转办按钮 默认显示
		},
		"vpplat":{
			"chooseTreeOpenLevel":4,
			"chooseEntityShowFirstDepart": true  // 选择实体对象部门默认显示跟节点，默认否，false显示用户的归属部门
		}
    };
}()