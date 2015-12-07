$(function(){
    var canvas = null;
    var init = {
        base : function(){
            //searchData(handlerCanvas,releaseCallback);
            init.event();
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
                    eleData   = [12,15,,55,26,18,''];
                    timeType = 7;
                }else if(time=="月"){
                    waterData = [18,15,18,15,12,15,12,18,15,18,15,12,15,12,19,20,13,17,25,12,19,20,13,17,25,12,19,20,13,17,25];
                    eleData   = [12,15,30,55,26,18,15,12,15,30,55,26,18,15,14,18,13,20,17,15,14,18,13,20,17,15,14,18,13,20,17];
                    var dayCount = getCurDays();
                    if(dayCount === 28) {
                        timeType = 14;
                    }else {
                        timeType = 15;
                    }
                    //timeType = getCurDays();
                }else if(time=="年"){
                    waterData = [18,15,18,15,12,15,12,19,20,13,17,25];
                    eleData   = [12,15,30,55,26,18,15,14,18,13,20,17];
                    timeType = 12;
                }
                canvas.changeTimeType(timeType,{waterData:waterData,eleData:eleData});
            });

            $(window).bind("resize",function(){
                //定位
                var $otherH  = $(".main-other").height();
                $(".dosage").css({position:"relative",height:$otherH});
                $(".dosage-main").css({height:$otherH-$(".menu-bar").height()-$(".submenu-bar").height()});
            }).trigger("resize");
        },
        //使用折线图
        setCanvas : function(id,callback){
            var waterData,eleData;
            waterData = [18,15,18,,12,,12];
            eleData   = ['',15,null,55,26,'',4];
            //假数据
            canvas = new Canvas(id,{});//'water','ele'
            var waitTemer = setInterval(function(){
                //未加载完成
                if(!canvas.hadLoadFont()) {
                    return;
                }
                //加载完成
                clearInterval(waitTemer);
                waitTemer = null;
                canvas.drawAllData(waterData, eleData);

            },100);

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
        maxHeight = 0,//显示范围
        loadFontFlg = false;//文字加载成功flg

    var nullData = [];
    var monthText = [
        {text:'一月',code:'YIYUE'},
        {text:'二月',code:'ERYUE'},
        {text:'三月',code:'SANYUE'},
        {text:'四月',code:'SIYUE'},
        {text:'五月',code:'WUYUE'},
        {text:'六月',code:'LIUYUE'},
        {text:'七月',code:'QIYUE'},
        {text:'八月',code:'BAYUE'},
        {text:'九月',code:'JIUYUE'},
        {text:'十月',code:'SHIYUE'},
        {text:'十一月',code:'SHIYIYUE'},
        {text:'十二月',code:'SHIERYUE'}
    ];

    /**
     * 初期化
     */
    function init() {
        var canvas = document.getElementById(id);
        canvas.height = $('#data-content').height() * 2;
        canvas.width = $('#data-content').width() * 2;
        height = canvas.height,width = canvas.width;
        maxHeight = height/2 - height/4;
        context = canvas.getContext('2d');
        context.font = '16px FZLTCXHJW';


        //绑定事件
        initBind();

    }

    /**
     * 判断文字是否加载完成
     * @returns {boolean}
     */
    function hadLoadFont() {
        var text = context.measureText('0');
        console.log(text.width);
        loadFontFlg = loadFontFlg?loadFontFlg : '8.734375' != text.width;
        return loadFontFlg;
    }

    /**
     * 绑定长按释放事件
     */
    function initBind() {

        var handler = param.handlerCallback || function(data,num){
                var text = ["周日","周一","周二","周三","周四","周五","周日"],
                    $day = text[num - 1];
                $(".day-info").css({opacity:0}).animate({opacity:1},500).find("dt").text($day);
                $(".day-info").find("strong").text(data);
            },//长按
            release = param.releaseCallback || function(){
                return;
                $(".day-info").css({opacity:0});
            };//释放
        var showDataTimer = null,
            leastTime = 0;//持续时间
        //点击
        $('#' + id).bind('touchstart',function(event) {
            //周数据有效
            if(timeType !== 7) {
                return;
            }

            var touchEvent = event;
            showDataTimer = setTimeout(function(){
                var touchX = touchEvent.originalEvent.touches[0].pageX;//点击位置
                var count = Math.ceil(touchX * 2/(width/timeType));//属于第几块
                var curData = dataType === 'water' ? data.waterData[count - 1]:data.eleData[count - 1];
                handlerData(count);
                curData = curData?curData:0;
                handler(curData,count);
            },leastTime);
        }).bind('touchend',function(event) {
            //周数据有效
            if(timeType !== 7) {
                return;
            }

            if(showDataTimer !== null) {
                clearTimeout(showDataTimer);
                showDataTimer = null;
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
        clearCanva();
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
                context.strokeStyle = dataType === 'water'?'RGBA(25,161,199,0.8)':'RGBA(218,51,11,0.8)';
                var lineWidth = width*0.0015;
                context.lineWidth = width*0.015;
                context.moveTo(0,dataList[0]- lineWidth);
                //画突出线
                if(timeType === 7) {
                    context.beginPath();
                    context.globalCompositeOperation="source-over";
                    context.strokeStyle = 'RGBA(25,161,199,0.8)';
                    context.lineWidth = width*0.015;
                    var j = 1;

                    while(j <= block) {
                        context.lineTo(pointA[j - 1],dataList[j] - lineWidth);
                        j++;
                    }
                    context.stroke();
                    context.closePath();
                    j = 1;
                    context.beginPath();
                    context.fillStyle = dataType === 'water'?'RGBA(25,161,199,0.8)':'RGBA(218,51,11,0.8)';
                    context.arc(pointA[j - 1] + widthEvery/2,(dataList[j] - lineWidth) + (dataList[j + 1] - dataList[j]) /3,lineWidth * 10,0,Math.PI * 2,true);
                    context.fill();
                    context.closePath();
                    j++;
                    while(j < block) {
                        context.beginPath();
                        context.fillStyle = dataType === 'water'?'RGBA(25,161,199,0.8)':'RGBA(218,51,11,0.8)';
                        context.arc(pointA[j - 1],dataList[j] - lineWidth,lineWidth * 10,0,Math.PI * 2,true);
                        context.fill();
                        context.closePath();
                        j++;
                    }

                    context.beginPath();
                    context.fillStyle = dataType === 'water'?'RGBA(25,161,199,0.8)':'RGBA(218,51,11,0.8)';
                    context.arc(pointA[j - 1] - widthEvery/2,(dataList[j] - lineWidth) - (dataList[j] - dataList[j - 1]) /3,lineWidth * 10,0,Math.PI * 2,true);
                    context.fill();
                    context.closePath();



                }else {
                    context.beginPath();
                    context.globalCompositeOperation="destination-over";
                    context.lineWidth = width*0.015;
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

                    var len = nullData.length;
                    //console.log('nullData',nullData);
                    for(var nullIndex = 0; nullIndex < len; nullIndex++) {
                        drawDotted(nullData[nullIndex]);
                    }
                }
            }
        }
    }

    function drawDotted(block) {
        var widthEvery = width/timeType,
            startX = widthEvery * block + widthEvery/ 2,
            endX = startX + widthEvery;
        startX = block === 0 ? 0 : startX;


        endX = block === timeType - 1 ? width : endX;

        var dottedWidth = widthEvery/10;
        var lineWidth =  width*0.015;
        var startY = height/4,endY = height / 2;
        var x  = 0,paramY = -1;
        for(var i = 0; i < 10 && x <= endX; i++) {
            if(paramY === -1) {
                startY = height/4,endY = height / 2;
            }else {
                var count = Math.ceil(dottedWidth);
                startY = paramY - count * lineWidth;
                endY = paramY + 2 * count * lineWidth;
                startY = startY < height/4?height/4:startY;
                endY = endY > height/2?height/2:endY;
            }
            var xTemp = startX + 2 * i * dottedWidth;
            for (x = xTemp; x <= xTemp + dottedWidth && x <= endX; x++ ) {
                var paramY = toWhite(x,startY,endY)
                startY = paramY - lineWidth;
                endY = paramY + 2 * lineWidth;
                startY = startY < height/4?height/4:startY;
                endY = endY > height/2?height/2:endY;
            }
        }



    }

    function toWhite(x,startY,endY) {
        var paramY = 0;
        for(var y = startY; y <= endY; y++) {
            var imageData = context.getImageData(x, y, 1, 1);
            var pixel = imageData.data;
            var curColor = 'rgb(' + pixel[0] + ',' + pixel[1] + ',' + pixel[2] +')';
            if(curColor !== 'rgb(255,255,255)' && curColor !== 'rgb(0,0,0)' && curColor !== 'rgb(47,186,226,)' && curColor !=='rgb(242,88,38)') {
                paramY = y;
                /*context.beginPath();
                context.strokeStyle = '#FFF';
                context.g
                context.lineWidth = width * 0.0001;
                context.moveTo(x,y);
                context.lineTo(x + 1,y);
                context.stroke();
                context.closePath();*/
                insteadColor(x,y);

                break;
            }
        }

        var lineWidth =  width * 0.015;
        for(; y < paramY + lineWidth; y++) {
            insteadColor(x,y);
        }

        return paramY;
    }

    function insteadColor(X,Y) {
        var imgData = context.createImageData(1,1);
        for (var i=0;i<imgData.data.length;i+=4) {
            imgData.data[i+0]=255;
            imgData.data[i+1]=255;
            imgData.data[i+2]=255;
            imgData.data[i+3]=255;
        }
        return context.putImageData(imgData,X,Y);
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
        context.font = fontSize + ' FZLTCXHJW';
        var text=context.measureText(textVal);
        context.fillStyle = 'RGBA(255,255,255,0.8)';
        context.fillText(textVal,xVal + (width / 2) - (text.width /2),yVal);
        context.closePath();
    }

    /**
     * 画表格
     * @param count
     * @param context
     */
    function drawTable(context) {
        var widthEvery = width/timeType;
        var week = ['日','一','二','三','四','五','六'];
        for(var i = 1;i <= timeType;i++) {
            context.beginPath();
            context.strokeStyle = 'RGBA(255,255,255,0.3)';
            context.lineWidth = '1';
            context.moveTo(widthEvery * i , 0);
            context.lineTo(widthEvery * i , height);
            context.stroke();
            context.closePath();
            if( timeType === 7 ) {
                drawText('ZHOU',context,widthEvery * (i - 1) ,Math.floor(3 * widthEvery/12),widthEvery,Math.floor(3 * widthEvery/16) + 'px');
                drawText(week[i - 1],context,widthEvery * (i - 1),Math.floor(3 * widthEvery/20) * 2 + 20,widthEvery,Math.floor(3 * widthEvery/12) + 'px');
            }else if(timeType === 12){
                drawText(i,context,widthEvery * (i - 1) ,Math.floor(3 * widthEvery/9),widthEvery,Math.floor(4 * widthEvery/12) + 'px');
            }else if(timeType === 14){
                drawText(i*2,context,widthEvery * (i - 1),Math.floor(3 * widthEvery/7),widthEvery,Math.floor(6 * widthEvery/14) + 'px');
            }else {
                drawText(i*2 - 1,context,widthEvery * (i - 1),Math.floor(3 * widthEvery/7.5),widthEvery,Math.floor(6 * widthEvery/15) + 'px');
            }
        }

        /*var curDate = new Date();
        if( timeType === 12) {
            var year = curDate.getFullYear();
            drawText(year,context,0 ,50,width,'32px','RGB(255,255,255)');

        }else if(timeType > 12) {
            var monthIndex = curDate.getMonth();
            var month = monthText[monthIndex];
            drawText(month.code,context,0 ,40,width,'24px','RGB(255,255,255)');
            drawText(month.text,context,0 ,80,width,'40px','RGB(255,255,255)');
        }*/
    }

    /**
     * 获取坐标数据
     * @param dataList
     * @returns {Array}
     */
    function getShowData(dataList) {
        var len = timeType,dataListTemp = [],srcList = [];
        //确定空数据
        nullData = [];
        for( var index = 0;index < len; index++) {
            var dataVaild = dataList[index];
            if(dataVaild === null || dataVaild === '' || dataVaild === undefined) {
                nullData.push(index);
                dataVaild = 0;
            }
            if(index === 0 || index === len - 1) {
                dataListTemp.push(dataVaild);
            }
            dataListTemp.push(dataVaild);
        }
        //加头加尾--求3次贝塞尔曲线控制点需要
       /* dataListTemp.push(dataListTemp[0]);
        var lastVal = dataListTemp[len - 1];
        dataListTemp.push(lastVal);*/
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

    function changeText() {
        var text = '本',unit = '';
        text += (timeType === 7 ? '周':timeType === 12?'年':'月') + '用';
        var num = 0,dataItem = 0,curData = null;
        if(dataType === 'water') {
            unit = '吨';
            text += '水';
            curData = data.waterData;

        }else {
            unit = '度';
            text += '电';
            curData = data.eleData;
        }
        for(var i = 0; i < timeType; i++) {
            dataItem = curData[i];
            if(dataItem) {
                num += dataItem;
            }
        }
        $('#data-content .summary dd').html('<strong>' + num + '</strong>' + unit);
        $('#data-content .summary dt').html(text);
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
            var colorStyle = dataType === 'water'?'RGBA(25,161,199,0.8)':'RGBA(218,51,11,0.8)'
            $('.dosage-main .day-info dd strong').css('color',colorStyle);
            changeText();
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
            changeText();
            drawAllData(data.waterData,data.eleData);
        },
        hadLoadFont:hadLoadFont
    };
    init();
    return publicMethod;
};