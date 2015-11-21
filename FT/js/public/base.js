$(function(){
    var init = {
        base : function(){
            document.documentElement.style.webkitTouchCallout = "none"; //禁止弹出菜单
            document.documentElement.style.webkitUserSelect = "none";//禁止选中
            init.event();
            clickStyle({box:".defaultClick,.icon-add,.icon-catalogue,.close-userInfo,.close-everyDay,.every-day-info,.user-head,.icon-home",class:"opacity8"});
            clickStyle({box:".icon-upward,.icon-downward,.hint-modal-box .tools li,.list-info .link",class:"hover"});
            //自动获取屏幕最小高度
            $(window).bind("resize",function(){
                init.rem();
                $("body").css({display:"block"});
                //获取页面最小高度
                var $H = $(window).height(),
                    $header = $(".main-header").height();
                $(".main-other").css({minHeight:$H-$header});
            }).trigger("resize");
        },
        event : function(){
            //显示热水器
            $(".icon-add").on("touchend",function(){
                $(".nav-WaterPurifier").show().find(".active").removeClass("active");
                $("body").append("<div class='transparency'></div>");
                $(".status-remove").removeClass("status-remove");
            });
            //显示头部左侧菜单
            $(".icon-catalogue").on("touchend",function(){
                $(".nav-catalogue").show();
                $("body").append("<div class='transparency'></div>");
            });
            //关闭透明层
            $("body").on("touchend",".transparency",function(){
                $(".nav-WaterPurifier,.nav-catalogue").hide();
                $(this).remove();
                return false;
            });
            //关闭提示层
            $("body").on("click",".cancel-hint-modal",function(){
                $(".hint-modal").hide();
            });
            //开关
            $("body").on("touchstart",".switch-btn",function(){
                $(this).hasClass("close")?$(this).removeClass("close"):$(this).addClass("close");
                return false;
            });
            //返回上一层
            $("body").on("touchstart",".back",function(){
                Hekr.close();
//                location.href = $(this).attr("data-href");
            });
        }, 
        rem : function(){
            !function(win, option) {
                var count = 0,
                    designWidth = option.designWidth,
                    designHeight = option.designHeight || 0,
                    designFontSize = option.designFontSize || 20,
                    callback = option.callback || null,
                    root = document.documentElement,
                    body = document.body,
                    rootWidth, newSize, t, self;
                //返回root元素字体计算结果
                function _getNewFontSize() {
                    var scale = designHeight !== 0 ? Math.min(win.innerWidth / designWidth, win.innerHeight / designHeight) : win.innerWidth / designWidth;
                    return parseInt( scale * 10000 * designFontSize ) / 10000;
                }
                !function () {
                    rootWidth = root.getBoundingClientRect().width;
                    self = self ? self : arguments.callee;
                    //如果此时屏幕宽度不准确，就尝试再次获取分辨率，只尝试20次，否则使用win.innerWidth计算
                    if( rootWidth !== win.innerWidth &&  count < 20 ) {
                        win.setTimeout(function () {
                            count++;
                            self();
                        }, 0);
                    } else {
                        newSize = _getNewFontSize();
                        //如果css已经兼容当前分辨率就不管了
                        if( newSize + 'px' !== getComputedStyle(root)['font-size'] ) {
                            root.style.fontSize = newSize + "px";
                            return callback && callback(newSize);
                        };
                    };
                }();
                //横竖屏切换的时候改变fontSize，根据需要选择使用
                win.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function() {
                    clearTimeout(t);
                    t = setTimeout(function () {
                        self();
                    }, 200);
                }, false);
            }(window, {
                designWidth: 640,
                designHeight: 1136,
                designFontSize: 20,
                callback: function (argument) {
                    console.timeEnd("test")
                }
            });
        }
    };
    init.base();


});
/*触摸点击事件*/
function clickStyle(info){
    $(info.box).on("touchstart",function(){
            $(this).addClass(info.class);
        }
    );
    $(info.box).on("touchend",function(){
        var self = $(this);
        setTimeout(function(){
            self.removeClass(info.class);
        },100);
    });
}
//随机数
function random(n,t){
    return null == t&&(t=n,n=0),n+Math.floor(Math.random()*(t-n+1))
}
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





(function () {

    /*
    HEKR UARTDATA Protocol analysis


     智能灯光示例帧：
     0x48   0x0B    0x02    0x00

     0x01   0x00    0x64    0x00    0x00    0x00    0x00    0x00

     0XBA


     v1.0.1 by fwj@hekr.me   20150901
    */

    if (typeof UARTDATA !== 'object') {
        UARTDATA = {};
    }


    'use strict';

    var frame_num=0;
// var frame_header=0x48,


    function get_check_code(frame,option) {//frame 帧   option 是否包含校验位
        if(typeof(frame)=="string"){//格式化为数组
            frame=frame.replace(/(\w{2})/g,'$1 ').replace(/\s*$/,'').split(' ');
        }
        var sum=0,i=0;
        for(i in frame){
            sum+=parseInt(frame[i],16);
        }
        // if(i){
        //  sum=sum-0x48;
        // }
        if(option){
            //console.log(frame[frame.length-1])
            sum=sum-parseInt(frame[frame.length-1],16);
        }
        if(sum>255){
            sum=sum%0x100
        }
        if(sum<0x10){
            sum='0'+sum.toString(16)
        }else{
            sum=sum.toString(16)
        }
        //console.log("sum(hex)"+sum)
        return sum;
    }

/*
D(decimal)  十进制     dec
B(binary)   二进制     bin
O(octor)    八进制     oct
H(hex)      十六进制    hex

parseInt(str,2);
.charCodeAt(0);
*/
    function charstr2hexstr(data){
        var hexstr='';
        for(var i=0; i<data.length;i++){
            hexstr+=hex2str(data.charCodeAt(i));
        }
        return hexstr;
    }

    if (typeof UARTDATA.charstr2hexstr !== 'function') {
        UARTDATA.charstr2hexstr=charstr2hexstr;
    };

    function bin2str(bin){
        if(bin<0x10){
            bin='0000'+bin.toString(2)
        }else{
            bin=bin.toString(2)
        }
        return bin
    }

    if (typeof UARTDATA.bin2str !== 'function') {
        UARTDATA.bin2str=bin2str;
    };


    function hex2str(hex){
        if(hex<0x10){
            hex='0'+hex.toString(16)
        }else{
            hex=hex.toString(16)
        }
        return hex
    }

    if (typeof UARTDATA.hex2str !== 'function') {

        UARTDATA.hex2str=hex2str;
    };


    if (typeof UARTDATA.encode !== 'function') {

        UARTDATA.encode = function (frame_type,frame_data) {
            var frame='48';
            var frame_length=(frame_data.length/2+5);

            frame+=hex2str(frame_length);
            frame+=hex2str(frame_type);
            frame+=hex2str(frame_num);
            frame+=frame_data;
            frame+=get_check_code(frame,0)
            frame_num++;
            if(frame_num>0xff){
                frame_num=0;
            }
            return frame;
        };
    }




    if (typeof UARTDATA.decode !== 'function') {
        UARTDATA.decode = function (frame) {

            var data="";
            if(frame.length<10){
                return ''
            }

            //校验合法性
            var frame_check_code=get_check_code(frame,1);

            if(frame[frame.length-1].toUpperCase()==frame_check_code[frame_check_code.length-1].toUpperCase()){
                data=frame.substring(8, frame.length-2)
                //48 0B 02 00 03 01 35 00 00 00 00 00 46
            }


            data=data.replace(/(\w{2})/g,'$1 ').replace(/\s*$/,'').split(' ');
            for(var i in data){
                data[i]=parseInt(data[i],16);
            }

            return data
            //throw new SyntaxError('JSON.parse');
        };
    }
}());
