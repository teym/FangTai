$(function(){
	var init = {
		base : function(){
            init.event();
            $(window).bind("resize",function(){
                //定位
                var $filter  = $(".filter-list"),
                    $otherH  = $(".main-other").height(),
                    $filterH = $filter.height(),
                    $top     = $otherH-$filterH;
                $filter.css({position:"relative",top:$top>0?$top:0,bottom:"inherit",minHeight:$filterH});
            }).trigger("resize");
            //画滤
            var $li = $(".filter-list").find("li");
            for(var i=0;i<$li.length;i++){
                var canvas = $li.eq(i).find("canvas");
                canvas.attr("width",$li.eq(i).width());
                canvas.attr("height",$li.eq(i).height());
                //绘画滤芯
                init.playFilter({
                    id     : canvas.attr("id"),
                    width  : $li.eq(i).width(),
                    height : $li.eq(i).height(),
                    val    : $li.eq(i).attr("data-val"),
                    title  : $li.eq(i).attr("data-title")
                });
            }
		},
		event : function(){

		},
        playFilter : function(info){
            var filter  = document.getElementById(info.id),
                context = filter.getContext("2d"),
                blank   = info.height*0.005,
                val2    = 0;
            var $time = setInterval(function(){
                val2+=0.01;
                var val = parseFloat(val2.toFixed(2));
                if(val<info.val){
                    start(val);
                }else{
                    clearInterval($time);
                    //随机时间调用
                    other(val);
                }
            },250/(info.val*100));
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
                context.font = "1rem microsoft yahei";
                context.fillStyle = "transparent";
                context.fillText(info.title, 0, 0);
                var text  = context.measureText(info.title),
                    width = text.width;
                context.font = "1rem microsoft yahei";
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
                },random(2000,5000));
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
                    context.lineWidth = 3;
                    context.strokeStyle = '#6ddffd';
                    context.stroke();
                }
                if(num<0&&num>-11){
                    //汽泡2
                    context.beginPath();
                    context.arc(info.width*0.45,newtopH+blank+info.height*0.02, info.width*0.07, 0, Math.PI * 2, true);
                    context.closePath();
                    context.lineWidth = 2;
                    context.strokeStyle = '#6ddffd';
                    context.stroke();
                }
                if(num<4&&num>-6){
                    //汽泡3
                    context.beginPath();
                    context.arc(info.width*0.08,newtopH+blank+(-info.height*0.03), info.width*0.05, 0, Math.PI * 2, true);
                    context.closePath();
                    context.lineWidth = 1.5;
                    context.strokeStyle = '#6ddffd';
                    context.stroke();
                };
                if(num>-7){
                    //汽泡4
                    context.beginPath();
                    context.arc(info.width*0.3,newtopH+blank+(-info.height*0.03), info.width*0.04, 0, Math.PI * 2, true);
                    context.closePath();
                    context.lineWidth = 1;
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
                context.font = "1.5rem Arial";
                context.fillStyle = "transparent";
                context.fillText(val*100+"%", 0, 0);
                var text    = context.measureText(val*100+"%"),
                    width   = text.width;
                context.font = "1.5rem Arial";
                context.fillStyle = "#fff";
                if(val>0.7){
                    context.fillText(val*100+"%", (info.width-width)/2,topH+45+(info.height*0.03));
                }else if(val<=0.25){
                    context.fillStyle = "#ea0047";
                    context.fillText(val*100+"%", (info.width-width)/2,topH-25);
                }else{
                    context.fillText(val*100+"%", (info.width-width)/2,topH+45);//+(topH<blank*8?blank*8:topH)
                }
                context.closePath();
            };
        }
	};
	init.base();
});