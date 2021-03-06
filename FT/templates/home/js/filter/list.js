$(function(){
    //window.HerkIf = true;
	var init = {
		base : function(){
            init.event();
            $(window).bind("resize",function(){
                //定位
                var $filter  = $(".filter-list");
                $filter.find("li").height($(window).height()*0.6);
                var $otherH  = $(".main-other").height(),
                    $filterH = $filter.height(),
                    $top     = $otherH-$filterH;
                $filter.css({position:"relative",top:$top>0?$top:0,bottom:"inherit"});
            }).trigger("resize");
            //画滤
            if(!window.HerkIf){
                var $li = $(".filter-list").find("li");
                for(var i=0;i<$li.length;i++){
                    var canvas = $li.eq(i).find("canvas");
                    canvas.attr("width",$li.eq(i).width());
                    canvas.attr("height",$li.eq(i).height());
                    //绘画滤芯
                    playFilter({
                        id     : canvas.attr("id"),
                        width  : $li.eq(i).width(),
                        height : $li.eq(i).height(),
                        val    : $li.eq(i).attr("data-val"),
                        title  : $li.eq(i).attr("data-title")
                    });
                }
            }
		},
		event : function(){

		}
	};
	init.base();
    /*var msg = [00,09,41,04,"1e","32","64","14"];
    if(msg[1]==9&&msg[2]==41&&msg[3]==4){
        var $li     = $(".filter-list").find("li"),
            $width  = $li.width(),
            $height = $li.height();
        for(var i=0;i<4;i++){
            var canvas = $li.eq(i).find("canvas");
            canvas.attr("width",$width);
            canvas.attr("height",$height);
            //绘画滤芯
            playFilter({
                id     : canvas.attr("id"),
                width  : $width,
                height : $height,
                val    : parseInt(msg[4+i],16)/100,
                title  : $li.eq(i).attr("data-title")
            });
        }
    }*/
    //设备反馈
    document.addEventListener('HekrSDKReady',function(){
        // var $list  = $(".filter-list").find(">ul>li"),
        //     $one   = UARTDATA.hex2str($list.eq(0).attr("data-val")*100),
        //     $two   = UARTDATA.hex2str($list.eq(1).attr("data-val")*100),
        //     $three = UARTDATA.hex2str($list.eq(2).attr("data-val")*100),
        //     $four  = UARTDATA.hex2str($list.eq(3).attr("data-val")*100);
        //Hekr.sendMsg(tid,"(uartdata \"00094104"+$one+$two+$three+$four+"0A410401000000\")");//查询净水器设备滤芯状态
        Hekr.getConfig(function(info){
            window.tid = info.tid;
            if(window.tid){
                var $sendMsg = sendInfo("00094104000000000A410401000000");
                Hekr.sendMsg(tid,$sendMsg);
                Hekr.setMsgHandle(tid,function(str){
                    $(".main-other").append(str);
                    //var msg = getArrayInfo(str.split('uartdata\" \"')[1].split('\"')[0]);//获取反馈信息
                    var msg = getArrayInfo(str.state.uartdata);//获取反馈信息
                    //console.log(msg,msg[1]==9,msg[2]==41,msg[3]==4);
                    if(msg[1]==9&&msg[2]==41&&msg[3]==4){
                        var $li     = $(".filter-list").find("li"),
                            $width  = $li.width(),
                            $height = $li.height();
                        for(var i=0;i<4;i++){
                            var canvas = $li.eq(i).find("canvas");
                            canvas.attr("width",$width);
                            canvas.attr("height",$height);
                            //绘画滤芯
                            playFilter({
                                id     : canvas.attr("id"),
                                width  : $width,
                                height : $height,
                                val    : parseInt(msg[4+i],16)/100,
                                title  : $li.eq(i).attr("data-title")
                            });
                        }
                    }
                });
            }       
        });
	    
    }, false);
});
function playFilter(info){
            var filter  = document.getElementById(info.id),
                context = filter.getContext("2d"),
                blank   = info.height*0.005;
            window.val2    = 0;
            context.font = '16px FZLTCXHJW';
            var $time = setInterval(function(){
                val2+=0.01;
                var val = parseFloat(val2.toFixed(2));
                if(val<info.val){
                    start(val);
                }else{
                    clearInterval($time);
                    //随机时间调用
                    val = info.val;
                    other(val);
                }
            },50/(val2*100));
            //绘制基础效果
            function start(val){
                //绘制灰曲线
                context.fillStyle = "#f2f2f2";
                context.beginPath();
                context.moveTo(0,blank+info.height*0.025);
                context.bezierCurveTo(info.width*0.25,blank+info.height*0.075,info.width*0.75,blank+(-info.height*0.025),info.width,blank+info.height*0.025);
                context.lineTo(info.width,info.height);
                context.lineTo(0,info.height);
                context.closePath();
                context.fill();

                context.fillStyle = "black";
                context.beginPath();
                context.moveTo(0,blank+info.height*0.04);
                context.bezierCurveTo(info.width*0.25,blank+info.height*0.09,info.width*0.75,blank+(-info.height*0.01),info.width,blank+info.height*0.04);
                context.lineTo(info.width,info.height);
                context.lineTo(0,info.height);
                context.closePath();
                /* 增加渐变色 */
                var grad  = context.createLinearGradient(0,0,0,info.height);
                grad.addColorStop(0,'#ebebeb');
                grad.addColorStop(1,'#dadada');
                /* 将这个渐变设置为fillStyle */
                context.fillStyle = grad;
                /* 绘制矩形 */
                context.fill();
                //绘制值曲线
                var height = info.height*val,
                    topH   = info.height-height;
                context.fillStyle = "#7aebfe";
                context.beginPath();
                context.moveTo(0,blank+topH+height*0.025);
                context.bezierCurveTo(info.width*0.25,blank+topH+height*0.075,info.width*0.75,blank+topH+-height*0.025,info.width,blank+topH+height*0.025);
                context.lineTo(info.width,topH+height);
                context.lineTo(0,topH+height);
                context.closePath();
                context.fill();
                //绘制值曲线加渐变
                context.beginPath();
                context.moveTo(0,blank+topH+height*0.04);
                context.bezierCurveTo(info.width*0.25,blank+topH+height*0.09,info.width*0.75,blank+topH+-height*0.01,info.width,blank+topH+height*0.04);
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

                //绘制标题文本
                context.beginPath();
                context.font = info.width*0.2+"px FZLTCXHJW";
                var text  = context.measureText(info.title),
                    width = text.width;
                context.fillStyle = "#fff";
                context.fillText(info.title, (info.width-width)/2, info.height*0.96);
                context.closePath();


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
                    var $num = 5;
                    var $time = setInterval(function(){
                        $num-=0.5;
                        if($num!=-12){
                            bubble(val,$num);
                        }else{
                            clearInterval($time);
                            context.clearRect(0,0,info.width,info.height);
                            start(val);
                            textVal(val);
                        }
                    },50);
                }
            }
            //绘制汽泡效果
            function bubble(val,num){
                context.clearRect(0,0,info.width,info.height);
                start(val);
                textVal(val);
                var height  = info.height*val,
                    topH    = info.height-height;
                //绘制汽泡
                var newtopH = topH<blank*20?blank*20:topH;
                newtopH+=info.height*(num/100);
                //汽泡1
                if(num<-2){
                    context.beginPath();
                    context.arc(info.width*0.2,newtopH+blank+info.height*0.03, info.width*0.1, 0, Math.PI * 2, true);
                    context.closePath();
                    context.lineWidth = info.width*0.04;
                    context.strokeStyle = '#6ddffd';
                    context.stroke();
                }
                if(num<0&&num>-11){
                    //汽泡2
                    context.beginPath();
                    context.arc(info.width*0.45,newtopH+blank+info.height*0.02, info.width*0.07, 0, Math.PI * 2, true);
                    context.closePath();
                    context.lineWidth = info.width*0.03;
                    context.strokeStyle = '#6ddffd';
                    context.stroke();
                }
                if(num<4&&num>-6){
                    //汽泡3
                    context.beginPath();
                    context.arc(info.width*0.08,newtopH+blank+(-info.height*0.03), info.width*0.05, 0, Math.PI * 2, true);
                    context.closePath();
                    context.lineWidth = info.width*0.0225;
                    context.strokeStyle = '#6ddffd';
                    context.stroke();
                };
                if(num>-7){
                    //汽泡4
                    context.beginPath();
                    context.arc(info.width*0.3,newtopH+blank+(-info.height*0.03), info.width*0.04, 0, Math.PI * 2, true);
                    context.closePath();
                    context.lineWidth = info.width*0.015;
                    context.strokeStyle = '#6ddffd';
                    context.stroke();
                };
            };
            //绘制值文本
            function textVal(val){
                var height  = info.height*val,
                    topH    = info.height-height;
                //绘制值文本
                context.beginPath();
                context.font = info.width*0.32+"px FZLTCXHJW";
                var text    = context.measureText(val*100+"%"),
                    width   = text.width;
                context.fillStyle = "#fff";
                if(val>0.7){
                    context.fillText(val*100+"%", (info.width-width)/2,topH+info.width*0.5+(info.height*0.03));
                }else if(val<=0.25){
                    context.fillStyle = "#ea0047";
                    context.fillText(val*100+"%", (info.width-width)/2,topH-info.width*0.15);
                }else{
                    context.fillText(val*100+"%", (info.width-width)/2,topH+info.width*0.5);//+(topH<blank*8?blank*8:topH)
                }
                context.closePath();
            };
        }
