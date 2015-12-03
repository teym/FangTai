$(function(){
	var init = {
		base : function(){

            //画滤
            var $showWater = $(".show-water"),
                canvas     = $showWater.find("canvas");
            canvas.attr("width",$showWater.width());
            canvas.attr("height",$showWater.width());
            //获取前次数据 -- 每天自动清空
            var paramStr ='drink_data_' + (new Date()).toLocaleDateString();
            var val = init.getLocalStorage(paramStr);
            if(val > 0) {
                var selectedStr = localStorage.getItem('selected_index');
                var indexList = selectedStr.split(','),len = indexList.length;
                for(var i = 0; i < len; i++) {
                    $('.main-other li').eq(indexList[i]).find('.icon > i').attr('class','icon-success');
                }
            }
            $(".show-water").find("b").text(val);
            $(".show-water").attr("data-val",val);

            init.event();

                //绘画滤芯
            init.playDrinkingWater({
                id     : canvas.attr("id"),
                width  : $showWater.width(),
                val    : val,
                max    : $showWater.attr("data-max")
            });
            $(window).bind("resize",function(){
                //获取页面最小高度
                var $H = $(window).height(),
                    $header = $(".main-header").height();
                $(".main-other").css({height:$H-$header,minHeight:"0"});
            }).trigger("resize");
		},
		event : function(){
            //勾选饮水
            var timer = null,preVal = Number($(".show-water").attr("data-val"));
            $("body").on("touchend",".main-other .icon",function(){
                var $li = $(this).closest("li");

                if(!$li.hasClass("success")){
                    $li.addClass("success")
                    if(window.HerkIf){
                        Hekr.sendMsg("VDEV_1AFE349C3DPN","(uartdata \"C2072100fa\")");//设备上报单次用水量
                    }else{
                        $(this).find("i").removeClass().addClass("icon-success");
                        var $water     = Number($li.attr("data-water")),
                            $showWater = $(".show-water"),
                            canvas     = $showWater.find("canvas"),
                            $val       = $water + Number($showWater.attr("data-val")),
                            max        = $showWater.attr("data-max"),
                            width      = $showWater.width();

                            $showWater.attr("data-val",$val);

                        //保存当前数据
                        var paramStr ='drink_data_' + (new Date()).toLocaleDateString();
                        init.saveLocalStorage(paramStr,$val,$('.main-other li').index($li));
                        //time文字变化速度
                        var time = 50,textObj = $(".show-water").find("b"),canvasId = canvas.attr("id"),showFlg = true;
                        if(timer === null) {
                            timer = setInterval(function(){
                                preVal += 10;
//                        preVal = $val;
                                //重新取得当前值 -- 时间问题timer外部取得有问题
                                $val = Number($showWater.attr("data-val"));
                                if(preVal >= $val) {
                                    showFlg = false;
                                    preVal = $val;
                                }
                                textObj.text(preVal);
                                init.playDrinkingWater({
                                    id     : canvasId,
                                    width  : width,
                                    val    : preVal,
                                    max    : max,
                                    showFlg:showFlg
                                });

                                if(preVal === $val) {
                                    clearInterval(timer);
                                    timer = null;
                                }
                            },time);
                        }

                    }
                }
            });
		},
        playDrinkingWater : function(info){
            var filter  = document.getElementById(info.id),
                context = filter.getContext("2d"),
                val     = info.val/info.max,
                showFlg = info.showFlg;
            info.height = info.width;

            var outerCirLineWidth = info.width*0.05,
                outerRadius = info.width/2 - outerCirLineWidth/2;//外部圆半径

            var outline = info.width*0.035,innerRadius = outerRadius-outline,radius = innerRadius-outline/2;
            var center = {pointX:info.width/2,pointY:info.height/2};

            var curPoint = {};

            curPoint.radius = Math.sqrt(Math.pow(radius,2) - Math.pow(Math.abs(radius - radius*2*val),2));
            curPoint.deg = Math.asin(curPoint.radius/radius) //弧度 * (180/Math.PI)转化为角度
            curPoint.center = {pointX:center.pointX,pointY:center.pointY + radius - radius*2*val};
            curPoint.left = {pointX:center.pointX - curPoint.radius,pointY:curPoint.center.pointY};
            curPoint.right = {pointX:center.pointX + curPoint.radius,pointY:curPoint.center.pointY};
            curPoint.startDeg = val > 0.5 ? -Math.PI/2 + curPoint.deg:Math.PI/2 - curPoint.deg;
            curPoint.endDeg = val > 0.5 ? (Math.PI*3)/2 - curPoint.deg:Math.PI/2 + curPoint.deg;
            //showFlg -- 上升动画 -- animTime:上升速度-- 小于time
            var symbol = 1,loop = 0,animTime = showFlg? 30 : 100;
            var diffDeg = (val > 0.5? Math.PI * (1-val) / 3:Math.PI * val / 3),
                diffDeg2 = diffDeg/ 2,
                valdiff = 0;
            var degTemp = diffDeg,degDiff = 0,waitFlg = false;
            if(this.animTimer!==null){
                clearInterval(this.animTimer);
                this.animTimer = null;
            }
            this.animTimer = setInterval(function(){
            //this.animTimer = setTimeout(function(){
                loop++;
                if(loop === 11) {
                    degDiff = degTemp - diffDeg;
                }

                if(loop < 11) {
                    diffDeg = diffDeg - (0.3 * val*(1-val))/loop;
                    valdiff = loop * 5;
                }else if(loop < 31){
                    diffDeg =diffDeg + (30 - loop)*degDiff/200;
                    valdiff = valdiff - (30 - loop)/4
                }else if(loop < 41){
                    waitFlg = true;
                }else {
                    loop = 1;
                    diffDeg = degTemp;
                    waitFlg = false;
                    return;
                }
                if(!waitFlg) {
                    context.clearRect(0,0,info.width,info.height);
                }else {
                    return;
                }

                diffDeg2 = diffDeg/2;
                //高低阴影
                if(val > 0.5) {
                    curPoint.left_2 = {
                        pointX:center.pointX - radius*Math.sin(Math.asin(curPoint.radius/radius) + diffDeg),
                        pointY:center.pointY - radius*Math.cos(Math.asin(curPoint.radius/radius) + diffDeg)
                    };
                    curPoint.right_2 = {
                        pointX:center.pointX + radius*Math.sin(Math.asin(curPoint.radius/radius) - diffDeg2),
                        pointY:center.pointY - radius*Math.cos(Math.asin(curPoint.radius/radius) - diffDeg2)
                    };

                    curPoint.endDeg_2 = Math.PI*1.5 - (Math.asin(curPoint.radius/radius) + diffDeg);
                    curPoint.startDeg_2 = -Math.PI/2 + (Math.asin(curPoint.radius/radius) - diffDeg2);

                }else {
                    curPoint.left_2 = {
                        pointX:center.pointX - radius*Math.sin(Math.asin(curPoint.radius/radius) - diffDeg),
                        pointY:center.pointY + radius*Math.cos(Math.asin(curPoint.radius/radius) - diffDeg)
                    };
                    curPoint.right_2 = {
                        pointX:center.pointX + radius*Math.cos(Math.PI/2 - Math.asin(curPoint.radius/radius) - diffDeg2),
                        pointY:center.pointY + radius*Math.sin(Math.PI/2 - Math.asin(curPoint.radius/radius) - diffDeg2)
                    };

                    curPoint.startDeg_2 = Math.PI/2 - Math.asin(curPoint.radius/radius) - diffDeg2;
                    curPoint.endDeg_2 = Math.asin(curPoint.radius/radius) - diffDeg + Math.PI/2;

                }
                //大圆
                context.beginPath();
                context.lineWidth = outerCirLineWidth;
                context.strokeStyle = '#ebebeb';
                context.arc(info.width/2, info.height/2, outerRadius, 0, Math.PI * 2, false);
                context.stroke();
                context.closePath();
                //小圆
                context.beginPath();
                context.lineWidth = outline;
                context.strokeStyle = '#ddd';
                context.arc(info.width/2, info.height/2, innerRadius, 0, Math.PI * 2, false);
                context.stroke();
                context.closePath();

                //后阴影
                context.beginPath();
                context.lineWidth = 1;
                context.fillStyle = 'rgba(59, 214, 255, 0.6)';
                context.moveTo(curPoint.left.pointX,curPoint.left.pointY);

                if(val > 0.5) {
                    context.bezierCurveTo(
                        curPoint.left.pointX + (radius/1.5) * 2*(1-val), curPoint.left.pointY + (outline/2) * val + 1.5 * (1 - val)  * radius - valdiff*(1-val),
                        curPoint.right.pointX - (2 * (1-val) *radius)/1.5, curPoint.right.pointY + (outline/2) * val + valdiff*(1-val),
                        curPoint.right.pointX,curPoint.right.pointY
                    );
                }else {
                    context.bezierCurveTo(
                        curPoint.left.pointX + (radius/(1 + val)), curPoint.left.pointY + (outline/2) * val + (1.5*val) *radius - valdiff*val,
                        curPoint.right.pointX - (2 * val *radius)/(1 + val), curPoint.right.pointY + (outline/2) * val + valdiff*val,
                        curPoint.right.pointX,curPoint.right.pointY
                    );
                }
                context.arc(center.pointX, center.pointY, radius, curPoint.startDeg, curPoint.endDeg, false);
                context.fill();
                context.closePath();


                //前阴影
                context.beginPath();
                context.lineWidth = 1;
                context.fillStyle = 'rgba(0, 197, 249, 1)';
                //context.moveTo(curPoint.left_2.pointX + outline/2,curPoint.left_2.pointY );


                if(val > 0.5) {
                    context.moveTo(curPoint.left_2.pointX,curPoint.left_2.pointY);
                    context.bezierCurveTo(
                        curPoint.left_2.pointX + (radius*Math.sin(Math.asin(curPoint.radius/radius) - diffDeg))*(0.8),curPoint.left_2.pointY + radius*((1 - val)*(1 - val)),
                        (radius*Math.cos(Math.PI/2 - Math.asin(curPoint.radius/radius) - diffDeg))*((1 - val)*(1 - val)) + center.pointX, curPoint.right_2.pointY,
                        curPoint.right_2.pointX,curPoint.right_2.pointY
                    );
                    context.arc(center.pointX, center.pointY, radius, curPoint.startDeg_2, curPoint.endDeg_2, false);
                }else {
                    context.moveTo(curPoint.left_2.pointX,curPoint.left_2.pointY);
                    context.bezierCurveTo(
                        curPoint.left_2.pointX + (radius*Math.sin(Math.asin(curPoint.radius/radius) - diffDeg))*(1),curPoint.left_2.pointY + radius*(val*val),
                        (radius*Math.cos(Math.PI/2 - Math.asin(curPoint.radius/radius) - diffDeg))*(val*val) + center.pointX, curPoint.right_2.pointY,
                        curPoint.right_2.pointX,curPoint.right_2.pointY
                    );
                    context.arc(center.pointX, center.pointY, radius, curPoint.startDeg_2, curPoint.endDeg_2, false);
                }

                context.fill();
                context.closePath();

                if(showFlg) {
                    if(this.animTimer!==null){
                        clearInterval(this.animTimer);
                        this.animTimer = null;
                    }
                }


            },animTime);
        },
        saveLocalStorage : function(paramStr, val, index) {
            localStorage.setItem(paramStr,val);
            var indexList = localStorage.getItem('selected_index') || '';
            localStorage.setItem('selected_index',indexList + ',' + index);
        },
        getLocalStorage  : function(paramStr){
            var val = localStorage.getItem(paramStr);
            if(val === null || val === undefined) {
                localStorage.clear();
                return 0;
            }

            return Number(val);
        }
	};
	init.base();
});
//设备反馈
document.addEventListener('HekrSDKReady',function(){
    Hekr.setMsgHandle("VDEV_1AFE349C3DPN",function(str){
        var msg = getArrayInfo(str.split('uartdata\" \"')[1].split('\"')[0]);//获取反馈信息
        if(msg[1]=="C2"&&msg[1]==7&&msg[2]==21){
            var $water     = parseInt(a[3]+a[4],16),
                $showWater = $(".show-water"),
                canvas     = $showWater.find("canvas"),
                $val       = $water + Number($showWater.attr("data-val"));
            $showWater.attr("data-val",$val);
            $(".show-water").find("b").text($val);
            init.playDrinkingWater({
                id     : canvas.attr("id"),
                width  : $showWater.width(),
                val    : $showWater.attr("data-val"),
                max    : $showWater.attr("data-max")
            });
        }
    });
}, false);