webpackJsonp([36],{1298:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0});var s=a(685),i=n(s),l=a(172),r=n(l),o=a(459),d=n(o),u=a(54),c=n(u),p=a(55),h=n(p),f=a(59),m=n(f),v=a(93),g=n(v),y=a(8),x=n(y),k=a(4);a(1299);var b=function(e){function t(e){(0,c["default"])(this,t);var a=(0,m["default"])(this,(t.__proto__||(0,d["default"])(t)).call(this,e));return a.getCurrentWeek=function(){var e=[],t=new Date,n=t.getTime(),s=0==t.getDay()?7:t.getDay(),i=n-864e5*(s-1),l=n+864e5*(7-s),r=new Date(i),o=new Date(l);return e.push(a.formatDate(r)),e.push(a.formatDate(o)),e},a.handleStateClick=function(e,t){if(t!==a.state.approvestate){var n=[].concat((0,r["default"])(a.state.types)),s=[].concat((0,r["default"])(a.state.dates)),i=[].concat((0,r["default"])(a.state.tableHeaders));n[n.findIndex(function(e){return"primary"==e})]="ghost",n[t]="primary",t>0?(""==s[0]&&""==s[1]&&(s=a.getCurrentWeek()),i.splice(i.length-1,1),i.push(a.state.optionCol[1])):0==t&&(s=["",""],i.splice(i.length-1,1),i.push(a.state.optionCol[0])),a.setState({tableloading:!0,approvestate:t,types:n,dates:s,tableHeaders:i,iprojectid:"",iuserid:"",pjOptions:[],userOptions:[],selectedRowKeys:[]})}},a.handleChangeDate=function(e,t){a.setState({dates:t,iprojectid:"",iuserid:"",pjOptions:[],userOptions:[],selectedRowKeys:[]})},a.handleChange=function(e,t){"iuserid"==t?a.setState({iuserid:e}):"iprojectid"==t&&a.setState({iprojectid:e})},a.handleSubmit=function(e,t){var n=a.state.selectedRowKeys.join(",");if(""==n)return void(0,k.VpAlertMsg)({message:"消息提示",description:"请选择要审批的报工",type:"warning",onClose:a.onClose,closeText:"关闭",showIcon:!0},5);"1"==t?a.saveDate(n,t):"2"==t&&a.setState({visible:!0,iids:n})},a.handleSubmitSingle=function(e,t){var n=e.iid;"1"==t?a.saveDate(n,t):"2"==t&&a.setState({visible:!0,iids:n})},a.saveDate=function(e,t){var n={};n.currentuserid=vp.cookie.getTkInfo().userid,n.iids=e,"2"==t&&(n.saudittext=a.state.saudittext),n.iapprovalstate=t,(0,k.vpQuery)("/{vpplat}/bggl/approveTimeSheet",n).then(function(e){(0,k.VpAlertMsg)({message:"消息提示",description:"审批成功",type:"success",onClose:a.onClose,closeText:"关闭",showIcon:!0},5),a.tableRef.getTableData()})["catch"](function(e){(0,k.VpAlertMsg)({message:"消息提示",description:"审批失败",type:"error",onClose:a.onClose,closeText:"关闭",showIcon:!0},5)})},a.controlAddButton=function(e,t){a.getSumHours(),a.getProjects(),a.getUsers("");var n=a.cosCol(t),s=vp.computedHeight(t.length,".entityTable")-55;a.setState({tableloading:!1,tableHeight:s,tableHeaders:n},function(){$(".approveTimeSheetClass .ant-table-placeholder").css("maxHeight",s+"px")})},a.cosCol=function(e){for(var t="",n=0,s=0,i=0;i<e.length;i++){var l=e[i].username;0==i?(t=l,n=1,e[i].rowSpan=1):l==t?(n++,e[s].rowSpan=n,e[i].rowSpan=0):(n=1,t=l,s=i,e[i].rowSpan=1)}var o=[].concat((0,r["default"])(a.state.tableHeaders));return o.map(function(e,t){"username"==e.dataIndex&&(e.render=function(e,t,a){var n={children:e,props:{}};return n.props.rowSpan=t.rowSpan,n})}),o},a.getselectedRow=function(e,t){a.setState({selectedRowKeys:e})},a.handleOk=function(){if(!a.state.saudittext)return void(0,k.VpAlertMsg)({message:"消息提示",description:"审批意见不能为空",type:"error",onClose:a.onClose,closeText:"关闭",showIcon:!0},5);a.saveDate(a.state.iids,"2"),a.setState({visible:!1,iids:"",saudittext:""})},a.handleCancel=function(){a.setState({visible:!1,saudittext:""})},a.setSaudittext=function(e){a.setState({saudittext:e.target.value})},a.state={approvestate:0,types:["primary","ghost","ghost"],statenames:["待审批","已审批","已拒绝"],dates:["",""],iuserid:"",sumManhour:0,sumOverTime:0,tableloading:!0,tableHeight:200,tableHeaders:[{title:"人员",dataIndex:"username",key:"username",width:80},{title:"任务名称",dataIndex:"taskname",key:"taskname",width:150},{title:"隶属于",dataIndex:"lsy",key:"lsy",width:150},{title:"已报工时",dataIndex:"ybgs",key:"ybgs",width:70},{title:"报工日期",dataIndex:"dtimesheetdate",key:"dtimesheetdate",width:90},{title:"正常工时",dataIndex:"imanhour",key:"imanhour",width:70},{title:"加班工时",dataIndex:"imanovertime",key:"imanovertime",width:70},{title:"工作内容",dataIndex:"sdetail",key:"sdetail",width:150},{title:"操作",dataIndex:"iid",key:"iid",width:80,render:function(e,t,n){return x["default"].createElement("div",null,x["default"].createElement(k.VpTooltip,{placement:"top",title:"批准"},x["default"].createElement(k.VpIcon,{className:"cursor m-lr-xs f16 text-success",type:"check",onClick:function(){return a.handleSubmitSingle(t,"1")}})),x["default"].createElement(k.VpTooltip,{placement:"top",title:"拒绝"},x["default"].createElement(k.VpIcon,{className:"cursor m-lr-xs f16 text-danger",type:"cross",onClick:function(){return a.handleSubmitSingle(t,"2")}})))}}],optionCol:[{title:"操作",dataIndex:"iid",key:"operation",width:80,render:function(e,t,n){return x["default"].createElement("div",null,x["default"].createElement(k.VpTooltip,{placement:"top",title:"批准"},x["default"].createElement(k.VpIcon,{className:"cursor m-lr-xs f16 text-success",type:"check",onClick:function(){return a.handleSubmitSingle(t,"1")}})),x["default"].createElement(k.VpTooltip,{placement:"top",title:"拒绝"},x["default"].createElement(k.VpIcon,{className:"cursor m-lr-xs f16 text-danger",type:"cross",onClick:function(){return a.handleSubmitSingle(t,"2")}})))}},{title:"审批日期",dataIndex:"dapprovaldate",key:"dapprovaldate",width:90}],selectedRowKeys:[],visible:!1,saudittext:"",pjOptions:[],userOptions:[],iprojectid:e.location.state.iprojectid||""},a}return(0,g["default"])(t,e),(0,h["default"])(t,[{key:"getSumHours",value:function(){var e=this;(0,k.vpQuery)("/{vpplat}/bggl/getApproveTimeSumHours",{startdate:this.state.dates[0],enddate:this.state.dates[1],approvestate:this.state.approvestate,iprojectid:this.state.iprojectid,iuserid:this.state.iuserid,currentuserid:vp.cookie.getTkInfo().userid}).then(function(t){e.state.sumManhour==t.data.summanhour&&e.state.sumOverTime==t.data.sumovertime||e.setState({sumManhour:t.data.summanhour,sumOverTime:t.data.sumovertime})})["catch"](function(e){})}},{key:"componentDidMount",value:function(){}},{key:"componentDidUpdate",value:function(e,t){}},{key:"formatDate",value:function(){var e=arguments.length>0&&arguments[0]!==undefined?arguments[0]:new Date,t=e.getFullYear(),a=e.getMonth()+1,n=e.getDate();return t+"-"+(a<10?"0"+a:a)+"-"+(n<10?"0"+n:n)}},{key:"getProjects",value:function(){var e=this;(0,k.vpQuery)("/{vpplat}/bggl/getApproveTimeProjects",{startdate:this.state.dates[0],enddate:this.state.dates[1],approvestate:this.state.approvestate,currentuserid:vp.cookie.getTkInfo().userid}).then(function(t){if(t.data.length>0){var a=e.genOptions(t.data);e.setState({pjOptions:a})}})["catch"](function(e){})}},{key:"getUsers",value:function(e){var t=this;(0,k.vpQuery)("/{vpplat}/bggl/getApproveTimeUsers",{startdate:this.state.dates[0],enddate:this.state.dates[1],approvestate:this.state.approvestate,currentuserid:vp.cookie.getTkInfo().userid}).then(function(e){if(e.data.length>0){var a=t.genOptions(e.data);t.setState({userOptions:a})}})["catch"](function(e){})}},{key:"genOptions",value:function(e){var t=[],a=!0,n=!1,s=undefined;try{for(var l,r=(0,i["default"])(e);!(a=(l=r.next()).done);a=!0){var o=l.value;t.push(x["default"].createElement(k.VpOption,{key:o.iid,value:o.iid+"",title:o.sname},o.sname))}}catch(d){n=!0,s=d}finally{try{!a&&r["return"]&&r["return"]()}finally{if(n)throw s}}return t}},{key:"render",value:function(){var e=this,t={selectedRowKeys:this.state.selectedRowKeys,onChange:function(t,a){return e.getselectedRow(t,a)}};return x["default"].createElement("div",{className:"approveTimeSheetClass",style:{height:"100%"}},x["default"].createElement("div",{className:"sub-navigator clearfix"},x["default"].createElement(k.VpRow,{type:"flex",justify:"start"},x["default"].createElement(k.VpCol,{span:4,style:{width:"195px"}},x["default"].createElement(k.VpButtonGroup,{style:{margin:"5px 5px 5px 15px",width:"100%"}},x["default"].createElement(k.VpButton,{type:this.state.types[0],onClick:function(t){return e.handleStateClick(t,0)}},"待审批"),x["default"].createElement(k.VpButton,{type:this.state.types[1],onClick:function(t){return e.handleStateClick(t,1)}},"已审批"),x["default"].createElement(k.VpButton,{type:this.state.types[2],onClick:function(t){return e.handleStateClick(t,2)}},"已拒绝"))),x["default"].createElement(k.VpCol,{span:4,style:{minWidth:"195px"}},x["default"].createElement("div",{style:{margin:"5px 5px 5px 10px"}},x["default"].createElement(k.VpRangePicker,{onChange:this.handleChangeDate,value:this.state.dates}))),x["default"].createElement(k.VpCol,{span:4},x["default"].createElement("div",{style:{margin:"5px 5px 5px 10px"}},x["default"].createElement(k.VpSelect,{value:this.state.iprojectid,style:{width:"100%"},onChange:function(t){return e.handleChange(t,"iprojectid")}},x["default"].createElement(k.VpOption,{value:"",title:"请选择项目/根任务"},"请选择项目/根任务"),this.state.pjOptions))),x["default"].createElement(k.VpCol,{span:4},x["default"].createElement("div",{style:{margin:"5px 5px 5px 10px"}},x["default"].createElement(k.VpSelect,{value:this.state.iuserid,style:{width:"100%"},onChange:function(t){return e.handleChange(t,"iuserid")}},x["default"].createElement(k.VpOption,{value:""},"请选择人员"),this.state.userOptions))),x["default"].createElement(k.VpCol,{span:6,style:{minWidth:"280px"}},x["default"].createElement("div",{style:{margin:"5px 5px 5px 10px",textAlign:"left",height:"30px",lineHeight:"30px",textOverflow:"ellipsis",overflow:"hidden"}},this.state.statenames[this.state.approvestate],"：正常工时",x["default"].createElement("span",{className:"fontH"},this.state.sumManhour),"小时   加班工时",x["default"].createElement("span",{className:"fontH"},this.state.sumOverTime),"小时")))),x["default"].createElement("div",{className:"tableDivClass"},x["default"].createElement(k.VpTable,{ref:function(t){return e.tableRef=t},rowSelection:t,rowKey:"iid",columns:this.state.tableHeaders,dataUrl:"/{vpplat}/bggl/getApproveTimeSheetList",params:{startdate:this.state.dates[0],enddate:this.state.dates[1],approvestate:this.state.approvestate,iprojectid:this.state.iprojectid,iuserid:this.state.iuserid,currentuserid:vp.cookie.getTkInfo().userid},className:"entityTable",controlAddButton:function(t,a){e.controlAddButton(t,a)},loading:this.state.tableloading,resize:!0,scroll:{y:this.state.tableHeight},bordered:!0})),x["default"].createElement("div",{className:"footFixed b-t text-center"},x["default"].createElement(k.VpButton,{type:"primary",className:"vp-btn-br",onClick:function(t){return e.handleSubmit(t,1)},loading:this.state.loading},"批准"),x["default"].createElement(k.VpButton,{type:"ghost",className:"vp-btn-br",onClick:function(t){e.handleSubmit(t,2)},loading:this.state.loading,style:{marginLeft:10}},"拒绝")),x["default"].createElement(k.VpModal,{title:"审批意见",visible:this.state.visible,onOk:this.handleOk,onCancel:this.handleCancel,okText:"确定",cancelText:"取消",style:{height:"400px"}},x["default"].createElement("div",null,x["default"].createElement(k.VpInput,{value:this.state.saudittext,onChange:function(t){return e.setSaudittext(t)},type:"textarea",rows:8,maxLength:500}))))}}]),t}(y.Component);t["default"]=b},1299:function(e,t,a){var n=a(1300);"string"==typeof n&&(n=[[e.id,n,""]]);var s={hmr:!0};s.transform=void 0;a(465)(n,s);n.locals&&(e.exports=n.locals)},1300:function(e,t){}});