$(function(){
    var init = {
        base : function(){
            init.event();
            clickStyle({box:".coded-lock li",class:"hover"});
            window.lockNum = "";
            window.opportunity = 3;
        },
        event : function(){
            //按下数量
            $("body").on("touchend",".coded-lock li",function(){
                if($(".coded-lock").attr("status")=="true"){
                    var $box = $(".coded-lock"),
                        $val = $(this).text(),
                        $len = $box.find(".active").length;
                    //参数状态
                    $(".remove-lock-dot").show();
                    $box.find("li").eq($len).addClass("active");
                    lockNum+=$val;
                    if(lockNum.length==4){
                        var $func = $box.attr("func");
                        window[$func]({num:lockNum});
                        lockNum = "";
                        $(".coded-lock").find(".active").removeClass("active");
                        $(".remove-lock-dot").hide();
                    }
                    init.timeCount();//时间计算
            }
            });
            /*//取消已输入密码
            $("body").on("click",".remove-lock-dot",function(){
                init.infoDefault();
            });*/
        },
        //时间计算
        timeCount : function(){
            var self = this;
            self.second = 10;
            self.time = function(){
                clearInterval(this.timeSecond);
                self.timeSecond = null;
                self.timeSecond = setInterval(function(){
                    if(self.second==0){
                        clearInterval(self.timeSecond);
                        //初始化
                        init.infoDefault();
                    }
                    self.second--;
                },1000);
            };
            self.time();
        },
        infoDefault : function(){
            lockNum = "";
            $(".remove-lock-dot").hide();
            $(".coded-lock").find(".active").removeClass("active");
        }
    };
    init.base();
});
//验证密码
function verify(info){
    var self = this;
    self.password = "1357";
    self.hint = function(){
        if(info.num == self.password){
            location.href = "index.html?openType=push";
        }else{
            window.opportunity-=1;
            if(window.opportunity==0){
                /*//禁止解锁
                 self.prohibit();*/
                //启用重置密码
                $(".coded-lock").attr("func","resetPassword");
                $(".lock-caption").text("重置密码");
                $(".lock-hint").html("密码错误，请<span>重置</span>密码");
            }else{
                //添加解锁机会
                self.addOpportunity();
            }
        }
    };
    //添加解锁机会
    self.addOpportunity = function(){
        $(".lock-hint").text("密码输入错误，请重新输入");
        setTimeout(function(){
            window.opportunity+=1;
        },60000);
        //文字抖动效果
        var len = 4,size = 6,num=1;
        var $time = setInterval(function(){
            $(".lock-hint").animate({left:size},50);
            if(size>0){
                size = -(size+num);
            }else{
                size = -size+num;
            }
            len--;
            if(len==0){
                clearInterval($time);
                $(".lock-hint").animate({left:0});
            }
        },50);
    };
    //禁止解锁
    self.prohibit = function(){
        $(".coded-lock").attr("status","false");
        var $num = 60;
        var $time;
        $(".lock-hint").text("请在"+$num+"秒后重试");
        $time = setInterval(function(){
            $num--;
            $(".lock-hint").text("请在"+$num+"秒后重试");//请在秒后重试
            if($num==0){
                $(".coded-lock").attr("status","true");
                window.opportunity=5;
                clearInterval($time);
                $(".lock-hint").text("");
            }
        },1000);
    }
    self.hint();
};
//重置密码
function resetPassword(info){
    var self = this;
    self.init = function(){
        if(info.num == window.defaultPassword){
            $(".lock-hint").html("密码重置成功");
            setTimeout(function(){
                location.href = "index.html?openType=push";
            },1000);
        }else if(window.defaultPassword){
            window.defaultPassword = "";
            $(".lock-hint").html("两次密码不一致，请<span>重置</span>密码");
        }else{
            window.defaultPassword = info.num;
            $(".lock-hint").html("请在输入一次");
        }
    };
    self.init();
}