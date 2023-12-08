// 전역 스코프에 loadBusinessInfo 함수 정의
function loadBusinessInfo(event, element) {
    event.preventDefault();  // 기본 이벤트 방지
    var businessNumber = element.closest('.overlaybox4').getAttribute('data-business-number');
    window.location.href = '/pr2.html?brn=' + businessNumber;
}

document.addEventListener("DOMContentLoaded", function() {
    var mapContainer = document.getElementById('map');
    var mapOption = { 
        center: new kakao.maps.LatLng(37.566826, 126.9786567),
        level: 3
    };
    
    var map = new kakao.maps.Map(mapContainer, mapOption);
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            
            var locPosition = new kakao.maps.LatLng(lat, lon);
            var message = '<div style="padding:5px;">현재 위치입니다!</div>';
            
            displayMarker(locPosition, message);
        });
    } else {
        var locPosition = new kakao.maps.LatLng(37.566826, 126.9786567);
        var message = 'geolocation을 사용할 수 없어요..';
        
        displayMarker(locPosition, message);
    }
    
    function displayMarker(locPosition, message) {
        var marker = new kakao.maps.Marker({  
            map: map, 
            position: locPosition
        });
        
        var iwContent = message;
        var iwRemoveable = true;
    
        var infowindow = new kakao.maps.InfoWindow({
            content : iwContent,
            removable : iwRemoveable
        });
    
        infowindow.open(map, marker);
        map.setCenter(locPosition);
    }

    
    // 커스텀 오버레이에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
    var content = 
    '<div class="overlaybox">' +
        '    <div class="boxtitle"><a href="#" class="pr1">떼보헤어</a></div>' +
        '    <div class="first">' +
        '        <div class="movietitle text">떼보헤어</div>' +
        '    </div>' +
        '    <ul>' +
        '        <li class="up">' +
        '            <span class="number">1</span>' +
        '            <span class="title">윤인자</span>' +
        '        </li>' +
        '    </ul>' +
        '</div>';

    // 커스텀 오버레이가 표시될 위치입니다 
    var position = new kakao.maps.LatLng(37.46825448600417, 126.70467868704179);  

    // 커스텀 오버레이를 생성합니다
    var customOverlay = new kakao.maps.CustomOverlay({
        map: map,
        position: position,
        content: content,
        yAnchor: 1 
    });

    // 미용실 데이터 1
var content1 = 
'<div class="overlaybox1">' +
    '    <div class="boxtitle"><a href="#" class="pr1">블루미용실</a></div>' +
    '    <div class="first">' +
    '        <div class="movietitle text">블루미용실</div>' +
    '    </div>' +
    '    <ul>' +
    '        <li class="up">' +
    '            <span class="number">1</span>' +
    '            <span class="title">홍길동</span>' +
    '        </li>' +
    '        <li class="up">' +
    '            <span class="number">2</span>' +
    '            <span class="title">김김김</span>' +
    '        </li>' +
    '    </ul>' +
'</div>';
var position1 = new kakao.maps.LatLng(37.55996956790014, 126.7859985751274);
var customOverlay1 = new kakao.maps.CustomOverlay({
    map: map,
    position: position1,
    content: content1,
    yAnchor: 1 
});

// 미용실 데이터 2
var content2 = 
'<div class="overlaybox2">' +
    '    <div class="boxtitle"><a href="#" class="pr1">헤어플러스</a></div>' +
    '    <div class="first">' +
    '        <div class="movietitle text">헤어플러스</div>' +
    '    </div>' +
    '    <ul>' +
    '        <li class="up">' +
    '            <span class="number">1</span>' +
    '            <span class="title">이수진</span>' +
    '        </li>' +
    '        <li class="up">' +
    '            <span class="number">2</span>' +
    '            <span class="title">유재석</span>' +
    '        </li>' +
    '    </ul>' +
'</div>';
var position2 = new kakao.maps.LatLng(37.531504044609946, 127.10803273890176);
var customOverlay2 = new kakao.maps.CustomOverlay({
    map: map,
    position: position2,
    content: content2,
    yAnchor: 1 
});

// 미용실 데이터 3
var content3 = 
'<div class="overlaybox3">' +
    '    <div class="boxtitle"><a href="#" class="pr1">컷잇</a></div>' +
    '    <div class="first">' +
    '        <div class="movietitle text">컷잇</div>' +
    '    </div>' +
    '    <ul>' +
    '        <li class="up">' +
    '            <span class="number">1</span>' +
    '            <span class="title">김태희</span>' +
    '        </li>' +
    '        <li class="up">' +
    '            <span class="number">2</span>' +
    '            <span class="title">최진영</span>' +
    '        </li>' +
    '    </ul>' +
'</div>';
var position3 = new kakao.maps.LatLng(37.5133867724024, 127.1677272683127);
var customOverlay3 = new kakao.maps.CustomOverlay({
    map: map,
    position: position3,
    content: content3,
    yAnchor: 1 
});

var content4 = 
'<div class="overlaybox4" data-business-number="1234567890" onclick="loadBusinessInfo(event, this)">' +
    '    <div class="boxtitle">헤어천국</div>' +
    '    <div class="first">' +
    '        <div class="movietitle text">헤어천국</div>' +
    '    </div>' +
    '    <ul>' +
    '        <li class="up">' +
    '            <span class="number">1</span>' +
    '            <span class="title">정주인</span>' +
    '        </li>' +
    '    </ul>' +
'</div>';

var position4 = new kakao.maps.LatLng(37.45970386480665, 126.88128052780553);
var customOverlay4 = new kakao.maps.CustomOverlay({
    map: map,
    position: position4,
    content: content4,
    yAnchor: 1 
});

// 미용실 데이터 5
var content5 = 
'<div class="overlaybox5">' +
    '    <div class="boxtitle"><a href="#" class="pr1">헤어존</a></div>' +
    '    <div class="first">' +
    '        <div class="movietitle text">헤어존</div>' +
    '    </div>' +
    '    <ul>' +
    '        <li class="up">' +
    '            <span class="number">1</span>' +
    '            <span class="title">최민수</span>' +
    '        </li>' +
    '        <li class="up">' +
    '            <span class="number">2</span>' +
    '            <span class="title">박준석</span>' +
    '        </li>' +
    '    </ul>' +
'</div>';
var position5 = new kakao.maps.LatLng(37.55380846366173, 126.69791232006688);
var customOverlay5 = new kakao.maps.CustomOverlay({
    map: map,
    position: position5,
    content: content5,
    yAnchor: 1 
});

});
