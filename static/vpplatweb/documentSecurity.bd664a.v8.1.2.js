webpackJsonp([22],{1255:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0});var l=a(323),i=n(l),s=a(459),o=n(s),c=a(54),r=n(c),d=a(55),u=n(d),f=a(59),p=n(f),m=a(93),g=n(m),h=a(8),v=n(h),y=a(4),E=a(609);a(1256);var C=function(e){function t(e){(0,r["default"])(this,t);var a=(0,p["default"])(this,(t.__proto__||(0,o["default"])(t)).call(this,e));return a.queryentityRole=function(e,t){(0,y.vpQuery)("/{vpplat}/vfrm/entity/entityRole",{entityid:e,iid:t,saccesskey:"entity35_attr"}).then(function(e){a.setState({entityrole:e.data.entityRole})})},a.getData=function(){var e=a;(0,y.vpAdd)("/{vpplat}/documentSecurity/getData",{sparam:(0,i["default"])({pageType:0})}).then(function(t){e.setState({dataList:t.data,isClickMenu:!1},function(){$("#moveArea").sortable({update:function(e,t){$("#moveArea").sortable("toArray").shift()}})})})},a.saveRowData=function(e){var t=a;a.setState({loading:!0});var n={},l=!0;for(var s in e)e[s]==undefined?e[s]="":null==e[s]&&(e[s]=0),"sclassname"==s&&""==e[s]&&"0"==e.iflag&&(l=!1),-1==s.indexOf("_label")&&(n[s]=e[s]);n.iid=a.state.selectrecord.iid,l?(0,y.vpAdd)("/{vpplat}/documentSecurity/save",{sparam:(0,i["default"])(n)}).then(function(e){e.data.success?t.setState({loading:!1,showRightBox:!1},function(){t.getData()}):t.setState({loading:!1},function(){(0,y.VpAlertMsg)({message:"消息提示",description:e.data.msg,type:"error",onClose:t.onClose,closeText:"关闭",showIcon:!0},5)})}):t.setState({loading:!1},function(){(0,y.VpAlertMsg)({message:"消息提示",description:"请填写监听规则实现类的路径！",type:"error",onClose:t.onClose,closeText:"关闭",showIcon:!0},5)})},a.delSelected=function(){var e=[],t={},n=0;a.state.functionList.map(function(l,i){n=l.iid;for(var s=a.state.selectRowArr,o=!1,c=0;c<s.length;c++)if(s[c]==n){o=!0;break}if(!o){t={iid:n,ientityid:l.ientityid,inavid:l.inavid,iparent:l.iparent,surl:l.surl,sname:$("#name"+n).val().replace(/\s/g,""),sicon:$("#sicon"+n).val().replace(/\s/g,""),iusernum:$("#iusernum"+n).val().replace(/\s/g,""),iflag:0,ssequencekey:i};for(var r=a.state.iflagArr,d=0;d<r.length;d++)if(r[d].iid==t.iid){t.iflag=r[d].iflag;break}e.push(t)}}),a.setState({functionList:e,selectRowArr:[]})},a.handleDropDown=function(e,t){e.stopPropagation(),a.setState({selectrecord:t})},a.handleCancel=function(){a.setState({loading:!1,showRightBox:!1,isClickMenu:!1})},a.menuClick=function(e,t,n){a.setState({isClickMenu:!0});var l=e.key,s=a.state.selectrecord.iid;if("enable"==l||"disable"==l){var o=a,c=0,r="监听已启用";"disable"==l&&(c=1,r="监听已禁用"),(0,y.vpAdd)("/{vpplat}/documentSecurity/setFlag",{sparam:(0,i["default"])({iid:s,iflag:c})}).then(function(e){e.data.success?((0,y.VpAlertMsg)({message:"消息提示",description:r,type:"success",onClose:o.onClose,closeText:"关闭",showIcon:!0},5),o.getData()):(o.setState({isClickMenu:!1}),(0,y.VpAlertMsg)({message:"消息提示",description:e.data.msg,type:"error",onClose:o.onClose,closeText:"关闭",showIcon:!0},5))})}else if("edit"==l){var d=a;(0,y.vpAdd)("/{vpplat}/documentSecurity/get",{sparam:(0,i["default"])({iid:s})}).then(function(e){d.setState({isClickMenu:!1,showRightBox:!0,increaseData:e.data.form,rightTitle:d.state.selectrecord.sname})})}else if("clear"==l){var u=a;(0,y.vpAdd)("/{vpplat}/documentSecurity/remove",{sparam:(0,i["default"])({iid:s})}).then(function(e){(0,y.VpAlertMsg)({message:"消息提示",description:"监听配置已清除！",type:"success",onClose:u.onClose,closeText:"关闭",showIcon:!0},5),u.getData()})}},a.closeRightBox=function(e){a.setState({showRightBox:!1},function(){a.getData()})},a.loadRightWindow=function(){return v["default"].createElement(y.VpTabs,{defaultActiveKey:"0",onChange:a.tabsChange},v["default"].createElement(y.VpTabPane,{tab:"属性",key:"0"},v["default"].createElement(E.VpDynamicForm,{ref:function(e){return a.dynamic=e},bindThis:a,formData:a.state.increaseData,handleOk:a.state.entityrole?a.saveRowData:"",handleCancel:a.handleCancel,loading:a.state.loading,okText:"保 存"})))},a.state={showRightBox:!1,isClickMenu:!1,isMax:!0,rightTitle:"",selectItem:[],dataList:[],selectRowArr:[],iflagArr:[],increaseData:{},loading:!1,entityrole:!1},a}return(0,g["default"])(t,e),(0,u["default"])(t,[{key:"componentWillMount",value:function(){var e=this;this.setState({pageType:0},function(){e.queryentityRole("35",""),e.getData()})}},{key:"componentDidMount",value:function(){}},{key:"selectRow",value:function(e,t){if(t){var a=$(e.target).closest(".rowdiv"),n=this.state.selectRowArr,l=$(a).attr("data-id"),i=$.inArray(l,n),s=!0,o=$(e.target).attr("id");o!=undefined&&0==o.indexOf("optCol")&&(s=!1),s&&(i>=0?(n.splice(i,1),$(a).find(".rowitem").css("background-color","#ffffff"),$(a).find("input").css("background-color","#ffffff")):(n.push(l),$(a).find(".rowitem").css("background-color","#e8e8e8f5"),$(a).find("input").css("background-color","#e8e8e8f5")),this.setState({selectRowArr:n}))}}},{key:"tabsChange",value:function(e){}},{key:"render",value:function(){var e=this,t=v["default"].createElement(y.VpMenu,{onClick:this.menuClick},v["default"].createElement(y.VpMenuItem,{key:"enable"},v["default"].createElement("a",null,v["default"].createElement(y.VpIconFont,{type:"vpicon-stop"}),"  启用")),v["default"].createElement(y.VpMenuItem,{key:"edit"},v["default"].createElement("a",null,v["default"].createElement(y.VpIconFont,{type:"vpicon-edit"}),"  编辑")),v["default"].createElement(y.VpMenuItem,{key:"clear"},v["default"].createElement("a",null,v["default"].createElement(y.VpIconFont,{type:"vpicon-clear text-danger"}),"  清除配置"))),a=v["default"].createElement(y.VpMenu,{onClick:this.menuClick},v["default"].createElement(y.VpMenuItem,{key:"disable"},v["default"].createElement("a",null,v["default"].createElement(y.VpIconFont,{type:"vpicon-stop  text-danger"}),"  禁用")),v["default"].createElement(y.VpMenuItem,{key:"edit"},v["default"].createElement("a",null,v["default"].createElement(y.VpIconFont,{type:"vpicon-edit"}),"  编辑")),v["default"].createElement(y.VpMenuItem,{key:"clear"},v["default"].createElement("a",null,v["default"].createElement(y.VpIconFont,{type:"vpicon-clear text-danger"}),"  清除配置")));return v["default"].createElement("div",{className:"bg-white p-sm full-height p-t-xxlg pr"},v["default"].createElement("div",{className:"bg-gray p-sm titleDiv",key:"titleDiv"},v["default"].createElement(y.VpRow,{key:"titleRow"},v["default"].createElement(y.VpCol,{span:2,className:"text-left "},v["default"].createElement("h4",null,"监听ID")),v["default"].createElement(y.VpCol,{span:8,className:"text-left "},v["default"].createElement("h4",null,"监听名称")),v["default"].createElement(y.VpCol,{span:10,className:"text-left "},v["default"].createElement("h4",null,"监听描述")),v["default"].createElement(y.VpCol,{span:2,className:"text-center "},v["default"].createElement("h4",null,"监听状态")),v["default"].createElement(y.VpCol,{span:2,className:"text-center "},v["default"].createElement("h4",null,"监听操作")))),v["default"].createElement("div",{className:"bg-white moveArea full-height scroll-y",id:"moveArea"},this.state.dataList.map(function(n){return v["default"].createElement("div",{key:"rowdiv"+n.iid,className:"bg-white rowdiv","data-id":n.iid,onClick:function(t){return e.selectRow(t,!1)}},v["default"].createElement(y.VpRow,{key:"row"+n.iid,className:"p-sm b-b rowitem",type:"flex",justify:"left",align:"left"},v["default"].createElement(y.VpCol,{span:2,className:"text-left cursor"},v["default"].createElement("div",{id:"iid"+n.iid},n.iid)),v["default"].createElement(y.VpCol,{span:8,className:"text-left cursor"},v["default"].createElement("div",{id:"sname"+n.iid},n.sname)),v["default"].createElement(y.VpCol,{span:10,className:"text-left cursor"},v["default"].createElement("div",{id:"sdescription"+n.iid},n.sdescription)),v["default"].createElement(y.VpCol,{span:2,className:"text-center cursor"},v["default"].createElement("div",{id:"iflagdsp"+n.iid},n.iflagdsp)),v["default"].createElement(y.VpCol,{span:2,className:"text-center "},v["default"].createElement("div",{id:"optCol"+n.iid,style:{textAlign:"center"}},e.state.isClickMenu?"":v["default"].createElement(y.VpDropdown,{trigger:["click"],overlay:1==n.iflag?t:a,getPopupContainer:function(){return document.body}},v["default"].createElement(y.VpIconFont,{type:"vpicon-navlist",className:"cursor",onClick:function(t){return e.handleDropDown(t,n)}}))))))})),v["default"].createElement(E.RightBox,{max:this.state.isMax,button:v["default"].createElement("div",{className:"icon p-xs",onClick:this.closeRightBox},v["default"].createElement(y.VpTooltip,{placement:"top",title:this.state.rightTitle},v["default"].createElement(y.VpIcon,{type:"right"}))),tips:v["default"].createElement("div",{className:"tips p-xs"},v["default"].createElement(y.VpTooltip,{placement:"top",title:this.state.rightTitle+" > [IP网段输入框要求填写正常IP的前三段，若有多个用英文逗号隔开，如：192.168.2,100.135.101,127.0.0等;类路径请填写RulesHandler接口实现类的路径]"},v["default"].createElement(y.VpIcon,{type:"exclamation-circle text-muted m-r-xs"}))),show:this.state.showRightBox},this.state.showRightBox?this.loadRightWindow():null))}}]),t}(h.Component);t["default"]=C=(0,y.VpFormCreate)(C)},1256:function(e,t,a){var n=a(1257);"string"==typeof n&&(n=[[e.id,n,""]]);var l={hmr:!0};l.transform=void 0;a(465)(n,l);n.locals&&(e.exports=n.locals)},1257:function(e,t){}});