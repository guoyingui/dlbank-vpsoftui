webpackJsonp([3],{1190:function(e,t,a){"use strict";function l(e){return e&&e.__esModule?e:{"default":e}}function n(){return[{title:"标题",dataIndex:"stitle",key:"stitle",width:"",fixed:""},{title:"发布时间",dataIndex:"publishdate",key:"publishdate",width:"160",fixed:""},{title:"是否新公告",dataIndex:"inewflag",key:"inewflag",width:"140",fixed:""}]}function i(){return[]}Object.defineProperty(t,"__esModule",{value:!0});var s=a(14),o=l(s),c=a(459),r=l(c),u=a(54),d=l(u),m=a(55),f=l(m),p=a(59),h=l(p),b=a(93),E=l(b),v=a(8),g=l(v),w=a(4),N=a(609),y=a(1191),C=l(y),V=function(e){function t(e){(0,d["default"])(this,t);var a=(0,h["default"])(this,(t.__proto__||(0,r["default"])(t)).call(this,e));return a.queryFilterData=function(){a.setState({filterData:i()})},a.handlesearch=function(e){a.setState({searchData:e})},a.filterChange=function(e){a.setState({filterid:e.target.value})},a.onRowClick=function(e,t){a.queryFormData(129,e.iid)},a.cancelChoosen=function(){a.setState({detail:!1})},a.closeRightModal=function(){a.setState({showRightBox:!1},function(){a.tableRef.getTableData()})},a.handleSubmit=function(e){a.closeRightModal()},a.tabsChange=function(){},a.controlAddButton=function(e,t){var l=vp.computedHeight(t.length,".sysmsg");a.setState({tableHeight:l})},a.state={searchData:"",filterid:"-1",filterData:[],isAdd:!0,showRightBox:!1,stitle:"",publiccontent:"",tableHeight:""},a}return(0,E["default"])(t,e),(0,f["default"])(t,[{key:"componentWillMount",value:function(){this.queryFilterData()}},{key:"componentDidMount",value:function(){$(".ant-table-body").height($(window).height()-190)}},{key:"queryFormData",value:function(e,t){var a=this;(0,w.vpQuery)("/{vpplat}/vfrm/entity/getnotice",{entityid:e,iid:t}).then(function(l){l&&l.hasOwnProperty("data")&&a.setState({title:"公告",formData:l.data,detail:!0,entityid:e,iid:t,tabKey:1})})["catch"](function(e){})}},{key:"render",value:function(){var e=this,t=this.props.form.getFieldProps,a={labelCol:{span:3},wrapperCol:{span:19}};return g["default"].createElement("div",{className:"business-container pr full-height"},g["default"].createElement("div",{className:"subAssembly b-b bg-white"},g["default"].createElement(w.VpRow,{gutter:10},g["default"].createElement(w.VpCol,{className:"gutter-row",span:4},g["default"].createElement(N.SeachInput,{onSearch:this.handlesearch})),g["default"].createElement(w.VpCol,{className:"gutter-row check-radio",span:12},this.state.filterData.length>0?g["default"].createElement(N.CheckRadio,{filterData:this.state.filterData,defaultValue:this.state.filterid,onChange:this.filterChange}):""))),g["default"].createElement("div",{className:"business-wrapper p-t-sm full-height"},g["default"].createElement("div",{className:"p-sm bg-white entity-list"},g["default"].createElement(w.VpTable,{className:"sysmsg",ref:function(t){return e.tableRef=t},dataUrl:"/{vpplat}/dynamic/pageNotice",columns:n(),params:{searchData:this.state.searchData,filterid:this.state.filterid},controlAddButton:function(t,a){e.controlAddButton(t,a)},scroll:{y:this.state.tableHeight},onRowClick:this.onRowClick,bindThis:this}))),g["default"].createElement("div",{className:"drawer-fixed p-sm hide"},g["default"].createElement("div",{className:"pr full-height"},g["default"].createElement("div",{className:"spin-icon",onclick:"closeDrawer"},g["default"].createElement(w.VpIcon,{type:"verticle-left"})),g["default"].createElement("div",{className:"drawer-box"}))),g["default"].createElement(N.RightBox,{max:!this.state.isAdd,button:g["default"].createElement("div",{className:"icon p-xs",onClick:this.closeRightModal},g["default"].createElement(w.VpTooltip,{placement:"top",title:""},g["default"].createElement(w.VpIcon,{type:"right"}))),show:this.state.showRightBox},g["default"].createElement(w.VpTabs,{defaultActiveKey:"0",onChange:this.tabsChange},g["default"].createElement(w.VpTabPane,{tab:"系统消息",key:"0"},g["default"].createElement(w.VpForm,{horizontal:!0,onSubmit:this.handleSubmit},g["default"].createElement("div",null,g["default"].createElement(w.VpFInput,(0,o["default"])({label:"标题"},a,t("stitle",{initialValue:this.state.stitle}))),g["default"].createElement(w.VpFInput,(0,o["default"])({label:"内容",type:"textarea"},a,t("publiccontent",{initialValue:this.state.publiccontent}),{rows:5,style:{height:400}})))))),g["default"].createElement("div",{className:"footFixed p-sm b-t text-center"},g["default"].createElement(w.VpButton,{className:"vp-btn-br",style:{marginLeft:"10px"},type:"ghost",onClick:function(){return e.handleSubmit("cancle")}},"取消"))),g["default"].createElement(w.VpModal,{title:this.state.title,visible:this.state.detail,width:"70%",footer:null,wrapClassName:"modal-no-footer",onCancel:function(){return e.cancelChoosen()}},g["default"].createElement(C["default"],{className:"p-sm full-height scroll p-b-xxlg",formData:this.state.formData,iid:this.state.iid,closeModal:function(){return e.cancelChoosen()}})))}}]),t}(v.Component);t["default"]=V=(0,w.VpFormCreate)(V)},1191:function(e,t,a){"use strict";function l(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0});var n=a(459),i=l(n),s=a(54),o=l(s),c=a(55),r=l(c),u=a(59),d=l(u),m=a(93),f=l(m),p=a(8),h=l(p),b=a(4);a(1192);var E=function(e){function t(e){(0,o["default"])(this,t);var a=(0,d["default"])(this,(t.__proto__||(0,i["default"])(t)).call(this,e));return a.filedownload=function(e){(0,b.vpDownLoad)(window.vp.config.URL.download,{fileid:e})},a.handleSubmit=function(){a.props.closeModal()},a.state={formData:{}},a}return(0,f["default"])(t,e),(0,r["default"])(t,[{key:"componentWillMount",value:function(){this.setState({formData:this.props.formData})}},{key:"componentDidMount",value:function(){$(".ucontent").append(this.state.formData.odynamic)}},{key:"render",value:function(){var e=this,t=this.state.formData;return h["default"].createElement("div",{className:"bg-white notice full-height"},h["default"].createElement(b.VpRow,{className:"p-t-sm"},h["default"].createElement(b.VpCol,{span:3,className:""},h["default"].createElement("div",{className:"title-top"},"标题")),h["default"].createElement(b.VpCol,{span:19,className:"p-b-sm b-b m-b-sm"},h["default"].createElement("div",{className:"title-top rowheight"},t.sname))),h["default"].createElement(b.VpRow,null,h["default"].createElement(b.VpCol,{span:3,className:"p-b-sm  m-b-sm"},h["default"].createElement("div",{className:"title"},"类别")),h["default"].createElement(b.VpCol,{span:19,className:"p-b-sm b-b m-b-sm"},h["default"].createElement("div",{className:"title rowheight"},t.iclassname))),h["default"].createElement(b.VpRow,null,h["default"].createElement(b.VpCol,{span:3,className:"p-b-sm  m-b-sm"},h["default"].createElement("div",{className:"title "},"发布人")),h["default"].createElement(b.VpCol,{span:19,className:"p-b-sm b-b m-b-sm"},h["default"].createElement("div",{className:"title rowheight"},t.username))),h["default"].createElement(b.VpRow,null,h["default"].createElement(b.VpCol,{span:3,className:"p-b-sm  m-b-sm"},h["default"].createElement("div",{className:"title"},"发布日期")),h["default"].createElement(b.VpCol,{span:19,className:"p-b-sm b-b m-b-sm"},h["default"].createElement("div",{className:"title rowheight"},t.dpublishdate))),h["default"].createElement(b.VpRow,null,h["default"].createElement(b.VpCol,{span:1}),h["default"].createElement(b.VpCol,{span:21},h["default"].createElement("div",{className:"",style:{height:200,border:"1px solid #d9d9d9"}},h["default"].createElement("div",{className:"p-t-sm ucontent"})))),t.filelist&&t.filelist.length?h["default"].createElement(b.VpRow,{className:"m-t-sm"},h["default"].createElement(b.VpCol,{span:3,className:"p-b-sm  m-b-sm"},h["default"].createElement("div",{className:"title"},"附件")),h["default"].createElement(b.VpCol,{span:19,className:"p-b-sm b-b m-b-sm"},h["default"].createElement("div",null,h["default"].createElement("ul",null,t.filelist.map(function(t,a){return h["default"].createElement("li",{key:a,className:"list-file",onClick:function(){return e.filedownload(t.iid)}},t.sname)}))))):null,h["default"].createElement("div",{className:"footFixed p-sm b-t text-center"},h["default"].createElement(b.VpButton,{className:"vp-btn-br",type:"ghost",onClick:function(){return e.handleSubmit()}},"关闭")))}}]),t}(p.Component);t["default"]=E},1192:function(e,t,a){var l=a(1193);"string"==typeof l&&(l=[[e.id,l,""]]);var n={hmr:!0};n.transform=void 0;a(465)(l,n);l.locals&&(e.exports=l.locals)},1193:function(e,t){}});