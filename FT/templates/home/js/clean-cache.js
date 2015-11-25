$(function(){
	var init = {
		base : function(){
            init.event();
            //自动获取屏幕最小高度
            $(window).bind("resize",function(){
                //获取页面最小高度
                var $list  = $(".list-info").height(),
                    $other = $(".main-other").height();
                $(".info-status").css({height:$other-$list});
            }).trigger("resize");
            //加载中
            var $val = parseInt($(".loading-text").text());
            var $time = setInterval(function(){
                $(".loading-text").text($val+"%");
                if($val==100){
                    clearInterval($time);
                    $(".list-info").show();
                    $(".loading-text").text("50MB").parent().siblings("h5").text("");
                    return;
                }
                $val++;
            },10);
            var Wifi_loading = new window.Wifi_loading();
		},
		event : function(){
            //消除数据
            $("body").on("touchend",".list-info li",function(){
                var $all     = parseInt($(".loading-text").text()),
                    $val     = parseInt($(this).find("span").text()),
                    $default = $val;
                if($val==0){
                    return;
                }
                //清除中
                $(".list-info").hide();
                var $time = setInterval(function(){
                    $(".loading-text").text($val+"MB").parent().siblings("h5").text("清除中");
                    if($val==0){
                        clearInterval($time);
                        $(".list-info").show();
                        $(".loading-text").text($all-$default+"MB").parent().siblings("h5").text("");
                        //清除垃圾
                        var $li = $(".list-info").find("li");
                        for(var i=0;i<$li.length;i++){
                            $val = parseInt($li.eq(i).find("span").text());
                            $val = $val-$default<0?0:$val-$default;
                            $li.eq(i).find("span").text($val+"MB");
                        }
                        return;
                    }
                    $val--;
                },100);
            });
		}
	};
	init.base();
});