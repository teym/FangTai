$(function(){
	var init = {
		base : function(){
            init.event();
            //自动获取屏幕最小高度
            $(window).bind("resize",function(){
                //获取页面最小高度
                var $other  = $(".main-other").height(),
                    $tools  = $(".wifi-tools-btn").height();
                $(".wifi-main").css({minHeight:$other-$tools});
            }).trigger("resize");
		},
		event : function(){
            //记住密码
            $("body").on("click",".remember-password",function(){
                $(this).hasClass("active")?$(this).removeClass("active"):$(this).addClass("active");
            });
            //连接网站
            $("body").on("click",".wifi-tools-btn",function(){
                var self   = $(this),
                    $input = $(".wifi-tools-btn").find("input"),
                    $icon  = $(".wifi-status").find("i"),
                    $time;
                if(self.attr("data-status")=="link"){//连接网络
                    $(".wifi").addClass("in-service");
                    $input.val("取消");
                    self.attr("data-status","cancel");
                    $icon.removeClass().addClass("icon-wifi-loading");
                    $icon.siblings("span").text("连接中，请稍后");
                    //连接返回
                    $time = setTimeout(function(){
                        var $num = random(1,2);
                        if($num==1&&self.attr("data-status")=="cancel"){//成功
                            self.attr("data-status","success");
                            $icon.removeClass().addClass("icon-wifi-success");
                            $input.val("完成");
                        }else if($num==2&&self.attr("data-status")=="cancel"){//失败
                            self.attr("data-status","cancel");
                            $icon.removeClass().addClass("icon-wifi-defeated");
                            $input.val("返回");
                        }
                    },1000);
                }else if(self.attr("data-status")=="cancel"){//取消连接网络
                    $(".wifi").removeClass("in-service");
                    $input.val("确定");
                    self.attr("data-status","link");
                    $icon.removeClass().addClass("icon-wifi");
                    $icon.siblings("span").text("请选择一个可以用的WLAN");
                    clearTimeout($time);
                }else if(self.attr("data-status")=="success"){
                    location.href = "index.html";
                }
            });
		}
	};
	init.base();
});