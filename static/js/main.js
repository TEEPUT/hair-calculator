var slideIndex = 1;
var slideInterval = setInterval(function() { plusSlides(1); }, 3000);

document.addEventListener("DOMContentLoaded", function() {
  showSlides(slideIndex);
});

function plusSlides(n) {
  clearInterval(slideInterval);
  showSlides((slideIndex += n));
  slideInterval = setInterval(function() { plusSlides(1); }, 3000);
}

function currentSlide(n) {
  clearInterval(slideInterval);
  showSlides((slideIndex = n));
  slideInterval = setInterval(function() { plusSlides(1); }, 3000);
}

// 기존의 showSlides 함수는 그대로 유지됩니다.
function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("main-box");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
}


 // DOM이 로드된 후에 이벤트를 추가
 document.addEventListener("DOMContentLoaded", function () {
  // 미용실 컨테이너 요소를 찾음
  const salonContainer = document.querySelector('.salon');

  // 미용실 컨테이너가 존재하면 클릭 이벤트 추가
  if (salonContainer) {
      // 미용실 컨테이너를 클릭했을 때의 이벤트 처리
      salonContainer.addEventListener('click', function () {
          // 여기에 클릭했을 때 실행할 동작을 추가
          // 예를 들어, 해당 미용실의 세부페이지로 이동하는 코드를 추가할 수 있음
          window.location.href = 'sub.html'; // 적절한 세부페이지 URL로 변경
      });
  }
});