webpackJsonp([4],{1194:function(e,t,a){"use strict";function i(e){return e&&e.__esModule?e:{"default":e}}function l(){return[{title:"归属实体",dataIndex:"entityid",key:"entityid",width:"",fixed:""},{title:"归属实例",dataIndex:"iitemid",key:"iitemid",width:"",fixed:""},{title:"用户",dataIndex:"userid",key:"userid",width:"",fixed:""},{title:"内容",dataIndex:"sremark",key:"sremark",width:"",fixed:""},{title:"创建时间",dataIndex:"dcreatetime",key:"dcreatetime",width:"",fixed:""}]}Object.defineProperty(t,"__esModule",{value:!0});var n=a(459),d=i(n),s=a(54),c=i(s),o=a(55),r=i(o),u=a(59),h=i(u),f=a(93),m=i(f),p=a(8),g=i(p),w=a(4),b=a(609),y=a(908),v=i(y),x=function(e){function t(e){(0,c["default"])(this,t);var a=(0,h["default"])(this,(t.__proto__||(0,d["default"])(t)).call(this,e));return a.handlesearch=function(e){a.setState({searchData:e,showRightBox:!1,isAdd:!0})},a.onRowClick=function(e,t){a.setState({entityid:e.ientityid,iid:e.projectid,showRightBox:!0})},a.closeRightModal=function(){a.setState({showRightBox:!1},function(){a.tableRef.getTableData()})},a.addnewdom=function(){return g["default"].createElement(w.VpTabs,{defaultActiveKey:"0",onChange:a.tabsChange},g["default"].createElement(w.VpTabPane,{tab:"项目讨论",key:0},g["default"].createElement(v["default"],{entityid:a.state.entityid,iid:a.state.iid})))},a.controlAddButton=function(e,t){var i=vp.computedHeight(t.length,".discussList");a.setState({tableHeight:i})},a.state={searchData:"",entityid:"",iid:"",tableHeight:""},a}return(0,m["default"])(t,e),(0,r["default"])(t,[{key:"componentWillMount",value:function(){}},{key:"componentDidMount",value:function(){}},{key:"render",value:function(){var e=this;return g["default"].createElement("div",{className:"business-container pr full-height"},g["default"].createElement("div",{className:"subAssembly b-b bg-white"},g["default"].createElement(w.VpRow,{gutter:10},g["default"].createElement(w.VpCol,{className:"gutter-row",span:4},g["default"].createElement(b.SeachInput,{onSearch:this.handlesearch})))),g["default"].createElement("div",{className:"business-wrapper p-t-sm full-height"},g["default"].createElement("div",{className:"p-sm bg-white entity-list full-height"},g["default"].createElement(w.VpTable,{ref:function(t){return e.tableRef=t},dataUrl:"/{vpplat}/vfrm/entity/allDiscuss",columns:l(),controlAddButton:function(t,a){e.controlAddButton(t,a)},params:{searchData:this.state.searchData},className:"discussList",onRowClick:this.onRowClick,scroll:{y:this.state.tableHeight},bindThis:this}))),g["default"].createElement("div",{className:"drawer-fixed p-sm hide"},g["default"].createElement("div",{className:"pr full-height"},g["default"].createElement("div",{className:"spin-icon",onclick:"closeDrawer"},g["default"].createElement(w.VpIcon,{type:"verticle-left"})),g["default"].createElement("div",{className:"drawer-box"}))),g["default"].createElement(b.RightBox,{max:!this.state.isAdd,button:g["default"].createElement("div",{className:"icon p-xs",onClick:this.closeRightModal},g["default"].createElement(w.VpTooltip,{placement:"top",title:""},g["default"].createElement(w.VpIcon,{type:"right"}))),show:this.state.showRightBox},this.state.showRightBox?this.addnewdom():""))}}]),t}(p.Component);t["default"]=x=(0,w.VpFormCreate)(x)}});