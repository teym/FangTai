$(function(){
    //window.HerkIf = true;
	var init = {
		base : function(){
            init.event();
            $(window).bind("resize",function(){
                //定位
                $(".waterQuality-view").height($(window).height()*0.7);
                var $WH = $(window).height(),
                    $FH = $(".waterQuality-view").height(),
                    $H  = $(".main-header").height();
                $("#main").css({minHeight:$WH-$FH>$H?$WH:$H,paddingBottom:$WH-$FH>$H?0:$FH});
                $(".waterQuality-info").css({display:"block"});
            }).trigger("resize");
            //画滤
            var $waterQualityView = $(".waterQuality-view"),
                canvas      = $waterQualityView.find("canvas");
            canvas.attr("width",$waterQualityView.width());
            canvas.attr("height",$waterQualityView.height());
            //绘画滤芯
            init.playFilter({
                id     : canvas.attr("id"),
                width  : $waterQualityView.width(),
                height : $waterQualityView.height(),
                val    : $waterQualityView.attr("data-val"),
                title  : $waterQualityView.attr("data-title")
            });
            if(window.HerkIf){
                $(".TDS").html('<span>mg/L</span><b>(优)</b>');
                $(".organic").html('<span>mg/L</span><b>(优)</b>');
            }
		},
		event : function(){

		},
        playFilter : function(info){
            var waterQuality  = document.getElementById(info.id),
                context = waterQuality.getContext("2d"),
                blank   = info.height*0.005;
                var val = 1;
            start(val);
            other(val);
            //绘制基础效果
            function start(val){
                //绘制值曲线
                var height = info.height*val,
                    topH   = info.height-height;
                context.fillStyle = "#c7f8ff";
                context.beginPath();
                context.moveTo(0,blank+topH+height*0.05);
                context.bezierCurveTo(info.width*0.25,blank+topH+-height*0.05,info.width*0.75,blank+topH+height*0.15,info.width,blank+topH+height*0.05);
                context.lineTo(info.width,topH+height);
                context.lineTo(0,topH+height);
                context.closePath();
                context.fill();
                //绘制值曲线加渐变
                context.beginPath();
                context.moveTo(0,blank+topH+height*0.08);
                context.bezierCurveTo(info.width*0.25,blank+topH+-height*0.02,info.width*0.75,blank+topH+height*0.18,info.width,blank+topH+height*0.08);
                context.lineTo(info.width,topH+height);
                context.lineTo(0,topH+height);
                context.closePath();
                context.fill();

                /* 指定渐变区域 */
                var grad  = context.createLinearGradient(0,0,0,info.height);
                /* 指定几个颜色 */
                grad.addColorStop(0,'#64e8ff');
                grad.addColorStop(0.5,'#1cb6d9');//0.25+(1-0.25)/4
                grad.addColorStop(1,'#0087b8');
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
                },random(3000,5000));
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
    //设备反馈
    document.addEventListener('HekrSDKReady',function(){
        Hekr.sendMsg("VDEV_1AFE349C3DPN","(uartdata \"0003202404200000\")");//查询TDS进水口
        Hekr.setMsgHandle("VDEV_1AFE349C3DPN",function(str){
            var msg = getArrayInfo(str.split('uartdata\" \"')[1].split('\"')[0]);//获取反馈信息
            //var msg = [00,03,20,24,04,20,00,00];
            if(msg[1]==3&&msg[2]==20){
                $(".TDS").html(parseInt(msg[3],16)+'<span>mg/L</span><b>(优)</b>');
                Hekr.sendMsg("VDEV_1AFE349C3DPN","(uartdata \"00054103140005064103030602\")");//查询有机物进水口
            }
            //var msg = [00,05,41,03,14,00,05,06,41,03,03,06,02];
            if(msg[1]==5&&msg[2]==41&&msg[3]==03){
                var val = "";
                val += parseInt(msg[4],16)+".";
                val += parseInt(msg[5],16);
                val += parseInt(msg[6],16);
                $(".organic").html(val+'<span>mg/L</span><b>(优)</b>');
            }
        });
    }, false);
});