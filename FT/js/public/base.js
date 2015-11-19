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
                init.rem();
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
            //退回上一层
            $("body").on("touchstart",".icon-home",function(){
                if(){

                }
                hekr.close();
                return false;
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