//loading
window.Wifi_loading = function(){
    var context = null;
    init();
    //初期化
    function init(){
        var canvas = document.getElementById('loading');
        canvas.width = 120;
        canvas.height = canvas.width;
        context = canvas.getContext('2d');

        var center = {pointX:canvas.width/2,pointY:canvas.height/2};
        var radius = canvas.width/2;

        var caveIn = 20;
        var basicVal = Math.PI/180;
        var cssStyle = 'rgba(23, 123, 203,0.3)';
        var pointLeft = {},pointRight = {},controlLeft = {},controlRight = {};
        var leftDeg = 0,rightDeg = 0;
        var loop = 0,animVal = 0;
        setInterval(function(){
            loop++;
            if(loop <= 10) {
                animVal = basicVal*loop/3;
            }else if(loop <= 20){
                animVal = basicVal*(20-loop)/3;

            }else {
                loop = 0;
                return;
            }

            context.clearRect(0,0,canvas.width,canvas.height);

            context.beginPath();
            context.fillStyle = 'rgb(65, 169, 225)';
            context.arc(center.pointX,center.pointY,radius,0,Math.PI*2,false);
            context.fill();
            context.closePath();

            leftDeg = Math.PI*0.23 -animVal,rightDeg = 0 + animVal;
            pointLeft = {
                pointX:center.pointX - radius * Math.cos(leftDeg),
                pointY:center.pointY - radius*Math.sin(leftDeg)
            };
            pointRight = {
                pointX:center.pointX + radius * Math.cos(rightDeg),
                pointY:center.pointY - radius*Math.sin(rightDeg)
            };

            controlLeft = {
                pointX:center.pointX - radius * Math.cos(leftDeg)/2,
                pointY:pointLeft.pointY + caveIn*3/2
            }

            controlRight = {
                pointX:center.pointX + radius * Math.cos(rightDeg)/2,
                pointY:pointRight.pointY
            };
            context.beginPath();
            context.fillStyle = cssStyle;
            context.moveTo(pointLeft.pointX,pointLeft.pointY);
            context.bezierCurveTo(controlLeft.pointX,controlLeft.pointY,controlRight.pointX,controlRight.pointY,pointRight.pointX,pointRight.pointY);
            context.arc(center.pointX,center.pointY,radius,-Math.PI/6,Math.PI*7/6,false);
            context.fill();
            context.closePath();

            leftDeg = Math.PI/ 6 +animVal,rightDeg = Math.PI/ 6 - animVal;
            pointLeft = {
                pointX:center.pointX - radius * Math.cos(leftDeg),
                pointY:center.pointY - radius*Math.sin(leftDeg)
            };
            pointRight = {
                pointX:center.pointX + radius * Math.cos(rightDeg),
                pointY:center.pointY - radius*Math.sin(rightDeg)
            };

            controlLeft = {
                pointX:center.pointX - radius * Math.cos(leftDeg)/2,
                pointY:pointLeft.pointY + caveIn
            }

            controlRight = {
                pointX:center.pointX + radius * Math.cos(rightDeg)/2,
                pointY:pointRight.pointY + caveIn
            };
            context.beginPath();
            context.fillStyle = cssStyle;
            context.moveTo(pointLeft.pointX,pointLeft.pointY);
            context.bezierCurveTo(controlLeft.pointX,controlLeft.pointY,controlRight.pointX,controlRight.pointY,pointRight.pointX,pointRight.pointY);
            context.arc(center.pointX,center.pointY,radius,-Math.PI/6,Math.PI*7/6,false);
            context.fill();
            context.closePath();
        },200);
    }
};