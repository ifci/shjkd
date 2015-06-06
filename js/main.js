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
        },
        anim: function(opts){
            var defaults = {
                v: '0.0.1',
                delay: 200,   //延迟触发的距离
                ease: 'fadeInUp'
            }, options = $.extend(defaults, opts);
            return this.each(function(i) {
                var ease = $(this).attr('anim-ease') || options.ease,t = $(this);
                var bottom_of_object, bottom_of_window;   //元素距离顶部的值，元素进入视野的高度
                bottom_of_object = parseInt($(this).offset().top) + options.delay;
                bottom_of_window = $(window).scrollTop() + $(window).height();
                //console.log(bottom_of_object + "," + bottom_of_window);
                if (bottom_of_window > bottom_of_object) {
                    return $(this).addClass("active animated " + ease);
                }
            })
        },
        setRotateX: function(opts){
            var defaults = {
                v: '0.0.1',
                delay: 200,   //延迟触发的距离
                ease: 'fadeInUp'
            }, options = $.extend(defaults, opts);
            return this.each(function(i) {
                var $this = $(this),timer,degTarget=0;
                $this.mousemove(function(ev){
                    var deg = 10,pos = ev.clientX - this.offsetLeft;
                    if(ev.clientX < this.offsetLeft + this.offsetWidth/2){
                        degTarget = (deg - parseFloat(pos/this.offsetWidth*2).toFixed(1)*deg)*-1;
                    }else{
                        degTarget = (pos/this.offsetWidth*2).toFixed(1)*(deg) - deg;
                    }

                    console.log(degTarget);

                    $this.css({
                        "-webkit-transform": "rotateY(" + degTarget + "deg)",
                        "-moz-transform": "rotateY(" + degTarget + "deg)",
                        "-ms-transform": "rotateY(" + degTarget + "deg)",
                        "-o-transform": "rotateY(" + degTarget + "deg)",
                        "transform": "rotateY(" + degTarget + "deg)"
                    })
                });


                $this.mouseout(function(){
                    $this.css({
                        "-webkit-transform": "rotateY(0deg)",
                        "-moz-transform": "rotateY(0deg)",
                        "-ms-transform": "rotateY(0deg)",
                        "-o-transform": "rotateY(0deg)",
                        "transform": "rotateY(0deg)"
                    })
                })
            })
        },
        fader: function(opts) {
            var defaults = {
                v: '0.0.1',
                speed: 500, // 显示的速度
                randomize: false, // 选择随机
                reverse: false, // 选择反向
                animate: 500, // 消失的速度
                callback: function(){} // 回调函数
            }, options = $.extend(defaults, opts);
            var d = 0;
            return this.each(function (i) {
                var t = $(this);
                /*t.hide();
                t.delay(d).fadeTo(options.animate, 1);
                d += options.speed;*/
            })
        }
    });
})(jQuery);
$(function(){

    $('.fader li').fader();


    $(window).scroll(function(){
        $(".anim-row").anim();
    });

    $(".rotateX li").setRotateX();

    $(window).load(function(){
        $(".bannerBox .bd").css('visibility','visible');
        $(".loader1").remove();
    });

    $('.slideTxtBox .hd li').hover(function () {
        var i = $(this).index();
        var img = $('.slideTxtBox .bd li').eq(i).data('src');
        $(".slideTxtBox .list_r").fragmentFly({
            image_url:img,    //背景图路径，当前目录为元素所在的html目录
            cut_dir:"x",    //可选"x"或"y"，默认均分x方向
            ave_part:12,    //均分cut_dir方向，默认切割成12份
            rm_part:[2,3]   //非cut_dir方向上随机切割，默认最小2份，最多3份
        },{
            anime_dir:"down",   //切割子元素动画运行方向，可选"up","down","left","right"，默认为down
            path:[500,800],     //切割子元素动画路长，默认路径最短500px，最长800px
            time:[1000,1300],   //切割子元素动画时长，默认时长最短1000ms，最长1300ms
            opacity:[1,1]       //切割子元素透明度变化，默认初始为1，结束为1(即无渐变)
        });
    }, function(){});


    $('#banner').slide({
        mainCell:".bd ul",
        autoPlay:true,
        autoPage:true,
        titCell:".hd ul",
        effect: "fold",
        mouseOverStop: false,
        interTime: 3000
    });
    $('#kcap').slide({
        mainCell:".bd ul",
        autoPlay:false,
        effect: "fold",
        mouseOverStop: false
    });

    $(".course_b").slide({
        titCell:".hd li",
        mainCell:".bd > ul",
        autoPage:false,
        autoPlay:false,
        trigger:"click"
    });

    $(".slideTxtBox").slide({
        mainCell: ".bd > ul"
    });

    $(".jsgc_px_c").slide({
        titCell:".hd ul",
        mainCell:".bd ul",
        autoPage:true,
        effect:"left",
        autoPlay:true,
        vis:3
    });

    $('.cont_gc li,.cont_jz_list li,.cont_rz_list li,.jsgc_tx_c li').hover(function(){
        $(this).addClass('on').siblings('li').removeClass('on');
    });


    $(".infoList li").bind("click", function () {
        $.ajax({
            url: "",
            type: "post",
            data: { pid: $(this).data('pid') },
            dataType: "json",
            success: function (data) {
                $("#kcap .bd .box img").attr('src', data.img);
                $("#name").text(data.name);
                $("#tit").text(data.tit);
                $("#time").text(data.time);
                $("#address").text(data.address);
                $("#rname").text(data.rname);
                $("#rtxt").text(data.rtxt);
            }
        });
    });


    $(".jsgc_rz_c li,.jsgc_al_c li").hover(function(){
        $(this).addClass('on').siblings('li').removeClass('on');
    });


    var parallax = $('#parallax').parallax();
    //parallax.parallax('enable');

});