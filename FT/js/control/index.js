$(function(){
    var progress = null;
    var init = {
        base : function(){
            init.event();
            progress = new Progress();
            //progress.drawProgress(70,'wash');//pollutant,wash
            progress.drawProgress(80,'pollutant');
        },
        event : function(){
            //开关切换
            $("body").on("click",".switch input",function(){
                if($(this).hasClass("active")){
                   return;
                }
                $(this).addClass("active").siblings().removeClass("active");
                if($(this).hasClass("open")){
                    $(".purifier").addClass("open").removeClass("close");
                    progress.drawProgress(80,'pollutant');
                    Hekr.sendMsg("tid",("uartdata 01012001"));//开启净水器
                }else{
                    $(".purifier").addClass("close").removeClass("open");
                    progress.stopAnim();
                    Hekr.sendMsg("tid",("uartdata 01012002"));//关闭净水器
                }
            });

            $('#wash').on('touchend',function(){
                if(!progress.getWashFlg()) {
                    return;
                }
                var $this = $(this);
                $this.val('冲洗中');
                $(".purifier-text").text("冲洗中");
                progress.washProgress(30,'wash');
                Hekr.sendMsg("tid",("uartdata 02022001"));//冲洗净水器
//                progress.washProgress(30,'wash',callback);
            });
        }
    };
    init.base();
});

var Progress = function(){
    var context = null,
        center = null,
        outerRadius = '',
        innerRadius = '',
        sumDeg = '',//包括圆弧的总进度
        sval = '',//圆弧占的百分比
        cirWidth = 0,
        cirWidthDiff = 0,
        animTimer = null,
        lastTimerOut = null;

    var washFlg = true;

    init();

    //初期化
    function init(){
        var canvas = document.getElementById('progress_bar');
        canvas.width = $(window).width()*0.6;
        canvas.height = canvas.width;
        cirWidth = canvas.width*0.08;
        cirWidthDiff = cirWidth/8;
        context = canvas.getContext('2d');

        center = {pointX:canvas.width/2,pointY:canvas.height/2};
        outerRadius = canvas.width/2,
        innerRadius = outerRadius - cirWidth;
    }

    function drawCirProgress(){
        context.beginPath();
        context.arc(center.pointX,center.pointY,outerRadius,Math.PI*3/4,Math.PI*9/4,false);
        context.arc(center.pointX + (outerRadius - (cirWidth/2))*Math.sin(Math.PI/4),center.pointY + (outerRadius - cirWidth/2)*Math.sin(Math.PI/4),(cirWidth/2),Math.PI*5/4,Math.PI*1/4,true);
        context.fillStyle = '#a7dbed';
        context.arc(center.pointX,center.pointY,innerRadius,Math.PI*9/4,Math.PI*3/4,true);
        context.arc(center.pointX - (outerRadius - cirWidth/2)*Math.sin(Math.PI/4),center.pointY + (outerRadius - cirWidth/2)*Math.sin(Math.PI/4),cirWidth/2,-Math.PI*1/4,Math.PI*3/4,false);
        context.fill();
        context.closePath();

        sumDeg = Math.PI*3/2 + 2*Math.asin((cirWidth/2)/(outerRadius - (cirWidth/2)));
        sval = Math.asin((cirWidth/2)/(outerRadius - (cirWidth/2))) * 100/sumDeg;
    }

    function drawProgressVal(val,type){
        var startDeg = 0,
            endDeg = 0;

        var cssStyle = type === 'pollutant'?(val >= 70?'#f50000':'#2cbfe9'):'#2cbfe9';
        if(val < sval) {
            var precent = val/(sval);
            startDeg = Math.PI/4 - precent*Math.PI/2;
            endDeg = Math.PI/4 + precent*Math.PI/2;
            context.beginPath();
            context.fillStyle = cssStyle;
            context.arc(center.pointX - (outerRadius - (cirWidth/2))*Math.sin(Math.PI/4),center.pointY + (outerRadius - (cirWidth/2))*Math.sin(Math.PI/4),(cirWidth/2)-cirWidthDiff,startDeg,endDeg,false);

            context.fill();
            context.closePath();

        }else if(val < 100 - sval){
            endDeg = ((val - sval) /(100 - 2*sval))*3*Math.PI/2;
            context.beginPath();
            context.fillStyle = cssStyle;
            context.arc(center.pointX - (outerRadius - (cirWidth/2))*Math.sin(Math.PI/4),center.pointY + (outerRadius - (cirWidth/2))*Math.sin(Math.PI/4),(cirWidth/2)-cirWidthDiff,-Math.PI*1/4,Math.PI*3/4,false);
            context.arc(center.pointX,center.pointY,outerRadius - cirWidthDiff,Math.PI*3/4,Math.PI*3/4 + endDeg,false);
            context.arc(center.pointX,center.pointY,innerRadius + cirWidthDiff,Math.PI*3/4 + endDeg,Math.PI*3/4,true);
            context.fill();
            context.closePath()

            if(type === 'wash') {

            }
        }else {
            var precent = (100 - val)/sval;
            startDeg = Math.PI*3/4 - precent*Math.PI/2;
            endDeg = Math.PI*3/4 + precent*Math.PI/2;
            context.beginPath();
            context.fillStyle = cssStyle;
            context.arc(center.pointX - (outerRadius - (cirWidth/2))*Math.sin(Math.PI/4),center.pointY + (outerRadius - (cirWidth/2))*Math.sin(Math.PI/4),(cirWidth/2)-cirWidthDiff,-Math.PI*1/4,Math.PI*3/4,false);
            context.arc(center.pointX,center.pointY,outerRadius - cirWidthDiff,Math.PI*3/4,Math.PI*9/4,false);
            context.arc(center.pointX + (outerRadius - (cirWidth/2))*Math.sin(Math.PI/4),center.pointY + (outerRadius - (cirWidth/2))*Math.sin(Math.PI/4),(cirWidth/2)-cirWidthDiff,Math.PI*1/4,Math.PI*5/4,false);
            context.arc(center.pointX,center.pointY,innerRadius + cirWidthDiff,Math.PI*9/4,Math.PI*3/4,true);
            context.fill();
            context.closePath()
            context.beginPath();
            context.fillStyle = '#a7dbed';
            context.arc(center.pointX + (outerRadius - (cirWidth/2))*Math.sin(Math.PI/4),center.pointY + (outerRadius - (cirWidth/2))*Math.sin(Math.PI/4),(cirWidth/2)-cirWidthDiff,startDeg,endDeg,false);
            context.fill();
            context.closePath()

        }
    }

    return publicMethod = {
        drawProgress: function(val, type) {
            var valTemp = 0;
            washFlg = false;
            animTimer = setInterval(function(){
                valTemp++;
                $(".purifier-caption").html(valTemp+"<span>%</span>");
                context.clearRect(0,0,2*outerRadius,2*outerRadius);
                drawCirProgress();
                drawProgressVal(valTemp, type);
                if(valTemp === val) {
                    washFlg = true;
                    clearInterval(animTimer);
                    animTimer = null;
                }
            },20);

        },
        washProgress: function(val,type,callback) {
            var valTemp = 0,startFlg = true,valDiffTemp = val/12,valDiff = 5/val;
            washFlg = false;
            animTimer = setInterval(function(){
                if(valTemp >=100) {
                    startFlg = false;
                }

                if(startFlg) {
                    valTemp += valDiffTemp;
                    valTemp = valTemp > 100?100:valTemp;
                }else {
                    valTemp -= valDiff;
                    valTemp = valTemp < 0? 0 :valTemp;
                    context.clearRect(0,0,2*outerRadius,2*outerRadius);
                    drawCirProgress();
                }

                drawProgressVal(valTemp, type);
                var $val = Math.ceil(valTemp*30/100);
                $(".purifier-caption").html($val+"<span>s</span>");
                //$(".purifier-text").text("冲洗中");
                if(valTemp === 0) {
                    $(".purifier-caption").html("0<span>%</span>");
                    $(".purifier-text").text('污染度');
                    $('#wash').val('冲洗完毕');
                    lastTimerOut = setTimeout(function(){
                        $('#wash').val('冲洗');
                        washFlg = true;
                    },2000);
                    clearInterval(animTimer);
                    animTimer = null;
                }
            },50);
        },
        getWashFlg:function() {
            return washFlg;
        },
        stopAnim: function(){
            if(animTimer !== null) {
                washFlg = true;
                $(".purifier-text").text('污染度');
                $('#wash').val('冲洗');
                context.clearRect(0,0,2*outerRadius,2*outerRadius);
                clearInterval(animTimer);
                animTimer = null;
            }else if(lastTimerOut !== null) {
                $('#wash').val('冲洗');
                washFlg = true;
                context.clearRect(0,0,2*outerRadius,2*outerRadius);
                clearTimeout(lastTimerOut)
                lastTimerOut = null;
            }
        }
    }
};
    console.log(UARTDATA.decode("4809020102022001C7"));

//查询设备开关状态
Hekr.sendMsg("VDEV_1AFE349C3DPN",("uartdata 00012000"));//关闭净水器
//设备反馈
Hekr.setMsgHandle("VDEV_1AFE349C3DPN",function(str){
    //返回 "48 09 02 01 00 01 20 01"
    var msg = UARTDATA.decode("4809020100012001C7");//[0,1,32,1]
    if(msg[1]==1&&msg[2]==20){//反馈设备开关
        if(msg[3]==1){//开
            $(".switch").find(".open").click();
        }else if(msg[3]==2){//关
            $(".switch").find(".close").click();
        }
    }
    //返回 "48 09 02 01 00 08 20 4B C7"
    var msg = UARTDATA.decode("480902010008204BC7");//[0,8,32,75]
    if(msg[1]==8&&msg[2]==32){//反馈污染度
        progress.stopAnim();
        progress.drawProgress(msg[3],'pollutant');   
    }
    //返回 "48 09 02 01 02 02 20 01"
    var msg = UARTDATA.decode("4809020102022001C7");//[2,2,32,1]
    if(msg[1]==2&&msg[2]==32&&msg[3]==1){
        $('#wash').val('冲洗中');
        $(".purifier-text").text("冲洗中");
        progress.washProgress(30,'wash');
    }
});

//Hekr.sendMsg("tid",(uartdata "000082000"));




/*var tid  = getUrlParam("tid") || "VDEV_APPOUTSOURCE";//virtualdevice中device.tid
var host = getUrlParam("host") || "device.hekr.me";
var token =getUrlParam("access_key") || "azBlNkU3WW8xWHNRb01tUFppWXRBKzhQSWdWVjdlak1ockhJVjdZcCtMejkyWVBmZlZCRVNJZnQxNXlKUEdkMnJi" //virtualdevice中 user access_key

var user="APP_"+ Math.random().toString(36).substr(2);
var url  = "ws://"+host+":8080/websocket/t/"+user+"/code/"+token+"/user";
var Hekr   = new ReconnectingWebSocket(url);

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    //console.log(reg);
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
console.log(tid);
console.log(host);
console.log(token);
console.log(user);
console.log(url);
console.log(Hekr);*/



//console.log(tid,host,token,user,url,ws);
//设备状态回馈
/*Hekr.setMsgHandle("480902010008204BC7",function(str){

});*/

