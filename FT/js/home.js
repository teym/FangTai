$(function(){
	var init = {
		base : function(){
            init.event();
            init.gradual();
            setTimeout(function(){
                location.href = "login.html"
            },2000);
		},
		event : function(){

		},
        gradual : function(){
            //背景渐变
            var $W     = $(window).width(),
                $H     = $(window).height(),
                canvas = document.getElementById('gradual');
            var ctx = canvas.getContext('2d');
            ctx.beginPath();
            /* 指定渐变区域 */
            var grad  = ctx.createLinearGradient(0,0, 0,140);
            /* 指定几个颜色 */
            grad.addColorStop(0,'#2d8fc9');
            grad.addColorStop(0.4,'#4db4e1');
            grad.addColorStop(0.5,'#47addd');
            grad.addColorStop(0.75,'#2f91ca');
            grad.addColorStop(1,'#1674b6');
            /* 将这个渐变设置为fillStyle */
            ctx.fillStyle = grad;
            /* 绘制矩形 */
            ctx.rect(0,0, $W,$H);
            ctx.fill();
            //ctx.fillRect(0,0, 140,140);
        }
	};
	init.base();
});