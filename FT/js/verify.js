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
            var Wifi_loading = new window.Wifi_loading();
		},
		event : function(){

		}
	};
	init.base();
});