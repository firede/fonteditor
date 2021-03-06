/**
 * @file main.js
 * @author mengke01
 * @date
 * @description
 * ttf管理器
 */

define(
    function(require) {

        var GLYFViewer = require('./widget/glyfviewer');
        var GLYFEditor = require('./widget/glyfeditor');
        var ProjectViewer = require('./widget/projectviewer');
        var TTFManager = require('./widget/ttfmanager');
        var program = require('./widget/program');
        var controller = require('./controller/default');
        var actions = require('./widget/actions');

        // 打开文件
        function onUpFile(e) {
            var file = e.target.files[0];
            if (program.data.action == 'open' && program.loader.supportLoad(file.name)) {
                program.loader.load(file, {
                    type: file.name.slice(file.name.lastIndexOf('.') + 1).toLowerCase(),
                    success: function(imported) {
                        program.viewer.clearSelected();
                        program.ttfManager.set(imported);
                        program.data.projectName = null;
                    }
                });
            }
            else if (program.data.action == 'import' && program.loader.supportImport(file.name)) {
                if (program.ttfManager.get()) {

                    var ext = file.name.slice(file.name.lastIndexOf('.') + 1).toLowerCase();
                    var reg = new RegExp('\.'+ ext +'$', 'i');
                    var files = Array.prototype.slice.call(e.target.files).filter(function(f) {
                        return reg.test(file.name);
                    });

                    files.forEach(function(f) {
                        program.loader.load(f, {
                            type: ext,
                            success: function(imported) {
                                if (imported.glyf.length) {
                                    program.ttfManager.merge(imported, {scale: true});
                                }
                            }
                        });
                    });
                }
            }
            else {
                alert('无法识别文件类型!');
            }

            e.target.value = '';
        }

        // 绑定组件
        function bindEvent() {
            $('.navbar').delegate('[data-action]', 'click',  function(e) {
                var action = $(this).attr('data-action');
                if (actions[action]) {
                    program.data.action = action;
                    actions[action].call(this, e);
                }
            });

            $('#export-btn').on('mouseup', actions['export-file']);
            $('#export-btn-woff').on('mouseup', actions['export-file']);
            $('#export-btn-svg').on('mouseup', actions['export-file']);
            $('#export-btn-eot').on('mouseup', actions['export-file']);
            $('#export-btn-zip').on('mouseup', actions['export-file']);

            document.getElementById('font-import').addEventListener('change', onUpFile);
        }

        var entry = {

            /**
             * 初始化
             */
            init: function () {
                bindEvent();

                // glyf查看器
                program.viewer = new GLYFViewer($('#glyf-list'));

                // 字体查看器
                program.editor = new GLYFEditor($('#glyf-editor'));

                // 项目管理
                program.project = require('./widget/project');
                program.projectViewer = new ProjectViewer($('#project-list'));

                // ttf管理
                program.ttfManager = new TTFManager();

                // 导入导出器
                program.loader = require('./widget/loader');
                program.exporter = require('./widget/exporter');

                // 预览器
                program.previewer = require('./widget/previewer');

                controller.init(program);

                // 加载项目
                program.projectViewer.show(program.project.items());

            }
        };

        entry.init();

        return entry;
    }
);
