/**
 * 树形表格 2.x
 * date:2020-05-08   jiangsw
 */
layui.config({
    base: '../vpstatic/plugins/layuitreetable/treeTable/'
}).define(['layer', 'laytpl', 'form'], function (exports) {
    var $ = layui.jquery;
    var layer = layui.layer;
    var laytpl = layui.laytpl;
    var form = layui.form;
    var device = layui.device();
    var MOD_NAME = 'treeTable';  // 绑定事件的模块名
    // 改为同步加载css，避免滚动条补丁首次进入无效
    // $.ajax({
    //     url: ['../vpstatic/plugins/layuitreetable/treeTable/treeTable.css'],
    //     async: false,
    //     success: function (res) {
    //         console.log('res',res)
    //         $('head').append('<style id="vp-tree-table-css">' + res + '</style>');
    //     }
    // });

    /** TreeTable类构造方法 */
    var TreeTable = function (options) {
        // 表格默认参数
        var defaultOption = {
            elem: undefined,   // table容器
            data: [],  // 数据
            cols: [],  // 列配置
            reqData: undefined,  // 异步加载数据的方法
            width: undefined,  // 容器宽度
            height: undefined,  // 容器高度
            cellMinWidth: 100,  // 单元格最小宽度
            skin: 'line',  // 表格风格 line （行边框风格） row （列边框风格） nob （无边框风格） 都是针对内部表格区域
            size: undefined,  // 表格尺寸
            even: undefined,  // 是否开启隔行变色
            style: undefined,   // 容器样式
            getThead: function () {  // 获取表头
                return getThead(this);
            },
            getTheadL: function () {  // 获取表头
                return getTheadL(this);
            },
            getTheadR: function () {  // 获取表头
                return getTheadR(this);
            },
            getAllChooseBox: function () {  // 获取全选按钮
                return getAllChooseBox(this);
            },
            getColgroup: function () {  // 获取colgroup
                return getColgroup(this);
            },
            getColgroupL: function () {  // 获取colgroup
                return getColgroupL(this);
            },
            getColgroupR: function () {  // 获取colgroup
                return getColgroupR(this);
            },
            getTbWidth: function () {  // 计算table的宽度
                return getTbWidth(this);
            },
            tree: {},
            text: {}
        };
        // 默认tree参数
        var treeDefaultOption = {
            idName: 'iid',  // id的字段名
            pidName: 'pid',  // pid的字段名
            childName: 'children',  // children的字段名
            haveChildName: 'haveChild',  // 是否有children标识的字段名
            openName: 'open',  // 是否默认展开的字段名
            isPidData: false,  // 是否是pid形式的数据
            iconIndex: 0,  // 图标列的索引
            arrowType: undefined,  // 箭头类型
            onlyIconControl: false,  // 仅允许点击图标折叠
            getIcon: function (d) {  // 自定义图标
                return getIcon(d, this);
            }
        };
        // 默认提示文本
        var textDefaultOption = {
            none: '<div style="padding: 18px 0;">暂无数据</div>'  // 空文本提示文字
        };
        this.options = $.extend(defaultOption, options);
        this.options.tree = $.extend(treeDefaultOption, options.tree);
        this.options.text = $.extend(textDefaultOption, options.text);
        for (var i = 0; i < options.cols.length; i++) {
            // 列默认参数
            var colDefaultOption = {
                field_name: undefined,   // 字段名
                field_label: undefined,   // 标题
                align: undefined,  // 对齐方式
                templet: undefined,  // 自定义模板
                toolbar: undefined,  // 工具列
                iwidth: undefined,   // 宽度
                minWidth: 100,  // 最小宽度
                type: undefined,    // 列类型
                style: undefined,   // 单元格样式
                class: '',  // 单元格class
                singleLine: true,  // 一行显示
                fixed: undefined,    // 固定列
                unresize: false,   // 关闭拖拽列宽,
                sort: true
            };
            this.options.cols[i] = $.extend(colDefaultOption, options.cols[i]);
        }
        this.init();  // 初始化表格
        this.bindEvents();  // 绑定事件
    };

    /** 初始化表格 */
    TreeTable.prototype.init = function () {
        var options = this.options;
        var tbFilter = options.elem.substring(1);  // 树表格的filter
        var $elem = $(options.elem);  // 原始表格
        // 有固定列才插入
        var fixStr = '';
        for (var i = 0; i < options.cols.length; i++) {
            var col = options.cols[i];
            if (col.fixed) {
                var str = col.fixed == "left" ? 'layui-table-fixed-l' : 'layui-table-fixed-r';
                fixStr = '<div class="layui-table-fixed ' + str + ' ew-tree-hide">';
                fixStr += ' <div class="ew-tree-table-head">';
                fixStr += '     <table class="layui-table"></table>';
                fixStr += ' </div>';
                fixStr += ' <div class="ew-tree-table-box">';
                fixStr += '     <table class="layui-table"></table>';
                fixStr += ' </div>';
                fixStr += '</div>';
                break
            }
        }

        // 生成树表格dom
        $elem.removeAttr('lay-filter');
        $elem.next('.ew-tree-table').remove();
        var viewHtml = '<div class="layui-form ew-tree-table" style="' + (options.style || '') + '">';
        viewHtml += '      <div class="ew-tree-table-group">';
        viewHtml += '         <div class="ew-tree-table-head">';
        viewHtml += '            <table class="layui-table"></table>';
        viewHtml += '            <div class="ew-tree-table-border bottom"></div>';
        viewHtml += '         </div>';
        viewHtml += '         <div class="ew-tree-table-box">';
        viewHtml += '            <table class="layui-table"></table>';
        viewHtml += '            <div class="ew-tree-table-loading"><i class="layui-icon layui-anim layui-anim-rotate layui-anim-loop">&#xe63d;</i></div>';
        viewHtml += '            <div class="ew-tree-table-empty" style="display: none;">' + (options.text.none || '') + '</div>';
        viewHtml += '         </div>';

        viewHtml += fixStr;

        viewHtml += '      </div>';
        viewHtml += '      <div class="ew-tree-table-border top"></div><div class="ew-tree-table-border left"></div>';
        viewHtml += '      <div class="ew-tree-table-border right"></div><div class="ew-tree-table-border bottom"></div>';
        viewHtml += '   </div>';
        $elem.after(viewHtml);

        // 获取各个组件
        var components = this.getComponents();
        var $view = components.$view;   // 容器
        $view.attr('lay-filter', tbFilter);
        var $group = components.$group;  // 表格容器
        var $tbBox = components.$tbBox;  // 表格主体部分容器
        var $table = components.$table;  // 主体表格
        var $headTb = components.$headTb;  // 表头表格
        var $tbEmpty = components.$tbEmpty;  // 空视图
        var $tbLoading = components.$tbLoading;  // 空视图

        var $tbFixedLeftHead = components.$tbFixedLeftHead;
        var $tbFixedLeftBox = components.$tbFixedLeftBox;
        var $tbFixedLeftBd = components.$tbFixedLeftBd;

        var $tbFixedRightHead = components.$tbFixedRightHead;
        var $tbFixedRightBox = components.$tbFixedRightBox;
        var $tbFixedRightBd = components.$tbFixedRightBd;

        // 基础参数设置
        options.skin && $table.attr('lay-skin', options.skin);
        options.size && $table.attr('lay-size', options.size);
        options.even && $table.attr('lay-even', options.even);

        // 容器边框调整
        if (device.ie) {
            $view.find('.ew-tree-table-border.bottom').css('height', '1px');
            $view.find('.ew-tree-table-border.right').css('width', '1px');
        }

        // 固定宽度
        if (options.width) {
            $view.css('width', options.width);
            $headTb.parent().css('width', options.width);
            $tbBox.css('width', options.width);
        }
        // col最小宽度
        var tbWidth = options.getTbWidth();
        if (tbWidth.setWidth) {
            $table.css('width', tbWidth.minWidth);
            $headTb.css('width', tbWidth.minWidth);
        } else {
            $table.css('min-width', tbWidth.minWidth);
            $headTb.css('min-width', tbWidth.minWidth);
        }
        // 左固定列最小宽度
        if (tbWidth.widthL > 0) {
            $tbFixedLeftHead.css('width', tbWidth.widthL);
            $tbFixedLeftBd.css('width', tbWidth.widthL);
        }
        // 右固定列最小宽度
        if (tbWidth.widthR > 0) {
            $tbFixedRightHead.css('width', tbWidth.widthR);
            $tbFixedRightBd.css('width', tbWidth.widthR);
        }

        // 渲染表结构及表头-固定左列
        var colgroupLHtmlStr = options.getColgroupL();
        var headHtmlStrL = colgroupLHtmlStr + '<thead>' + options.getTheadL() + '</thead>';
        if (options.height) {  // 固定表头
            $tbFixedLeftBd.html(colgroupLHtmlStr + '<tbody></tbody>');
            $tbFixedLeftHead.html(headHtmlStrL);
            $tbFixedLeftBd.css('margin-top', '-1px');
            if (typeof options.height === 'string' && options.height.indexOf('full-') == 0) {  // 差值高度
                var h = parseFloat(options.height.substring(5)) + 17;
                var cssStr = '<style>.ew-tree-table > .ew-tree-table-group > .layui-table-fixed > .ew-tree-table-box {';
                cssStr += '      height: calc(100vh - ' + h + 'px)';
                cssStr += '      }';
                cssStr += '      .ew-tree-table > .ew-tree-table-group > .layui-table-fixed-l {';
                cssStr += '      left: 0px;';
                cssStr += '   }</style>';
                $tbFixedLeftBox.after(cssStr);
                $tbFixedLeftBox.attr('ew-tree-full', h);
            } else {  // 固定高度
                var h = parseFloat(options.height) - 17;
                var cssStr = '<style>.ew-tree-table > .ew-tree-table-group > .layui-table-fixed-l {';
                cssStr += '      left: 0px;';
                cssStr += '   }</style>';
                $tbFixedLeftBox.after(cssStr);
                $tbFixedLeftBox.css('height', h + 'px');
            }
        } else {
            $tbFixedRightBd.html(headHtmlStrL + '<tbody></tbody>');
        }

        // 渲染表结构及表头-固定右列
        var colgroupRHtmlStr = options.getColgroupR();
        var headHtmlStrR = colgroupRHtmlStr + '<thead>' + options.getTheadR() + '</thead>';
        if (options.height) {  // 固定表头
            $tbFixedRightBd.html(colgroupRHtmlStr + '<tbody></tbody>');
            $tbFixedRightHead.html(headHtmlStrR);
            $tbFixedRightBd.css('margin-top', '-1px');
            if (typeof options.height === 'string' && options.height.indexOf('full-') == 0) {  // 差值高度
                var h = parseFloat(options.height.substring(5)) + 17;
                var cssStr = '<style>.ew-tree-table > .ew-tree-table-group > .layui-table-fixed > .ew-tree-table-box {';
                cssStr += '      height: calc(100vh - ' + h + 'px)';
                cssStr += '      }';
                cssStr += '      .ew-tree-table > .ew-tree-table-group > .layui-table-fixed-r {';
                cssStr += '      right: 0;';
                cssStr += '   }</style>';
                $tbFixedRightBox.after(cssStr);
                $tbFixedRightBox.attr('ew-tree-full', h);
            } else {  // 固定高度
                var h = parseFloat(options.height) - 17;
                var cssStr = '<style>.ew-tree-table > .ew-tree-table-group > .layui-table-fixed-r {';
                cssStr += '      right: 0;';
                cssStr += '   }</style>';
                $tbFixedRightBox.after(cssStr);
                $tbFixedRightBox.css('height', h + 'px');
            }
        } else {
            $tbFixedRightBd.html(headHtmlStrR + '<tbody></tbody>');
        }

        // 渲染表结构及表头
        var colgroupHtmlStr = options.getColgroup();
        var headHtmlStr = colgroupHtmlStr + '<thead>' + options.getThead() + '</thead>';
        if (options.height) {  // 固定表头
            $table.html(colgroupHtmlStr + '<tbody></tbody>');
            $headTb.html(headHtmlStr);
            $table.css('margin-top', '-1px');
            if (typeof options.height === 'string' && options.height.indexOf('full-') == 0) {  // 差值高度
                var h = parseFloat(options.height.substring(5));
                var cssStr = '<style>.ew-tree-table > .ew-tree-table-group > .ew-tree-table-box {';
                cssStr += '      height: ' + (getPageHeight() - h) + 'px;';
                cssStr += '      height: -moz-calc(100vh - ' + h + 'px);';
                cssStr += '      height: -webkit-calc(100vh - ' + h + 'px);';
                cssStr += '      height: calc(100vh - ' + h + 'px);';
                cssStr += '   }</style>';
                $tbBox.after(cssStr);
                $tbBox.attr('ew-tree-full', h);
            } else {  // 固定高度
                $tbBox.css('height', options.height);
            }
        } else {
            $table.html(headHtmlStr + '<tbody></tbody>');
        }

        form.render('checkbox', tbFilter);  // 渲染表头的表单元素

        // 渲染数据
        if (options.reqData) {  // 异步加载
            this.renderBodyAsync();
        } else {  // 一次性渲染
            if (options.data && options.data.length > 0) {
                // 处理数据
                if (options.tree.isPidData) {  // pid形式数据
                    options.data = treeTb.pidToChildren(options.data, options.tree.idName, options.tree.pidName, options.tree.childName);
                } else {  // children形式数据
                    addPidField(options.data, options.tree);
                }
                $table.children('tbody').html(this.renderBody(options.data));
                $tbFixedLeftBd.children('tbody').html(this.renderBodyL(options.data));
                $tbFixedRightBd.children('tbody').html(this.renderBodyR(options.data));
                $tbLoading.hide();
                components.$tbFixedLeft.removeClass('ew-tree-hide');
                components.$tbFixedRight.removeClass('ew-tree-hide');
                this.renderNumberCol();  // 渲染序号列
                form.render(null, tbFilter);  // 渲染表单元素
                this.checkChooseAllCB();  // 联动全选框
                updateFixedTbHead($view);
            } else {
                $tbLoading.hide();
                $tbEmpty.show();
            }
        }


    };

    /** 绑定各项事件 */
    TreeTable.prototype.bindEvents = function () {
        var that = this;
        var options = this.options;
        var components = this.getComponents();
        var $view = components.$view;
        var $table = components.$table;
        var $tbFixedLeftBd = components.$tbFixedLeftBd;
        var $tbFixedRightBd = components.$tbFixedRightBd;
        var $tbEmpty = components.$tbEmpty;
        var tbFilter = components.tbFilter;
        var checkboxFilter = components.checkboxFilter;
        var radioFilter = components.radioFilter;
        var cbAllFilter = components.cbAllFilter;
        var $tbody = $table.children('tbody');
        var $tbFixedLeftbody = $tbFixedLeftBd.children('tbody');
        var $tbFixedRightbody = $tbFixedRightBd.children('tbody');

        /** 行事件公共返回对象 */
        var commonMember = function (ext) {
            var $tr = $(this);
            if (!$tr.is('tr')) {
                var $td_tr = $tr.parent('tr[data-id]');
                if ($td_tr.length > 0) {
                    $tr = $td_tr;
                } else {
                    $tr = $tr.parentsUntil('tr[data-id]').last().parent();
                }
            }
            var id = $tr.data('id');
            var data = getDataById(options.data, id, options.tree);
            var obj = {
                tr: $tr,  // 当前行
                data: data, //当前行数据
                del: function () { // 删除行
                    var indent = parseInt(this.tr.data('indent'));
                    this.tr.nextAll('tr').each(function () {
                        if (parseInt($(this).data('indent')) <= indent) {
                            return false;
                        }
                        $(this).remove();
                    });
                    var $parentTr = this.tr.prevAll('tr');
                    this.tr.remove();
                    delDataById(options.data, id, options.tree);
                    if (!options.data || options.data.length <= 0) {
                        $tbEmpty.show();
                    }
                    that.renderNumberCol();  // 渲染序号列
                    // 联动父级
                    $parentTr.each(function () {
                        var tInd = parseInt($(this).data('indent'));
                        if (tInd < indent) {
                            that.checkParentCB($(this));
                            indent = tInd;
                        }
                    });
                    that.checkChooseAllCB();  // 联动全选框
                },
                update: function (fields) {  // 修改行
                    data = $.extend(data, fields);
                    var indent = parseInt(this.tr.data('indent'));
                    that.renderBodyTr(data, indent, undefined, this.tr);
                    form.render(null, tbFilter);  // 渲染表单元素
                    that.checkIndeterminateCB();  // 恢复半选框状态
                    that.checkChooseAllCB();  // 联动全选框
                }
            };
            return $.extend(obj, ext);
        };

        // 绑定折叠展开事件-left
        $tbFixedLeftbody.off('click.fold').on('click.fold', '.ew-tree-pack', function (e) {
            layui.stope(e);
            var $tr = $(this).parentsUntil('tr').last().parent();
            if ($tr.hasClass('ew-tree-table-loading')) {  // 已是加载中
                return;
            }
            var haveChild = $tr.data('have-child');
            if (haveChild != true && haveChild != 'true') {  // 子节点
                return;
            }
            var id = $tr.data('id');
            var isOpen = $tr.hasClass('ew-tree-table-open');
            var data = getDataById(options.data, id, options.tree);
            if (!isOpen && (!data[options.tree.childName] || data[options.tree.childName].length <= 0)) {
                that.renderBodyAsync(data, $tr);
            } else {
                toggleRow($tr);
            }
        });

        // 绑定折叠展开事件
        $tbody.off('click.fold').on('click.fold', '.ew-tree-pack', function (e) {
            layui.stope(e);
            var $tr = $(this).parentsUntil('tr').last().parent();
            if ($tr.hasClass('ew-tree-table-loading')) {  // 已是加载中
                return;
            }
            var haveChild = $tr.data('have-child');
            if (haveChild != true && haveChild != 'true') {  // 子节点
                return;
            }
            var id = $tr.data('id');
            var isOpen = $tr.hasClass('ew-tree-table-open');
            var data = getDataById(options.data, id, options.tree);
            if (!isOpen && (!data[options.tree.childName] || data[options.tree.childName].length <= 0)) {
                that.renderBodyAsync(data, $tr);
            } else {
                toggleRow($tr);
            }
        });

        // 绑定lay-event事件 因react中对原生HTML的属性不接收，故data-lay-event
        $tbody.off('click.tool').on('click.tool', '*[data-lay-event]', function (e) {
            layui.stope(e);
            var $this = $(this);
            layui.event.call(this, MOD_NAME, 'tool(' + tbFilter + ')', commonMember.call(this, {
                event: $this.attr('data-lay-event')
            }));
        });
        $tbFixedRightbody.off('click.tool').on('click.tool', '*[data-lay-event]', function (e) {
            layui.stope(e);
            var $this = $(this);
            layui.event.call(this, MOD_NAME, 'tool(' + tbFilter + ')', commonMember.call(this, {
                event: $this.attr('data-lay-event')
            }));
        });


        // 绑定单选框事件
        form.on('radio(' + radioFilter + ')', function (data) {
            var d = getDataById(options.data, data.value, options.tree);
            that.removeAllChecked();
            d.LAY_CHECKED = true;  // 同时更新数据
            layui.event.call(this, MOD_NAME, 'checkbox(' + tbFilter + ')', { checked: true, data: d, type: 'one' });
        });

        // 绑定复选框事件
        form.on('checkbox(' + checkboxFilter + ')', function (data) {

            var checked = data.elem.checked;
            var $cb = $(data.elem);
            var $layCb = $cb.next('.layui-form-checkbox');
            // 如果是半选状态，点击全选
            if (!checked && $layCb.hasClass('ew-form-indeterminate')) {
                checked = true;
                $cb.prop('checked', checked);
                $cb.data('indeterminate', 'false');
                $layCb.addClass('layui-form-checked');
                $layCb.removeClass('ew-form-indeterminate');
            }
            var d = getDataById(options.data, data.value, options.tree);
            d.LAY_CHECKED = checked;  // 同时更新数据
            // 联动操作
            var $tr = $cb.parentsUntil('tr').last().parent();

            var _id = $tr.data('id');
            var $trArr = $('tr[data-id=' + _id + ']');
            for (var i = 0; i < $trArr.length; i++) {
                var _$tr = $($trArr[i]);
                var _$ipt = _$tr.children('td').find('input[name="' + checkboxFilter + '"]');
                var _$iptnt = _$ipt.next('.layui-form-checkbox');
                _$tr.prop('checked', checked)
                if (checked) {
                    _$iptnt.addClass('layui-form-checked')
                } else {
                    _$iptnt.removeClass('layui-form-checked')
                }
                if (d[options.tree.childName] && d[options.tree.childName].length > 0) {
                    that.checkSubCB(_$tr, checked);  // 联动子级
                }
                var indent = parseInt(_$tr.data('indent'));

                _$tr.prevAll('tr').each(function () {
                    var tInd = parseInt($(this).data('indent'));
                    if (tInd < indent) {
                        that.checkParentCB($(this));  // 联动父级
                        indent = tInd;
                    }
                });
                that.checkChooseAllCB();  // 联动全选框

            }



            // 回调事件
            layui.event.call(this, MOD_NAME, 'checkbox(' + tbFilter + ')', {
                checked: checked,
                data: d,
                type: 'one'
            });
        });

        // 绑定全选复选框事件
        form.on('checkbox(' + cbAllFilter + ')', function (data) {
            var checked = data.elem.checked;
            var $cb = $(data.elem);
            var $layCb = $cb.next('.layui-form-checkbox');
            var $cbAll = $('input[lay-filter="' + cbAllFilter + '"]');

            if (!options.data || options.data.length <= 0) {  // 如果数据为空
                $cb.prop('checked', false);
                $cb.data('indeterminate', 'false');
                $layCb.removeClass('layui-form-checked ew-form-indeterminate');
                return;
            }

            for (var i = 0; i < $cbAll.length; i++) {
                $($cbAll[i]).prop('checked', checked)
                if (checked) {
                    $($cbAll[i]).next('.layui-form-checkbox').addClass('layui-form-checked').removeClass('ew-form-indeterminate')
                } else {
                    $($cbAll[i]).next('.layui-form-checkbox').removeClass('layui-form-checked')
                }
                // 如果是半选状态，点击全选
                if (!checked && $($cbAll[i]).next('.layui-form-checkbox').hasClass('ew-form-indeterminate')) {
                    checked = true;
                    $($cbAll[i]).prop('checked', checked);
                    $($cbAll[i]).data('indeterminate', 'false');
                    $($cbAll[i]).next('.layui-form-checkbox').addClass('layui-form-checked').removeClass('ew-form-indeterminate');
                }
                console.log(i, $($cbAll[i]).prop('checked'))
            }
            console.log('全选', checked, $cbAll)
            layui.event.call(this, MOD_NAME, 'checkbox(' + tbFilter + ')', {
                checked: checked,
                data: undefined,
                type: 'all'
            });
            that.checkSubCB($table.children('tbody'), checked);  // 联动操作
        });

        // 绑定行单击事件
        $tbody.off('click.row').on('click.row', 'tr', function () {
            layui.event.call(this, MOD_NAME, 'row(' + tbFilter + ')', commonMember.call(this, {}));
        });

        // 绑定行双击事件
        $tbody.off('dblclick.rowDouble').on('dblclick.rowDouble', 'tr', function () {
            layui.event.call(this, MOD_NAME, 'rowDouble(' + tbFilter + ')', commonMember.call(this, {}));
        });

        // 绑定单元格点击事件
        $tbody.off('click.cell').on('click.cell', 'td', function (e) {
            var $td = $(this);
            var type = $td.data('type');
            // 判断是否是复选框、单选框列
            if (type == 'checkbox' || type == 'radio') {
                layui.stope(e);
                return;
            }
            var edit = $td.data('edit');
            var field = $td.data('field_name');
            if (edit) {  // 开启了单元格编辑
                layui.stope(e);
                if ($tbody.find('.ew-tree-table-edit').length > 0) {
                    return;
                }
                var index = $td.data('index');
                var indentSize = $td.children('.ew-tree-table-indent').length;
                var id = $td.parent().data('id');
                var d = getDataById(options.data, id, options.tree);
                if ('text' == edit || 'number' == edit) {  // 文本框
                    var $input = $('<input type="' + edit + '" class="layui-input ew-tree-table-edit"/>');
                    $input[0].value = d[field];
                    $td.append($input);
                    $input.focus();
                    $input.blur(function () {
                        var value = $(this).val();
                        if (value == d[field]) {
                            $(this).remove();
                            return;
                        }
                        var rs = layui.event.call(this, MOD_NAME, 'edit(' + tbFilter + ')', commonMember.call(this, {
                            value: value,
                            field: field
                        }));
                        if (rs == false) {
                            $(this).addClass('layui-form-danger');
                            $(this).focus();
                        } else {
                            d[field] = value;  // 同步更新数据
                            that.renderBodyTd(d, indentSize, index, $td);  // 更新单元格
                        }
                    });
                } else {
                    console.error('不支持的单元格编辑类型:' + edit);
                }
            } else {  // 回调单元格点击事件
                var rs = layui.event.call(this, MOD_NAME, 'cell(' + tbFilter + ')', commonMember.call(this, {
                    td: $td,
                    field: field
                }));
                if (rs == false) {
                    layui.stope(e);
                }
            }
        });

        // 绑定单元格双击事件
        $tbody.off('dblclick.cellDouble').on('dblclick.cellDouble', 'td', function (e) {
            var $td = $(this);
            var type = $td.data('type');
            // 判断是否是复选框、单选框列
            if (type == 'checkbox' || type == 'radio') {
                layui.stope(e);
                return;
            }
            var edit = $td.data('edit');
            var field = $td.data('field_name');
            if (edit) {  // 开启了单元格编辑
                layui.stope(e);
            } else {  // 回调单元格双击事件
                var rs = layui.event.call(this, MOD_NAME, 'cellDouble(' + tbFilter + ')', commonMember.call(this, {
                    td: $td,
                    field: field
                }));
                if (rs == false) {
                    layui.stope(e);
                }
            }
        });

        // 同步滚动条
        components.$tbBox.on('scroll', function () {
            var $this = $(this);
            var scrollLeft = $this.scrollLeft();
            var scrollTop = $this.scrollTop();
            components.$headTb.parent().scrollLeft(scrollLeft);
            components.$tbFixedLeftBox.scrollTop(scrollTop);
            components.$tbFixedRightBox.scrollTop(scrollTop);
        });
        components.$tbFixedLeftBox.on('scroll', function () {
            var $this = $(this);
            var scrollTop = $this.scrollTop();
            components.$tbBox.scrollTop(scrollTop);
        });
        // components.$tbFixedRightBox.on('scroll', function () {
        //     var $this = $(this);
        //     var scrollTop = $this.scrollTop();
        //     components.$tbBox.scrollTop(scrollTop);
        // });

        // 列宽拖拽调整
        /*$view.off('mousedown.resize').on('mousedown.resize', '.ew-tb-resize', function (e) {
            layui.stope(e);
            var index = $(this).parent().data('index');
            $(this).data('move', 'true');
            $(this).data('x', e.clientX);
            var w = $(this).parent().parent().parent().parent().children('colgroup').children('col').eq(index).attr('width');
            $(this).data('width', w);
        });
        $view.off('mousemove.resize').on('mousemove.resize', '.ew-tb-resize', function (e) {
            layui.stope(e);
            var move = $(this).data('move');
            if ('true' == move) {
                var x = $(this).data('x');
                var w = $(this).data('width');
                var index = $(this).parent().data('index');
                var nw = parseFloat(w) + e.clientX - parseFloat(x);
                $(this).parent().parent().parent().parent().children('colgroup').children('col').eq(index).attr('width', nw);
            }
        });
        $view.off('mouseup.resize').on('mouseup.resize', '.ew-tb-resize', function (e) {
            layui.stope(e);
            $(this).data('move', 'false');
        });
        $view.off('mouseleave.resize').on('mouseleave.resize', '.ew-tb-resize', function (e) {
            layui.stope(e);
            $(this).data('move', 'false');
        });*/

    };

    /** 获取各个组件 */
    TreeTable.prototype.getComponents = function () {
        var $view = $(this.options.elem).next();   // 容器
        var $group = $view.children('.ew-tree-table-group');  // 表格容器
        var $tbBox = $group.children('.ew-tree-table-box');  // 表格主体部分容器
        var $table = $tbBox.children('.layui-table');  // 主体表格
        var $headTb = $group.children('.ew-tree-table-head').children('.layui-table');  // 表头表格
        var $tbEmpty = $tbBox.children('.ew-tree-table-empty');  // 空视图
        var $tbLoading = $tbBox.children('.ew-tree-table-loading');  // 加载视图

        var $tbFixedLeft = $group.children('.layui-table-fixed-l');  // 表格左侧固定部分容器
        var $tbFixedLeftHead = $tbFixedLeft.children('.ew-tree-table-head').children('.layui-table');  // 表格左侧固定表头表格
        var $tbFixedLeftBox = $tbFixedLeft.children('.ew-tree-table-box');  // 表格左侧固定表格容器
        var $tbFixedLeftBd = $tbFixedLeftBox.children('.layui-table');  // 表格左侧固定表数据表格

        var $tbFixedRight = $group.children('.layui-table-fixed-r');  // 表格右侧固定部分容器
        var $tbFixedRightHead = $tbFixedRight.children('.ew-tree-table-head').children('.layui-table');  // 表格右侧固定表头表格
        var $tbFixedRightBox = $tbFixedRight.children('.ew-tree-table-box');  // 表格右侧固定表格容器
        var $tbFixedRightBd = $tbFixedRightBox.children('.layui-table');  // 表格右侧固定表数据表格

        var tbFilter = $view.attr('lay-filter');  // 容器filter
        var checkboxFilter = 'ew_tb_checkbox_' + tbFilter;  // 复选框filter
        var radioFilter = 'ew_tb_radio_' + tbFilter;  // 单选框filter
        var cbAllFilter = 'ew_tb_choose_all_' + tbFilter;  // 全选按钮filter
        return {
            $view: $view,
            $group: $group,
            $tbBox: $tbBox,
            $table: $table,
            $headTb: $headTb,
            $tbFixedLeft: $tbFixedLeft,
            $tbFixedLeftHead: $tbFixedLeftHead,
            $tbFixedLeftBox: $tbFixedLeftBox,
            $tbFixedLeftBd: $tbFixedLeftBd,
            $tbFixedRight: $tbFixedRight,
            $tbFixedRightHead: $tbFixedRightHead,
            $tbFixedRightBox: $tbFixedRightBox,
            $tbFixedRightBd: $tbFixedRightBd,
            $tbEmpty: $tbEmpty,
            $tbLoading: $tbLoading,
            tbFilter: tbFilter,
            checkboxFilter: checkboxFilter,
            radioFilter: radioFilter,
            cbAllFilter: cbAllFilter
        };
    };

    /**
     * 递归渲染表格主体部分JSW
     * @param data 数据列表
     * @param indentSize 缩进大小
     * @param isHide 是否默认隐藏
     * @returns {string}
     */
    TreeTable.prototype.renderBodyL = function (data, indentSize, isHide) {
        var options = this.options;
        var treeOption = options.tree;
        indentSize || (indentSize = 0);
        var htmlStr = '';
        for (var i = 0; i < data.length; i++) {
            var d = data[i];
            htmlStr += this.renderBodyTrL(d, indentSize, isHide);
            // 递归渲染子集
            var children = d[treeOption.childName];
            if (children && children.length > 0) {
                htmlStr += this.renderBodyL(children, indentSize + 1, !d[treeOption.openName]);
            }
        }
        // console.log('tt',htmlStr)
        return htmlStr;
    };
    /**
     * 渲染一行数据JSW
     * @param d 行数据
     * @param option 配置
     * @param indentSize 缩进大小
     * @param isHide 是否隐藏
     * @param $tr
     * @returns {string}
     */
    TreeTable.prototype.renderBodyTrL = function (d, indentSize, isHide, $tr) {
        var options = this.options;
        var cols = options.cols;
        var treeOption = options.tree;
        indentSize || (indentSize = 0);
        var htmlStr = '';
        var haveChild = getHaveChild(d, treeOption);
        if ($tr) {
            $tr.data('pid', d[treeOption.pidName] || '');
            $tr.data('have-child', haveChild);
            $tr.data('indent', indentSize);
            $tr.removeClass('ew-tree-table-loading');
        } else {
            var classNames = '';
            if (haveChild && d[treeOption.openName]) {
                classNames += 'ew-tree-table-open';
            }
            if (isHide) {
                classNames += 'ew-tree-tb-hide';
            }
            htmlStr += '<tr class="' + classNames + '" data-id="' + d[treeOption.idName] + '"';
            htmlStr += ' data-pid="' + (d[treeOption.pidName] || '') + '" data-have-child="' + haveChild + '"';
            htmlStr += ' data-indent="' + indentSize + '">';
        }
        for (var j = 0; j < cols.length; j++) {
            var $td;
            if ($tr) {
                $td = $tr.children('td').eq(j);
            }
            htmlStr += this.renderBodyTdL(d, indentSize, j, $td);
        }
        htmlStr += '</tr>';
        return htmlStr;
    };

    /**
     * 渲染每一个单元格数据JSW
     * @param d 行数据
     * @param indentSize 缩进大小
     * @param index 第几列
     * @param $td
     * @returns {string}
     */
    TreeTable.prototype.renderBodyTdL = function (d, indentSize, index, $td) {
        var options = this.options;
        var col = options.cols[index];
        var treeOption = options.tree;
        var components = this.getComponents();
        var checkboxFilter = components.checkboxFilter;
        var radioFilter = components.radioFilter;
        indentSize || (indentSize = 0);
        if (col.fixed == "left") {

            // 内容填充
            var fieldStr = '';
            if (col.type == 'numbers') {  // 序号列
                fieldStr += '<span class="ew-tree-table-numbers"></span>';
                col.singleLine = false;
            } else if (col.type == 'checkbox') {  // 复选框列
                var attrStr = 'name="' + checkboxFilter + '" lay-filter="' + checkboxFilter + '" value="' + d[treeOption.idName] + '"';
                attrStr += d.LAY_CHECKED ? ' checked="checked"' : '';
                fieldStr += '<input type="checkbox" lay-skin="primary" ' + attrStr + ' class="ew-tree-table-checkbox" />';
                col.singleLine = false;
            } else if (col.type == 'radio') {  // 单选框列
                var attrStr = 'name="' + radioFilter + '" lay-filter="' + radioFilter + '" value="' + d[treeOption.idName] + '"';
                attrStr += d.LAY_CHECKED ? ' checked="checked"' : '';
                fieldStr += '<input type="radio" ' + attrStr + ' class="ew-tree-table-radio" />';
                col.singleLine = false;
            } else if (col.templet) {  // 自定义模板
                if (typeof col.templet == 'function') {
                    fieldStr += col.templet(d);
                } else if (typeof col.templet == 'string') {
                    laytpl($(col.templet).html()).render(d, function (html) {
                        fieldStr += html;
                    });
                }
            } else if (col.toolbar) {  // 工具列
                laytpl($(col.toolbar).html()).render(d, function (html) {
                    fieldStr += html;

                });
            } else if (col.field_name && d[col.field_name] != undefined && d[col.field_name] != null) {  // 普通字段
                fieldStr += d[col.field_name];
            }
            var tdStr = '';
            // 图标列处理
            if (index == treeOption.iconIndex) {
                // 缩进
                for (var k = 0; k < indentSize; k++) {
                    tdStr += '<span class="ew-tree-table-indent"></span>';
                }
                tdStr += '<span class="ew-tree-pack">';
                // 加箭头
                var haveChild = getHaveChild(d, treeOption);
                tdStr += ('<i class="layui-icon ew-tree-table-arrow ' + (haveChild ? '' : 'ew-tree-table-arrow-hide') + ' ' + (options.tree.arrowType || '') + '"></i>');
                // 加图标
                tdStr += treeOption.getIcon(d);
                if (options.tree.onlyIconControl) {
                    tdStr += '</span>';
                    tdStr += ('<span>' + fieldStr + '</span>');
                } else {
                    tdStr += ('<span>' + fieldStr + '</span>');
                    tdStr += '</span>';
                }
            } else {
                tdStr += fieldStr;
            }
            if ($td && col.type != 'numbers') {
                $td.html(tdStr);
            }
            var htmlStr = '<td data-index="' + index + '" ';
            col.field_name && (htmlStr += (' data-field="' + col.field_name + '"'));
            col.edit && (htmlStr += (' data-edit="' + col.edit + '"'));
            col.type && (htmlStr += (' data-type="' + col.type + '"'));
            col.align && (htmlStr += (' align="' + col.align + '"'));  // 对齐方式
            col.style && (htmlStr += (' style="' + col.style + '"'));  // 单元格样式
            col.class && (htmlStr += (' class="' + col.class + '"'));  // 单元格样式
            htmlStr += '>';
            if (col.singleLine) {
                htmlStr += ('<div class="ew-tree-table-td-single"><i class="layui-icon layui-icon-close ew-tree-tips-c"></i><div class="ew-tree-tips">' + tdStr + '</div></div>');
            } else {
                htmlStr += tdStr;
            }
            htmlStr += '</td>';
            return htmlStr;
        }
    };


    /**
     * 递归渲染表格主体部分JSW
     * @param data 数据列表
     * @param indentSize 缩进大小
     * @param isHide 是否默认隐藏
     * @returns {string}
     */
    TreeTable.prototype.renderBodyR = function (data, indentSize, isHide) {
        var options = this.options;
        var treeOption = options.tree;
        indentSize || (indentSize = 0);
        var htmlStr = '';
        for (var i = 0; i < data.length; i++) {
            var d = data[i];
            htmlStr += this.renderBodyTrR(d, indentSize, isHide);
            // 递归渲染子集
            var children = d[treeOption.childName];
            if (children && children.length > 0) {
                htmlStr += this.renderBodyR(children, indentSize + 1, !d[treeOption.openName]);
            }
        }
        // console.log('tt',htmlStr)
        return htmlStr;
    };
    /**
     * 渲染一行数据JSW
     * @param d 行数据
     * @param option 配置
     * @param indentSize 缩进大小
     * @param isHide 是否隐藏
     * @param $tr
     * @returns {string}
     */
    TreeTable.prototype.renderBodyTrR = function (d, indentSize, isHide, $tr) {
        var options = this.options;
        var cols = options.cols;
        var treeOption = options.tree;
        indentSize || (indentSize = 0);
        var htmlStr = '';
        var haveChild = getHaveChild(d, treeOption);
        if ($tr) {
            $tr.data('pid', d[treeOption.pidName] || '');
            $tr.data('have-child', haveChild);
            $tr.data('indent', indentSize);
            $tr.removeClass('ew-tree-table-loading');
        } else {
            var classNames = '';
            if (haveChild && d[treeOption.openName]) {
                classNames += 'ew-tree-table-open';
            }
            if (isHide) {
                classNames += 'ew-tree-tb-hide';
            }
            htmlStr += '<tr class="' + classNames + '" data-id="' + d[treeOption.idName] + '"';
            htmlStr += ' data-pid="' + (d[treeOption.pidName] || '') + '" data-have-child="' + haveChild + '"';
            htmlStr += ' data-indent="' + indentSize + '">';
        }
        for (var j = 0; j < cols.length; j++) {
            var $td;
            if ($tr) {
                $td = $tr.children('td').eq(j);
            }
            htmlStr += this.renderBodyTdR(d, indentSize, j, $td);
        }
        htmlStr += '</tr>';
        return htmlStr;
    };

    /**
     * 渲染每一个单元格数据JSW
     * @param d 行数据
     * @param indentSize 缩进大小
     * @param index 第几列
     * @param $td
     * @returns {string}
     */
    TreeTable.prototype.renderBodyTdR = function (d, indentSize, index, $td) {
        var options = this.options;
        var col = options.cols[index];
        var treeOption = options.tree;
        var components = this.getComponents();
        var checkboxFilter = components.checkboxFilter;
        var radioFilter = components.radioFilter;
        indentSize || (indentSize = 0);
        if (col.fixed == "right") {

            // 内容填充
            var fieldStr = '';
            if (col.type == 'numbers') {  // 序号列
                fieldStr += '<span class="ew-tree-table-numbers"></span>';
                col.singleLine = false;
            } else if (col.type == 'checkbox') {  // 复选框列
                var attrStr = 'name="' + checkboxFilter + '" lay-filter="' + checkboxFilter + '" value="' + d[treeOption.idName] + '"';
                attrStr += d.LAY_CHECKED ? ' checked="checked"' : '';
                fieldStr += '<input type="checkbox" lay-skin="primary" ' + attrStr + ' class="ew-tree-table-checkbox" />';
                col.singleLine = false;
            } else if (col.type == 'radio') {  // 单选框列
                var attrStr = 'name="' + radioFilter + '" lay-filter="' + radioFilter + '" value="' + d[treeOption.idName] + '"';
                attrStr += d.LAY_CHECKED ? ' checked="checked"' : '';
                fieldStr += '<input type="radio" ' + attrStr + ' class="ew-tree-table-radio" />';
                col.singleLine = false;
            } else if (col.templet) {  // 自定义模板
                if (typeof col.templet == 'function') {
                    fieldStr += col.templet(d);
                } else if (typeof col.templet == 'string') {
                    laytpl($(col.templet).html()).render(d, function (html) {
                        fieldStr += html;
                    });
                }
            } else if (col.toolbar) {  // 工具列
                laytpl($(col.toolbar).html()).render(d, function (html) {
                    fieldStr += html;

                });
            } else if (col.field_name && d[col.field_name] != undefined && d[col.field_name] != null) {  // 普通字段
                fieldStr += d[col.field_name];
            }
            var tdStr = '';
            // 图标列处理
            if (index == treeOption.iconIndex) {
                // 缩进
                for (var k = 0; k < indentSize; k++) {
                    tdStr += '<span class="ew-tree-table-indent"></span>';
                }
                tdStr += '<span class="ew-tree-pack">';
                // 加箭头
                var haveChild = getHaveChild(d, treeOption);
                tdStr += ('<i class="layui-icon ew-tree-table-arrow ' + (haveChild ? '' : 'ew-tree-table-arrow-hide') + ' ' + (options.tree.arrowType || '') + '"></i>');
                // 加图标
                tdStr += treeOption.getIcon(d);
                if (options.tree.onlyIconControl) {
                    tdStr += '</span>';
                    tdStr += ('<span>' + fieldStr + '</span>');
                } else {
                    tdStr += ('<span>' + fieldStr + '</span>');
                    tdStr += '</span>';
                }
            } else {
                tdStr += fieldStr;
            }
            if ($td && col.type != 'numbers') {
                $td.html(tdStr);
            }
            var htmlStr = '<td data-index="' + index + '" ';
            col.field_name && (htmlStr += (' data-field="' + col.field_name + '"'));
            col.edit && (htmlStr += (' data-edit="' + col.edit + '"'));
            col.type && (htmlStr += (' data-type="' + col.type + '"'));
            col.align && (htmlStr += (' align="' + col.align + '"'));  // 对齐方式
            col.style && (htmlStr += (' style="' + col.style + '"'));  // 单元格样式
            col.class && (htmlStr += (' class="' + col.class + '"'));  // 单元格样式
            htmlStr += '>';
            if (col.singleLine) {
                htmlStr += ('<div class="ew-tree-table-td-single"><i class="layui-icon layui-icon-close ew-tree-tips-c"></i><div class="ew-tree-tips">' + tdStr + '</div></div>');
            } else {
                htmlStr += tdStr;
            }
            htmlStr += '</td>';
            return htmlStr;
        }
    };




    /**
     * 递归渲染表格主体部分
     * @param data 数据列表
     * @param indentSize 缩进大小
     * @param isHide 是否默认隐藏
     * @returns {string}
     */
    TreeTable.prototype.renderBody = function (data, indentSize, isHide) {
        var options = this.options;
        var treeOption = options.tree;
        indentSize || (indentSize = 0);
        var htmlStr = '';
        for (var i = 0; i < data.length; i++) {
            var d = data[i];
            htmlStr += this.renderBodyTr(d, indentSize, isHide);
            // 递归渲染子集
            var children = d[treeOption.childName];
            if (children && children.length > 0) {
                htmlStr += this.renderBody(children, indentSize + 1, !d[treeOption.openName]);
            }
        }
        // console.log('tt',htmlStr)
        return htmlStr;
    };

    /**
     * 渲染一行数据
     * @param d 行数据
     * @param option 配置
     * @param indentSize 缩进大小
     * @param isHide 是否隐藏
     * @param $tr
     * @returns {string}
     */
    TreeTable.prototype.renderBodyTr = function (d, indentSize, isHide, $tr) {
        var options = this.options;
        var cols = options.cols;
        var treeOption = options.tree;
        indentSize || (indentSize = 0);
        var htmlStr = '';
        var haveChild = getHaveChild(d, treeOption);
        if ($tr) {
            $tr.data('pid', d[treeOption.pidName] || '');
            $tr.data('have-child', haveChild);
            $tr.data('indent', indentSize);
            $tr.removeClass('ew-tree-table-loading');
        } else {
            var classNames = '';
            if (haveChild && d[treeOption.openName]) {
                classNames += 'ew-tree-table-open';
            }
            if (isHide) {
                classNames += 'ew-tree-tb-hide';
            }
            htmlStr += '<tr class="' + classNames + '" data-id="' + d[treeOption.idName] + '"';
            htmlStr += ' data-pid="' + (d[treeOption.pidName] || '') + '" data-have-child="' + haveChild + '"';
            htmlStr += ' data-indent="' + indentSize + '">';
        }
        for (var j = 0; j < cols.length; j++) {
            var $td;
            if ($tr) {
                $td = $tr.children('td').eq(j);
            }
            htmlStr += this.renderBodyTd(d, indentSize, j, $td);
        }
        htmlStr += '</tr>';
        return htmlStr;
    };

    /**
     * 渲染每一个单元格数据
     * @param d 行数据
     * @param indentSize 缩进大小
     * @param index 第几列
     * @param $td
     * @returns {string}
     */
    TreeTable.prototype.renderBodyTd = function (d, indentSize, index, $td) {
        var options = this.options;
        var col = options.cols[index];
        var treeOption = options.tree;
        var components = this.getComponents();
        var checkboxFilter = components.checkboxFilter;
        var radioFilter = components.radioFilter;
        indentSize || (indentSize = 0);
        // 内容填充
        var fieldStr = '';
        if (col.type == 'numbers') {  // 序号列
            fieldStr += '<span class="ew-tree-table-numbers"></span>';
            col.singleLine = false;
        } else if (col.type == 'checkbox') {  // 复选框列
            var attrStr = 'name="' + checkboxFilter + '" lay-filter="' + checkboxFilter + '" value="' + d[treeOption.idName] + '"';
            attrStr += d.LAY_CHECKED ? ' checked="checked"' : '';
            fieldStr += '<input type="checkbox" lay-skin="primary" ' + attrStr + ' class="ew-tree-table-checkbox" />';
            col.singleLine = false;
        } else if (col.type == 'radio') {  // 单选框列
            var attrStr = 'name="' + radioFilter + '" lay-filter="' + radioFilter + '" value="' + d[treeOption.idName] + '"';
            attrStr += d.LAY_CHECKED ? ' checked="checked"' : '';
            fieldStr += '<input type="radio" ' + attrStr + ' class="ew-tree-table-radio" />';
            col.singleLine = false;
        } else if (col.templet) {  // 自定义模板
            if (typeof col.templet == 'function') {
                fieldStr += col.templet(d);
            } else if (typeof col.templet == 'string') {
                laytpl($(col.templet).html()).render(d, function (html) {
                    fieldStr += html;
                });
            }
        } else if (col.toolbar) {  // 工具列
            laytpl($(col.toolbar).html()).render(d, function (html) {
                fieldStr += html;

            });
            col.singleLine = false;
        } else if (col.field_name && d[col.field_name] != undefined && d[col.field_name] != null) {  // 普通字段
            fieldStr += d[col.field_name];
        }
        var tdStr = '';
        // 图标列处理
        if (index == treeOption.iconIndex) {
            // 缩进
            for (var k = 0; k < indentSize; k++) {
                tdStr += '<span class="ew-tree-table-indent"></span>';
            }
            tdStr += '<span class="ew-tree-pack">';
            // 加箭头
            var haveChild = getHaveChild(d, treeOption);
            tdStr += ('<i class="layui-icon ew-tree-table-arrow ' + (haveChild ? '' : 'ew-tree-table-arrow-hide') + ' ' + (options.tree.arrowType || '') + '"></i>');
            // 加图标
            tdStr += treeOption.getIcon(d);
            if (options.tree.onlyIconControl) {
                tdStr += '</span>';
                tdStr += ('<span>' + fieldStr + '</span>');
            } else {
                tdStr += ('<span>' + fieldStr + '</span>');
                tdStr += '</span>';
            }
        } else {
            tdStr += fieldStr;
        }
        if ($td && col.type != 'numbers') {
            $td.html(tdStr);
        }
        var htmlStr = '<td data-index="' + index + '" ';
        col.field_name && (htmlStr += (' data-field="' + col.field_name + '"'));
        col.edit && (htmlStr += (' data-edit="' + col.edit + '"'));
        col.type && (htmlStr += (' data-type="' + col.type + '"'));
        col.align && (htmlStr += (' align="' + col.align + '"'));  // 对齐方式
        col.style && (htmlStr += (' style="' + col.style + '"'));  // 单元格样式
        col.class && (htmlStr += (' class="' + col.class + '"'));  // 单元格样式
        htmlStr += '>';
        if (col.singleLine) {
            htmlStr += ('<div class="ew-tree-table-td-single"><i class="layui-icon layui-icon-close ew-tree-tips-c"></i><div class="ew-tree-tips">' + tdStr + '</div></div>');
        } else {
            htmlStr += tdStr;
        }
        htmlStr += '</td>';
        return htmlStr;
    };

    /**
     * 异步加载渲染
     * @param data 父级数据
     * @param $tr 父级dom
     */
    TreeTable.prototype.renderBodyAsync = function (d, $tr) {
        var that = this;
        var options = this.options;
        var components = this.getComponents();
        var $tbEmpty = components.$tbEmpty;
        var $tbLoading = components.$tbLoading;
        // 显示loading
        if ($tr) {
            $tr.addClass('ew-tree-table-loading');
            $tr.children('td').find('.ew-tree-pack').children('.ew-tree-table-arrow').addClass('layui-anim layui-anim-rotate layui-anim-loop');
        } else {
            if (options.data && options.data.length > 0) {
                $tbLoading.addClass('ew-loading-float');
            }
            $tbLoading.show();
            $tbEmpty.hide();
        }
        // 请求数据
        options.reqData(d, function (res) {
            if (options.tree.isPidData) {
                res = treeTb.pidToChildren(res, options.tree.idName, options.tree.pidName, options.tree.childName);
            }
            // console.log('请求数据',res, d, $tr)
            that.renderBodyData(res, d, $tr);  // 渲染内容
            // 移除loading
            if ($tr) {
                $tr.removeClass('ew-tree-table-loading');
                $tr.children('td').find('.ew-tree-pack').children('.ew-tree-table-arrow').removeClass('layui-anim layui-anim-rotate layui-anim-loop');
            } else {
                $tbLoading.hide();
                $tbLoading.removeClass('ew-loading-float');
                components.$tbFixedLeft.removeClass('ew-tree-hide');
                components.$tbFixedRight.removeClass('ew-tree-hide');
                // 是否为空
                if (!res || res.length == 0) {
                    $tbEmpty.show();
                } else {
                    $tbEmpty.hide();
                }
            }
        });
    };

    /**
     * 根据数据渲染body
     * @param data  数据集合
     * @param option 配置项
     * @param d 父级数据
     * @param $tr 父级dom
     */
    TreeTable.prototype.renderBodyData = function (data, d, $tr) {
        var that = this;
        var options = this.options;
        var components = this.getComponents();
        var $view = components.$view;
        var $table = components.$table;
        var $tbFixedLeftBd = components.$tbFixedLeftBd;
        var $tbFixedRightBd = components.$tbFixedRightBd;
        var tbFilter = components.tbFilter;
        addPidField(data, options.tree, d);  // 补充pid字段
        // 更新到数据
        if (d == undefined) {
            options.data = data;
        } else {
            console.log('else',d,data)
            data = d[options.tree.childName];
        }
        var indent;
        if ($tr) {
            indent = parseInt($tr.data('indent')) + 1;
        }
        var htmlStr = this.renderBody(data, indent);
        var htmlStrL = this.renderBodyL(data, indent);
        var htmlStrR = this.renderBodyR(data, indent);
        if ($tr) {
            var _id = $tr.data('id');
            var $trArr = $('tr[data-id=' + _id + ']');
            for (var i = 0; i < $trArr.length; i++) {
                
                var _$tr = $($trArr[i]);
                // 移除旧dom
                _$tr.nextAll('tr').each(function () {
                    if (parseInt($(this).data('indent')) <= (indent - 1)) {
                        return false;
                    }
                    $(this).remove();
                });
                // 渲染新dom
                if (_$tr.closest('.layui-table-fixed-l').length) {
                    _$tr.after(htmlStrL);
                } if (_$tr.closest('.layui-table-fixed-r').length) {
                    _$tr.after(htmlStrR);
                } else {
                    _$tr.after(htmlStr);
                }
                _$tr.addClass('ew-tree-table-open');
            }

        } else {
            $table.children('tbody').html(htmlStr);
            $tbFixedLeftBd.children('tbody').html(htmlStrL);
            $tbFixedRightBd.children('tbody').html(htmlStrR);
        }
        form.render(null, tbFilter);  // 渲染表单元素
        this.renderNumberCol();  // 渲染序号列
        this.checkIndeterminateCB();  // 恢复复选框半选状态
        if ($tr) {
            // 更新父级复选框状态
            this.checkParentCB($tr);
            $tr.prevAll('tr').each(function () {
                var tInd = parseInt($(this).data('indent'));
                if (tInd < (indent - 1)) {
                    that.checkParentCB($(this));
                    indent = tInd + 1;
                }
            });
        }
        this.checkChooseAllCB();  // 联动全选框
        updateFixedTbHead($view);
    };

    /**
     * 联动子级复选框状态
     * @param $tr 当前tr的dom
     * @param checked
     */
    TreeTable.prototype.checkSubCB = function ($tr, checked) {
        var that = this;
        var components = this.getComponents();
        var cbFilter = components.checkboxFilter;
        var indent = -1, $trList;

        if ($tr.is('tbody')) {
            var $tbodyarr = $tr.closest('.ew-tree-table').find('.ew-tree-table-box').find('tbody')
            for (var i = 0; i < $tbodyarr.length; i++) {
                var _$tr = $($tbodyarr[i]);
                $trList = _$tr.children('tr');
                $trList.each(function () {
                    if (parseInt($(this).data('indent')) <= indent) {
                        return false;
                    }
                    var $cb = $(this).children('td').find('input[name="' + cbFilter + '"]');
                    $cb.prop('checked', checked);
                    if (checked) {
                        $cb.data('indeterminate', 'false');
                        $cb.next('.layui-form-checkbox').addClass('layui-form-checked');
                        $cb.next('.layui-form-checkbox').removeClass('ew-form-indeterminate');
                    } else {
                        $cb.data('indeterminate', 'false');
                        $cb.next('.layui-form-checkbox').removeClass('layui-form-checked ew-form-indeterminate');
                    }
                    that.update($(this).data('id'), { LAY_CHECKED: checked });  // 同步更新数据
                });
            }
        } else {
            var _id = $tr.data('id');
            var trarr = $('tr[data-id=' + _id + ']');
            indent = parseInt($tr.data('indent'));
            for (var i = 0; i < trarr.length; i++) {
                var _$tr = $(trarr[i]);
                $trList = _$tr.nextAll('tr')
                $trList.each(function () {
                    if (parseInt($(this).data('indent')) <= indent) {
                        return false;
                    }
                    var $cb = $(this).children('td').find('input[name="' + cbFilter + '"]');
                    $cb.prop('checked', checked);
                    if (checked) {
                        $cb.data('indeterminate', 'false');
                        $cb.next('.layui-form-checkbox').addClass('layui-form-checked');
                        $cb.next('.layui-form-checkbox').removeClass('ew-form-indeterminate');
                    } else {
                        $cb.data('indeterminate', 'false');
                        $cb.next('.layui-form-checkbox').removeClass('layui-form-checked ew-form-indeterminate');
                    }
                    that.update($(this).data('id'), { LAY_CHECKED: checked });  // 同步更新数据
                });

            }


        }



    };

    /**
     * 联动父级复选框状态
     * @param $tr 父级的dom
     */
    TreeTable.prototype.checkParentCB = function ($tr) {
        var that = this;
        var components = this.getComponents();
        var cbFilter = components.checkboxFilter;
        var indent = parseInt($tr.data('indent'));
        var ckNum = 0, unCkNum = 0;

        var _id = $tr.data('id');
        var trarr = $('tr[data-id=' + _id + ']');
        for (var i = 0; i < trarr.length; i++) {
            var _$tr = $(trarr[i]);
            var $cb = _$tr.children('td').find('input[name="' + cbFilter + '"]');
            $cb.prop('checked')
            _$tr.nextAll('tr').each(function () {
                if (parseInt($(this).data('indent')) <= indent) {
                    return false;
                }
                var $cb = $(this).children('td').find('input[name="' + cbFilter + '"]');
                var $cbnxt = $cb.next('.layui-form-checkbox').hasClass('layui-form-checked');
                if ($cb.prop('checked') || $cbnxt) {
                    ckNum++;
                } else {
                    unCkNum++;
                }
            });
            console.log('kk', $cb)
            if (ckNum > 0 && unCkNum == 0) {  // 全选
                $cb.prop('checked', true);
                $cb.data('indeterminate', 'false');
                $cb.next('.layui-form-checkbox').addClass('layui-form-checked');
                $cb.next('.layui-form-checkbox').removeClass('ew-form-indeterminate');
                that.update(_$tr.data('id'), { LAY_CHECKED: true });  // 同步更新数据
            } else if (ckNum == 0 && unCkNum > 0) {  // 全不选
                $cb.prop('checked', false);
                $cb.data('indeterminate', 'false');
                $cb.next('.layui-form-checkbox').removeClass('layui-form-checked ew-form-indeterminate');
                that.update(_$tr.data('id'), { LAY_CHECKED: false });  // 同步更新数据
            } else if (ckNum > 0 && unCkNum > 0) {  // 半选
                $cb.prop('checked', true);
                $cb.data('indeterminate', 'true');
                $cb.next('.layui-form-checkbox').addClass('layui-form-checked ew-form-indeterminate');
                that.update(_$tr.data('id'), { LAY_CHECKED: true });  // 同步更新数据
            }
        }
        console.log('dd', ckNum, unCkNum)
    };

    /** 联动全选复选框 */
    TreeTable.prototype.checkChooseAllCB = function () {
        var components = this.getComponents();
        var cbAllFilter = components.cbAllFilter;
        var cbFilter = components.checkboxFilter;
        var $trs = components.$group.find('.ew-tree-table-box').find('tbody');
        var ckNum = 0, unCkNum = 0;
        // console.log('trs', $trs)
        for (var i = 0; i < $trs.length; i++) {
            var $tbody = $($trs[i]);
            $tbody.children('tr').each(function () {
                var $cb = $(this).children('td').find('input[name="' + cbFilter + '"]');
                if ($cb.prop('checked')) {
                    ckNum++;
                } else {
                    unCkNum++;
                }
            });
            var $cb = $('input[lay-filter="' + cbAllFilter + '"]');
            if (ckNum > 0 && unCkNum == 0) {  // 全选
                $cb.prop('checked', true);
                $cb.data('indeterminate', 'false');
                $cb.next('.layui-form-checkbox').addClass('layui-form-checked');
                $cb.next('.layui-form-checkbox').removeClass('ew-form-indeterminate');
            } else if ((ckNum == 0 && unCkNum > 0) || (ckNum == 0 && unCkNum == 0)) {  // 全不选
                $cb.prop('checked', false);
                $cb.data('indeterminate', 'false');
                $cb.next('.layui-form-checkbox').removeClass('layui-form-checked ew-form-indeterminate');
            } else if (ckNum > 0 && unCkNum > 0) {  // 半选
                $cb.prop('checked', true);
                $cb.data('indeterminate', 'true');
                $cb.next('.layui-form-checkbox').addClass('layui-form-checked ew-form-indeterminate');
            }

        }


    };

    /** 填充序号列 */
    TreeTable.prototype.renderNumberCol = function () {
        var components = this.getComponents();
        var $tbody = components.$table.children('tbody');
        var $tbodyLeft = components.$tbFixedLeftBd.children('tbody');
        $tbody.children('tr').each(function (index) {
            $(this).children('td').find('.ew-tree-table-numbers').text(index + 1);
        });
        $tbodyLeft.children('tr').each(function (index) {
            $(this).children('td').find('.ew-tree-table-numbers').text(index + 1);
        });
    };

    /* 解决form.render之后半选框被重置的问题 */
    TreeTable.prototype.checkIndeterminateCB = function () {
        var components = this.getComponents();
        var cbFilter = components.checkboxFilter;
        $('input[lay-filter="' + cbFilter + '"]').each(function () {
            var $cb = $(this);
            if ($cb.data('indeterminate') == 'true' && $cb.prop('checked')) {
                $cb.next('.layui-form-checkbox').addClass('ew-form-indeterminate');
            }
        });
    };

    /**
     * 搜索数据
     * @param ids 关键字或数据id集合
     */
    TreeTable.prototype.filterData = function (ids) {
        var components = this.getComponents();
        var $trList = components.$table.children('tbody').children('tr');
        if (typeof ids == 'string') {  // 关键字
            var keyword = ids;
            ids = [];
            $trList.each(function () {
                var id = $(this).data('id');
                $(this).children('td').each(function () {
                    if ($(this).text().indexOf(keyword) != -1) {
                        ids.push(id);
                        return false;
                    }
                });
            });
        }
        $trList.addClass('ew-tree-table-filter-hide');
        for (var i = 0; i < ids.length; i++) {
            var $tr = $trList.filter('[data-id="' + ids[i] + '"]');
            $tr.removeClass('ew-tree-table-filter-hide');
            // 联动父级
            var indent = parseInt($tr.data('indent'));
            $tr.prevAll('tr').each(function () {
                var tInd = parseInt($(this).data('indent'));
                if (tInd < indent) {
                    $(this).removeClass('ew-tree-table-filter-hide');  // 联动父级
                    if (!$(this).hasClass('ew-tree-table-open')) {
                        toggleRow($(this));
                    }
                    indent = tInd;
                }
            });
        }
    };

    /** 重置搜索 */
    TreeTable.prototype.clearFilter = function () {
        var components = this.getComponents();
        var $trList = components.$table.children('tbody').children('tr');
        $trList.removeClass('ew-tree-table-filter-hide');
    };

    /** 展开指定行 */
    TreeTable.prototype.expand = function (id, cascade) {
        var components = this.getComponents();
        var $tr = components.$table.children('tbody').children('tr[data-id="' + id + '"]');
        if (!$tr.hasClass('ew-tree-table-open')) {
            $tr.children('td').find('.ew-tree-pack').trigger('click');
        }
        if (cascade == false) {
            return;
        }
        // 联动父级
        var indent = parseInt($tr.data('indent'));
        $tr.prevAll('tr').each(function () {
            var tInd = parseInt($(this).data('indent'));
            if (tInd < indent) {
                if (!$(this).hasClass('ew-tree-table-open')) {
                    $(this).children('td').find('.ew-tree-pack').trigger('click');
                }
                indent = tInd;
            }
        });
    };

    /** 折叠指定行 */
    TreeTable.prototype.fold = function (id, cascade) {
        var components = this.getComponents();
        var $tr = components.$table.children('tbody').children('tr[data-id="' + id + '"]');
        if ($tr.hasClass('ew-tree-table-open')) {
            $tr.children('td').find('.ew-tree-pack').trigger('click');
        }
        if (cascade == false) {
            return;
        }
        // 联动父级
        var indent = parseInt($tr.data('indent'));
        $tr.prevAll('tr').each(function () {
            var tInd = parseInt($(this).data('indent'));
            if (tInd < indent) {
                if ($(this).hasClass('ew-tree-table-open')) {
                    $(this).children('td').find('.ew-tree-pack').trigger('click');
                }
                indent = tInd;
            }
        });
    };

    /** 全部展开 */
    TreeTable.prototype.expandAll = function () {
        var that = this;
        var components = this.getComponents();
        var $trList = components.$table.children('tbody').children('tr');
        $trList.each(function () {
            that.expand($(this).data('id'), false);
        });
    };

    /** 全部折叠 */
    TreeTable.prototype.foldAll = function () {
        var that = this;
        var components = this.getComponents();
        var $trList = components.$table.children('tbody').children('tr');
        $trList.each(function () {
            that.fold($(this).data('id'), false);
        });
    };

    /** 获取当前数据 */
    TreeTable.prototype.getData = function () {
        return this.options.data;
    };

    /** 重载表格 */
    TreeTable.prototype.reload = function (opt) {
        treeTb.render($.extend(this.options, opt));
    };

    /** 根据id更新数据 */
    TreeTable.prototype.update = function (id, fields) {
        var data = getDataById(this.getData(), id, this.options.tree);
        $.extend(data, fields);
    };

    /** 根据id删除数据 */
    TreeTable.prototype.del = function (id) {
        delDataById(this.getData(), id, this.options.tree);
    };

    /** 获取当前选中行 */
    TreeTable.prototype.checkStatus = function (needIndeterminate) {
        (needIndeterminate == undefined) && (needIndeterminate = true);
        var that = this;
        var components = this.getComponents();
        var $table = components.$table;
        var checkboxFilter = components.checkboxFilter;
        var radioFilter = components.radioFilter;
        var list = [];
        // 获取单选框选中数据
        var $radio = $table.find('input[name="' + radioFilter + '"]');
        if ($radio.length > 0) {
            var id = $radio.filter(':checked').val();
            var d = getDataById(this.getData(), id, this.options.tree);
            if (d) {
                list.push(d);
            }
        } else {  // 获取复选框数据
            $table.find('input[name="' + checkboxFilter + '"]:checked').each(function () {
                var id = $(this).val();
                var isIndeterminate = $(this).next('.layui-form-checkbox').hasClass('ew-form-indeterminate');
                if (needIndeterminate || !isIndeterminate) {
                    var d = getDataById(that.getData(), id, that.options.tree);
                    if (d) {
                        d.isIndeterminate = isIndeterminate;
                        list.push(d);
                    }
                }
            });
        }
        return list;
    };

    /** 设置复/单选框选中 */
    TreeTable.prototype.setChecked = function (ids) {
        var components = this.getComponents();
        var $table = components.$table;
        var checkboxFilter = components.checkboxFilter;
        var radioFilter = components.radioFilter;
        var $radio = $table.find('input[name="' + radioFilter + '"]');
        if ($radio.length > 0) {  // 开启了单选框
            $radio.each(function () {
                if (ids[ids.length - 1] == $(this).val()) {
                    $(this).next('.layui-form-radio').trigger('click');
                    return false;
                }
            });
        } else {  // 开启了复选框
            $table.find('input[name="' + checkboxFilter + '"]').each(function () {
                var $cb = $(this);
                var value = $cb.val();
                var $layCb = $cb.next('.layui-form-checkbox');
                for (var i = 0; i < ids.length; i++) {
                    if (value == ids[i]) {
                        var checked = $cb.prop('checked');
                        var indeterminate = $layCb.hasClass('ew-form-indeterminate');
                        if (!checked || indeterminate) {
                            $layCb.trigger('click');
                        }
                    }
                }
            });
        }
    };

    /** 移除全部选中 */
    TreeTable.prototype.removeAllChecked = function () {
        var components = this.getComponents();
        var $table = components.$table;
        var checkboxFilter = components.checkboxFilter;
        this.checkSubCB($table.children('tbody'), false);
    };

    /**
     * 刷新指定父级下的节点
     * @param id 父级id,空则全部刷新
     * @param data 非异步模式替换的数据
     */
    TreeTable.prototype.refresh = function (id, data) {
        if (isClass(id) == 'Array') {
            data = id;
            id = undefined;
        }
        var components = this.getComponents();
        var $table = components.$table;
        var d, $tr;
        if (id != undefined) {
            d = getDataById(this.getData(), id, this.options.tree);
            $tr = $table.children('tbody').children('tr[data-id="' + id + '"]');
        }
        if (data) {  // 数据模式
            components.$tbLoading.addClass('ew-loading-float');
            components.$tbLoading.show();
            this.renderBodyData(data, d, $tr);
            components.$tbLoading.hide();
            components.$tbLoading.removeClass('ew-loading-float');
            components.$tbFixedLeft.removeClass('ew-tree-hide');
            components.$tbFixedRight.removeClass('ew-tree-hide');
            if (data && data.length > 0) {
                components.$tbEmpty.hide();
            } else {
                components.$tbEmpty.show();
            }
        } else {  // 异步模式
            this.renderBodyAsync(d, $tr);
        }
    };
    // 校验变量是否有html结构
    function checkHtml(htmlStr) {
        var  reg = /<[^>]+>/g;
        return reg.test(htmlStr);
    }
    /** 生成表头 */
    function getThead(options) {
        var htmlStr = '<tr>';
        for (var i = 0; i < options.cols.length; i++) {
            var col = options.cols[i];
            htmlStr += '<th data-index="' + i + '" ';
            col.align && (htmlStr += ' align="' + col.align + '"');  // 对齐方式
            htmlStr += ' >';
            if (col.singleLine && col.type != 'checkbox') {  // 单行显示
                htmlStr += '<div class="ew-tree-table-td-single"><i class="layui-icon layui-icon-close ew-tree-tips-c"></i><div class="ew-tree-tips">';
            }
            // 标题
            if (col.type == 'checkbox') {
                htmlStr += options.getAllChooseBox();
            } else if(checkHtml(col.field_label)) {
                htmlStr += (col.field_label || "");
            } else {
                htmlStr += '<span title='+(col.field_label || "")+' class="fw">'+(col.field_label || "")+'</span>';
            }
            if(i==options.tree.iconIndex){
                htmlStr += '<span class="m-l-xs cursor" id="expandAllBtn" title="全部展开"><i class="anticon anticon-plus-square"></i></span><span class="m-l-xs cursor" id="foldAllBtn" title="全部收起"><i class="anticon anticon-minus-square"></i></span>'
            }
            if (col.singleLine) {  // 单行显示
                htmlStr += '</div></div>';
            }
            // 列宽拖拽
            if (!col.unresize && 'checkbox' != col.type && 'radio' != col.type && 'numbers' != col.type && 'space' != col.type) {
                htmlStr += '<span class="ew-tb-resize"></span>';
            }
            htmlStr += '</th>';
        }
        htmlStr += '</tr>';
        return htmlStr;
    }

    /** 生成表头L */
    function getTheadL(options) {
        var htmlStr = '<tr>';
        for (var i = 0; i < options.cols.length; i++) {
            var col = options.cols[i];
            if (col.fixed == 'left') {
                htmlStr += '<td data-index="' + i + '" ';
                col.align && (htmlStr += ' align="' + col.align + '"');  // 对齐方式
                htmlStr += ' >';
                if (col.singleLine && col.type != 'checkbox') {  // 单行显示
                    htmlStr += '<div class="ew-tree-table-td-single"><i class="layui-icon layui-icon-close ew-tree-tips-c"></i><div class="ew-tree-tips">';
                }
                // 标题
                if (col.type == 'checkbox') {
                    htmlStr += options.getAllChooseBox();
                } else if(checkHtml(col.field_label)) {
                    htmlStr += (col.field_label || "");
                } else {
                    htmlStr += (col.field_label || '');
                }
                // 列宽拖拽
                if (!col.unresize && 'checkbox' != col.type && 'radio' != col.type && 'numbers' != col.type && 'space' != col.type) {
                    htmlStr += '<span class="ew-tb-resize"></span>';
                }
                if (col.singleLine) {  // 单行显示
                    htmlStr += '</div></div>';
                }
                htmlStr += '</td>';
            }
        }
        htmlStr += '</tr>';
        return htmlStr;
    }

    /** 生成表头R */
    function getTheadR(options) {
        var htmlStr = '<tr>';
        for (var i = 0; i < options.cols.length; i++) {
            var col = options.cols[i];
            if (col.fixed == 'right' && col.iwidth) {
                htmlStr += '<td data-index="' + i + '" ';
                col.align && (htmlStr += ' align="' + col.align + '"');  // 对齐方式
                htmlStr += ' >';
                if (col.singleLine && col.type != 'checkbox') {  // 单行显示
                    htmlStr += '<div class="ew-tree-table-td-single"><i class="layui-icon layui-icon-close ew-tree-tips-c"></i><div class="ew-tree-tips">';
                }
                // 标题
                if (col.type == 'checkbox') {
                    htmlStr += options.getAllChooseBox();
                } else {
                    htmlStr += (col.field_label || '');
                }
                // 列宽拖拽
                if (!col.unresize && 'checkbox' != col.type && 'radio' != col.type && 'numbers' != col.type && 'space' != col.type) {
                    htmlStr += '<span class="ew-tb-resize"></span>';
                }
                if (col.singleLine) {  // 单行显示
                    htmlStr += '</div></div>';
                }
                htmlStr += '</td>';
            }
        }
        htmlStr += '</tr>';
        return htmlStr;
    }

    /** 生成colgroup */
    function getColgroup(options) {
        var htmlStr = '<colgroup>';
        for (var i = 0; i < options.cols.length; i++) {
            var col = options.cols[i];
            htmlStr += '<col ';
            // 设置宽度
            if (col.iwidth) {
                htmlStr += 'width="' + col.iwidth + '"'
            } else if (col.type == 'space') {  // 空列
                htmlStr += 'width="15"'
            } else if (col.type == 'numbers') {  // 序号列
                htmlStr += 'width="40"'
            } else if (col.type == 'checkbox' || col.type == 'radio') {  // 复/单选框列
                htmlStr += 'width="48"'
            }
            htmlStr += ' />';
        }
        htmlStr += '</colgroup>';
        return htmlStr;
    }

    /** 生成固定列colgroupL */
    function getColgroupL(options) {
        var htmlStr = '<colgroup>';
        for (var i = 0; i < options.cols.length; i++) {
            var col = options.cols[i];
            if (col.fixed == 'left') {
                htmlStr += '<col ';
                // 设置宽度
                if (col.iwidth) {
                    htmlStr += 'width="' + col.iwidth + '"'
                } else if (col.type == 'space') {  // 空列
                    htmlStr += 'width="15"'
                } else if (col.type == 'numbers') {  // 序号列
                    htmlStr += 'width="40"'
                } else if (col.type == 'checkbox' || col.type == 'radio') {  // 复/单选框列
                    htmlStr += 'width="48"'
                }
                htmlStr += ' />';
            }
        }
        htmlStr += '</colgroup>';
        return htmlStr;
    }

    /** 生成固定列colgroupR */
    function getColgroupR(options) {
        var htmlStr = '<colgroup>';
        for (var i = 0; i < options.cols.length; i++) {
            var col = options.cols[i];
            if (col.fixed == 'right' && col.iwidth) {
                htmlStr += '<col ';
                // 设置宽度
                if (col.iwidth) {
                    htmlStr += 'width="' + col.iwidth + '"'
                } else if (col.type == 'space') {  // 空列
                    htmlStr += 'width="15"'
                } else if (col.type == 'numbers') {  // 序号列
                    htmlStr += 'width="40"'
                } else if (col.type == 'checkbox' || col.type == 'radio') {  // 复/单选框列
                    htmlStr += 'width="48"'
                }
                htmlStr += ' />';
            }
        }
        htmlStr += '</colgroup>';
        return htmlStr;
    }

    /** 计算table宽度 */
    function getTbWidth(options) {
        var minWidth = 0, widthL = 0, widthR = 0, setWidth = true;
        for (var i = 0; i < options.cols.length; i++) {
            var col = options.cols[i];
            if (col.type == 'space') {  // 空列
                minWidth += 15;
            } else if (col.type == 'numbers') {  // 序号列
                minWidth += 40;
            } else if (col.type == 'checkbox' || col.type == 'radio') {  // 复/单选框列
                minWidth += 48;
            } else if (!col.iwidth || /\d+%$/.test(col.iwidth)) {  // 列未固定宽度
                setWidth = false;
                if (col.minWidth) {
                    minWidth += col.minWidth;
                } else if (options.cellMinWidth) {
                    minWidth += options.cellMinWidth;
                }
            } else {  // 列固定宽度
                minWidth += col.iwidth;
            }
            if (col.fixed == 'left') {
                if (col.type == 'space') {  // 空列
                    widthL += 15;
                } else if (col.type == 'numbers') {  // 序号列
                    widthL += 40;
                } else if (col.type == 'checkbox' || col.type == 'radio') {  // 复/单选框列
                    widthL += 48;
                } else if (!col.iwidth || /\d+%$/.test(col.iwidth)) {  // 列未固定宽度
                    setWidth = false;
                    if (col.minWidth) {
                        widthL += col.minWidth;
                    } else if (options.cellMinWidth) {
                        widthL += options.cellMinWidth;
                    }
                } else {
                    widthL += col.iwidth;
                }

            }
            if (col.fixed == 'right' && col.iwidth) {
                widthR += col.iwidth;
            }
        }
        return { minWidth: minWidth, widthL: widthL, widthR: widthR, setWidth: setWidth };
    }

    /** 生成全选按钮 */
    function getAllChooseBox(options) {
        var tbFilter = $(options.elem).next().attr('lay-filter');
        var cbAllFilter = 'ew_tb_choose_all_' + tbFilter;
        return '<input type="checkbox" lay-filter="' + cbAllFilter + '" lay-skin="primary" class="ew-tree-table-checkbox"/>';
    }

    /** 获取列图标 */
    function getIcon(d, treeOption) {
        if (getHaveChild(d, treeOption)) {
            return '<i class="ew-tree-icon layui-icon layui-icon-layer"></i>';
        } else {
            return '<i class="ew-tree-icon layui-icon layui-icon-file"></i>';
        }
    }

    /** 折叠/展开行 */
    function toggleRow($tr) {
        var _id = $tr.data('id');
        var $trArr = $('tr[data-id=' + _id + ']');
        for (var i = 0; i < $trArr.length; i++) {
            var _$tr = $($trArr[i]);
            var indent = parseInt(_$tr.data('indent'));
            var isOpen = _$tr.hasClass('ew-tree-table-open');
            if (isOpen) {  // 折叠
                _$tr.removeClass('ew-tree-table-open');
                _$tr.nextAll('tr').each(function () {
                    if (parseInt($(this).data('indent')) <= indent) {
                        return false;
                    }
                    $(this).addClass('ew-tree-tb-hide');
                });
            } else {  // 展开
                _$tr.addClass('ew-tree-table-open');
                var hideInd;
                _$tr.nextAll('tr').each(function () {
                    var ind = parseInt($(this).data('indent'));
                    if (ind <= indent) {
                        return false;
                    }
                    if (hideInd != undefined && ind > hideInd) {
                        return true;
                    }
                    $(this).removeClass('ew-tree-tb-hide');
                    if (!$(this).hasClass('ew-tree-table-open')) {
                        hideInd = parseInt($(this).data('indent'));
                    } else {
                        hideInd = undefined;
                    }
                });
            }
        }

        updateFixedTbHead($tr.parent().parent().parent().parent().parent());
    }

    /** 固定表头滚动条补丁 */
    function updateFixedTbHead($view) {
        var $group = $view.children('.ew-tree-table-group');
        var $headBox = $group.children('.ew-tree-table-head');
        var $tbBox = $group.children('.ew-tree-table-box');
        var sWidth = $tbBox.width() - $tbBox.prop('clientWidth');
        if (sWidth > 0) {
            $headBox.css('border-right', sWidth + 'px solid #f2f2f2');
        } else {
            $headBox.css('border-right', 'none');
        }
    }

    // 监听窗口大小改变
    $(window).resize(function () {
        $('.ew-tree-table').each(function () {
            updateFixedTbHead($(this));
            var $tbBox = $(this).children('.ew-tree-table-group').children('.ew-tree-table-box');
            var $tbBoxFixed = $(this).children('.ew-tree-table-group').children('.layui-table-fixed').children('.ew-tree-table-box');
            var full = $tbBox.attr('ew-tree-full');
            var fullr = $tbBoxFixed.attr('ew-tree-full');
            if (full && device.ie && device.ie < 10) {
                $tbBox.css('height', getPageHeight() - full);
            }
            if (fullr && device.ie && device.ie < 10) {
                $tbBoxFixed.css('height', getPageHeight() - full);
            }
        });
    });

    // 表格溢出点击展开功能
    $(document).on('mouseenter', '.ew-tree-table td', function () {
        var $tdSingle = $(this).children('.ew-tree-table-td-single');
        var $content = $tdSingle.children('.ew-tree-tips');
        if ($tdSingle.length > 0 && $content.prop('scrollWidth') > $content.outerWidth()) {
            $(this).append('<div class="layui-table-grid-down"><i class="layui-icon layui-icon-down"></i></div>');
        }
    }).on('mouseleave', '.ew-tree-table td', function () {
        $(this).children('.layui-table-grid-down').remove();
    });
    // 点击箭头展开
    $(document).on('click', '.ew-tree-table td>.layui-table-grid-down', function (e) {
        hideAllTdTips();
        var $tdSingle = $(this).parent().children('.ew-tree-table-td-single');
        $tdSingle.addClass('ew-tree-tips-open');
        var $box = $tdSingle.parents().filter('.ew-tree-table-box');
        if ($box.length <= 0) {
            $box = $tdSingle.parents().filter('.ew-tree-table-head');
        }
        if (($tdSingle.outerWidth() + $tdSingle.parent().offset().left) > $box.offset().left + $box.outerWidth()) {
            $tdSingle.addClass('ew-show-left');
        }
        if (($tdSingle.outerHeight() + $tdSingle.parent().offset().top) > $box.offset().top + $box.outerHeight()) {
            $tdSingle.addClass('ew-show-bottom');
        }
        e.stopPropagation();
    });
    // 点击关闭按钮关闭
    $(document).on('click', '.ew-tree-table .ew-tree-tips-c', function (e) {
        hideAllTdTips();
    });
    // 点击空白部分关闭
    $(document).on('click', function () {
        hideAllTdTips();
    });
    $(document).on('click', '.ew-tree-table-td-single.ew-tree-tips-open', function (e) {
        e.stopPropagation();
    });

    /* 关闭所有单元格溢出提示框 */
    function hideAllTdTips() {
        var $single = $('.ew-tree-table-td-single');
        $single.removeClass('ew-tree-tips-open');
        $single.removeClass('ew-show-left');
    }

    /** 判断是否还有子节点 */
    function getHaveChild(d, treeOption) {
        var haveChild = false;
        if (d[treeOption.haveChildName] != undefined) {
            haveChild = d[treeOption.haveChildName];
            haveChild = haveChild == true || haveChild == 'true';
        } else if (d[treeOption.childName]) {
            haveChild = d[treeOption.childName].length > 0;
        }
        return haveChild;
    }

    /** 补充pid字段 */
    function addPidField(data, treeOption, parent) {
        for (var i = 0; i < data.length; i++) {
            if (parent) {
                data[i][treeOption.pidName] = parent[treeOption.idName];
            }
            if (data[i][treeOption.childName] && data[i][treeOption.childName].length > 0) {
                addPidField(data[i][treeOption.childName], treeOption, data[i]);
            }
        }
    }

    /** 根据id获取数据 */
    function getDataById(data, id, treeOption) {
        // console.log('cc',data)
        for (var i = 0; i < data.length; i++) {
            if (data[i][treeOption.idName] == id) {
                return data[i];
            }
            if (data[i][treeOption.childName] && data[i][treeOption.childName].length > 0) {
                var d = getDataById(data[i][treeOption.childName], id, treeOption);
                if (d != undefined) {
                    return d;
                }
            }
        }
    }

    /** 根据id删除数据 */
    function delDataById(data, id, treeOption) {
        for (var i = 0; i < data.length; i++) {
            if (data[i][treeOption.idName] == id) {
                data.splice(i, 1);
                return true;
            }
            if (data[i][treeOption.childName] && data[i][treeOption.childName].length > 0) {
                var rs = delDataById(data[i][treeOption.childName], id, treeOption);
                if (rs) {
                    return true;
                }
            }
        }
    }

    /** 获取顶级的pId */
    function getPids(list, idName, pidName) {
        var pids = [];
        for (var i = 0; i < list.length; i++) {
            var hasPid = false;
            for (var j = 0; j < list.length; j++) {
                if (i != j && list[j][idName] == list[i][pidName]) {
                    hasPid = true;
                }
            }
            if (!hasPid) {
                pids.push(list[i][pidName]);
            }
        }
        return pids;
    }

    /** 判断pId是否相等 */
    function pidEquals(pId, pIds) {
        if (isClass(pIds) == 'Array') {
            for (var i = 0; i < pIds.length; i++) {
                if (pId == pIds[i]) {
                    return true;
                }
            }
        } else {
            return pId == pIds;
        }
        return false;
    }

    /** 获取变量类型 */
    function isClass(o) {
        if (o === null)
            return 'Null';
        if (o === undefined)
            return 'Undefined';
        return Object.prototype.toString.call(o).slice(8, -1);
    }

    /* 获取浏览器高度 */
    function getPageHeight() {
        return document.documentElement.clientHeight || document.body.clientHeight;
    }

    /* 获取浏览器宽度 */
    function getPageWidth() {
        return document.documentElement.clientWidth || document.body.clientWidth;
    }

    /** 对外提供的方法 */
    var treeTb = {
        /* 渲染 */
        render: function (options) {
            return new TreeTable(options);
        },
        /* 事件监听 */
        on: function (events, callback) {
            return layui.onevent.call(this, MOD_NAME, events, callback);
        },
        /* pid转children形式 */
        pidToChildren: function (data, idName, pidName, childName, pId) {
            childName || (childName = 'children');
            var newList = [];
            for (var i = 0; i < data.length; i++) {
                (pId == undefined) && (pId = getPids(data, idName, pidName));
                if (pidEquals(data[i][pidName], pId)) {
                    var children = this.pidToChildren(data, idName, pidName, childName, data[i][idName]);
                    (children.length > 0) && (data[i][childName] = children);
                    newList.push(data[i]);
                }
            }
            return newList;
        }
    };

    exports('treeTable', treeTb);
});