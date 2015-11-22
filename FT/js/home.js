$(function(){
    var circle = null,
        $W = 0,
        $H = 0;
	var init = {
		base : function(){

            $W  = $(window).width(),
            $H  = $(window).height();

            init.event();
            init.gradual();
            if($('.logo-container-img').height()){
                circle = new Circle();
                circle.init($W);
            }else{
                $('.logo-container-img').load(function(){
                    circle = new Circle();
                    circle.init($W);
                });
            }
		},
		event : function(){

		},
        gradual : function(){
            //背景渐变
            var canvas = document.getElementById('gradual');
            canvas.width = $W,
            canvas.height = $H;
            var ctx = canvas.getContext('2d');
            ctx.beginPath();
            /* 指定渐变区域 */
            var grad  = ctx.createLinearGradient(0,0, 0,$H);
            /* 指定几个颜色 */
            grad.addColorStop(0,'#3ab9ff');
            grad.addColorStop(0.5,'#55d9ff');
            grad.addColorStop(1,'#23a0f9');
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

var Circle = function(){
  var context = null,
      cirWidth = 0,
      center = {},
      $W = 0;

  var original = {};//原点
  /**
   * 初期化
   * @param width
   */
  function init(width){
      var canvas = document.getElementById('cir_canvas');
      context = canvas.getContext('2d'),
      $W = width;
      var $H = $(window).height();
      original.pointX = 0.25*$W + 0.5*$W * (44 + 29) / 260;
      original.pointY = $('.logo-container img').height()/2;
      var maxX = $W - original.pointX,
          maxY = $H/2 +  original.pointY,
          maxRadius = maxX > maxY ? maxX : maxY;
      console.log('$W',$W);
      console.log('$H',$H);
      console.log('maxX',maxX);
      console.log('maxY',maxY);
      console.log('maxRadius',maxRadius);
      maxRadius = Math.ceil((35 * maxRadius / 23)/original.pointY);

      drawInit(maxRadius,true);
  }

  /**
   * 开始动画
   * @param radiusParam
   * @param waveFlg
   */
  function drawInit(radiusParam,waveFlg) {
      var radiusParam = radiusParam || 1;
      var canvas = document.getElementById('cir_canvas');
      cirWidth = 0.5*$W * 58/260 * radiusParam,
      center = {pointX:cirWidth/2,pointY:cirWidth/2};
      canvas.width = cirWidth,canvas.height = cirWidth;

      //初始化情况下距离中心点的距离
      $(canvas).css({'margin-top': -1 *  original.pointY -cirWidth/2,'margin-left':original.pointX - cirWidth/2});
      context.clearRect(0,0,cirWidth,cirWidth);
      if(waveFlg) {
          waveAnim(radiusParam);
      }else {
          drawCir();
      }
  }

  /**
   * 圆内浪的效果
   * @param radiusParam
   */
  function waveAnim(radiusParam){
      var animTimer = null,loop = 0;
      animTimer = setInterval(function(){
          drawCir(loop,animTimer);
          loop++;
          if(loop > 10) {
              if(animTimer !== null && animTimer !== undefined) {
                  clearInterval(animTimer);
                  animTimer = null;
                  bigToSmall(radiusParam);
              }
          }
      },100);
  }

    /**
     * 圆和阴影
     * @param loop
     * @param animTimer
     */
  function drawCir(loop,animTimer){
          var loop = loop || 0;
          context.clearRect(0,0,cirWidth,cirWidth);
          context.beginPath();
          /* 指定渐变区域 */
          /*var grad  = context.createLinearGradient(0,0, 0,$W);
           *//* 指定几个颜色 *//*
           grad.addColorStop(0,'#3ab9ff');
           grad.addColorStop(0.1,'#55d9ff');
           grad.addColorStop(1,'#55d9ff');*/
          /* 将这个渐变设置为fillStyle */
          context.fillStyle = '#55d9ff';
          /* 绘制矩形 */
          context.rect(0,0, cirWidth,cirWidth);
          context.fill();

          var lineWidth = cirWidth * 6 /58,
              radius = (cirWidth - lineWidth)/2;
          context.beginPath();
          context.arc(center.pointX,center.pointY,radius,0 , Math.PI * 2, false);;
          context.strokeStyle = '#FFF';
          context.lineWidth = lineWidth;
          context.stroke();
          context.closePath();

          var grad = context.createLinearGradient(0,0,0,cirWidth);
          /* 指定几个颜色 */
          grad.addColorStop(0,"rgba(35,159,249,0.4)");
          grad.addColorStop(1,"rgba(13,110,204,0.7)");
          //前阴影
          var diffDeg = loop > 5?Math.PI * (10 - loop) / 180:Math.PI * loop / 180,
              shadowRadius = radius - lineWidth/ 2,
              deep = shadowRadius /3,
              startDeg = Math.PI* 7 / 6 - diffDeg,
              endDeg = Math.PI * 11 / 6 - diffDeg;
          var leftPoint = {pointX:center.pointX + Math.cos(startDeg) * shadowRadius,pointY:center.pointY + Math.sin(startDeg)*shadowRadius},
              rightPoint = {pointX:center.pointX + Math.cos(endDeg) * shadowRadius,pointY:center.pointY + Math.sin(endDeg)*shadowRadius},
              leftControl = {pointX:center.pointX + (Math.cos(startDeg) * shadowRadius) * 1 / 4,pointY:center.pointY + Math.sin(startDeg)*shadowRadius},
              rightControl = {pointX:center.pointX + (Math.cos(endDeg) * shadowRadius) * 1 / 4,pointY:center.pointY + Math.sin(endDeg)*shadowRadius + deep};

          context.beginPath();
      context.fillStyle = grad;
      context.moveTo(leftPoint.pointX,leftPoint.pointY);
      context.bezierCurveTo(
          leftControl.pointX,leftControl.pointY,
          rightControl.pointX,rightControl.pointY,
          rightPoint.pointX,rightPoint.pointY
      );
      context.arc(center.pointX,center.pointY,shadowRadius,endDeg,startDeg + Math.PI* 2,false);
      context.fill();
      context.closePath();

       //后阴影
       var startDeg2 =startDeg + Math.PI/18 + 2*diffDeg,
           endDeg2 = endDeg + Math.PI/12 + 2*diffDeg;

      var leftPoint2 = {pointX:center.pointX + Math.cos(startDeg2) * shadowRadius,pointY:center.pointY + Math.sin(startDeg2)*shadowRadius},
          rightPoint2 = {pointX:center.pointX + Math.cos(endDeg2) * shadowRadius,pointY:center.pointY + Math.sin(endDeg2)*shadowRadius},
          leftControl2 = {pointX:center.pointX + + (Math.cos(startDeg) * shadowRadius) * 3 / 4,pointY:center.pointY + Math.sin(startDeg2)*shadowRadius},
          rightControl2 = {pointX:center.pointX + (Math.cos(endDeg2) * shadowRadius) * 2 / 4,pointY:center.pointY + Math.sin(startDeg2)*shadowRadius};

      context.beginPath();
      context.fillStyle = grad;
      context.moveTo(leftPoint2.pointX,leftPoint2.pointY);
      context.bezierCurveTo(
          leftControl2.pointX,leftControl2.pointY,
          rightControl.pointX,rightControl.pointY,
          rightPoint2.pointX,rightPoint2.pointY
      );
      context.arc(center.pointX,center.pointY,shadowRadius,endDeg2,startDeg2 + Math.PI* 2,false);
      context.fill();
      context.closePath();

  }

    /**
     * 从大到小  -- 包括渐显
     * @param maxRadius
     */
  function bigToSmall(maxRadius){
      var animTimer = null,loop = maxRadius,loopTemp = (loop - 1)/20;
      animTimer = setInterval(function(){
          loop = loop < 1? 1 : loop;
          drawInit(loop);
          console.log('loop',loop);
          if(loop === 1) {
              clearInterval(animTimer);
              animTimer = null;
              //图片渐显
              $('.logo-container img').animate({opacity:1},500,'linear',function(){
                  console.log('lv','finish');
                  setTimeout(function(){
                      location.href = "login.html"
                  },2500);
              })
          }
          loop -= loopTemp;
//          loop = loop < 0 ? 0 : loop;

      },50);
  }

  return {
      init      :   init,
  }
};