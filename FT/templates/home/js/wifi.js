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
            var Wifi_loading = new window.Wifi_loading();
            //表单键盘控制
            new inputControl($("input:not(input[type='button'])"));
		},
		event : function(){
            //记住密码
            $("body").on("touchend",".remember-password",function(){
                $(this).hasClass("active")?$(this).removeClass("active"):$(this).addClass("active");
            });
            //显示密码
            $("body").on("touchend",".icon-eye",function(){
                var $input = $(".account-password");
                if($input.attr("type")=="password"){
                    $input.attr("type","text");
                }else{
                    $input.attr("type","password");
                }
            });
            //连接网站
            $("body").on("touchend",".wifi-tools-btn",function(){
                var self   = $(this),
                    $input = $(".wifi-tools-btn").find("input"),
                    $span  = $(".wifi-status").find("span"),
                    $time;
                if(self.attr("data-status")=="link"){//连接网络
                    $(".wifi").addClass("in-service");
                    $input.val("取消");
                    self.attr("data-status","cancel");
                    $("#loading").css({display:"block"}).siblings(".icon").hide();
                    $span.text("连接中，请稍后");
                    if(window.HerkIf){
                        Hekr.config(SSID,$.trim($(".account-password").val()),function(ret,error){
                            if(ret.tid){//成功
                                Hekr.saveConfig({tid:ret.tid});
                                self.attr("data-status","success");
                                $(".icon-wifi-success").css({display:"block"}).siblings(".icon").hide();
                                $span.text("连接成功");
                                $input.val("完成");
                            }else{//失败
                                self.attr("data-status","cancel");
                                $(".icon-wifi-defeated").css({display:"block"}).siblings(".icon").hide();
                                $span.text("连接失败");
                                $input.val("返回");
                            }
                        });
                    }else{
                        //连接返回
                        $time = setTimeout(function(){
                            var $num = random(1,2);
                            if($num==1&&self.attr("data-status")=="cancel"){//成功
                                self.attr("data-status","success");
                                $(".icon-wifi-success").css({display:"block"}).siblings(".icon").hide();
                                $span.text("连接成功");
                                $input.val("完成");
                            }else if($num==2&&self.attr("data-status")=="cancel"){//失败
                                self.attr("data-status","cancel");
                                $(".icon-wifi-defeated").css({display:"block"}).siblings(".icon").hide();
                                $span.text("连接失败");
                                $input.val("返回");
                            }
                        },1000);
                    }
                }else if(self.attr("data-status")=="cancel"){//取消连接网络
                    if(window.HerkIf){
                        Hekr.cancelConfig();
                    }
                    $(".wifi").removeClass("in-service");
                    $input.val("确定");
                    self.attr("data-status","link");
                    $(".icon-wifi").css({display:"block"}).siblings(".icon").hide();
                    $span.text("请选择一个可以用的WLAN");

                    clearTimeout($time);
                }else if(self.attr("data-status")=="success"){
                    if(window.HerkIf){
                        Hekr.backTo("/home/html/index.html",true);
                    }else{
                        location.href = "index.html?openType=push";
                    }
                }
            });
		}
	};
	init.base();
});
//设备反馈
document.addEventListener('HekrSDKReady',function(){
  Hekr.currentSSID(function(info){
    window.SSID = info;
    $(".account-name").val(info);
  });//获取用户SSID
}, false);
