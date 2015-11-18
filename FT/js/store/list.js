$(function(){
	var init = {
		base : function(){
            init.event();
		},
		event : function(){
            //拖动切换菜单
            $("body").on("touchstart",".store-list .active",function(e){
                $(this).stop(true,true);
                //获取拖拽基本参数
                $(this).attr("data-start-val",event.touches[0].pageY).attr("data-move-val",event.touches[0].pageY);
                $(this).attr("data-height",$(this).height());
            }).on("touchmove",".store-list .active",function(e){
                var $val = parseFloat($(this).attr("data-start-val")-event.touches[0].pageY);
                if($(".store-list").find(".active").prev().length==0&&$val/$(this).attr("data-height")<=-0.09){
                    //第一张停止
                    return;
                }else if($(".store-list").find(".active").next().length==0&&$val/$(this).attr("data-height")>=0.09){
                    //最后一张停止
                    return;
                }
                $(this).attr("data-move-val",event.touches[0].pageY);
                $(this).css({top:-$val});
                return false;
            }).on("touchend",".store-list .active",function(e){
                var $val = parseFloat($(this).attr("data-start-val")-$(this).attr("data-move-val"));
                //变换效果
                if($val/$(this).attr("data-height")>=0.1){
                    var $top = 0;
                    $(this).removeClass("active").siblings(".next").removeClass("next").siblings(".next-two").removeClass("next-two").siblings(".next-three").removeClass("next-three");
                    $(this).next().addClass("active").css({top:0}).next().addClass("next").css({top:"-1.1rem"}).next().addClass("next-two").css({top:"-1.9rem"}).next().addClass("next-three").css({top:"-2.7rem"});
                }else if($val/$(this).attr("data-height")<=-0.1){
                    var $top = "-1.1rem";
                    $(this).removeClass("active").siblings(".next").removeClass("next").siblings(".next-two").removeClass("next-two").siblings(".next-three").removeClass("next-three");
                    $(this).prev().addClass("active").css({top:0}).next().addClass("next").next().addClass("next-two").css({top:"-1.9rem"}).next().addClass("next-three").css({top:"-2.7rem"});
                }
                $(this).animate({top:$top||0},700,function(){});
                //改变数字
                var $num = $(".store-list").find(".active").prevAll().length+1;
                $(".list-num").find("b").text($num<10?"0"+$num:$num);
            });
		}
	};
	init.base();
});