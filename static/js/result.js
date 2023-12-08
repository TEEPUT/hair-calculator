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
