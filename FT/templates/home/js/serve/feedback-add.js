$(function(){
	var init = {
		base : function(){
            init.event();
            //表单键盘控制
            new inputControl($("input:not(input[type='button'])"));
		},
		event : function(){
             $(".feedback-info textarea").bind("focus",function(){
                 window.activeobj=this;
                 this.clock = setInterval(function(){
                     var $captionH = $(".section-caption").height(),
                         $height   = $(window).height()-$captionH*4;
                     if(activeobj.scrollHeight>$height){
                         activeobj.style.height = $height+'px';
                     }else{
                         activeobj.style.height = activeobj.scrollHeight+'px';
                     }
                 },10);
             }).bind("blur",function(){
                     clearInterval(this.clock);
                });
		}
	};
	init.base();
});