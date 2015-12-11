$(function(){
  //window.HerkIf = true;
  window.progress = null;
  window.progress = new Progress();
  progress.initData('last',12);
    var init = {
        base : function(){
            init.event();
            //progress.drawProgress(70,'wash');//pollutant,wash
            if(!window.HerkIf){
                $(".switch .open").click();
            }
        },
        event : function(){
            //冲洗经过效果
            $(".wash-btn").on("touchstart",function(){
                if($(this).hasClass("true")){
                    $(this).addClass("opacity8");
                }
            }).on("touchend",".wash-btn.true",function(){
                var self = $(this);
                setTimeout(function(){
                    self.removeClass("opacity8");
                },100);
            });
            //开关切换
            $("body").on("click",".switch input",function(){
                if($(this).hasClass("active")){
                   return;
                }
                if(window.HerkIf){
                    if($(this).hasClass("open")){
                        var $sendMsg = sendInfo("01012001");//开启净水器
                        Hekr.sendMsg(tid,$sendMsg);
                    }else{
                        var $sendMsg = sendInfo("01012002");//关闭净水器
                        Hekr.sendMsg(tid,$sendMsg);
                    }
                }else{
                    $(this).addClass("active").siblings().removeClass("active");
                    if($(this).hasClass("open")){
                        $(".purifier").addClass("open").removeClass("close");
                        progress.drawProgress(15,'pre');
                    }else{
                        $(".purifier").addClass("close").removeClass("open");
                        progress.stopAnim();
                    }
                }

            });
            //点击冲
            $('#wash').on('touchend',function(){
                if(!progress.getWashFlg()) {
                    return;
                }
                if(window.HerkIf){
                    var $sendMsg = sendInfo("02022001");//开启净水器
                    Hekr.sendMsg(tid,$sendMsg);
                }else{
                    var $this = $(this);
                    $this.val('冲洗中').addClass("underway").removeClass("true");
                    $(".purifier-text").text("冲洗中");
                    progress.washProgress(30,'wash');
                }
                //progress.washProgress(30,'wash',callback);
            });
        }
    };
    init.base();
});


//查询设备开关状态
//设备反馈
document.addEventListener('HekrSDKReady',function(){
  
    Hekr.getConfig(function(info){
        window.tid = info.tid;
        if(window.tid){
            var $sendMsg = sendInfo("00012000");//查询净水器
          Hekr.sendMsg(tid,$sendMsg);
          Hekr.setMsgHandle(tid,function(str){
              var msg = getArrayInfo(str.state.uartdata);//获取反馈信息
              console.log(msg);
              //反馈设备开关
              if(msg[1]==1&&msg[2]==20){
                  if(msg[3]==1){//开
                      $(".switch").find(".open").addClass("active").siblings().removeClass("active");
                      $(".purifier").addClass("open").removeClass("close");
                      var $sendMsg = sendInfo("00082000");//查询污染
                      Hekr.sendMsg(tid,$sendMsg);
                  }else if(msg[3]==2){//关
                      $(".switch").find(".close").addClass("active").siblings().removeClass("active");
                      $(".purifier").addClass("close").removeClass("open");
                      progress.stopAnim();
                  }
              }
              //反馈污染度
              if(msg[1]==8&&msg[2]==20){
                  progress.stopAnim();
                  console.log(msg[3],parseInt(msg[3],16));
                  progress.drawProgress(parseInt(msg[3],16),'pre');
              }
              //冲洗中
              if(msg[1]==2&&msg[2]==20&&msg[3]==1){
                  $('#wash').val('冲洗中').addClass("underway").removeClass("true");
                  $(".purifier-text").text("冲洗中");
                  progress.washProgress(30,'wash');
              }
          });
        }       
    });
}, false);


/*var tid  = getUrlParam(tid) || "VDEV_APPOUTSOURCE";//virtualdevice中device.tid
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

    var $purifierCaption = $('purifier-caption');

    var washFlg = true;

    var curUse = {pre:null,next:null};

    var config = {
        purifier:{
            text:'污染度',
            text_color:'#FFF',
            unit:'%',
            color:'#f50000',
            type : 'pollutant'
        },
        last:{
            text:'距上次<div>冲洗时间</div>',
            text_color:'rgb(102,255,51)',
            unit:'小时',
            color:'rgb(102,255,51)',
            type : 'last'
        },
        wash:{
            text:'冲洗中',
            text_color:'#FFF',
            unit:'s',
            color:'#2cbfe9',
            type : 'wash'
        },
    }

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
        context.arc(center.pointX + (outerRadius - (cirWidth/2))*Math.sin(Math.PI/4),center.pointY + (outerRadius - cirWidth/2)*Math.sin(Math.PI/4),(cirWidth/2),Math.PI*1/4,Math.PI*5/4,false);
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

        var cssStyle = type === 'pre'?curUse.pre.color:curUse.next.color;
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
        initData: function(preType,val){
            var pre = curUse.pre = config[preType];
            curUse.next = config.wash;
            $(".purifier-caption").css('color',pre.text_color);
            $('.purifier-text').html(pre.text);
        },
        drawProgress: function(val, type) {
            var valTemp = 0,curVal = 0;
            // if(val > 0) {
            //     curVal = Math.floor(((val % 12)/12) * 100);
            //     curVal = curVal === 0? 100 : curVal;
            // }
            washFlg = false;
            if(type === 'pre') {
                unit = curUse.pre.unit;
            }else {
                unit = curUse.next.unit;
            }
            animTimer = setInterval(function(){
                valTemp += 0.5;
                valTemp = valTemp > val ? val : valTemp;
                $(".purifier-caption").html(Math.floor(valTemp) + '<span>' + unit  + '</span>');
                context.clearRect(0,0,2*outerRadius,2*outerRadius);
                drawCirProgress();
                curVal = Math.floor((valTemp/12) * 100);
                curVal = curVal > 100 ? 100 : curVal;
                drawProgressVal(curVal, type);
                if(valTemp === val) {
                    washFlg = true;
                    clearInterval(animTimer);
                    animTimer = null;
                    $('#wash').addClass("true").removeClass("opacity8");
                }
            },50);

        },
        washProgress: function(val,type,callback) {
            var valTemp = 0,startFlg = true,valDiffTemp = val/12,valDiff = 5/val;
            washFlg = false;

            var unit = curUse.next.unit,color = curUse.next.text_color;
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
                $(".purifier-caption").css('color',color);
                drawProgressVal(valTemp, type);
                var $val = Math.ceil(valTemp*30/100);
                $(".purifier-caption").html($val + '<span>' + unit  + '</span>');
                //$(".purifier-text").text("冲洗中");
                if(valTemp === 0) {
                    $(".purifier-caption").html('0' + '<span>' + curUse.pre.unit  + '</span>');
                    $(".purifier-text").html(curUse.pre.text);
                    $('#wash').val('冲洗完毕').removeClass("underway true opacity8");
                    lastTimerOut = setTimeout(function(){
                        $('#wash').val('冲洗').removeClass("underway").addClass("true");
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
                $('#wash').val('冲洗').removeClass("underway true");
                context.clearRect(0,0,2*outerRadius,2*outerRadius);
                clearInterval(animTimer);
                animTimer = null;
            }else if(lastTimerOut !== null) {
                $('#wash').val('冲洗').removeClass("underway true");
                washFlg = true;
                context.clearRect(0,0,2*outerRadius,2*outerRadius);
                clearTimeout(lastTimerOut)
                lastTimerOut = null;
            }
        }
    }
};
