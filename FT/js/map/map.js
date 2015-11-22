$(function(){
    var mapObj = null;
	var init = {
		base : function(){
            init.event();
            $(window).bind("resize",function(){
                //获取页面最小高度
                var $other         = $(".main-other").height(),
                    $selectAddress = $(".select-address").height(),
                    $organization  = $(".organization-info").height();
                $(".map-detail,.address-list").css({height:$other-$selectAddress-$organization});
                $(".address-list").css({top:$selectAddress});
            }).trigger("resize");
            mapObj = new Map();
//            map.searchTest();
		},
		event : function(){
            //打开关闭选择地址
            $("body").on("touchend",".select-address li",function(){
                if($(".address-list").css("display")=="block"){
                    $(".select-address").find("li").removeClass("active").find(".icon").removeClass("icon-remove5");
                    $(".address-list").hide();
                }else{
                    $(this).addClass("active").find(".icon").addClass("icon-remove5");
                    $(".address-list").show();
                }
            });
            //选择城市
            $("body").on("touchend",".city li",function(){
                var $text = $(this).text();
                $(".select-address").find("li").removeClass("active").find(".icon").removeClass("icon-remove5").siblings("h5").text($text);
                $(".address-list").hide();
            });
		}
	};
	init.base();

    //定位
    function getLocation(callback){
        //var option = {enableHighAccuracy:true};//精度
        var option = {};

        //经度,纬度
        var pointA = '',pointB = '';
        navigator.geolocation.getCurrentPosition(function(position){
            pointB = position.coords.latitude;
            pointA = position.coords.longitude;
            callback({pointX:pointA,pointY:pointB});
        },function(error){
            search();
            //console.error(error);
        });
    }
});

var Map = function(){
    var map = null,
        local = null,
        mapLevel = 16,
        pointList = [];

    var searchThing = '景点';

    var myIcon = new BMap.Icon("../../images/map/icon-address-grey.png",
        new BMap.Size(110,135));
    var myIcon2 = new BMap.Icon("../../images/map/icon-address-green.png", new BMap.Size(110,135));
    var activeMarketIndex = 0;

    var laterTimer = null;
    var options = {
        onSearchComplete: function(results){
            // 判断状态是否正确
            if (local.getStatus() == BMAP_STATUS_SUCCESS){
                var marker = null,point = null;

                for (var i = 0; i < results.getCurrentNumPois(); i ++){
                    point = results.getPoi(i);
                    var newPoint = new BMap.Point(point.point.lng, point.point.lat);

                    var pointStr = 'lng' + point.point.lng + 'lat' + point.point.lat;
                    if(pointList.indexOf(pointStr) !== -1) {
                        continue;
                    }

                    pointList.push(pointStr);

                    if( i === 0) {
                        activeMarketIndex = pointList.length - 1;
                        //map.centerAndZoom(newPoint, mapLevel);
                    }

                    marker = new BMap.Marker(newPoint,{icon:myIcon});
                    marker.addEventListener("click",attribute);
                    map.addOverlay(marker);
                    var label = new BMap.Label("TDS<div style='font-size:56px;'>50</div>");
                    label.setStyle({
                        border:0,
                        marginTop:'5px',
                        fontSize: '20px',
                        width: '110px',
                        height: '135px',
                        lineHeight:'40px',
                        textAlign:'center',
                        fontFamily:'FZLTCXHJW',
                        color:'#FFF',
                        backgroundColor:'RGBA(0,0,0,0)'
                    });
                    marker.setLabel(label);
                }
                if(laterTimer !== null) {
                    clearTimeout(laterTimer);
                    laterTimer = null;
                }
                setTimeout(function(){
                    var curMarker = map.getOverlays()[activeMarketIndex];
                    curMarker.dispatchEvent('click');
                },100)
            }
        },
        onMarkersSet: function(pois) {
            
        }
    };

    //获取覆盖物位置
    function attribute(e){

        $('.BMap_Marker .active img').attr('src','../../images/map/icon-address-grey.png');
        $('.BMap_Marker.active,.BMap_Marker .active').removeClass('active');
        if(e) {
            var p = e.target;
            $(p.V).addClass('active');
            $(p.zc.childNodes[0]).find('img').attr('src','../../images/map/icon-address-green.png');
            $(p.zc.childNodes[0]).addClass('active');
            $(p.zc.childNodes[1]).addClass('active');
        }
        //alert("marker的位置是" + p.getPosition().lng + "," + p.getPosition().lat);
    }

    init();
    function init(){
        initMap();
//        navigator.geolocation.getCurrentPosition(function(position){
//           var lat = position.coords.latitude,lng = position.coords.longitude;
//            initMap({lng:lng,lat:lat});
//        },function(error){
//            initMap();
//            //console.error(error);
//        });
    }

    function initMap(point) {

        point = point || {lat:30.282,lng:120.085};
        map = new BMap.Map("map_detail", {enableMapClick:false});
        var centerPoint = new BMap.Point(point.lng,point.lat);
        map.centerAndZoom(centerPoint, mapLevel);

        //test
        map.enableScrollWheelZoom();


        var bs = map.getBounds();
        search(bs);
        var bsTemp = bs;
        map.addEventListener("tilesloaded",function(type, target){
            var newBs = map.getBounds();
            var bssw = newBs.getSouthWest(),bsne = newBs.getNorthEast();
            var bsswTemp = bsTemp.getSouthWest(),bsneTemp = bsTemp.getNorthEast();
            if(
                bssw.lng!== bsswTemp.lng
                || bssw.lat!== bsswTemp.lat
                || bsne.lng!== bsneTemp.lng
                || bsne.lat!== bsneTemp.lat
                ) {
                bsTemp = newBs;
                search(newBs);
            }else {
//                if(activeMarket)
//                activeMarket.dispatchEvent('click');
            }
//            var bs = map.getBounds();
//            search(bs);
        });

        map.addEventListener('addoverlay',function(type, target){
            if(activeMarketIndex === pointList.length - 1) {
                
            }
        });
    }

    function search(bs){
        //map.clearOverlays();
        local = new BMap.LocalSearch(map,options);
        local.searchInBounds(searchThing,bs);
    }

    return {
        search:search,
        getMap:function(){
            return map;
        }
    }

};


//map.enableScrollWheelZoom();

/*var options = {
 onSearchComplete: function(results){
 // 判断状态是否正确
 if (local.getStatus() == BMAP_STATUS_SUCCESS){
 var s = [];
 for (var i = 0; i < results.getCurrentNumPois(); i ++){
 //var marker = new BMap.Marker(new BMap.Point(116.404, 39.915));
 s.push(results.getPoi(i).title + ", " + results.getPoi(i).address);
 }
 document.getElementById("map_result").innerHTML = s.join("<br/>");
 }
 }
 };*/


/*

function showInfo(e){
    alert(e.point.lng + ", " + e.point.lat);
}
map.addEventListener("click", showInfo);*/
