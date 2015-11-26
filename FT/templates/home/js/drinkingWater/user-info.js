$(function(){
    var canvas = null;
	var init = {
		base : function(){
            init.event();
            $(window).bind("resize",function(){
                //获取页面最小高度
                var $H       = $(window).height(),
                    $header  = $(".main-header").height(),
                    $quantum = $(".Drink-water-records").height(),
                    $submenu = $(".submenu-bar").height();
                var $val = $H-$header-$quantum-$submenu-1;
                $(".Drink-water-records").css({height:$quantum+($val>0?$val:0)});
            }).trigger("resize");
            var data = [12,15,30,55,26,18,15];
            var yearData = [18,15,18,15,12,15,12,19,20,13,17,25];
            var monthData = [18,15,18,15,12,15,12,18,15,18,15,12,15,12,19,20,13,17,25,12,19,20,13,17,25,12,19,20,13,17,25,18];
            canvas = new Canvas('showdata');
            canvas.draw(data);
            //时间切换
            $("body").on("touchend",".submenu-bar input",function(){
                var $val = $(this).val();
                if($val=="周"){
                    canvas.changeTimeType(7,data);
                }else if($val=="月"){
                    var dayCount = getCurDays();
                    if(dayCount === 28) {
                        canvas.changeTimeType(14,monthData);
                    }else {
                        canvas.changeTimeType(15,monthData);
                    }

                }else if($val=="年"){
                    canvas.changeTimeType(12,yearData);
                }
                $(this).addClass("active").siblings().removeClass("active");
            });
		},
		event : function(){


		},
	};
	init.base();

    function getCurDays(){
        var curDate = new Date();
        return new Date(curDate.getFullYear(), (curDate.getMonth()+1), 0).getDate();
    }
});

var Canvas = function(id,param){
    var context = null,
        timeType = 7,//week:7,month:28~31,year:12
        height = 0,width = 0,
        initFlg = false,//初次显示时突出线要有动画效果
        data = [],//保存传进来的数据
        maxHeight = 0;//显示范围

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
        canvas.height = $('#data_content').height();
        canvas.width = $('#data_content').width();
        height = canvas.height,width = canvas.width;
        maxHeight = height/2 - height/4;
        context = canvas.getContext('2d');

        //绑定事件

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
    function draw(data) {
        drawTable(context);
        drawData(data);
    }

    /**
     * 画数据
     */
    function drawData(data) {
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

        dataList = getShowData(data);
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
            context.fillStyle = 'RGBA(255,255,255,0.9)';
            context.fill();
            context.closePath();
            lineParam.push(dataList);
            lineParam.push(controlList);
            //画突出线
            context.beginPath();
            context.globalCompositeOperation="destination-over";
            context.strokeStyle = 'RGBA(25,161,199,0.8)';

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

    /**
     * 画文字
     * @param textVal 内容
     * @param context
     * @param xVal 原点X值
     * @param yVal 目标点Y值
     * @param width 显示区域宽度
     * @param fontSize 字体大小
     */
    function drawText(textVal,context,xVal,yVal,width,fontSize,fillStyle) {
        context.beginPath();
        context.font = fontSize + ' microsoft yahei';
        var text=context.measureText(textVal);
        context.fillStyle = fillStyle?fillStyle:'RGBA(255,255,255,1)';
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
        var week = ['日','一','二','三','四','五','六']
        for(var i = 1;i <= timeType;i++) {
            context.beginPath();
            context.strokeStyle = 'RGBA(255,255,255,0.5)';
            context.lineWidth = '1';
            context.moveTo(widthEvery * i , 0);
            context.lineTo(widthEvery * i , height);
            context.stroke();
            context.closePath();
            if( timeType === 7 ) {
                drawText('ZHOU',context,widthEvery * (i - 1) ,20,widthEvery,'12px');
                drawText(week[i - 1],context,widthEvery * (i - 1),36,widthEvery,'12px');
            }else if(timeType === 12){
                drawText(i,context,widthEvery * (i - 1) ,16,widthEvery,'12px');
            }else if(timeType === 14){
                drawText(i*2,context,widthEvery * (i - 1),16,widthEvery,'12px');
            }else {
                drawText(i*2 - 1,context,widthEvery * (i - 1),16,widthEvery,'12px');
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
        draw: draw,
        drawText: drawText,/**
         * 改变数据周期week,mouth,year
         * @param type
         */
        changeTimeType:function(type,newdata) {
            timeType = type,data = newdata;
            clearCanva();
            draw(data);
        }
    };
    init();
    return publicMethod;
};