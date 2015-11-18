$(function(){
    var canvas = null;
    var init = {
        base : function(){
            init.event();
            //searchData(handlerCanvas,releaseCallback);
            $(window).bind("resize",function(){
                //定位
                var $dosage  = $(".dosage"),
                    $otherH  = $(".main-other").height(),
                    $dosageH = $dosage.height(),
                    $top     = $otherH-$dosageH;
                $dosage.css({position:"relative",top:$top>0?$top:0,bottom:"inherit",minHeight:$dosageH});
                $(".main-other").css({minHeight:$dosageH});
            }).trigger("resize");
            init.setCanvas('showdata');
        },
        event : function(){
            //切换显示记录
            $("body").on("click",".menu-bar input",function(){
                if($(this).hasClass("active")){
                    return;
                }
                var $class = $(this).attr("data-class");
                $(".dosage").removeClass("water ele").addClass($class);
                $(this).addClass("active").siblings().removeClass("active");
                canvas.changeDataType($(".menu-bar").find(".active").attr("data-class"));
            });
            //切换时间
            $("body").on("click",".submenu-bar input",function(){
                if($(this).hasClass("active")){
                    return;
                }
                $(this).addClass("active").siblings().removeClass("active");
                var time = $(".submenu-bar").find(".active").val();
                var waterData,eleData;
                if(time=="周"){
                    waterData = [18,15,18,15,12,15,12];
                    eleData   = [12,15,30,55,26,18,15];
                    timeType = 7;
                }else if(time=="月"){
                    waterData = [18,15,18,15,12,15,12,18,15,18,15,12,15,12,19,20,13,17,25,12,19,20,13,17,25,12,19,20,13,17,25];
                    eleData   = [12,15,30,55,26,18,15,12,15,30,55,26,18,15,14,18,13,20,17,15,14,18,13,20,17,15,14,18,13,20,17];
                    timeType = getCurDays();
                }else if(time=="年"){
                    waterData = [18,15,18,15,12,15,12,19,20,13,17,25];
                    eleData   = [12,15,30,55,26,18,15,14,18,13,20,17];
                    timeType = 12;
                }
                canvas.changeTimeType(timeType,{waterData:waterData,eleData:eleData});
            });
        },
        //使用折线图
        setCanvas : function(id){
            var waterData,eleData;
            waterData = [18,15,18,15,12,15,12];
            eleData   = [12,15,30,55,26,18,15];
            //假数据
            canvas = new Canvas(id,{});//'water','ele'
            canvas.drawAllData(waterData, eleData);
        }
    };

    function getCurDays(){
        var curDate = new Date();
        return new Date(curDate.getFullYear(), (curDate.getMonth()+1), 0).getDate();
    }

    init.base();
});
/**
 *
 * @param id
 * @param param {handlerCallback:长按回调方法,releaseCallback:释放回调方法}
 * @returns {{drawAllData: drawAllData, drawText: drawText, changeDataType: Function, changeTimeType: Function}}
 * @constructor
 */
Canvas = function(id,param){
    var context = null,
        dataType = 'water',//'water','ele'
        timeType = 7,//week:7,month:28~31,year:12
        height = 0,width = 0,
        initFlg = false,//初次显示时突出线要有动画效果
        data = {waterData:null,eleData:null},//保存传进来的数据
        maxHeight = 0;//显示范围

    /**
     * 初期化
     */
    function init() {
        var canvas = document.getElementById(id);
        canvas.height = $('#data-content').height();
        canvas.width = $('#data-content').width();
        height = canvas.height,width = canvas.width;
        maxHeight = height/2 - height/4;
        context = canvas.getContext('2d');

        //绑定事件
        initBind();

    }

    /**
     * 绑定长按释放事件
     */
    function initBind() {

        var handler = param.handlerCallback || function(data,num){
                var $day;
                switch (num){
                    case 1 : $day = "周一"
                        break;
                    case 2 : $day = "周二"
                        break;
                    case 3 : $day = "周三"
                        break;
                    case 4 : $day = "周四"
                        break;
                    case 5 : $day = "周五"
                        break;
                    case 6 : $day = "周六"
                        break;
                    case 7 : $day = "周日"
                        break;
                }
                $(".day-info").css({opacity:1}).find("dt").text($day);
                $(".day-info").find("strong").text(data);
            },//长按
            release = param.releaseCallback || function(){
                $(".day-info").css({opacity:0});
            };//释放
        var showDataTimer = null,
            leastTime = 200;//持续时间
        //点击
        $('#' + id).bind('touchstart',function(event) {
            //周数据有效
            if(timeType !== 7) {
                return;
            }

            var touchEvent = event;
            showDataTimer = setTimeout(function(){
                var touchX = touchEvent.originalEvent.touches[0].pageX;//点击位置
                var count = Math.ceil(touchX/(width/timeType));//属于第几块
                var curData = dataType === 'water' ? data.waterData[count - 1]:data.eleData[count - 1];
                handlerData(count);
                handler(curData,count);
            },leastTime);
        });
        //释放
        $('#showdata').bind('touchend',function(event) {
            //周数据有效
            if(timeType !== 7) {
                return;
            }

            if(showDataTimer !== null) {
                clearTimeout(showDataTimer);
                showDataTimer = null;
                clearCanva();
                drawAllData(data.waterData,data.eleData);
                release();
            }
        });
    }

    /**
     * @summary 突显长按的块
     * @param count
     */
    function handlerData(count){
        var widthEvery = width/timeType;
        context.beginPath();
        context.fillStyle = dataType === 'water'? 'RGBA(0,96,139,0.9)':'RGBA(211,59,0,0.9)';
        context.globalCompositeOperation="destination-over";
        context.rect((count - 1) * widthEvery,0,widthEvery,height);
        context.fill();
        context.closePath();
    }

    /**
     * 清除canvas
     */
    function clearCanva(){
        context.clearRect(0,0,width,height);
    }

    /**
     *
     * @param waterData
     * @param eleData
     */
    function drawAllData(waterData,eleData) {
        data.waterData = waterData;
        data.eleData = eleData;
        drawTable(context);
        drawData();
    }

    /**
     * 画数据
     */
    function drawData() {
        var block = timeType,
            dataList = [],//当前适应的数据
            controlList = [],
            lineParam = [];

        var widthEvery = width/timeType;

        var pointA = [];
        pointA.push(0);
        for( var i = 1; i < block - 1;i++ ) {
            pointA.push(widthEvery/2 + widthEvery*i);
        }
        pointA.push(width);

        for(var index = 0; index < 2; index++) {
            if(dataType === 'water' && index === 1) {
                dataList = data.eleData;
            }else if(dataType === 'water' && index === 0) {
                dataList = data.waterData;
            }else if(dataType === 'ele' && index === 1) {
                dataList = data.waterData;
            }else {
                dataList = data.eleData;
            }

            dataList = getShowData(dataList);
            controlList = getControlPoint(dataList);

            context.beginPath();
            //if(index === 1) {
                context.globalCompositeOperation="destination-over";
            //}
            context.moveTo(0,dataList[0]);

            for(var j = 1;j < block;j++) {
                context.lineTo(pointA[j - 1],dataList[j])
                context.bezierCurveTo(controlList[j - 1].pointAX,controlList[j - 1].pointAY,controlList[j - 1].pointBX,controlList[j - 1].pointBY,pointA[j],dataList[j + 1])

            }
            context.lineTo(width,height);
            context.lineTo(0,height);
            context.lineTo(0,dataList[0]);
            context.fillStyle = 'RGBA(255,255,255,0.8)';
            context.fill();
            context.closePath();
            if( index === 0) {
                lineParam.push(dataList);
                lineParam.push(controlList);
                //画突出线
                context.beginPath();
                context.globalCompositeOperation="destination-over";
                context.strokeStyle = dataType === 'water'?'RGBA(25,161,199,0.8)':'RGBA(218,51,11,0.8)';

                var lineWidth = 2;
                context.lineWidth = 5;
                context.moveTo(0,dataList[0]- lineWidth);
                var k = 1;
                if(initFlg) {
                    initFlg = false;
                    var anim = setInterval(function(){
                        var dataListTemp = lineParam[0];
                        var controlListTemp = lineParam[1];
                        if( k === block) {
                            clearInterval(anim);
                            anim = null;
                        }else {
                            context.beginPath();
                            context.lineTo(pointA[k - 1],dataListTemp[k] - lineWidth);
                            context.bezierCurveTo(controlListTemp[k - 1].pointAX,controlListTemp[k - 1].pointAY - lineWidth,controlListTemp[k - 1].pointBX,controlListTemp[k - 1].pointBY - lineWidth,pointA[k],dataListTemp[k + 1] - lineWidth);
                            k++;
                            context.stroke();
                            context.closePath();
                        }
                    },100);
                }else {
                    while(k < block) {
                        context.lineTo(pointA[k - 1],dataList[k] - lineWidth);
                        context.bezierCurveTo(controlList[k - 1].pointAX,controlList[k - 1].pointAY - lineWidth,controlList[k - 1].pointBX,controlList[k - 1].pointBY - lineWidth,pointA[k],dataList[k + 1] - lineWidth);
                        k++;
                    }
                    context.stroke();
                    context.closePath();
                }
            }

        }
    }

    /**
     * 画文字
     * @param textVal 内容
     * @param context
     * @param xVal 原点X值
     * @param yVal 目标点Y值
     * @param width 显示区域宽度
     * @param fontSize 字体大小
     */
    function drawText(textVal,context,xVal,yVal,width,fontSize) {
        context.beginPath();
        context.font = fontSize + ' microsoft yahei';
        var text=context.measureText(textVal);
        context.fillStyle = 'RGBA(255,255,255,0.3)';
        context.fillText(textVal,xVal + (width / 2) - (text.width /2),yVal);
    }

    /**
     * 画表格
     * @param count
     * @param context
     */
    function drawTable(context) {
        var widthEvery = width/timeType;
        var week = ['日','一','二','三','四','五','六']
        for(var i = 1;i <= timeType;i++) {
            context.beginPath();
            context.strokeStyle = 'RGBA(255,255,255,0.3)';
            context.lineWidth = '1';
            context.moveTo(widthEvery * i , 0);
            context.lineTo(widthEvery * i , height);
            context.stroke();
            context.closePath();
            if( timeType === 7 ) {
                drawText('ZHOU',context,widthEvery * (i - 1) ,20,widthEvery,'12px');
                drawText(week[i - 1],context,widthEvery * (i - 1),36,widthEvery,'12px');
            }else if(timeType === 12){

            }else {
                drawText(i,context,widthEvery * (i - 1),16,widthEvery,'12px');

            }
        }
    }

    /**
     * 获取坐标数据
     * @param dataList
     * @returns {Array}
     */
    function getShowData(dataList) {
        var len = timeType,dataListTemp = [],srcList = [];
        //加头加尾--求3次贝塞尔曲线控制点需要
        dataListTemp.push(dataList[0]);
        dataListTemp = dataListTemp.concat(dataList);
        dataListTemp.push(dataList[len - 1]);
        len += 2;
        var maxVal = minVal = dataListTemp[0];
        for(var i = 1; i < len;i++) {
            var data = dataListTemp[i];
            if(data > maxVal) {
                maxVal = data;
            }

            if(data < minVal) {
                minVal = data;
            }
        }

        var everyVal = maxHeight/(maxVal - minVal);

        for(var j = 0; j < len;j++) {
            var data = dataListTemp[j];
            data = height/2 - (data - minVal) * everyVal;
            srcList.push(data);
        }

        return srcList;
    }

    /**
     * 获取控制点
     * @param dataList
     * @returns {Array}
     */
    function getControlPoint(dataList){
        var xDataList = [];
        var widthEvery = width/timeType;
        xDataList.push(widthEvery/2);
        for( var i = 1; i < timeType - 1;i++ ) {
            xDataList.push(widthEvery/2 + widthEvery*i);
        }
        xDataList.push(width - widthEvery/2);

        xDataList.push(xDataList[i - 1]);
        xDataList.unshift(widthEvery/2);
        var controlList = [];
        var paramA = 0;
        var paramB = 0;
        for(var j = 0;j < i;j++) {
            var a1 = dataList[j+1] - dataList[j];
            var a2 = dataList[j+2] - dataList[j+1];
            var a3 = dataList[j+3] - dataList[j+2];

            if(a1 === 0 && a2 < 0 && a3 <= a2) {
                paramA = 4;
                paramB = 4;

            }else if(a1 < 0 && a1 > a2 && a3 >= 0){
                paramA = 4;
                paramB = 4;
            }else if(a2 < 0 && a1 <= a2 && a3 >= 0){
                //上上下--中间一段
                paramA = 100;
                paramB = 5;
                if(5 * Math.abs(a2) < Math.abs(a1)) {
                    paramB = 2.85;
                }else if(2 * Math.abs(a2) < Math.abs(a1)) {
                    paramB = 3;
                }
            }else if(a1 > 0 && a2 >= 0 && a3 <= 0){
                paramA = 100;
                paramB = 5;

                if(a2 > a1) {
                    paramA = 3;
                    paramB = 5;
                }else if(a1 > height/8 &&  height / 12 >= a2) {
                    paramA = 3;
                    paramB = 10;
                }


            }else if(a1 <= 0 && a2 > 0 && a3 >= 0){
                if( j == 0) {
                    paramA = 6;
                    paramB = 6;
                }else if(Math.abs(a2 * 4)/height <0.1 ){
                    paramA = 6;
                    paramB = 7;
                }else if(a2 > height/8 &&  height / 12 >= a3){
                    paramA = 4;
                    paramB = 10;
                }else {
                    paramA = 5;
                    paramB = 100;
                }
            }else if(a1 > 0 && a2 <= 0 && a3 <= 0 ){
                paramA = 4;
                paramB = 100;
                if(5 * Math.abs(a3) < Math.abs(a2)) {
                    paramB = 8;
                }else if(2 * Math.abs(a3) < Math.abs(a2)) {
                    paramB = 24;
                }
            }else if(a1 === 0 && a2 > 0){
                //由平向下
                paramA = 6;
                paramB = 5;
            }else if(a1 === 0 && a2 < 0){
                //由平向上
                paramA = 10;
                paramB = 5;
            }else if(a2 === 0 ){
                if(a1 === 0 ) {
                    //平
                    paramA = 100;
                    paramB = 100;
                }else{
                    //
                    paramA = 6;
                    paramB = 6;
                }
            } else{
                paramA = 5;
                paramB = 5;
            }
            var pointAX = xDataList[j + 1] + (xDataList[j + 2] - xDataList[j])/paramA;
            var pointAY = dataList[j + 1] +(dataList[j + 2] - dataList[j])/paramA;
            var pointBX = xDataList[j + 2] - (xDataList[j + 3] - xDataList[j + 1])/paramB;
            var pointBY = dataList[j + 2] -(dataList[j + 3] - dataList[j + 1])/paramB;
            controlList.push({pointAX:pointAX,pointAY:pointAY,pointBX:pointBX,pointBY:pointBY});
        }

        return controlList;
    }



    var publicMethod = {
        drawAllData: drawAllData,
        drawText: drawText,
        /**
         * 改变显示数据类型'water','ele'
         * @param type
         */
        changeDataType:function(type){
            dataType = type;
            clearCanva();
            drawAllData(data.waterData,data.eleData);
        },
        /**
         * 改变数据周期week,mouth,year
         * @param type
         */
        changeTimeType:function(type,newdata) {
            timeType = type,data = newdata;
            clearCanva();
            drawAllData(data.waterData,data.eleData);
        }
    };
    init();
    return publicMethod;
};