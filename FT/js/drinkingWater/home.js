$(function(){
	var init = {
		base : function(){
            init.event();
            //画滤
            var $showWater = $(".show-water"),
                canvas     = $showWater.find("canvas");
            canvas.attr("width",$showWater.width());
            canvas.attr("height",$showWater.width());
            //绘画滤芯
            init.playDrinkingWater({
                id     : canvas.attr("id"),
                width  : $showWater.width(),
                val    : $showWater.attr("data-val"),
                max    : $showWater.attr("data-max")
            });
            $(window).bind("resize",function(){
                //获取页面最小高度
                var $H = $(window).height(),
                    $header = $(".main-header").height();
                $(".main-other").css({height:$H-$header});
            }).trigger("resize");
		},
		event : function(){
            //勾选饮水
            $("body").on("touchend",".main-other .icon",function(){
                var $li = $(this).closest("li");
                if(!$li.hasClass("success")){
                    $li.addClass("success")
                    $(this).find("i").removeClass().addClass("icon-success");
                    var $water     = Number($li.attr("data-water")),
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
		},
        playDrinkingWater : function(info){
            var filter  = document.getElementById(info.id),
                context = filter.getContext("2d"),
                val     = info.val/info.max;
            info.height = info.width;

            var outerCirLineWidth = 10,
                outerRadius = info.width/2 - outerCirLineWidth/2;//外部圆半径

            var outline = 7,innerRadius = outerRadius-outline;
            var center = {pointX:info.width/2,pointY:info.height/2};
            var outerCirLineWidth = 10,
                outerRadius = info.width/2 - outerCirLineWidth/2;//外部圆半径
            var outline = 7,innerRadius = outerRadius - outline;

            var curPoint = {};

            curPoint.radius = Math.sqrt(Math.pow(innerRadius,2) - Math.pow(Math.abs(innerRadius - innerRadius*2*val),2));
            curPoint.deg = Math.asin(curPoint.radius/innerRadius) //弧度 * (180/Math.PI)转化为角度
            curPoint.center = {pointX:center.pointX,pointY:center.pointY + innerRadius - innerRadius*2*val};
            curPoint.left = {pointX:center.pointX - curPoint.radius,pointY:curPoint.center.pointY};
            curPoint.right = {pointX:center.pointX + curPoint.radius,pointY:curPoint.center.pointY};
            curPoint.startDeg = val > 0.5 ? -Math.PI/2 + curPoint.deg:Math.PI/2 - curPoint.deg;
            curPoint.endDeg = val > 0.5 ? (Math.PI*3)/2 - curPoint.deg:Math.PI/2 + curPoint.deg;

            var symbol = 1,loop = 0,animTime = 100;
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
                        pointX:center.pointX - innerRadius*Math.sin(Math.asin(curPoint.radius/innerRadius) + diffDeg),
                        pointY:center.pointY - innerRadius*Math.cos(Math.asin(curPoint.radius/innerRadius) + diffDeg)
                    };
                    curPoint.right_2 = {
                        pointX:center.pointX + innerRadius*Math.sin(Math.asin(curPoint.radius/innerRadius) - diffDeg2),
                        pointY:center.pointY - innerRadius*Math.cos(Math.asin(curPoint.radius/innerRadius) - diffDeg2)
                    };

                    curPoint.endDeg_2 = Math.PI*1.5 - (Math.asin(curPoint.radius/innerRadius) + diffDeg2);
                    curPoint.startDeg_2 = -Math.PI/2 + (Math.asin(curPoint.radius/innerRadius) - diffDeg);

                }else {
                    curPoint.left_2 = {
                        pointX:center.pointX - innerRadius*Math.sin(Math.asin(curPoint.radius/innerRadius) - diffDeg),
                        pointY:center.pointY + innerRadius*Math.cos(Math.asin(curPoint.radius/innerRadius) - diffDeg)
                    };
                    curPoint.right_2 = {
                        pointX:center.pointX + innerRadius*Math.cos(Math.PI/2 - Math.asin(curPoint.radius/innerRadius) - diffDeg2),
                        pointY:center.pointY + innerRadius*Math.sin(Math.PI/2 - Math.asin(curPoint.radius/innerRadius) - diffDeg2)
                    };

                    curPoint.startDeg_2 = Math.PI/2 - Math.asin(curPoint.radius/innerRadius) - diffDeg;
                    curPoint.endDeg_2 = Math.asin(curPoint.radius/innerRadius) - diffDeg2 + Math.PI/2;

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
                context.moveTo(curPoint.left.pointX + outline/2,curPoint.left.pointY + (outline/2) * val);

                if(val > 0.5) {
                    context.bezierCurveTo(
                        curPoint.left.pointX + (innerRadius/1.5) * 2*(1-val), curPoint.left.pointY + (outline/2) * val + 1.5 * (1 - val)  * innerRadius - valdiff*(1-val),
                        curPoint.right.pointX - (2 * (1-val) *innerRadius)/1.5, curPoint.right.pointY + (outline/2) * val + valdiff*(1-val),
                        curPoint.right.pointX - outline/2,curPoint.right.pointY + (outline/2) *(1-val)
                    );
                }else {
                    context.bezierCurveTo(
                        curPoint.left.pointX + (innerRadius/(1 + val)), curPoint.left.pointY + (outline/2) * val + (1.5*val) *innerRadius - valdiff*val,
                        curPoint.right.pointX - (2 * val *innerRadius)/(1 + val), curPoint.right.pointY + (outline/2) * val + valdiff*val,
                        curPoint.right.pointX - outline/2,curPoint.right.pointY + (outline/2) * val
                    );
                }
                context.arc(center.pointX, center.pointY, innerRadius - (outline/2) * val, curPoint.startDeg, curPoint.endDeg, false);
                context.fill();
                context.closePath();


                //前阴影
                context.beginPath();
                context.lineWidth = 1;
                context.fillStyle = 'rgba(0, 197, 249, 1)';
                //context.moveTo(curPoint.left_2.pointX + outline/2,curPoint.left_2.pointY );


                if(val > 0.5) {
                    context.moveTo(curPoint.left_2.pointX + outline/2* (1-val),curPoint.left_2.pointY - outline/2* (1-val) );
                    context.bezierCurveTo(
                        curPoint.left_2.pointX + (innerRadius*Math.sin(Math.asin(curPoint.radius/innerRadius) - diffDeg))*(0.8),curPoint.left_2.pointY + innerRadius*((1 - val)*(1 - val)),
                        (innerRadius*Math.cos(Math.PI/2 - Math.asin(curPoint.radius/innerRadius) - diffDeg))*((1 - val)*(1 - val)) + center.pointX, curPoint.right_2.pointY,
                        curPoint.right_2.pointX - outline/2* (1-val),curPoint.right_2.pointY - outline/2* (1-val)
                    );
                    context.arc(center.pointX, center.pointY, innerRadius - (outline/2) * (1-val), curPoint.startDeg_2, curPoint.endDeg_2, false);
                }else {
                    context.moveTo(curPoint.left_2.pointX + outline/2*val,curPoint.left_2.pointY - outline/2*val );
                    context.bezierCurveTo(
                        curPoint.left_2.pointX + (innerRadius*Math.sin(Math.asin(curPoint.radius/innerRadius) - diffDeg))*(1),curPoint.left_2.pointY + innerRadius*(val*val),
                        (innerRadius*Math.cos(Math.PI/2 - Math.asin(curPoint.radius/innerRadius) - diffDeg))*(val*val) + center.pointX, curPoint.right_2.pointY,
                        curPoint.right_2.pointX - outline/2*val,curPoint.right_2.pointY - outline/2*val
                    );
                    context.arc(center.pointX, center.pointY, innerRadius - (outline/2) * (val), curPoint.startDeg_2, curPoint.endDeg_2, false);
                }

                context.fill();
                context.closePath();


            },animTime);
        }
	};
	init.base();
});