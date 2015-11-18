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