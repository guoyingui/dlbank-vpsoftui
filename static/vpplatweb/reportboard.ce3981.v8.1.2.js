webpackJsonp([24],{1262:function(e,t,a){"use strict";function l(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0});var n=a(459),r=l(n),o=a(54),c=l(o),s=a(55),i=l(s),u=a(59),p=l(u),d=a(93),f=l(d),m=a(8),h=l(m),v=a(4),g=(a(593),a(609));a(1263);var E=function(e){function t(e){(0,c["default"])(this,t);var a=(0,p["default"])(this,(t.__proto__||(0,r["default"])(t)).call(this,e));return a.getData=function(){(0,v.vpQuery)("/{vpplat}/reportboard/list",{quickvalue:a.state.quickvalue,filter:a.state.filter}).then(function(e){a.setState({listdata:e.data})})},a.handleClick=function(e,t){$(".dropDown-box_"+t).slideToggle(),a.state.icontype[t]?a.state.icontype[t]=null:a.state.icontype[t]="vpicon-arrow-down",a.setState({icontype:a.state.icontype})},a.cardClick=function(e){a.setState({showreport:!0,title:e.sname,url:e.staburl})},a.handleLike=function(e){var t=0;t=0==e.iflag?1:0,(0,v.vpQuery)("/{vpplat}/reportboard/handlelike",{iid:e.iid,flag:t}).then(function(e){a.getData()})},a.cancelModal=function(){a.setState({showreport:!1})},a.handlesearch=function(e){var t=$.trim(e);a.setState({quickvalue:t},function(){a.getData()})},a.handleViewChange=function(e){a.setState({filter:e.target.value},function(){a.getData()})},a.state={icontype:{},showreport:!1,title:"报表",quickvalue:"",filter:"",listdata:[],url:""},a}return(0,f["default"])(t,e),(0,i["default"])(t,[{key:"componentWillMount",value:function(){this.getData()}},{key:"render",value:function(){var e=this;return h["default"].createElement("div",{className:"work-space pr full-height"},h["default"].createElement("div",{className:"subAssembly b-b bg-white"},h["default"].createElement(v.VpRow,null,h["default"].createElement(v.VpCol,{span:4},h["default"].createElement(g.SeachInput,{onSearch:this.handlesearch})),h["default"].createElement(v.VpCol,{span:4,className:"p-l-sm"},h["default"].createElement(v.VpRadioGroup,{defaultValue:"",onChange:this.handleViewChange},h["default"].createElement(v.VpRadioButton,{value:""},"全部"),h["default"].createElement(v.VpRadioButton,{value:"like"},"我关注的"))))),h["default"].createElement("div",{className:"full-height scroll-y bg-white p-sm"},this.state.listdata.map(function(t,a){return h["default"].createElement(v.VpRow,{gutter:20,key:a},h["default"].createElement(v.VpCol,{span:24,className:"p-lr-sm fw"},h["default"].createElement("div",{className:"line-title dropDown pr p-b-xs"},h["default"].createElement("span",{className:"p-lr-sm bg-white pr"},t.title),h["default"].createElement(v.VpIconFont,{type:e.state.icontype[a]?e.state.icontype[a]:"vpicon-arrow-up",className:"f12 pr cursor p-r-xs bg-white",onClick:function(t){return e.handleClick(t,a)}}))),h["default"].createElement(v.VpCol,{span:24,className:"dropDown-box_"+a},t.data.map(function(t,a){return h["default"].createElement(v.VpCol,{onClick:function(){return e.cardClick(t)},key:a,className:"gutter-row",style:{paddingRight:30},span:6},h["default"].createElement("div",{className:"gutter-box b bg-white p-lg cursor pr"},h["default"].createElement(v.VpTooltip,{placement:"top",title:"关注"},h["default"].createElement(v.VpIconFont,{onClick:function(a){a.stopPropagation(),e.handleLike(t)},className:"type",type:1==t.iflag?"vpicon-star":"vpicon-star-o"})),h["default"].createElement(v.VpRow,{gutter:16},h["default"].createElement(v.VpCol,{span:5,className:"p-tb-md text-center"},h["default"].createElement(v.VpIconFont,{className:"text-primary f30",type:t.icontype?t.icontype:"vpicon-wenben"})),h["default"].createElement(v.VpCol,{className:"p-sm",span:18},h["default"].createElement("p",{className:"f16"},h["default"].createElement("span",null,t.sname)),h["default"].createElement("p",{className:"f12 m-t-xs text-muted"},h["default"].createElement("span",{title:t.desc},t.desc||""))))))})))})),h["default"].createElement(v.VpModal,{title:this.state.title,visible:this.state.showreport,onCancel:function(){return e.cancelModal()},width:"90%",height:"90%",footer:null,showMaxIcon:!0,wrapClassName:"modal-no-footer"},this.state.showreport?h["default"].createElement(v.VpIframe,{url:this.state.url}):null))}}]),t}(h["default"].Component);t["default"]=E},1263:function(e,t,a){var l=a(1264);"string"==typeof l&&(l=[[e.id,l,""]]);var n={hmr:!0};n.transform=void 0;a(465)(l,n);l.locals&&(e.exports=l.locals)},1264:function(e,t){}});