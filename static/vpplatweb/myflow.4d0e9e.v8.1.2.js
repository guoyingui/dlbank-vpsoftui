webpackJsonp([10],{1185:function(e,t,a){"use strict";function o(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0});var i=a(14),n=o(i),r=a(459),l=o(r),s=a(54),c=o(s),d=a(55),u=o(d),p=a(59),m=o(p),f=a(93),h=o(f),v=a(8),y=o(v),g=a(4),k=a(888),w=o(k),I=a(609),x=function(e){function t(e){(0,c["default"])(this,t);var a=(0,m["default"])(this,(t.__proto__||(0,l["default"])(t)).call(this,e));return a.getHeader=function(){var e=[{title:"发起流程",dataIndex:"flowName",key:"flowName",width:170,sorter:function(e,t){return e.flowName.localeCompare(t.flowName)}},{title:"编号",dataIndex:"objectCode",key:"objectCode",width:130,sorter:function(e,t){return e.version.localeCompare(t.version)}},{title:"名称",dataIndex:"objectName",key:"objectName",width:230,sorter:function(e,t){return e.objectName.localeCompare(t.objectName)}},{title:"处理环节",dataIndex:"activityName",key:"activityName",sorter:function(e,t){return e.startUsername.localeCompare(t.activityName)}},{title:"发起人",dataIndex:"startUsername",key:"startUsername",sorter:function(e,t){return e.startUsername.localeCompare(t.startUsername)}},{title:"发起时间",dataIndex:"startTime",key:"startTime",width:110,sorter:function(e,t){return e.startUsername.localeCompare(t.startTime)}},{title:"处理人",dataIndex:"handlers",key:"handlers",sorter:function(e,t){return e.startUsername.localeCompare(t.handlers)}},{title:"接收时间",dataIndex:"createTime",key:"createTime",width:110,sorter:function(e,t){return e.startUsername.localeCompare(t.createTime)}},{title:"状态",dataIndex:"taskState",key:"taskState",width:40,render:function(e,t){var a="";return-1==t.taskState&&(a=y["default"].createElement(g.VpTooltip,{placement:"top",title:"进行中 已超时"},y["default"].createElement(g.VpIcon,{className:"m-r-xs",type:"vpicon-handle"}))),0==t.taskState?a=y["default"].createElement(g.VpTooltip,{placement:"top",title:"进行中 未超时"},y["default"].createElement(g.VpIcon,{className:"m-r-xs",type:"vpicon-clock"})):1==t.taskState?a=y["default"].createElement(g.VpTooltip,{placement:"top",title:"已终止"},y["default"].createElement(g.VpIcon,{className:"m-r-xs",type:"vpicon-close"})):2==t.taskState&&(a=y["default"].createElement(g.VpTooltip,{placement:"top",title:"已完成"},y["default"].createElement(g.VpIcon,{className:"m-r-xs",type:"vpicon-check"}))),y["default"].createElement("span",null,a)}}];e.push({title:"操作",fixed:"right",width:120,key:"operation",render:function(e,t){return y["default"].createElement("span",null,y["default"].createElement(g.VpTooltip,{placement:"top",title:"查看"},y["default"].createElement(g.VpIconFont,{"data-id":t.id,className:"cursor text-primary m-lr-xs",type:"vpicon-see-o"})),null!=t.endTime?"":y["default"].createElement("span",null,y["default"].createElement(g.VpTooltip,{placement:"top",title:"终止"},y["default"].createElement(g.VpPopconfirm,{title:"确定要终止此流程吗？",onConfirm:function(){return a.handleStop(t)}},y["default"].createElement(g.VpIconFont,{onClick:function(e){e.stopPropagation()},className:"cursor text-primary m-lr-xs",type:"vpicon-stop"}))),y["default"].createElement(g.VpTooltip,{placement:"top",title:"催办"},y["default"].createElement(g.VpIconFont,{onClick:function(e){return a.handleUrge(e,t)},className:"cursor text-primary m-lr-xs",type:"vpicon-msgs"}))))}}),a.setState({tableHeader:e})},a.getData=function(){(0,g.vpQuery)("/{vpflow}/rest/process/myflow",{curr:a.state.curr,limit:a.state.limit,quickvalue:a.state.quickvalue,filtervalue:a.state.filtervalue}).then(function(e){var t=e.data,o=function(){return"共"+t.count+"条"},i=vp.computedHeight(t.count,".myflow");a.setState({tableHeight:i,tableData:t.result,curr:t.curr,total_rows:t.count,limit:t.limit,pagination:{total:t.count,showTotal:o,pageSize:t.limit,onShowSizeChange:a.onShowSizeChange,showSizeChanger:!0,showQuickJumper:!0}})})},a.onShowSizeChange=function(e){},a.handleStop=function(e){var t={pdId:e.pdId,piId:e.piId};(0,g.vpQuery)("/{vpflow}/rest/process/end-process",(0,n["default"])({},t)).then(function(e){a.getData()})},a.handleUrge=function(e,t){e.stopPropagation();var o={pdId:t.pdId,piId:t.piId};(0,g.vpQuery)("/{vpflow}/rest/process/urge-process",(0,n["default"])({},o)).then(function(e){if(e.data==undefined)return void(0,g.VpAlertMsg)({message:"消息提示",description:e.msg,type:"error",closeText:"关闭",showIcon:!0},5);(0,g.VpAlertMsg)({message:"消息提示",description:"催办成功!",type:"success",onClose:a.onClose,closeText:"关闭",showIcon:!0},5),a.getData()})},a.handlesearch=function(e){var t=$.trim(e);a.setState({quickvalue:t},function(){a.getData()})},a.tableChange=function(e,t,o){var i="";"descend"===o.order?i="desc":"ascend"===o.order&&(i="asc"),a.setState({curr:e.current||a.state.curr,sortfield:o.field,sorttype:i,limit:e.pageSize||a.state.limit},function(){a.getData()})},a.closeRightModal=function(){a.setState({showRightBox:!1,increaseData:{}}),a.props.setBreadCrumb2()},a.filterChange=function(e){a.setState({filtervalue:e.target.value},function(){a.getData()})},a.cancelModal=function(){a.setState({visible:!1})},a.closeRight=function(e){a.setState({showRightBox:e,staskid:""})},a.onRowClick=function(e,t){a.setState({showRightBox:!1},function(){"string"!=typeof t&&(t="0");var o=e.piId;(0,g.vpQuery)("/{vpflow}/rest/process/activitytask",{piId:o}).then(function(o){var i=o.data.taskId||"",n=o.data.formkey||"",r=o.data.usermode||"",l=o.data.entityId||"",s=o.data.objectId||"",c=o.data.record||{piId:e.piId,pdId:e.pdId,endTime:e.endTime};a.setState({showRightBox:!0,record:c,staskid:i,iid:s,usermode:2!=r,entityid:l,formkey:n,flowDefaultActivekey:t}),a.props.setBreadCrumb(e.flowName)})})},a.addNewDom=function(){var e=a.state.record,t=a.state.flowDefaultActivekey;return y["default"].createElement(w["default"],{usermode:a.state.usermode,stepkey:e.activityId,staskid:a.state.staskid,piid:e.piId,pdid:e.pdId,iobjectentityid:a.state.entityid,iobjectid:a.state.iid,entityid:e.iflowentityid,endTime:e.endTime,formkey:a.state.formkey,closeRight:function(e){return a.closeRight(e)},getData:function(){return a.getData()},defaultActiveKey:t})},a.state={tableHeader:[],tableData:[],curr:1,limit:10,filtervalue:a.props.filtervalue||"",quickvalue:a.props.quickvalue||"",showRightBox:!1,total_rows:"",pagination:{},visible:!1,staskid:"",entityid:"",iid:"",record:{},usermode:"",formkey:"",tableHeight:0,flowDefaultActivekey:"0"},a}return(0,h["default"])(t,e),(0,u["default"])(t,[{key:"componentWillReceiveProps",value:function(e){var t=this;(e.filtervalue!=this.props.filtervalue||e.searchflag)&&this.setState({filtervalue:e.filtervalue,quickvalue:e.quickvalue},function(){t.getData()})}},{key:"componentWillMount",value:function(){this.getHeader(),this.getData()}},{key:"componentDidMount",value:function(){var e=$(window).height()-255;$(".myflow").find(".ant-table-body").css({height:e})}},{key:"render",value:function(){return y["default"].createElement("div",{className:"full-height"},y["default"].createElement(g.VpTable,{className:"myflow",columns:this.state.tableHeader,dataSource:this.state.tableData,onChange:this.tableChange,pagination:this.state.pagination,onRowClick:this.onRowClick,scroll:{y:this.state.tableHeight},resize:!0}),y["default"].createElement(I.RightBox,{max:!0,button:y["default"].createElement("div",{className:"icon p-xs",onClick:this.closeRightModal},y["default"].createElement(g.VpTooltip,{placement:"top",title:""},y["default"].createElement(g.VpIcon,{type:"right"}))),tips:y["default"].createElement("div",{className:"tips p-xs"},y["default"].createElement(g.VpTooltip,{placement:"top",title:"0000"},y["default"].createElement(g.VpIcon,{type:"exclamation-circle text-muted m-r-xs"}))),show:this.state.showRightBox},this.state.showRightBox?this.addNewDom():null))}}]),t}(v.Component);t["default"]=x=(0,g.VpFormCreate)(x)}});