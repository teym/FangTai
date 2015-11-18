$(function(){
	var init = {
		base : function(){
            init.event();
            init.resize();//获取屏幕
            clickStyle({box:".header-nav li",class:"active"});
            var $malfunction = $(".malfunction-status"),
                $len         = $malfunction.length,
                $num
            setInterval(function(){
                $malfunction.eq(random(0,$len-1)).show().siblings().hide();
            },1000);
		},
		event : function(){
            //删除净水机
            $(".nav-WaterPurifier li:not(.add-WaterPurifier)").bind("touchstart",function(e){
                window.startVal = window.moveVal = event.touches[0].pageX;
                }).bind("touchmove",function(){
                    window.moveVal = event.touches[0].pageX;
                    //左滑效果
                    var $distance = window.startVal-window.moveVal,
                        $width    = $(this).width(),
                        $val;
                    if(-$distance>0){
                        $val=0;
                    }else{
                        $val=-$distance;
                    }
                    $(this).css({left:$val,opacity:1-($distance/$width)});
                    return false;
                }).bind("touchend",function(){
                    //左滑效果
                    var $distance = window.startVal-window.moveVal,
                        $width    = $(this).width(),
                        $val      = 1-($distance/$width);
                    if($val>=0.7){//退回，不取消
                        $(this).animate({left:0,opacity:1},500);
                    }else{//取消
                        $(this).animate({left:-$width,opacity:0},500,function(){
                            $(this).remove();
                        });
                    }
                    return false;
                    //$(this).css({left:$val,opacity:1-(-$distance/$width)});
            });
            /*//替换净水机
            $("body").on("click",".icon-change",function(){
                $(".cancel-binding").css({display:"table"});
                return false;
            });
            //删除净水机
            $("body").on("click",".icon-remove",function(){
                $(".change-Water").css({display:"table"});
                return false;
            });
            //选中净水机
            $("body").on("touchstart",".nav-WaterPurifier h3",function(){
                var $li = $(this).closest("li");
                if($li.hasClass("active")){
                    $li.removeClass("active");
                }else{
                    $li.addClass("active").siblings().removeClass("active");
                }
            });*/
            //拖动切换菜单
            $("#nav .sub-nav").bind("touchstart",function(e){
                //清除参数
                $(this).find(".scaleFull").removeClass("scaleFull");
                $(this).find(".notransition").removeClass("notransition")
                $(this).find(".box").css({transform : "scale(1,1)"});
                $(this).find("li").stop(true,true);
                //获取拖拽基本参数
                $(this).attr("data-start-val",event.touches[0].pageX).attr("data-move-val",event.touches[0].pageX);
                $(this).attr("data-width",$(this).find(".active").width());
                $(this).attr("data-siblings-width",$(this).find(".active").siblings().width());
                //设置选中菜单为移动中的ICON
                $(this).find(".active").addClass("moveLi selected");
            }).bind("touchmove",function(e){
                $(this).attr("data-move-val",event.touches[0].pageX);
                //获取参数
                var $val        = $(this).attr("data-start-val")-event.touches[0].pageX,
                    $integer    = $val>0?$val:-$val,
                    $dataWidth  = parseFloat($(this).attr("data-width")),
                    $dataSWidth = parseFloat($(this).attr("data-siblings-width"));
                //计算拖拽值
                var $width  = $dataWidth-$integer<$dataSWidth?$dataSWidth:$dataWidth-$integer,
                    $sWidth = $dataSWidth+$integer>$dataWidth?$dataWidth:$dataSWidth+$integer;
                //判断位移方向
                var $moveLi = $(this).find(".moveLi"),
                    $prev   = $moveLi.prev(),
                    $next   = $moveLi.next();
                $moveLi.addClass("active");
                if($val>0&&$(this).find(".moveLi").next().length>0){
                    $prev.removeClass("active selected");
                    //向左拖拽
                    $moveLi.css({
                        width     : $width
                    }).find(".box").css({
                        opacity   : $width/$dataWidth+0.4,
                        transform : "scale("+$width/$dataWidth+","+$width/$dataWidth+")"
                    });
                    $next.addClass("active").css({
                        width     : $sWidth/*,
                        transform : "scale("+$width/$dataWidth+","+$width/$dataWidth+")"*/
                    }).find(".box").css({
                        opacity   : $sWidth/$dataWidth+0.4,
                        transform : "scale("+$sWidth/$dataWidth+","+$sWidth/$dataWidth+")"
                    });
                    //小于一定值，取消选中效果
                    if($sWidth/$dataWidth<0.1){
                        $next.removeClass("active").find(".box").css({
                            opacity   : 1,
                            transform : "scale(1,1)"
                        });
                    }
                    //拖拽达到一定值，更改选中菜单
                    if($sWidth>$dataWidth*0.3){
                        $moveLi.removeClass("selected").next().addClass("selected");
                    }else{
                        $moveLi.addClass("selected").next().removeClass("selected");
                    }
                }else if($val<0&&$(this).find(".moveLi").prev().length>0){
                    $next.removeClass("active selected");
                    //向右拖拽
                    $moveLi.css({
                        width     : $width/*,
                         transform : "scale("+$width/$dataWidth+","+$width/$dataWidth+")"*/
                    }).find(".box").css({
                            opacity   : $width/$dataWidth+0.4,
                            transform : "scale("+$width/$dataWidth+","+$width/$dataWidth+")"
                        });
                    $prev.addClass("active").css({
                        width     : $sWidth/*,
                         transform : "scale("+$width/$dataWidth+","+$width/$dataWidth+")"*/
                    }).find(".box").css({
                            opacity   : $sWidth/$dataWidth+0.4,
                            transform : "scale("+$sWidth/$dataWidth+","+$sWidth/$dataWidth+")"
                        });
                    //小于一定值，取消选中效果
                    if($sWidth/$dataWidth<0.1){
                        $prev.removeClass("active").find(".box").css({
                            opacity   : 1,
                            transform : "scale(1,1)"
                        });
                    }
                    //拖拽达到一定值，更改选中菜单
                    if($sWidth>$dataWidth*0.3){
                        $moveLi.removeClass("selected").prev().addClass("selected");
                    }else{
                        $moveLi.addClass("selected").prev().removeClass("selected");
                    }
                }
                //小于一定值，取消选中效果
                if($width/$dataWidth<0.1){
                    $moveLi.removeClass("active").find(".box").css({
                        opacity   : 1,
                        transform : "scale(1,1)"
                    });
                }
                //根据值更变显示效果
                /*if(!$moveLi.hasClass("selected")){
                    if($width>$dataWidth*0.3){
                        $moveLi.addClass("active");
                    }else{
                        $moveLi.removeClass("active");
                    }
                }*/
                return false;
            }).bind("touchend",function(e){
                var $parent = $(this).parent(),
                    $width  = $(this).attr("data-width"),
                    $sWidth = $(this).attr("data-siblings-width");
                //$parent.find(".box").css({opacity:1,scale:"scale(1,1)"});
                $parent.find("li.active:not(.selected) .box").addClass("scaleEmpty").animate({
                    opacity   : 1
                },500,function(){
                    $(this).addClass("notransition scaleFull").removeClass("scaleEmpty");
                });
                $parent.find(".selected .box").addClass("scaleFull").animate({
                    opacity   : 1
                },500,function(){
                    $(this).addClass("notransition");
                });
                $parent.find(".selected").removeClass("selected").animate({
                    width     : $width
                },500,function(){
                    $(this).addClass("active");
                }).siblings().animate({
                    width     : $sWidth
                },500,function(){
                    $(this).removeClass("active");
                });
                //解绑移动中的ICON
                $parent.find(".moveLi").removeClass("moveLi");
            });
		},
        //获取屏幕
        resize : function(){
            $(window).bind("resize",function(){
                //获取页面最小高度
                var $W       = $(window).width(),
                    $H       = $(window).height(),
                    $header  = $("#header").height(),
                    $li      = $("#nav").find(">ul>li"),
                    $liWidth = $li.find("li:not(.active)").width();
                $H-=$header;
                $(".control-portion,.control-portion li").height($H*0.425);//控制
                $(".water-portion,.water-portion li").height($H*0.37);//水质
                $(".serve-portion,.serve-portion li").height($H*0.205);//服务
                $li.find(".active").css({width:$W-($liWidth*2)});
                //42.5  37  20.5
            }).trigger("resize");
        }
	};
	init.base();
});