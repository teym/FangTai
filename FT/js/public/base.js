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
            //返回指定页面
            $("body").on("touchstart",".backTo",function(){
                Hekr.backTo($(this).attr("data-href"),true);
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
//设备反馈
document.addEventListener('HekrSDKReady',function(){
    Hekr.setMsgHandle("VDEV_1AFE349C3DPN",function(str){
        //返回 "48 09 02 01 C1 0B 30 01 50"
        var msg = UARTDATA.decode("480902010008204BC7");//[0,8,32,75]
        console.log(msg);
        if(msg[1]==8&&msg[2]==32){//反馈污染度
            progress.stopAnim();
            progress.drawProgress(msg[3],'pollutant');
        }
    });
}, false);

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
};
//获取字符串信息为数据
function getArrayInfo(info){
    var val = [];
    info = info.slice(8,info.length-2);
    for(){

    }
    return;
};