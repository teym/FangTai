$(function(){
    //window.HerkIf = true;
		//alert(UARTDATA.encode(0x02,00094104000000000A410401000000));
	var init = {
		base : function(){
            init.event();
            init.resize();//获取屏幕
            clickStyle({box:".header-nav li,.nav-WaterPurifier li",class:"active"});
            var $malfunction = $(".malfunction-status"),
                $len         = $malfunction.length;
            if(!window.HerkIf){
                var $time = setInterval(function(){
                    $malfunction.eq(random(0,$len-1)).show().siblings().hide();
                    if(!window.HerkIf){
                         clearInterval($time);
                         $malfunction.hide();
                    }
            },1000);
            }
		},
		event : function(){
            //删除净水机
            $("body").on("touchstart",".status-remove .icon-remove",function(){
                $(".cancel-binding").css({display:"table"}).attr("data-tid",$(this).closest("li").attr("data-tid"));
                $(this).closest("li").addClass("status-active");
                return false;
            });
            //确定删除净水机
            $("body").on("touchstart",".cancel-binding li",function(){
                if($(this).hasClass("submit")){
                    if(window.HerkIf){
									//		alert($(".cancel-binding").attr("data-tid"));
                        Hekr.removeDevice($(".cancel-binding").attr("data-tid"),function(ret){
                            if(ret){
                                $(".status-active").fadeOut(500,function(){
                                    console.log(ret);
                                    $(".cancel-binding").css({display:"none"});
                                    $(this).remove();
                                });
                            }else{
                                hintModal({val:"删除净水机失败"});
                            }
                        });
                    }else{
                        $(".status-remove").fadeOut(500,function(){
                            $(".cancel-binding").css({display:"none"});
                            $(this).remove();
                        });
                    }
                }else{
                    $(".cancel-binding").css({display:"none"});
                    $(".status-remove").removeClass("status-remove");
                }
                return false;
            });
            //选中净水机
           /* $("body").on("touchstart",".nav-WaterPurifier h3",function(){
                var $li = $(this).closest("li");
                if($li.hasClass("active")){
                    $li.removeClass("active");
                }else{
                    $li.addClass("active").siblings().removeClass("active");
                }
            });*/
            //删除净水机
            $("body").on("touchstart",".nav-WaterPurifier li",function(){
                if(!$(this).hasClass("status-remove")){
                    this.startVal = this.moveVal = event.touches[0].pageX;
                    $(".status-remove").removeClass("status-remove");
                }else{
                    this.startVal = "";
                }
            }).on("touchmove",".nav-WaterPurifier li:not(.status-remove)",function(){
                    if(this.startVal){
                        this.moveVal = event.touches[0].pageX;
                        //左滑效果
                        var $distance = this.startVal-this.moveVal,
                            $width    = $(this).width();
                        if($distance/$width>0.1){
                            $(this).addClass("status-remove");
                        }
                    }
                    return false;
                }).on("touchend",".nav-WaterPurifier li",function(){
                    var $state = this.startVal-this.moveVal>1||this.startVal-this.moveVal<-1;
                    this.startVal = this.moveVal = null;
                    console.log($state);
                    if(!$state&&!$(this).hasClass("add-WaterPurifier")){
                        if($(this).hasClass("status-remove")){
                            $(this).removeClass("status-remove");
                        }else{
                            Hekr.saveConfig({tid:$(this).attr("data-tid")});
                            window.tid = $(this).attr("data-tid");
                            $(".nav-WaterPurifier").hide();
                            $(".transparency").remove();    
                        }
                        
                    }else{
                        if($(this).find(">a").attr("href")){
                            if($(".nav-WaterPurifier li").length>=4){
                                hintModal({val:"设置已达绑定上限，请删除设备在重新绑定"});
                            }else{
                                location.href = $(this).find(">a").attr("href");
                            }
                        }
                    }
                    return false;
                });
            /*$(".nav-WaterPurifier li:not(.status-remove)").bind("touchstart",function(e){
                window.startVal = window.moveVal = event.touches[0].pageX;
                $(this).find(".tools").hide();
                console.log($(this).hasClass("status-remove"));
            }).bind("touchmove",function(){
                    window.moveVal = event.touches[0].pageX;
                    //左滑效果
                    var $distance = window.startVal-window.moveVal,
                        $width    = $(this).width();
                    if($distance/$width>0.1){
                        $(this).addClass("status-remove").find(".tools").show();
                    }
                    return false;
                }).bind("touchend",function(){
                    return false;
                });*/
            //删除净水机
            /*$(".nav-WaterPurifier li:not(.add-WaterPurifier)").bind("touchstart",function(e){
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
            });*/
            /*//替换净水机
            $("body").on("click",".icon-change",function(){
                $(".cancel-binding").css({display:"table"});
                return false;
            });
             */
           /* //拖动切换菜单
           $("#nav .sub-nav").bind("touchstart",function(e){
                //清除参数
                $(this).find(".box").css({transform : "scale(1,1)"});
                $(this).find(".scaleFull").removeClass("scaleFull");
                $(this).find(".notransition").removeClass("notransition")
                $(this).find("li").stop(true,true);
                //设置参数
                window.startVal = window.moveVal = event.touches[0].pageX;
                window.width = $(this).find(".active").width();
                window.siblingsWidth = $(this).find(".active").addClass("selected").siblings().width();
            }).bind("touchmove",function(e){
                    window.moveVal = event.touches[0].pageX;
                    var $val = window.startVal - window.moveVal,
                        $positiveVal = $val>0?$val:-$val;
                    //计算拖拽值
                    var $width  = window.width-$positiveVal<window.siblingsWidth?window.siblingsWidth:window.width-$positiveVal,
                        $sWidth = window.siblingsWidth+$positiveVal>window.width?window.width:window.siblingsWidth+$positiveVal;
                    console.log($width,$sWidth,$val);
                    //一起移动的值
                    var $selected = $(this).find(".selected");
                    if($val>0){
                        var $move = $selected.next();
                    }else{
                        var $move = $selected.prev();
                    }
                    if($move.length==1){
                        $selected.addClass("active").css({width:$width}).find(".box").css({
                            opacity   : $width/window.width+0.4,
                            transform : "scale("+$width/window.width+","+$width/window.width+")"
                        });
                        $move.addClass("active").css({width:$sWidth}).find(".box").css({
                            opacity   : $sWidth/window.width+0.4,
                            transform : "scale("+$sWidth/window.width+","+$sWidth/window.width+")"
                        });
                        //小于一定值，取消选中效果
                        if($width/window.width<0.1){
                            $selected.removeClass("active").find(".box").css({
                                opacity   : 1,
                                transform : "scale(1,1)"
                            });
                        }
                        if($sWidth/window.width<0.1){
                            $move.removeClass("active").find(".box").css({
                                opacity   : 1,
                                transform : "scale(1,1)"
                            });
                        }
                    }else{
                        if($val<0){
                            $move.width({width:$sWidth});
                        }
                    }
                    if($move.next().length==0){
                        $move.prev().addClass("prev");
                    }else{
                        $move.siblings(".prev").removeClass("prev");
                    }
                    if($move.prev().length==0){
                        $move.next().addClass("next");
                    }else{
                        $move.siblings(".next").removeClass("next");
                    }
                }).bind("touchend",function(e){
                    var $val = window.startVal - window.moveVal,
                        $positiveVal = $val>0?$val:-$val;
                    //计算拖拽值
                    var $width  = window.width-$positiveVal<window.siblingsWidth?window.siblingsWidth:window.width-$positiveVal,
                        $sWidth = window.siblingsWidth+$positiveVal>window.width?window.width:window.siblingsWidth+$positiveVal;
                    console.log($width,$sWidth,$val);
                    //一起移动的值
                    var $selected = $(this).find(".selected");
                    if($val>0){
                        var $move = $selected.next();
                    }else{
                        var $move = $selected.prev();
                    }
                    if($move.length==1){
                        if($positiveVal/window.width>0.1){
                            $move.find(".box").addClass("scaleFull").animate({opacity:1},500,function(){
                                $(this).addClass("notransition scaleFull").css({transform : "scale(1,1)"}).removeClass("scaleEmpty");
                            });
                            $selected.find(".box").addClass("scaleEmpty").animate({opacity:1},500,function(){
                                $(this).addClass("notransition scaleFull").css({transform : "scale(1,1)"}).removeClass("scaleEmpty");
                            });
                            $move.addClass("active selected").animate({width:window.width}).siblings().animate({width:window.siblingsWidth},500,function(){
                                $(this).removeClass("active selected");
                            });
                        }else{
                            $selected.find(".box").addClass("scaleFull").animate({opacity:1},500,function(){
                                $(this).addClass("notransition scaleFull").css({transform : "scale(1,1)"}).removeClass("scaleEmpty");
                            });
                            $move.find(".box").addClass("scaleEmpty").animate({opacity:1},500,function(){
                                $(this).addClass("notransition scaleFull").css({transform : "scale(1,1)"}).removeClass("scaleEmpty");
                            });
                            $selected.addClass("active selected").animate({width:window.width},500).siblings().animate({width:window.siblingsWidth},500,function(){
                                $(this).removeClass("active selected");
                            });
                        }
                    }
                });
            return;*/
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
                $(this).attr("data-siblings-width",$("#nav").find(">ul>li").find("li:not(.active)").width());
                //设置选中菜单为移动中的ICON
                $(this).find(".active").addClass("moveLi selected");
            }).bind("touchmove",function(e){
                //清除参数
                $(this).find(".scaleFull").removeClass("scaleFull");
                $(this).find(".notransition").removeClass("notransition")
                $(this).find(".box").css({transform : "scale(1,1)"});
                $(this).find("li").stop(true,true);

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
                    if($sWidth>$dataWidth*0.1){
                        $moveLi.removeClass("selected").next().addClass("selected");
                    }else{
                        $moveLi.addClass("selected").next().removeClass("selected");
                    }
                    //小于一定值，取消选中效果
                    if($width/$dataWidth<0.1){
                        $moveLi.removeClass("active").find(".box").css({
                            opacity   : 1,
                            transform : "scale(1,1)"
                        });
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
                    if($sWidth>$dataWidth*0.1){
                        $moveLi.removeClass("selected").prev().addClass("selected");
                    }else{
                        $moveLi.addClass("selected").prev().removeClass("selected");
                    }
                    //小于一定值，取消选中效果
                    if($width/$dataWidth<0.1){
                        $moveLi.removeClass("active").find(".box").css({
                            opacity   : 1,
                            transform : "scale(1,1)"
                        });
                    }
                }

                //根据值更变显示效果
                /*if(!$moveLi.hasClass("selected")){
                    if($width>$dataWidth*0.3){
                        $moveLi.addClass("active");
                    }else{
                        $moveLi.removeClass("active");
                    }
                }*/
                if($val>0){
                    var $move = $moveLi.next();
                }else{
                    var $move = $moveLi.prev();
                }

                if($move.next().length==0){
                    $move.prev().addClass("prev");
                }else{
                    $move.siblings(".prev").removeClass("prev");
                }
                if($move.prev().length==0){
                    $move.next().addClass("next");
                }else{
                    $move.siblings(".next").removeClass("next");
                }
                return false;
            }).bind("touchend",function(e){
                //清除参数
                var $parent = $(this).parent(),
                    $width  = $(this).attr("data-width"),
                    $sWidth = $(this).attr("data-siblings-width");
                //$parent.find(".box").css({opacity:1,scale:"scale(1,1)"});
                $parent.find("li.active:not(.selected) .box").addClass("scaleEmpty").animate({
                    opacity   : 1
                },500,function(){
                    $(this).addClass("notransition");
                    $(this).addClass("scaleFull").css({transform : "scale(1,1)"}).stop(true,true).removeClass("scaleEmpty");
                });
                $parent.find(".selected .box").addClass("scaleFull").animate({
                    opacity   : 1
                },500,function(){
                    $(this).addClass("notransition");
                    $(this).css({transform : "scale(1,1)"}).stop(true,true).removeClass("scaleEmpty");
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
                var $state = $(this).attr("data-start-val")-$(this).attr("data-move-val")==0;
                if($state){
                    var $active = $(this).find(".active");
                    //故障1
                    if(window.errorone){
                        if($active.hasClass("filter")||$active.hasClass("control")||$active.hasClass("dosage")){
                            hintModal({val:"设备漏水或缺水，无法使用该功能"});
                            return false;
                        }
                    }
                    if(window.errortwo){
                    //故障2
                        if($active.hasClass("waterQuality")){
                            hintModal({val:"设备故障，无法使用该功能"});
                            return false;
                        }
                    }
                    location.href = $(this).find(".active a").attr("data-href");
                }
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
                console.log($liWidth);
                //$li.find("li").width($liWidth*1.5);
                $li.find(".active").css({width:$W-($liWidth*2)});
                //42.5  37  20.5
                //为下面元素设计百分比
                return;
                var $subLi = $("#nav").find(".sub-nav .active");
                for(var i=0;i<$subLi.length;i++){
                    var $width = $subLi.eq(i).width(),
                        $proportion = $subLi.eq(i).find("i").attr("data-proportion");
                    $subLi.eq(i).find("i").css({height:$width*$proportion});
                }
            }).trigger("resize");
        }
	};
	init.base();
    //设备反馈
    document.addEventListener('HekrSDKReady',function(){
		//获取用户信息
        Hekr.currentUser(function(user){
            window.uid = user.uid;
        });
			  //获取设备列表
        Hekr.getDevices(function(list,error){
            if(!list.length){
                Hekr.saveConfig({tid:""});
                return;
            }
            Hekr.getConfig(function(info){
                window.tid = info.tid;
                if(!info){
                    Hekr.saveConfig({tid:list[0].tid});
                    window.tid = list[0].tid;
                }else{
                    for(var i=0;i<list.length&&i<3;i++){
                        if(list[i].tid==tid){
                            return;
                        }else if(i==2){
                            Hekr.saveConfig({tid:list[0].tid});
                            window.tid = list[0].tid;
                        }
                    }
                }
            });
            $(".nav-WaterPurifier").append(template.render("WaterPurifier-list",{value:list}));
            for(var i=0;i<list.length;i++){
                $(".nav-WaterPurifier").find("li").eq(1+i).attr("data-tid",list[i].tid);
            }

        });
    }, false);
});
