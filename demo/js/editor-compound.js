/**
 * @file editor-compound.js
 * @author mengke01
 * @date 
 * @description
 * editor 组件测试
 */

define(
    function(require) {

        var editor = require('editor/main');
        var compound = require('./compound-glyf');

        var currentEditor;

        var entry = {

            /**
             * 初始化
             */
            init: function () {
                currentEditor = editor.create($('#render-view').get(0));
                window.editor = currentEditor.setFont(compound);
                //currentEditor.blur();
                
            }
        };

        entry.init();
        
        return entry;
    }
);
