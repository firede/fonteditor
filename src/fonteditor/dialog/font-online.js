/**
 * @file setting-unicode.js
 * @author mengke01
 * @date 
 * @description
 * 在线字体列表
 */

define(
    function(require) {
        var string = require('common/string');
        var onlineList = require('../data/online-font');

        return require('./setting').derive({
            
            title: '在线字体',

            nofooter: true,

            getTpl: function() {
                
                var str = '<div class="list-group">';
                onlineList.forEach(function(item, index) {
                    str += '<a href="'+ item.url +'" class="list-group-item">'
                        + '<span class="from">'+ string.encodeHTML(item.from) +'</span>'
                        + (index + 1) + '. '
                        + string.encodeHTML(item.name) 
                        + '</a>';
                });
                str += '</div>';
                return str;
            },

            set: function() {
                var me = this;
                var dialog = this.getDialog();
                dialog.find('.list-group').delegate('.list-group-item', 'click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var url = this.href;
                    dialog.find('.list-group').off('[data-url]', 'click').remove();
                    me.options.onChange && me.options.onChange.call(this, decodeURIComponent(url));
                    $('#model-dialog').modal('hide');
                });
            }
        });
    }
);
