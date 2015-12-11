$(function(){
    window.HerkIf = true;
    var init = {
        base : function(){
            document.documentElement.style.webkitTouchCallout = "none"; //禁止弹出菜单
            document.documentElement.style.webkitUserSelect = "none";//禁止选中
            init.event();
            clickStyle({box:".defaultClick,.icon-add,.icon-catalogue,.close-userInfo,.close-everyDay,.every-day-info,.user-head,.icon-home",class:"opacity8"});
            clickStyle({box:".icon-upward,.icon-downward,.hint-modal-box .tools li,.list-info .link,.hoverClick",class:"hover"});
            //自动获取屏幕最小高度
            //$(window).bind("resize",function(){
                init.rem();
                $("body").css({display:"block"});
                //获取页面最小高度
                var $H = $(window).height(),
                    $header = $(".main-header").height();
                $(".main-other").css({minHeight:$H-$header});
            //}).trigger("resize");
        },
        event : function(){
            /*var listerTimer = null,listerTime = 50;
            $('body').on('touchstart touchmove',function(e) {
                var $this = $(this);
                clearInterval(listerTimer)
                listerTimer = null;
                listerTimer = setInterval(function(){
                    $('body').append("window: <span style='color: #FFF;'>" + ( document.body.clientTop) + '</span><br>');
                },listerTime);
            }).on('touchend',function(e){
                    clearInterval(listerTimer)
                    listerTimer = null;
                });*/

            //显示热水器
            $(".icon-add").on("touchend",function(){
                $(".nav-WaterPurifier").show().find(".active").removeClass("active");
                $("body").append("<div class='transparency'></div>");
                $(".status-remove").removeClass("status-remove");
                return false;
            });
            //显示头部左侧菜单
            $(".icon-catalogue").on("touchend",function(){
                $(".nav-catalogue").show();
                $("body").append("<div class='transparency'></div>");
                return false;
            });
            //关闭透明层
            $("body").on("touchend",".transparency",function(){
                $(".nav-WaterPurifier,.nav-catalogue").hide();
                $(this).remove();
                return false;
            });
            //关闭提示层
            $("body").on("touchend",".cancel-hint-modal",function(){
                $(".hint-modal").hide();
            });
            //开关
            $("body").on("touchend",".switch-btn",function(){
                $(this).hasClass("close")?$(this).removeClass("close"):$(this).addClass("close");
                return false;
            });
            //返回上一层
            $("body").on("touchend",".back",function(){
                if(window.HerkIf){
                    Hekr.close(true);
                }else{
                    location.href = $(this).attr("data-href");
                }
                return false;
            });
            //返回指定页面
            $("body").on("touchend",".backTo",function(){
                if(window.HerkIf){
                    Hekr.backTo("/home/html/index.html",true);
                }else{
                    location.href = $(this).attr("data-href");
                }
                return false;
            });
            //关闭提示框
            $("body").on("touchend",".close-hint",function(){
                $(".hint-modal.hint").css({display:"none"});
            });
            //登出
            $("body").on("touchend",".login-out",function(){
                if(window.HerkIf){
                    Hekr.logout();
                }
                location.href = "login.html";
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
                    //console.timeEnd("test")
                }
            });
        }
    };
    init.base();
});
//设备反馈
document.addEventListener('HekrSDKReady',function(){
    Hekr.getConfig(function(info){
        window.tid = info.tid;
        if(window.tid){
            // var $sendMsg = sendInfo("000B3000");
            // Hekr.sendMsg(tid,$sendMsg);
        }       
        Hekr.setMsgHandle(tid,function(str){
            var msg = getArrayInfo(str.state.uartdata);//获取反馈信息
            window.errorone = window.errortwo = false;
            if(msg[0]=="C1"){//告警消息实时推送
                Hekr.backTo("/home/html/index.html",true);
                $(".malfunction-status").hide();
                window.errorone = window.errortwo = false;
                if(msg[1]=="0B"){//漏水
                    window.errorone = true;
                    $(".malfunction-makeWater").show().siblings().hide();
                }else if(msg[1]=="0C"){//缺水
                    window.errorone = true;
                    $(".malfunction-hydropenia").show().siblings().hide();
                }else if(msg[1]=="0D"){//设备故障
                    window.errorone = false;
                    // $(".malfunction-wifi").show().siblings().hide();
                    $(".malfunction-malfunction").html('<i class="icon icon-malfunction"></i>设备故障').show().siblings().hide();
                }
            }
                // }else if(msg[3]==03){//进水TDS故障
                //     $(".malfunction-malfunction").html('<i class="icon icon-malfunction"></i>进水TDS故障');
                // }else if(msg[3]==04){//出水TDS故障
                //     $(".malfunction-malfunction").html('<i class="icon icon-malfunction"></i>出水TDS故障');
                // }else if(msg[3]==05){//进水有机物故障
                //     $(".malfunction-malfunction").html('<i class="icon icon-malfunction"></i>进水有机物故障');
                // }else if(msg[3]==06){//出水有机物故障
                //     $(".malfunction-malfunction").html('<i class="icon icon-malfunction"></i>出水有机物故障');
                // }else if(msg[3]==07){//进水流量故障
                //     $(".malfunction-malfunction").html('<i class="icon icon-malfunction"></i>进水流量故障');
                // }else if(msg[3]==08){//出水流量故障
                //     $(".malfunction-malfunction").html('<i class="icon icon-malfunction"></i>出水流量故障');
                // }else if(msg[3]==09){//蓝牙故障
                //     $(".malfunction-malfunction").html('<i class="icon icon-malfunction"></i>蓝牙故障');
                // }else if(msg[3]=="0A"){//无线充电故障
                //     $(".malfunction-malfunction").html('<i class="icon icon-malfunction"></i>无线充电故障');
                // }else if(msg[3]=="0B"){//电磁阀故障
                //     $(".malfunction-malfunction").html('<i class="icon icon-malfunction"></i>电磁阀故障');
                // }else if(msg[3]=="0C"){//水压开关故障
                //     $(".malfunction-malfunction").html('<i class="icon icon-malfunction"></i>水压开关故障');
                // }else if(msg[3]=="0D"){//膜故障
                //     $(".malfunction-malfunction").html('<i class="icon icon-malfunction"></i>膜故障');
                // }
        });
    });
        
}, false);

/*提示信息*/
function hintModal(info){
    $(".hint-modal.hint").remove();
    $("body").append(template.render("hint-modal",{val:info.val}));
    $(".hint-modal.hint").css({display:"table"});
};

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
    for(var i=0;i<info.length;i+=2){
        val.push(info.slice(i,i+2));
    }
    return val;
};
//发送命令
function sendInfo(data){
    var frame = UARTDATA.encode(0x02,data);
    return "(uartdata \""+frame+"\")";
};
//表单键盘控制
var inputControl = function($obj) {
    var type = typeof $obj;
    var inputFlg = false;

    $obj.each(function(index, ele) {
        $(ele).focus(function(){
            inputFlg = true;
        });
    });

    $('body').bind('touchend',function(event){
        var target = event.target;
        if($obj.index(target) === -1 && inputFlg === true) {
            //alert(1);
            $obj.blur();
        }
    })
};

//方太缓存
var com = {};
if(!com.fangtai) {
    com.fangtai = {};
}

com.fangtai.localStorage = {
    setDrinkWaterDate : function(paramStr, val, index){
        localStorage.setItem(paramStr,val);
        localStorage.setItem('drinkWater_date',paramStr);
        var indexList = localStorage.getItem('selected_index') || '';
        localStorage.setItem('selected_index',indexList + ',' + index);
    },
    getDrinkWaterDate : function(paramStr){
        var val = localStorage.getItem(paramStr);
        if(val === null || val === undefined) {
            localStorage.setItem('selected_index',null);
            var date = localStorage.getItem('drinkWater_date');
            localStorage.setItem(date,null);
            return 0;
        }

        return Number(val);
    },
    getDrinkWater_SaveIndex: function(){
        return localStorage.getItem('selected_index') || '';
    }
}