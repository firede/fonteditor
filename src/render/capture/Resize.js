/**
 * @file Resize.js
 * @author mengke01
 * @date 
 * @description
 * resize捕获器
 */


define(
    function(require) {

        var lang = require('common/lang');
        var observable = require('common/observable');

        /**
         * 键盘按键
         * @param {MouseEvent} e 事件
         * 
         * @return {Object} 按键列表
         */
        function getEvent(e) {
            return {
                originEvent: e
            };
        }

        /**
         * 按下弹起事件
         * 
         * @param {Object} e 事件参数
         */
        function resizedetect(e) {
            
            if(false === this.events.resize) {
                return;
            }

            var event = getEvent(e);
            this.fire('resize', event);
        }

        /**
         * 鼠标动作捕获器
         * 
         * @constructor
         * @param {HTMLElement} main 控制元素
         * @param {Object} options 参数选项
         * @param {HTMLElement} options.main 监控对象
         */
        function ResizeCapture(main, options) {
            this.main = main;
            options = options || {};
            this.events = options.events || {};
            this.debounce = options.debounce || 200;
            this.handlers = {
                resize: lang.debounce(lang.bind(resizedetect, this), this.debounce)
            };
            
            this.start();
        }


        lang.extend(ResizeCapture.prototype, {

            /**
             * 开始监听
             * 
             * @return {this}
             */
            start: function() {

                if (!this.listening) {
                    this.listening = true;
                    window.addEventListener('resize', this.handlers.resize, false);
                }

                return this;
            },

            /**
             * 停止监听
             * 
             * @return {this}
             */
            stop: function() {

                if (this.listening) {
                    this.listening = false;
                    window.removeEventListener('resize', this.handlers.resize);
                }

                return this;
            },

            /**
             * 是否监听中
             * 
             * @return {boolean} 是否
             */
            isListening: function() {
                return !!this.listening;
            },

            /**
             * 注销
             */
            dispose: function() {
                this.stop();
                this.main = this.events = null;
                this.un();
            }
        });

        observable.mixin(ResizeCapture.prototype);

        return ResizeCapture;
    }
);
