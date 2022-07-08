# 2.2.1 版本修改记录：--2020-06-05--

1、替换node_modules\vpreact  
1.1、新增VpEchart组件
1.2、新增VpTreeTable组件
1.3、修改VpEditTableCol组件（表格编辑）中的下拉、时间日期类型的控件点击直接显示、文本域高度调小到单元格内
2、替换node_modules\vpbusiness
2.1、扩展动态表单中formItemLayoutAllLine（适用all_line为2）和formItemLayout（适用all_line为1）属性，用来自定义文字和控件的栅格列;
3、替换node_modules\vplat
3.1、 扩展左侧菜单点击支持参数vp.config.vpframe.showtabs:true来控制是否在顶部显示访问历史记录
4、替换vpcommon\vputils.min.js   // 修改了vp.computedHeight的计算高度（支持了顶部显示TAB页签的高度）
5、static\vpstatic\plugins  下新增layuitreetable

该版对应npm版本：vpreact@2.2.1  vpbusiness@2.2.0   vplat@2.2.0

2.2.0版本修改记录：-- 2020-04-15 --

1、替换node_modules\vpreact
1.1、扩展动态表单中附件预览和编辑时在未解析时显示解析进度;
1.2、所有请求在统一的catch中提示异常带上infocode，并在描述中显示识别出的TypeError和500错误;
1.3、所有请求头Content-Type添加charset=UTF-8;
1.4、扩展配置文件中vp.config.ajaxoptions.setLocalStorage参数用来控制是否把异常记录到LocalStorage;
1.5、扩展vpTable中表头title字段支持自定义方法titleFn和暂无数据那么表头添加新的className以方便可以滚动表头查看完整字段;
1.6、扩展附件上传支持模板下载参数fileTypeTempfun;

该版对应npm版本：vpreact@2.2.0  vpbusiness@2.1.10-RELEASE   vplat@2.1.10-RELEASE

2.1.10-RELEASE版本

修改记录：-- 2020-01-16 --

1、修改webpack.base.config.js                                // 修改DefinePlugin中全局变量名称env->vpenv
2、修改src\index.js                                          // 修改框架入口在开发、生产（不带菜单）、生产（带菜单）时条件
3、替换src\script\utils.js                                   // 扩展requireFile在统一构建和各自构建时dynamic目录条件requireFileType
4、修改vpcommon\config.js                                    // 扩展参数requireFileType，默认0或者不设这个参数走各自构建

修改记录：-- 2020-01-14 --

1、替换node_modules\vpreact                                  // 修改表单中预览、编辑为同步请求，同时扩展了es7的async语法（为了支持同步）
2、替换node_modules\vplat                                    // 修改导航配置中添加可选功能列表之前因数据问题而做的判断条件（去掉）
3、替换node_modules\vpbusiness

注：因扩展es7语法对所有组件的语法编译都有变动

修改记录：-- 2019-12-31 --

1、替换node_modules\vpbusiness                               // 动态表单中的文本通过window.textSetValue设值的时候扩展只读字段、实体选择字段在通过其他字段联动的时候没有清除图标修复
2、替换node_modules\vpreact                                  // 表头有合并列的时候宽度会挤一起问题修复
3、替换 vpcommon\vputils.min.js                              // 扩展joinToken方法中对所有iframe的url是否自动拼上token通过配置参数showtoken控制，默认true、加解密扩展自定义密钥或不传直接用默认
4、修改 vpcommon\config.js                                   // 扩展参数showtoken，默认true或者不设这个参数

修改记录：-- 2019-12-11 --

1、替换node_modules\vpbusiness                               // 动态表单的必填校验提示信息以弹层形式明确提示出来（可通过参数dynamicFormOptions.formErrorTips控制是否提示）
2、替换 vpcommon\vputils.min.js                              // 删除重复定义的vp.encrypt
3、调整 config.js                                            // 修改预览的配置参数放到fileViewOptions中、新增表单校验提示配置参数dynamicFormOptions

修改记录：-- 2019-11-25 --

1、替换node_modules\vpreact                                  // 动态表单中新增编辑功能、下载和预览和编辑统一参数且id加密
2、调整了package.json                                        // 调整了完整构建的命令publish-> fullbuild ，同时增加了linux环境上构建的命令
3、调整 config.js                                            // 针对动态表单中新增的编辑功能扩展的配置参数fileEditOptions，

修改记录：-- 2019-11-18 --

1、替换 vpcommon\vputils.min.js                              // 扩展了vp.computedHeight()的条件判断（是否有暂无数据的DIV判断）
2、调整 src\index.html                                       // 对index.html中的js引入位置作了相关调整

修改记录：-- 2019-10-30 --

1、替换node_modules\vpbusiness                               // 修改动态表单中tabs页签距离左侧距离太大问题
2、修改src\index.less                                        // 自定义样式统一移到底层vpreact，这个文件以后只用于自定义项目上的样式

修改记录：-- 2019-10-20 --

1、替换node_modules\vpreact                                  // 修复模态框多层嵌套时高度计算错误、全局样式滚动条在IE上默认显示、居中兼容IE、模态框高度默认 '80%'、表格编辑时间日期控件在IE上闪关修复
2、修改src\index.less                                        // 原自定义样式统一移到底层vpreact
3、替换node_modules\vplat                                    // 修改退出登录的确认框大小、左侧LOGO居中、缩起时图标放大
4、node_modules中新增sortablejs依懒                          //  看板拖动依懒包（产品平台提供的）
5、替换 node_modules\ztree\css\zTreeStyle\zTreeStyle.css      // 优化树的样式

该版本对前期所做过的IE和其他功能修复进行一个归正，推出相对稳定版本！

该版对应npm版本：vpreact@2.1.10-RELEASE  vpbusiness@2.1.10-RELEASE   vplat@2.1.10-RELEASE

2.1.9版本修改记录：-- 2019-09-27 --

1、替换node_modules\vpreact                                  // 修改附件预览时增加一个加载中的弹窗，调整列表模式操作列宽150

该版对应npm版本：vpreact@2.1.5  vpbusiness@2.1.4   vplat@2.1.2

2.1.8版本修改记录：-- 2019-09-17 --

1、替换node_modules\vpreact                                  // 修复附件上传类型有初始值时保存提示不对、修改附件列表模式中列宽、优化模态框高度在没有默认按钮但有自定义按钮时样式
2、替换node_modules\vplat                                    // 修改个人资料弹出框高度

该版对应npm版本：vpreact@2.1.4  vpbusiness@2.1.4   vplat@2.1.2

2.1.7版本修改记录：-- 2019-09-06 --

1、替换src\index.js                                         // 优化加载其他应用刷新时页面短暂404提示

该版对应npm版本：vpreact@2.1.3  vpbusiness@2.1.4   vplat@2.1.1

2.1.6版本修改记录：-- 2019-09-04 --

1、替换node_modules\vpreact                                         // 扩展上传组件中默认属性defaultValue用于配合动态表单新增的数据字段defaultFileTypeValue、更新VpTable操作列更多样式图标、修复登录超时自动跳转到网关、优化了下模态框最大高96%，内容区最小高120px
2、替换node_modules\vpbusiness                                      // 动态表单中上传附件类型新增默认值数据字段defaultFileTypeValue、动态表单中表格类型中新增字段hasborder控制表格边框显示与否，默认false
3、替换node_modules\vplat                                           // 修改模态框中页面的结构

该版对应npm版本：vpreact@2.1.3  vpbusiness@2.1.4   vplat@2.1.1

2.1.5版本修改记录：-- 2019-8-15 --

1、替换node_modules\vpreact                                         // 更新图标库、模态框有默认就直接显示时(编辑表格中的模态框)高度不会计算调整
2、替换node_modules\vpbusiness                                      // 动态表单实体选择清空crossClick方法优化、状态机在validateOk为false时依然会校验问题修复、实体选择新增自定义模态框字段宽(modal_width)、高(modal_height),默认均为 80%、tabs类型的IE（关联实体）会报错问题修复

该版对应npm版本：vpreact@2.1.2  vpbusiness@2.1.3   vplat@2.1.0

2.1.4版本修改记录：-- 2019-8-10 --

1、替换node_modules\vpreact                                         // 更新图标库、模态框样式调整
2、替换node_modules\vpbusiness                                      // 富文本只读模式改调DIV模式渲染、动态表单实体选择新增清空crossClick方法、新增是否需要校验的参数validateOk
3、替换node_modules\vplat                                           // 修改导航链接模态框高度

该版对应npm版本：vpreact@2.1.1  vpbusiness@2.1.2   vplat@2.1.0

2.1.3版本修改记录：-- 2019-8-05 --

1、修改src\index.less                                               // 删除所有和模态框.ant-modal相关的自定义样式（统一移到vpreact里了）
2、修改vpcommon\config.js                                           // 新增动态表单、模态框底部按钮全局初始化参数initFooterText
3、替换node_modules\vpreact                                         // 修改modal中底部按钮okText、cancelText参数可config.js中配置initFooterText
4、替换node_modules\vpbusiness                                      // 修复动态表单中文本/文本域父字段validator未判断
5、替换node_modules\vplat                                           // 修改登出和个人信息模态框高度

该版对应npm版本：vpreact@2.1.0  vpbusiness@2.1.1   vplat@2.0.9

2.1.2版本修改记录：-- 2019-7-31 --

1、替换static\vpstatic\plugins\UEditor\ueditor.all.min.js 、ueditor.all.js  // 修改富本文在页签快速切换的时候会报错导致页面假死 加了个判断 me.ifrmae,同时处理了下富文本中文字和全局不统一
2、替换node_modules\vpreact                                                 // 新增了基础样式、默认请求超时时间改为60S
3、替换node_modules\vpbusiness                                              // 优化动态表单输入延迟
4、修改input类型为text、textarea的字段设值方法window.textSetValue           // onload、onsave方法中涉及到text、textarea类型的input设值统一改用window.textSetValue
5、替换src\index.js                                                         // 修复生产环境上会重复刷新route的问题
6、增加node_modules\ztree                                                   // 引入ztree

该版对应npm版本：vpreact@2.0.9  vpbusiness@2.1.0   vplat@2.0.8

2.1.1版本修改记录：-- 2019-7-21 --

1、替换 node_modules\vpreact                                   // 修改VpInputUploader超过文件大小提示、富文本只读取的是disabled、附件下载等权限
2、替换 node_modules\vpbusiness                                // 扩展RightBox新增entity属性、富文本和多行文本左侧的label不换、实体选择灯泡添加字段属性showdetail

该版对应npm版本：vpreact@2.0.8  vpbusiness@2.0.9   vplat@2.0.8

2.1.0版本修改记录：-- 2019-7-8 --

1、替换package.json                                            // 修改了相关命令
2、删除inserthtml.js
3、替换src\index.js                                            // 修改入口文件中动态插入div
4、替换src\index.html                                          // 静态化页面
5、替换static\vpstatic\js\diyfun.js                            // css和js 分开插入页面对应位置
6、替换node_modules\vplat                                      // 固定左侧导航顶部的LOGO、修改登出
（没有更新2.0.6的请注意以下版本修改）

该版对应npm版本：vpreact@2.0.7  vpbusiness@2.0.8   vplat@2.0.8

2.0.6版本修改记录：-- 2019-7-3 --
  
1、替换 node_modules\antd                                       // 修改远程调用alicdn图标库为本地调用
2、替换 node_modules\vpreact                                    // 修复附件上传列表模式在只读情况下上传按钮依然可用(小雷修改了附件预览)
3、替换 node_modules\vpbusiness                                 // 扩展右侧滑出层maskClose和min 属性
4、修改 vpcommon\config.js                                      // 新增了列表分页的全局控制pagination(优先级：页面上的>全局>默认)

该版对应npm版本：vpreact@2.0.7  vpbusiness@2.0.8   vplat@2.0.7

2.0.5版本修改记录：-- 2019-6-15 --

1、修改 vpcommon\config.js                                      // 增加了报表服务的相关配置(武汉)
2、替换 node_modules\vpreact                                    // 修改token失效重复提示、字体图标
3、替换 node_modules\vpbusiness                                 // 对象选择文本框中放大镜为可点击、实体选择增加后端配只读前台显示灰色
4、替换 node_modules\vplat                                      // 修改公告数据来源

该版对应npm版本：vpreact@2.0.6  vpbusiness@2.0.7   vplat@2.0.7
