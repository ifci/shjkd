"use strict";
/**
 * Created by Administrator on 2015/5/6.
 */

(function($){
    $.fn.extend({
        // coffee方法,事件管理
        coffee: function (obj) {
            for (var eName in obj)
                for (var selector in obj[eName])
                    $(this).on(eName, selector, obj[eName][selector]);
        },
        // 返回顶部
        bTop: function () {
            this.click(function () {
                $("html,body").stop(true).animate({scrollTop: 0}, 1000);
            });
        },
        bNext: function(){
            this.click(function(){
                var top = $(this).offset().top;
                $("html,body").stop(true).animate({scrollTop: top}, 800, 'easeOutCubic');
            })
        },
        layer: function(opts){
            var defaults = {
                v: '0.0.1',
                trigger : 'click',
                type: 'msg',
                shade: [0.3, '#000'],  //弹出遮罩层，默认#000，透明度0.3，关闭为false
                size: [630, 360],   //弹出层尺寸
                scrollbar: true,
                page: ''
            }, options = $.extend(defaults, opts);
            return this.each(function(){
                var Func,lay,page = $(this).data('url');

                if(options.type === 'msg'){
                    Func = function(module, callback){
                        if($('#layer').length < 1){
                            /*$('<div class="layer" id="layer"><div class="layer-box"><div class="layer-box-con"><embed src="' + page + '" quality="high" width="630" height="360" align="middle" allowScriptAccess="always" allowFullScreen="true" mode="transparent" type="application/x-shockwave-flash"></embed></div><div class="layer-close"></div></div></div></div>').appendTo('body');*/
                            $('body').append('<div class="layer" id="layer">');
                            var law = options.size[0]/2;
                            var lah = options.size[1]/2;
                            $("#layer").html('<div class="layer-box"><div class="layer-box-con"><embed src="' + page + '" quality="high" wmode="Transparent" width="630" height="360" align="middle" allowScriptAccess="always" allowFullScreen="true" mode="transparent" type="application/x-shockwave-flash"></embed></div><div class="layer-close"></div></div>');
                            $("#layer .layer-box").css({'margin-left':-law,'margin-top':-lah,'width': options.size[0],'height': options.size[1]});
                        }
                    }
                }else if(options.type === 'confirm'){
                    Func = function(module, callback){
                        $('<div>',{
                            html: '<div class="alertTip"><p class="tips">提示：' + module + '</p><a class="sure" href="javascript:;">确定</a><a class="cancel" href="javascript:;">取消</a></div>',
                            id: 'layer'
                        }).appendTo('body');
                        $('#layer,.alertTip').show();
                        $('.sure').click(callback);
                    }
                }else if(options.type === 'page'){
                    Func = function(module, callback) {

                    }
                }

                //弹出层效果
                var shade = options.shade ? $('<div class="layer-shade" id="layer-shade" style="opacity:'+ (options.shade[0]||options.shade) +'; filter:alpha(opacity='+ (options.shade[0]*100||options.shade*100) +');background-color:'+ (options.shade[1]||'#000') +';"></div>') : '';


                //点击关闭事件
                /*$('#layer,.cancel,.sure').on('click',function(){
                    $(this).remove();
                });*/

                /*$('body').on('click', '.layer-shade', function(){
                    $('#layer').remove();
                    $('body').css('overflow', 'auto');
                });*/

                $('body').coffee({
                    click: {
                        '.layer-shade,.layer-close': function(){
                            $('#layer').remove();
                            $('body').css('overflow', 'auto');
                        }
                    }
                });


                $(this).on(options.trigger, function(){
                    Func(options.page);
                    shade.prependTo('#layer');
                    //浏览器滚动条
                    options.scrollbar ? $('body').css('overflow', 'hidden') : '';
                })
            });
        }
    });
})(jQuery);
$(function(){
    $('#banner').slide({
        mainCell:".bd ul",
        autoPlay:true,
        autoPage:true,
        titCell:".hd ul",
        effect: "fold",
        mouseOverStop: false,
        interTime: 3000
    });

    $('.cont_gc li,.cont_jz_list li').hover(function(){
        $(this).addClass('on').siblings('li').removeClass('on');
    })
})