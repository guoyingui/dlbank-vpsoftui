webpackJsonp([23],{1258:function(e,t,a){"use strict";function i(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0});var l=a(14),n=i(l),s=a(171),d=i(s),o=a(323),c=i(o),r=a(172),u=i(r),p=a(149),m=i(p),f=a(459),h=i(f),y=a(54),v=i(y),E=a(55),g=i(E),V=a(59),w=i(V),C=a(93),k=i(C),N=a(8),b=i(N),S=a(4);a(1259);var x=a(1261),I=i(x),F=function(e){function t(e){(0,v["default"])(this,t);var a=(0,w["default"])(this,(t.__proto__||(0,h["default"])(t)).call(this,e));return a.quatolist=function(){(0,S.vpQuery)("/{vpplat}/quota/quatolist",{}).then(function(e){a.state.treeData[0].children=e.data,a.setState({treeData:a.state.treeData})})},a.quatoeditlist=function(){-1==a.state.itypes?a.setState({itemLists:[]}):(0,S.vpQuery)("/{vpplat}/quota/editlist",{itype:a.state.itypes,tid:a.state.tid}).then(function(e){a.setState({itemLists:e.data.olist,iclassid:e.data.itypes})})},a.loadData=function(e){return m["default"].resolve()},a.handleClick=function(e){"1"===e.key||("2"===e.key?a.treeRef.removeTreeNode(a.state.selectId):"3"===e.key?a.treeRef.addTreeNode(a.state.selectId,[{name:"测试"}],1):"4"===e.key?a.treeRef.addTreeNode(a.state.selectId,[{name:"测试"}],2):a.treeRef.setNewData(a.state.treeData))},a.addNew=function(){a.setState({itemLists:[].concat((0,u["default"])(a.state.itemLists),[{sname:"",sdescription:"",iid:a.keys--,status:!0,iweight:"",iclassid:""}])})},a.handleSwitchChange=function(e,t){var i=a.state.itemLists,l=-1;i.map(function(t,a){t.iid==e&&(l=a)}),i[l].status=t,a.setState({itemLists:i})},a.deleteRow=function(e){e>0&&(0,S.vpQuery)("/{vpplat}/quota/deletelistrow",{itype:a.state.itypes,iid:e}).then(function(e){(0,S.VpAlertMsg)({message:"消息提示",description:"删除成功！",type:"success",closeText:"关闭",showIcon:!0},5),a.quatolist()}),a.state.itemLists.map(function(t,i){t.iid==e&&a.state.itemLists.splice(i,1)}),a.setState({itemLists:a.state.itemLists})},a.handleCancel=function(){a.setState({visible:!1,tid:""})},a.handleOk=function(){var e="";a.props.form.validateFields(function(t,i){t||(e=a.state.Add?"/{vpplat}/quota/savequota":"/{vpplat}/quota/updatequota",(0,S.vpAdd)(e,{sparam:(0,c["default"])(i),itype:a.state.itypes,tid:a.state.tid}).then(function(e){a.setState({visible:!1,tid:""},function(){return a.quatolist()})}))})},a.onSelect=function(e,t){},a.onRightClick=function(e){var t=(e.event,e.node),i=t.props.item;-1==i.itypes?a.nodetype=0:0==i.itypes?a.nodetype=1:1==i.itypes&&(a.nodetype=2)},a.rightItemList=function(){var e=a.nodetype;return 0==e?[{key:"1",title:"编辑"},{key:"2",title:"删除"},{key:"3",title:"新增指标库"}]:1==e?[{key:"1",title:"编辑"},{key:"2",title:"删除"},{key:"4",title:"修改指标库"}]:2==e?[{key:"1",title:"编辑"},{key:"2",title:"删除"}]:void 0},a.addFunc=function(e,t){e||(0,S.vpQuery)("/{vpplat}/quota/editrow",{itypes:t.itypes,tid:t.tid}).then(function(e){a.setState({editrow:e.data})}),a.setState({title:0==t.itypes?e?"新增指标分组":"修改指标库":"新增指标库",visible:!0,itypes:t.itypes,tid:t.tid,Add:e})},a.removeFunc=function(e){(0,S.vpAdd)("/{vpplat}/quota/deletequota",{tid:e.tid,itype:e.itypes}).then(function(e){a.setState({tid:""}),a.quatolist()})},a.nodeclick=function(e){a.setState({nodetype:e.itypes,itypes:e.itypes,tid:e.tid},function(){-1!=e.itypes&&a.quatoeditlist()})},a.titleNode=function(e){var t,i,l,n,s;return b["default"].createElement("div",{className:"tree-node pr"},b["default"].createElement("div",{onClick:function(){return a.nodeclick(e)}},b["default"].createElement(S.VpIcon,{className:"tree-icon",type:e.icon+" text-primary"}),e.name),b["default"].createElement("div",{className:"tree-options"},b["default"].createElement("div",null,-1==e.itypes?b["default"].createElement(S.VpTooltip,{title:"添加指标库"},b["default"].createElement(S.VpIconFont,(t={className:"tree-icon",onClick:function(){return a.addFunc(!0,e)}},(0,d["default"])(t,"className","cursor m-lr-xs text-success"),(0,d["default"])(t,"type","vpicon-plus-circle"),t))):0==e.itypes?b["default"].createElement("div",null,b["default"].createElement(S.VpTooltip,{title:"添加指标分组"},b["default"].createElement(S.VpIconFont,(i={className:"tree-icon",onClick:function(){return a.addFunc(!0,e)}},(0,d["default"])(i,"className","cursor m-lr-xs text-success"),(0,d["default"])(i,"type","vpicon-plus-circle"),i))),b["default"].createElement(S.VpTooltip,{title:"编辑"},b["default"].createElement(S.VpIconFont,(l={className:"tree-icon",onClick:function(){return a.addFunc(!1,e)}},(0,d["default"])(l,"className","cursor m-lr-xs text-success"),(0,d["default"])(l,"type","vpicon-edit"),l))),b["default"].createElement(S.VpTooltip,{title:"删除"},b["default"].createElement(S.VpPopconfirm,{title:"确定要删除这条信息吗？",onConfirm:function(){return a.removeFunc(e)}},b["default"].createElement(S.VpIconFont,(n={className:"tree-icon",onClick:function(e){return e.stopPropagation()}},(0,d["default"])(n,"className","cursor m-lr-xs text-danger"),(0,d["default"])(n,"type","vpicon-minus-circle"),n))))):b["default"].createElement(S.VpTooltip,{title:"删除"},b["default"].createElement(S.VpPopconfirm,{title:"确定要删除这条信息吗？",onConfirm:function(){return a.removeFunc(e)}},b["default"].createElement(S.VpIconFont,(s={className:"tree-icon",onClick:function(e){return e.stopPropagation()}},(0,d["default"])(s,"className","cursor m-lr-xs text-danger"),(0,d["default"])(s,"type","vpicon-minus-circle"),s)))))))},a.handleInputChange=function(e){var t=e.target.value,i=$(e.target).attr("data-idx"),l=$(e.target).attr("data-key"),n=a.state.editrowdata[i]||{};n[l]=t,a.state.editrowdata[i]=n,a.setState({editrowdata:a.state.editrowdata})},a.handleSelectChange=function(e,t,i){var l=a.state.editrowdata[t]||{};l[i]=e,a.state.editrowdata[t]=l,a.setState({editrowdata:a.state.editrowdata})},a.saveeditlist=function(){a.setState({loading:!0});var e=a.state.editrowdata,t=[];if($.isEmptyObject(e))return(0,S.VpAlertMsg)({message:"消息提示",description:"暂无可保存的数据！",type:"info",onClose:a.onClose,closeText:"关闭",showIcon:!0},5),void a.setState({loading:!1});for(var i in e)if(e.hasOwnProperty(i)){var l=e[i];l.iid=i,t.push(l)}(0,S.vpAdd)("/{vpplat}/quota/saverows",{sparam:(0,c["default"])(t),tid:a.state.tid,itype:a.state.itypes}).then(function(e){(0,S.VpAlertMsg)({message:"消息提示",description:"保存成功！",type:"success",closeText:"关闭",showIcon:!0},3),a.setState({editrowdata:{},loading:!1}),a.quatoeditlist(),a.quatolist()})["catch"](function(e){a.setState({editrowdata:{},loading:!1})})},a.handledicOk=function(){var e=a,t=e.state.item.iid,i=e.dictionary.state.editrowdata,l=e.dictionary.state.currentDic,n=e.state.editrowdata[t]||{};if(n.idictionaryid=l,e.state.editrowdata[t]=n,e.state.itemLists.map(function(e,a){t==e.iid&&(e.iweight="数据字典",e.idictionaryid=l)}),e.setState({editrowdata:e.state.editrowdata,itemLists:e.state.itemLists}),!$.isEmptyObject(i)||""!=l){var s=[];for(var d in i)if(i.hasOwnProperty(d)){var o=i[d];o.iid=d,s.push(o)}s.length?(0,S.vpAdd)("/{vpplat}/quota/saveDic",{dicrowdata:(0,c["default"])(s),currentDic:l,sname:e.state.item.sname,scode:e.state.item.iid}).then(function(t){e.setState({dictionaryfalg:!1})}):e.setState({dictionaryfalg:!1})}},a.handledicCancel=function(){a.setState({dictionaryfalg:!1})},a.dicClick=function(e,t){1==e&&a.setState({dictionaryfalg:!0,item:t})},a.state={treeData:[{name:"目录",tid:-250,open:!0,icon:"",children:[],itypes:-1}],itemLists:[],visible:!1,title:"",tid:"",editrowdata:{},Add:!1,editrow:{},loading:!1,dictionaryfalg:!1},a.keys=-1,a.nodetype=0,a}return(0,k["default"])(t,e),(0,g["default"])(t,[{key:"componentWillMount",value:function(){this.quatolist()}},{key:"componentDidMount",value:function(){var e=window.vp.config.isOpenMenu,t=$(document).height(),a=0,i=0;0==e?(a=t-115,i=t-175):(a=t-149,i=t-209),$(".quotatree").height(a),$(".quotacontent").height(i)}},{key:"componentWillUnmount",value:function(){this.setState=function(e,t){}}},{key:"render",value:function(){var e=this,t={labelCol:{span:6},wrapperCol:{span:14}},a=this.props.form.getFieldProps,i=this.state.editrow;return b["default"].createElement("div",{className:"full-height quota"},b["default"].createElement(S.VpRow,{gutter:10,className:"full-height"},b["default"].createElement(S.VpCol,{span:6,className:"full-height"},b["default"].createElement("div",{className:"bg-white full-height"},b["default"].createElement("div",{className:"p-sm fw b-b"}," 指标库树"),b["default"].createElement("div",{className:"p-sm quotatree"},b["default"].createElement(S.VpTree,{ref:function(t){return e.treeRef=t},titleNode:this.titleNode,treeData:this.state.treeData,loadData:this.loadData,onSelect:this.onSelect,hasSearch:!0})))),this.state.nodetype==undefined||"-1"==this.state.nodetype?b["default"].createElement(S.VpCol,{span:18,className:"full-height bg-white p-static"},b["default"].createElement("div",{className:"tip-box text-center"},b["default"].createElement("div",{className:"tip-icon text-warning"},b["default"].createElement(S.VpIconFont,{type:"vpicon-warning"})),b["default"].createElement("div",{className:"tip f30 p-b-sm"},"请选择指标库或者指标分组！"))):b["default"].createElement(S.VpCol,{span:18,className:"full-height"},b["default"].createElement("div",{className:"bg-white full-height qouta-content"},b["default"].createElement("div",{className:"p-sm fw b-b title"},"指标列表"),b["default"].createElement("div",{className:"p-lg scroll list-view"},b["default"].createElement(S.VpRow,null,b["default"].createElement(S.VpCol,{span:6,className:"p-l-sm"},"名称"),b["default"].createElement(S.VpCol,{span:6,className:"p-l-sm"},0==this.state.itypes?"编号":"数据源"),b["default"].createElement(S.VpCol,{span:5,className:"p-l-sm"},0==this.state.itypes?"图标样式":"权重"),b["default"].createElement(S.VpCol,{span:6,className:"p-l-sm"},"描述")),this.state.itemLists.map(function(t,a){var i;return b["default"].createElement(S.VpRow,{key:t.iid},b["default"].createElement(S.VpCol,{span:6,className:"p-sm p-b-none"},b["default"].createElement(S.VpTooltip,{title:"删除"},b["default"].createElement(S.VpPopconfirm,{title:"确定要删除这条信息吗？",onConfirm:function(){return e.deleteRow(t.iid)}},b["default"].createElement(S.VpIconFont,(i={className:"tree-icon",style:{position:"absolute",left:"-13px",lineHeight:"28px",color:"red"},onClick:function(e){return e.stopPropagation()}},(0,d["default"])(i,"className","cursor m-lr-xs text-danger"),(0,d["default"])(i,"type","vpicon-minus-circle"),i)))),b["default"].createElement(S.VpInput,{defaultValue:t.sname,"data-key":"sname","data-idx":t.iid,onChange:e.handleInputChange})),b["default"].createElement(S.VpCol,{span:6,className:"p-sm p-b-none"},1==e.state.iclassid?"通过/不通过/不适用":0==e.state.itypes?b["default"].createElement(S.VpInput,{defaultValue:t.scode,"data-key":"scode","data-idx":t.iid,onChange:e.handleInputChange}):b["default"].createElement(S.VpSelect,{onSelect:function(a){return e.dicClick(a,t)},style:{width:200},defaultValue:t.iclassid||"0",onChange:function(a){return e.handleSelectChange(a,t.iid,"iclassid")}},b["default"].createElement(S.VpOption,{key:0,value:"0"},"文本输入"),b["default"].createElement(S.VpOption,{disabled:!(t.iid>0),key:1,value:"1"},"数据字典"),b["default"].createElement(S.VpOption,{key:1,value:"1"},"数据字典"))),b["default"].createElement(S.VpCol,{span:5,className:"p-sm p-b-none"},1==e.state.iclassid?"/":b["default"].createElement(S.VpInput,{type:0==e.state.itypes?"text":"number",defaultValue:0==e.state.itypes?t.sicon:t.iweight,"data-key":0==e.state.itypes?"sicon":"iweight","data-idx":t.iid,onChange:e.handleInputChange})),b["default"].createElement(S.VpCol,{span:6,className:"p-sm p-b-none"},b["default"].createElement(S.VpInput,{defaultValue:t.sdescription,"data-key":"sdescription","data-idx":t.iid,onChange:e.handleInputChange})))}),b["default"].createElement(S.VpRow,{className:"m-t-sm"},b["default"].createElement("a",{onClick:this.addNew},b["default"].createElement(S.VpIcon,{type:"plus-circle",className:"m-l-sm m-r-xs"}),"再添加一个"))),b["default"].createElement(S.VpRow,{className:"footer"},b["default"].createElement(S.VpButton,{loading:this.state.loading,onClick:this.saveeditlist,className:"vp-btn-br",type:"primary"},"保存")))),b["default"].createElement(S.VpModal,{title:this.state.title,visible:this.state.visible,onOk:this.handleOk,width:"60%",height:"70%",confirmLoading:this.state.confirmLoading,onCancel:this.handleCancel},this.state.visible?b["default"].createElement(S.VpForm,null,b["default"].createElement(S.VpFInput,(0,n["default"])({},t,a("code",{initialValue:this.state.Add?"":i.scode,rules:[{required:!0,message:"功能编码不能为空"}]}),{label:"指标编码",placeholder:"请输入指标编码",hasFeedback:!0})),b["default"].createElement(S.VpFInput,(0,n["default"])({},t,a("name",{initialValue:this.state.Add?"":i.sname,rules:[{required:!0,message:"功能名称不能为空"}]}),{label:"指标名称",placeholder:"请输入指标名称",hasFeedback:!0})),b["default"].createElement(S.VpFInput,(0,n["default"])({type:"textarea"},t,a("sdesc",{initialValue:this.state.Add?"":i.sdescription}),{label:"指标描述",placeholder:"请输入描述内容"})),-1==this.state.itypes||!this.state.Add&&0==this.state.itypes?b["default"].createElement(S.VpFSelect,(0,n["default"])({label:"指标库类别"},t),b["default"].createElement(S.VpSelect,a("iclassid",{initialValue:this.state.Add?"0":i.iclassid}),b["default"].createElement(S.VpOption,{key:0,value:"0"},"考核评价"),b["default"].createElement(S.VpOption,{key:1,value:"1"},"质量检查"))):null,b["default"].createElement(S.VpFInput,(0,n["default"])({},t,a("sicon",{initialValue:this.state.Add?"":i.sicon}),{label:"指标图标",placeholder:"请输入指标图标",hasFeedback:!0}))):null),b["default"].createElement(S.VpModal,{title:"数据字典明细",visible:this.state.dictionaryfalg,onOk:this.handledicOk,onCancel:this.handledicCancel,width:"70%",height:"80%"},this.state.dictionaryfalg?b["default"].createElement(I["default"],{dom:function(t){return e.dictionary=t},item:this.state.item}):null)))}}]),t}(N.Component);t["default"]=F=(0,S.VpFormCreate)(F)},1259:function(e,t,a){var i=a(1260);"string"==typeof i&&(i=[[e.id,i,""]]);var l={hmr:!0};l.transform=void 0;a(465)(i,l);i.locals&&(e.exports=i.locals)},1260:function(e,t){},1261:function(e,t,a){"use strict";function i(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0});var l=a(14),n=i(l),s=a(171),d=i(s),o=a(172),c=i(o),r=a(323),u=i(r),p=a(459),m=i(p),f=a(54),h=i(f),y=a(55),v=i(y),E=a(59),g=i(E),V=a(93),w=i(V),C=a(8),k=i(C),N=a(4);a(709);a(1259);var b=(a(609),function(e){function t(e){(0,h["default"])(this,t);var a=(0,g["default"])(this,(t.__proto__||(0,m["default"])(t)).call(this,e));return a.dictlist=function(){(0,N.vpAdd)("/{vpplat}/cfgentattr/getDataTypeList",{sparam:(0,u["default"])({scode:"dictionary"})}).then(function(e){a.setState({optionslist:e.data.data})})},a.addNew=function(){a.setState({itemLists:[].concat((0,c["default"])(a.state.itemLists),[{iid:a.keys--}])})},a.handleInputChange=function(e){var t=e.target.value,i=$(e.target).attr("data-idx"),l=$(e.target).attr("data-key"),n=a.state.editrowdata[i]||{};n[l]=t,a.state.editrowdata[i]=n,a.setState({editrowdata:a.state.editrowdata})},a.handleSelectChange=function(e){a.setState({currentDic:e}),(0,N.vpAdd)("/{vpplat}/cfgentattr/getDataTypeList",{sparam:(0,u["default"])({idictionaryid:e,scode:"dictionarydetail"})}).then(function(e){a.setState({itemLists:e.data.data})})},a.checkbox=function(e,t){a.state.itemLists.map(function(a,i){a.idefault="0","1"==e&&a.iid==t.iid&&(a.idefault="1")}),a.setState({itemLists:a.state.itemLists})},a.deleteRow=function(e){a.state.itemLists.map(function(t,i){t.iid==e&&a.state.itemLists.splice(i,1)}),a.setState({itemLists:a.state.itemLists})},a.state=(0,d["default"])({itemLists:[],editrowdata:{},dictionaryfalg:!1,optionslist:[],currentDic:""},"editrowdata",{}),a.keys=-1,a}return(0,w["default"])(t,e),(0,v["default"])(t,[{key:"componentWillMount",value:function(){var e=this;this.dictlist();var t=this.props.item.idictionaryid;""!=t&&t!=undefined&&(0,N.vpAdd)("/{vpplat}/cfgentattr/getDataTypeList",{sparam:(0,u["default"])({idictionaryid:t,scode:"dictionarydetail"})}).then(function(t){e.setState({itemLists:t.data.data})})}},{key:"componentDidMount",value:function(){this.props.dom(this);var e=$(".dictionary").height();$(".diccontent").height(e-125)}},{key:"componentWillUnmount",value:function(){this.setState=function(e,t){}}},{key:"render",value:function(){var e=this,t={labelCol:{span:5},wrapperCol:{span:19}},a=this.props.form.getFieldProps;return k["default"].createElement("div",{className:"dictionary full-height"},k["default"].createElement(N.VpForm,null,k["default"].createElement(N.VpRow,{className:"m-t-sm"},k["default"].createElement(N.VpCol,{span:12},k["default"].createElement(N.VpFInput,(0,n["default"])({},t,a("code",{initialValue:this.props.item.iid}),{readOnly:!0,label:"指标项编号",hasFeedback:!0}))),k["default"].createElement(N.VpCol,{span:12},k["default"].createElement(N.VpFInput,(0,n["default"])({},t,a("name",{initialValue:this.props.item.sname}),{readOnly:!0,label:"指标项名称",hasFeedback:!0})))),k["default"].createElement(N.VpRow,{className:"m-t-sm"},k["default"].createElement(N.VpCol,{span:12},k["default"].createElement(N.VpFSelect,(0,n["default"])({label:"数据字典"},t),k["default"].createElement(N.VpSelect,(0,n["default"])({showSearch:!0,placeholder:"请选择数据字典",optionFilterProp:"children",onSelect:function(t){return e.handleSelectChange(t)}},a("idictionaryid",{initialValue:this.props.item.idictionaryid})),this.state.optionslist.map(function(e,t){return k["default"].createElement(N.VpOption,{key:e.iid+t,value:e.iid},e.sname)})))))),k["default"].createElement(N.VpRow,{className:"diccontent"},k["default"].createElement(N.VpCol,{className:"full-height"},k["default"].createElement("div",{className:"bg-white full-height"},k["default"].createElement("div",{className:"p-sm fw b-b"},"数据字典明细"),k["default"].createElement("div",{className:"p-lg scroll quotacontent"},k["default"].createElement(N.VpRow,null,k["default"].createElement(N.VpCol,{span:11,className:"p-l-sm"},"选项值"),k["default"].createElement(N.VpCol,{span:11,className:"p-l-sm"},"选项名称")),this.state.itemLists.map(function(t,a){var i;return k["default"].createElement(N.VpRow,{key:t.iid},k["default"].createElement(N.VpCol,{span:8,className:"p-sm p-b-none"},k["default"].createElement(N.VpTooltip,{title:"删除"},k["default"].createElement(N.VpIconFont,(i={className:"tree-icon",style:{position:"absolute",left:"-13px",lineHeight:"28px",color:"red"},onClick:function(){return e.deleteRow(t.iid)}},(0,d["default"])(i,"className","cursor m-lr-xs text-danger"),(0,d["default"])(i,"type","vpicon-minus-circle"),i))),k["default"].createElement(N.VpInput,{defaultValue:t.scode,"data-key":"ivalue","data-idx":t.iid,onChange:e.handleInputChange})),k["default"].createElement(N.VpCol,{span:8,className:"p-sm p-b-none"},k["default"].createElement(N.VpInput,{defaultValue:t.sname,"data-key":"stext","data-idx":t.iid,onChange:e.handleInputChange})))}),k["default"].createElement(N.VpRow,{className:"m-t-sm"},k["default"].createElement("a",{onClick:this.addNew},k["default"].createElement(N.VpIcon,{type:"plus-circle",className:"m-l-sm m-r-xs"}),"再添加一个")))))))}}]),t}(C.Component));t["default"]=b=(0,N.VpFormCreate)(b)}});