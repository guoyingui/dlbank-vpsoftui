webpackJsonp([7],{1208:function(e,t,a){"use strict";function i(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0});var n=a(323),s=i(n),o=a(459),l=i(o),d=a(54),c=i(d),r=a(55),u=i(r),h=a(59),f=i(h),p=a(93),y=i(p),g=a(8),v=i(g),w=a(4),m=a(609),R=a(1209),b=i(R),S=function(e){function t(e){(0,c["default"])(this,t);var a=(0,f["default"])(this,(t.__proto__||(0,l["default"])(t)).call(this,e));return a.state={filters:[],showRightBox:!1,table_headers:[],table_array:[],cur_page:1,page:1,pagination:{},limit:10,sortfield:"",sorttype:"",increaseData:[],formdata:[],visible:!1,modaltitle:"",selectiid:""},a.handleCancel=a.handleCancel.bind(a),a.handleOk=a.handleOk.bind(a),a.tableChange=a.tableChange.bind(a),a.getHeader=a.getHeader.bind(a),a.getData=a.getData.bind(a),a.okModal=a.okModal.bind(a),a.cancelModal=a.cancelModal.bind(a),a.onExpand=a.onExpand.bind(a),a.onRowClick=a.onRowClick.bind(a),a.closeRightModal=a.closeRightModal.bind(a),a}return(0,y["default"])(t,e),(0,u["default"])(t,[{key:"componentWillMount",value:function(){var e=this;this.setState({entityid:this.props.entityid,iid:this.props.iid},function(){e.getHeader(),e.getData()})}},{key:"componentDidMount",value:function(){vp.computedHeight(this.state.table_array.length,".pjcost",185)}},{key:"getHeader",value:function(){var e=this,t={listType:"pjcost",entityid:this.state.entityid};(0,w.vpAdd)("/{vppm}/activity/getListHeader",{sparam:(0,s["default"])(t)}).then(function(t){if(t&&t.hasOwnProperty("data")&&(e.setState({loading:!1}),t.data.hasOwnProperty("grid"))){var a=[];t.data.grid.hasOwnProperty("fields")&&(t.data.grid.fields.map(function(e,t){var i=void 0,n=void 0,s=void 0,o=void 0;for(var l in e)"field_label"==l?i=e[l]:"field_name"==l&&(n=e[l]),"fixed"==l&&(o=e[l]),"field_width"==l&&(s=e[l]);i&&n&&("left"==o||"right"==o?a.push({title:i,dataIndex:n,key:n,width:s,fixed:o}):a.push({title:i,dataIndex:n,key:n,fixed:o}))}),e.setState({table_headers:a}))}})["catch"](function(e){})}},{key:"getData",value:function(){var e=this,t={listType:"pjcost",currentPage:this.state.cur_page,pageSize:this.state.limit,entityid:this.state.entityid};(0,w.vpAdd)("/{vppm}/activity/getListData",{sparam:(0,s["default"])(t)}).then(function(t){var a=t.data,i=function(){return"共"+a.totalRows+"条"};vp.computedHeight(a.resultList.length,".pjcost",185);e.setState({table_array:a.resultList,cur_page:a.currentPage,total_rows:a.totalRows,num_perpage:a.numPerPage,pagination:{total:a.totalRows,showTotal:i,pageSize:a.numPerPage,onShowSizeChange:e.onShowSizeChange,showSizeChanger:!0,showQuickJumper:!0}})})["catch"](function(e){"function"!=typeof e||e()})}},{key:"onShowSizeChange",value:function(e){}},{key:"tableChange",value:function(e,t,a){var i=this,n="";"descend"===a.order?n="desc":"ascend"===a.order&&(n="asc"),this.setState({cur_page:e.current||this.state.cur_page,sortfield:a.field,sorttype:n,limit:e.pageSize||this.state.limit},function(){i.getData()})}},{key:"okModal",value:function(){this.setState({visible:!1})}},{key:"cancelModal",value:function(){this.setState({visible:!1})}},{key:"handleCancel",value:function(){this.setState({visible:!1})}},{key:"handleOk",value:function(){this.saveRowData(this.props.form.getFieldsValue())}},{key:"onRowClick",value:function(e){var t=this;this.setState({showRightBox:!0,iid:e.iid,rightTitle:"项目类型 > "+e.sname},function(){t.loadRightWindow()})}},{key:"onExpand",value:function(e,t){}},{key:"loadRightWindow",value:function(){return v["default"].createElement(w.VpTabs,{defaultActiveKey:"0",onChange:this.tabsChange},v["default"].createElement(w.VpTabPane,{tab:this.state.rightTitle,key:"0"},v["default"].createElement(b["default"],{iid:this.state.iid})))}},{key:"closeRightModal",value:function(){this.setState({showRightBox:!1})}},{key:"render",value:function(){return v["default"].createElement("div",{className:"full-height overflow"},v["default"].createElement("div",{className:"p-sm bg-white full-height scroll-y",style:{paddingBottom:0}},v["default"].createElement("div",{className:""},v["default"].createElement(w.VpTable,{className:"pjcost",onExpand:this.onExpand,columns:this.state.table_headers,dataSource:this.state.table_array,onChange:this.tableChange,onRowClick:this.onRowClick,pagination:this.state.pagination,resize:!0}))),v["default"].createElement(m.RightBox,{max:this.state.max,button:v["default"].createElement("div",{className:"icon p-xs",onClick:this.closeRightModal},v["default"].createElement(w.VpTooltip,{placement:"top",title:""},v["default"].createElement(w.VpIcon,{type:"right"}))),show:this.state.showRightBox},this.state.showRightBox?this.loadRightWindow():null))}}]),t}(g.Component);t["default"]=S=(0,w.VpFormCreate)(S)},1209:function(e,t,a){"use strict";function i(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0});var n=a(172),s=i(n),o=a(323),l=i(o),d=a(459),c=i(d),r=a(54),u=i(r),h=a(55),f=i(h),p=a(59),y=i(p),g=a(93),v=i(g),w=a(8),m=i(w),R=a(4),b=function(e){function t(e){(0,u["default"])(this,t);var a=(0,y["default"])(this,(t.__proto__||(0,c["default"])(t)).call(this,e));return a.systemRole=function(){var e=a;(0,R.vpQuery)("/{vpplat}/api/pur/point",{saccesskey:"system"}).then(function(t){var a=!0;t.data.system>0&&(a=!1),e.setState({disabled:a})})},a.state={filters:[],showRightBox:!1,table_headers:[],table_array:[],cur_page:1,page:1,pagination:{},limit:10,sortfield:"",sorttype:"",increaseData:[],formdata:[],entityid:"",iids:"",row_id:"",entityiid:"",entityrole:!1,selectItem:[],selectedRowKeys:[],expandedRowKeys:[],disabled:!0},a.tableChange=a.tableChange.bind(a),a.getHeader=a.getHeader.bind(a),a.getData=a.getData.bind(a),a.onExpand=a.onExpand.bind(a),a.toolBarClick=a.toolBarClick.bind(a),a.onRowClick=a.onRowClick.bind(a),a.handleSelect=a.handleSelect.bind(a),a.handleSelectAll=a.handleSelectAll.bind(a),a.onSelectChange=a.onSelectChange.bind(a),a}return(0,v["default"])(t,e),(0,f["default"])(t,[{key:"componentWillReceiveProps",value:function(e){var t=this;e.iid!=this.state.iid&&this.setState({iid:e.iid},function(){t.getHeader(),t.getData()})}},{key:"componentWillMount",value:function(){var e=this;this.setState({iid:this.props.iid},function(){e.getHeader(),e.getData(),e.systemRole()})}},{key:"componentDidMount",value:function(){}},{key:"getHeader",value:function(){var e=this,t={classid:this.state.iid};(0,R.vpAdd)("/{vppm}/activity/getTreeHeader",{sparam:(0,l["default"])(t)}).then(function(t){if(t&&t.hasOwnProperty("data")&&(e.setState({loading:!1}),t.data.hasOwnProperty("grid"))){var a=[];if(t.data.grid.hasOwnProperty("fields")){t.data.grid.fields.map(function(e,t){var i=void 0,n=void 0,s=void 0,o=void 0;for(var l in e)"field_label"==l?i=e[l]:"field_name"==l&&(n=e[l]),"fixed"==l&&(o=e[l]),"field_width"==l&&(s=e[l]);i&&n&&("left"==o||"right"==o?a.push({title:i,dataIndex:n,key:n,width:s,fixed:o}):a.push({title:i,dataIndex:n,key:n,fixed:o}))});var i=[];a.filter(function(e){return"sname"==e.dataIndex}).map(function(e){e.width=280,i.push(e)}),a.map(function(e,t){"sname"!=e.dataIndex&&i.push(e)}),e.setState({table_headers:i})}}})["catch"](function(e){})}},{key:"getData",value:function(){var e=this,t={listType:"pjcost",classid:this.state.iid};(0,R.vpAdd)("/{vppm}/activity/getTreeData",{sparam:(0,l["default"])(t)}).then(function(t){var a=t.data.page,i=t.data.list,n=function(){return"共"+a.totalRows+"条"};e.setState({table_array:a.resultList,cur_page:a.currentPage,total_rows:a.totalRows,num_perpage:a.numPerPage,pagination:{showTotal:n,pageSize:a.numPerPage,showSizeChanger:!1,showQuickJumper:!1}});var s=[],o=[];i.map(function(e,t){"true"==e.ischecked&&o.push(e.iid),s.push(e.iid)}),e.setState({selectedRowKeys:o,expandedRowKeys:s})})["catch"](function(e){"function"!=typeof e||e()})}},{key:"tableChange",value:function(e,t,a){var i=this,n="";"descend"===a.order?n="desc":"ascend"===a.order&&(n="asc"),this.setState({cur_page:e.current||this.state.cur_page,sortfield:a.field,sorttype:n,limit:e.pageSize||this.state.limit},function(){i.getData()})}},{key:"onRowClick",value:function(e){var t=this,a=this.state.selectedRowKeys.findIndex(function(t){return e.iid===t}),i=!0;-1!=a&&(i=!1),i?this.setState({selectedRowKeys:[].concat((0,s["default"])(this.state.selectedRowKeys),[e.iid])},function(){e.pid>0&&t.cascadeSelectParent(e.pid),e.hasOwnProperty("children")&&t.cascadeSelect(e,i)}):this.setState({selectedRowKeys:[].concat((0,s["default"])(this.state.selectedRowKeys.slice(0,a)),(0,s["default"])(this.state.selectedRowKeys.slice(a+1)))},function(){e.hasOwnProperty("children")&&t.cascadeSelect(e,i)})}},{key:"handleSelect",value:function(e,t){var a=this,i=0;t?this.setState({selectedRowKeys:[].concat((0,s["default"])(this.state.selectedRowKeys),[e.iid])},function(){e.pid>0&&a.cascadeSelectParent(e.pid),e.hasOwnProperty("children")&&a.cascadeSelect(e,t)}):(this.state.selectedRowKeys.forEach(function(t,a){t===e.iid&&(i=a)}),this.setState({selectedRowKeys:[].concat((0,s["default"])(this.state.selectedRowKeys.slice(0,i)),(0,s["default"])(this.state.selectedRowKeys.slice(i+1)))},function(){e.hasOwnProperty("children")&&a.cascadeSelect(e,t)}))}},{key:"cascadeSelectParent",value:function(e){-1==this.state.selectedRowKeys.findIndex(function(t){return e===t})&&this.setState({selectedRowKeys:[].concat((0,s["default"])(this.state.selectedRowKeys),[e])})}},{key:"cascadeSelect",value:function(e,t){var a=this,i=0,n=[];if(e.hasOwnProperty("children")&&e.children.forEach(function(e,s){i=a.state.selectedRowKeys.findIndex(function(t){return e.iid===t}),t?-1==i&&n.push(e.iid):-1!=i&&n.push(e.iid)}),t)this.setState({selectedRowKeys:[].concat((0,s["default"])(this.state.selectedRowKeys),n)},function(){});else{var o=[];this.state.selectedRowKeys.forEach(function(e,t){-1==(i=n.findIndex(function(t){return e===t}))&&o.push(e)}),this.setState({selectedRowKeys:o},function(){})}}},{key:"onSelectChange",value:function(e){this.setState({selectedRowKeys:e})}},{key:"handleSelectAll",value:function(e,t,a){this.setState({selectItem:t})}},{key:"toolBarClick",value:function(e){if("save"==e){var t={classid:this.state.iid,ids:this.state.selectedRowKeys};(0,R.vpAdd)("/{vppm}/activity/save",{sparam:(0,l["default"])(t)}).then(function(e){e.data.success?(0,R.VpAlertMsg)({message:"消息提示",description:"保存成功！",type:"success",closeText:"关闭",showIcon:!0},5):(0,R.VpAlertMsg)({message:"消息提示",description:e.data.msg,type:"error",closeText:"关闭",showIcon:!0},5)})}}},{key:"onExpand",value:function(e,t){if(e)this.setState({expandedRowKeys:[].concat((0,s["default"])(this.state.expandedRowKeys),[t.iid])},function(){});else{var a=this.state.expandedRowKeys.findIndex(function(e){return t.iid===e});this.setState({expandedRowKeys:[].concat((0,s["default"])(this.state.expandedRowKeys.slice(0,a)),(0,s["default"])(this.state.expandedRowKeys.slice(a+1)))},function(){})}}},{key:"render",value:function(){var e=this,t=this.state.selectedRowKeys,a={type:"checkbox",selectedRowKeys:t,onSelect:this.handleSelect,onSelectAll:this.handleSelectAll,onChange:this.onSelectChange};return m["default"].createElement("div",{className:"bg-white scroll full-height p-b-xxlg"},m["default"].createElement("div",{className:"p-sm"},m["default"].createElement(R.VpTable,{onExpand:this.onExpand,columns:this.state.table_headers,dataSource:this.state.table_array,onChange:this.tableChange,onRowClick:this.onRowClick,pagination:this.state.pagination,rowSelection:a,rowKey:function(e){return e.iid},expandedRowKeys:this.state.expandedRowKeys,resize:!0})),m["default"].createElement("div",{className:"footer-button-wrap ant-modal-footer",style:{position:"absolute"}},this.state.disabled?null:m["default"].createElement(R.VpButton,{className:"vp-btn-br",type:"primary",icon:"",onClick:function(){return e.toolBarClick("save")}},"保存")))}}]),t}(w.Component);t["default"]=b=(0,R.VpFormCreate)(b)}});