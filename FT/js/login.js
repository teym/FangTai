$(function(){
	var init = {
		base : function(){
            init.event();
            init.loginBg();
            clickStyle({box:"#login-btn",class:"hover"});
		},
		event : function(){

		},
        //登陆背景
        loginBg : function(){
            //背景渐变
            var $W     = $(window).width(),
                $H     = $(window).height();
            $("#login-bg").attr("width",$W).attr("height",$H);
            var canvas = document.getElementById('login-bg');
            var context = canvas.getContext('2d');

            var val = 0,loop = 0;

            setInterval(function(){
                loop++;
                if(loop <= 20) {
                    val = -1*loop;
                }else if(loop <= 40) {
                    val = -1*(40 - loop);
                }else {
                    loop = 0;
                    return;
                }
                context.clearRect(0,0,$W,$H);
                context.beginPath();
                /* 指定渐变区域 */
                var grad  = context.createLinearGradient(0,0, 0,140);
                /* 指定几个颜色 */
                grad.addColorStop(0,'#3ab9ff');
                grad.addColorStop(0.4,'#85e4ff');
                grad.addColorStop(1,'#85e4ff');
                /* 将这个渐变设置为fillStyle */
                context.fillStyle = grad;
                /* 绘制矩形 */
                context.closePath();
                context.rect(0,0, $W,$H);
                context.fill();

                var $HTemp = 0.8*$H;
                //绘制值曲线加渐变
                context.beginPath();/* 指定渐变区域 */
                grad  = context.createLinearGradient(0,0,0,$HTemp);
                var $scrollTop = $("#login-btn").offset().top,
                    $height    = $("#login-btn").height();
                /* 指定几个颜色 */
                grad.addColorStop(0,"rgba(35,159,249,0.4)");
                grad.addColorStop(1,"rgba(13,110,204,0.7)");
                /* 将这个渐变设置为fillStyle */
                context.fillStyle = grad;
                context.moveTo(0,$scrollTop - $height*0.9 + val);
                context.bezierCurveTo($W*0.25,$scrollTop+($height),$W*0.75,$scrollTop+($height*1.5),$W,$scrollTop+$height- val);
                context.lineTo($W,$H);
                context.lineTo(0,$H);
                context.fill();
                context.closePath();

                //绘制值曲线加渐变
                context.beginPath();
                /* 指定渐变区域 */
                grad  = context.createLinearGradient(0,0,0,$H);
                /* 指定几个颜色 */
                grad.addColorStop(0,"rgba(35,159,249,0.4)");
                grad.addColorStop(1,"rgba(13,110,204,0.7)");
                /* 将这个渐变设置为fillStyle */
                context.fillStyle = grad;
                context.moveTo(0,$scrollTop - $height*0.3 - val);
                context.bezierCurveTo($W*0.25,$scrollTop+$height*0.6,$W*0.75,$scrollTop+$height*1.2,$W,$scrollTop + $height*0.3 + val);
                context.lineTo($W,$H);
                context.lineTo(0,$H);
                context.fill();
                context.closePath();
            },100);
        }
	};
	init.base();
});