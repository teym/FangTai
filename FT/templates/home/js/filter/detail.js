$(function(){
	var init = {
		base : function(){
            init.event();
            $(window).bind("resize",function(){
                //定位
                $(".filter-view").height($(window).height()*0.6);
                var $WH = $(window).height(),
                    $FH = $(".filter-view-list").height(),
                    $H  = $(".main-header").height();
                //$("#main").css({minHeight:$WH-$FH>$H?$WH:$H,paddingBottom:$WH-$FH>$H?0:$FH});
                $(".buy-filter-caption").css({marginBottom:$WH-$H-$FH<0?0:$WH-$H-$FH});
                $(".history").css({display:"table-cell"});
            }).trigger("resize");
            $(".filter-view-list").find("li").css({left:-location.href.split("num=")[1].split("&")[0]*$(window).width()});
            //画滤
            var $li = $(".filter-view-list").find(">ul>li");
            for(var i=0;i<$li.length;i++){
                var $filterView = $li.eq(i).find(".filter-view"),
                    canvas      = $filterView.find("canvas");
                canvas.attr("width",$filterView.width());
                canvas.attr("height",$filterView.height());
                //绘画滤芯
                init.playFilter({
                    id     : canvas.attr("id"),
                    width  : $filterView.width(),
                    height : $filterView.height(),
                    val    : $filterView.attr("data-val"),
                    title  : $filterView.attr("data-title")
                });
            }
		},
		event : function(){
            //切换滤芯效果
            var $filterLI = $(".filter-view-list>ul>li");
            $filterLI.bind("touchstart",function(e){
                $filterLI.stop(true,true);
                window.startVal = window.moveVal = event.touches[0].pageX;
                window.defaultLeft = parseInt($(this).css("left"));
            }).bind("touchmove",function(){
                    window.moveVal = event.touches[0].pageX;
                    var $distance = -(window.startVal-window.moveVal),
                        $width    = $(this).width();
                    if($distance>0){//最大值
                        var $val;
                        if(defaultLeft+$distance>10){
                            $val = 10;
                            window.moveVal -= defaultLeft+$distance-10;
                        }else{
                            $val = defaultLeft+$distance;
                        }
                    }else if($distance<0){//最小值
                        var $minWidth = -($filterLI.length-1)*$width;
                        var $val;
                        if(defaultLeft+$distance<$minWidth-10){
                            $val = $minWidth-10;
                            window.moveVal -= $minWidth - defaultLeft+$distance-10;
                        }else{
                            $val = defaultLeft+$distance;
                        }
                    }
                    $filterLI.css({left:$val});
                    return false;
                }).bind("touchend",function(){
                    var $distance = -(window.startVal-window.moveVal),
                        $width    = $(this).width();
                    if($distance/$width>0.1){
                        $filterLI.animate({left:window.defaultLeft+$width},500);
                    }else if($distance/$width<-0.1){
                        $filterLI.animate({left:window.defaultLeft-$width},500);
                    }else{
                        $filterLI.animate({left:window.defaultLeft},500);
                    }
                });
		},
        playFilter : function(info){
            var filter  = document.getElementById(info.id),
                context = filter.getContext("2d"),
                blank   = info.height*0.005;
                var val = 1;
            start(val);
            other(val);
            //绘制基础效果
            function start(val){
                //绘制值曲线
                var height = info.height*val,
                    topH   = info.height-height;
                context.fillStyle = "#7aebfe";
                context.beginPath();
                context.moveTo(0,blank+topH+height*0.05);
                context.bezierCurveTo(info.width*0.25,blank+topH+height*0.15,info.width*0.75,blank+topH+-height*0.05,info.width,blank+topH+height*0.05);
                context.lineTo(info.width,topH+height);
                context.lineTo(0,topH+height);
                context.closePath();
                context.fill();
                //绘制值曲线加渐变
                context.beginPath();
                context.moveTo(0,blank+topH+height*0.08);
                context.bezierCurveTo(info.width*0.25,blank+topH+height*0.18,info.width*0.75,blank+topH+-height*0.02,info.width,blank+topH+height*0.08);
                context.lineTo(info.width,topH+height);
                context.lineTo(0,topH+height);
                context.closePath();
                context.fill();

                /* 指定渐变区域 */
                var grad  = context.createLinearGradient(0,0,0,info.height);
                /* 指定几个颜色 */
                var $val2 = parseFloat(1-val)+(val)*0.3,
                    $val3 = parseFloat(1-val)+(val)*0.75;

                grad.addColorStop(1-val,'#3bdbfe');
                grad.addColorStop($val2,'#1aa7d6');//0.25+(1-0.25)/4
                grad.addColorStop($val3,'#026ba3');
                grad.addColorStop(1,'#005893');
                /* 将这个渐变设置为fillStyle */
                context.fillStyle = grad;
                /* 绘制矩形 */
                context.fill();
            }
            //绘制其它效果
            function other(val){
                //绘制值曲线
                var height = info.height*val,
                    topH   = info.height-height;
                randomBubble();
                //汽泡动画
                setInterval(function(){
                    randomBubble();
                },random(2000,5000));
                //随机汽泡
                function randomBubble(){
                    var $num = 5,
                        left = random(info.width*0.1,info.width*0.9);
                    var $time = setInterval(function(){
                        $num-=0.5;
                        if($num!=-12){
                            bubble(val,$num,left);
                        }else{
                            clearInterval($time);
                            context.clearRect(0,0,info.width,info.height);
                            start(val);
                        }
                    },50);
                }
            }
            //绘制汽泡效果
            function bubble(val,num,left){
                context.clearRect(0,0,info.width,info.height);
                start(val);
                var height  = info.height*val,
                    topH    = info.height-height;
                //绘制汽泡
                var newtopH = topH<blank*20?blank*20:topH;
                newtopH+=info.height*(num/100);
                //汽泡1
                if(num<-2){
                    context.beginPath();
                    context.arc(left+42,newtopH+blank+info.height*0.03, 4, 0, Math.PI * 2, true);
                    context.closePath();
                    context.lineWidth = 2;
                    context.strokeStyle = '#6ddffd';
                    context.stroke();
                }
                if(num<0&&num>-11){
                    //汽泡2
                    context.beginPath();
                    context.arc(left+20,newtopH+blank+info.height*0.03, 7, 0, Math.PI * 2, true);
                    context.closePath();
                    context.lineWidth = 2;
                    context.strokeStyle = '#6ddffd';
                    context.stroke();
                }
                if(num<4&&num>-6){
                    //汽泡3
                    context.beginPath();
                    context.arc(left+33,newtopH+blank+(-info.height*0.03),4, 0, Math.PI * 2, true);
                    context.closePath();
                    context.lineWidth = 1.5;
                    context.strokeStyle = '#6ddffd';
                    context.stroke();
                };
                if(num>-7){
                    //汽泡4
                    context.beginPath();
                    context.arc(left+10,newtopH+blank+(-info.height*0.03),6, 0, Math.PI * 2, true);
                    context.closePath();
                    context.lineWidth = 1;
                    context.strokeStyle = '#6ddffd';
                    context.stroke();
                };
            };
        }
	};
	init.base();
});
//设备反馈
document.addEventListener('HekrSDKReady',function(){
    var $list  = $(".filter-view-list").find(">ul>li"),
        $one   = UARTDATA.hex2str($list.eq(0).attr("data-val")*100),
        $two   = UARTDATA.hex2str($list.eq(1).attr("data-val")*100),
        $three = UARTDATA.hex2str($list.eq(2).attr("data-val")*100),
        $four  = UARTDATA.hex2str($list.eq(3).attr("data-val")*100);
    Hekr.sendMsg("VDEV_1AFE349C3DPN","(uartdata \"00094104"+$one+$two+$three+$four+"0A410401000000\")");//查询净水器设备滤芯状态
    Hekr.setMsgHandle("VDEV_1AFE349C3DPN",function(str){
        var msg = getArrayInfo(str.split('uartdata\" \"')[1].split('\"')[0]);//获取反馈信息
        if(msg[1]==9&&msg[2]==41&&msg[3]==4){
            var $li = $(".filter-view-list").find(">ul>li");
            for(var i=0;i<4;i++){
                var $filterView = $li.eq(i).find(".filter-view"),
                    canvas      = $filterView.find("canvas");
                canvas.attr("width",$filterView.width());
                canvas.attr("height",$filterView.height());
                //绘画滤芯
                init.playFilter({
                    id     : canvas.attr("id"),
                    width  : $filterView.width(),
                    height : $filterView.height(),
                    val    : msg[3+i],
                    title  : $filterView.attr("data-title")
                });
            }
        }

    });
}, false);