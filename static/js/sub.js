// salon-detail.js

document.addEventListener("DOMContentLoaded", function() {
    // 네비게이션 링크를 클릭했을 때 스크롤 이벤트를 추가
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            // 클릭한 링크의 href 값을 사용하여 해당 섹션의 위치로 스크롤 이동
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth' // 부드러운 스크롤 적용
                });
            }
        });
    });
});

  function showSection(sectionId) {
    // 모든 섹션 숨기기
    var sections = document.querySelectorAll('.section');
    sections.forEach(function (section) {
      section.classList.remove('active-section');
    });

    // 클릭한 네비게이션 항목과 연결된 섹션 보여주기
    var activeSection = document.getElementById(sectionId);
    if (activeSection) {
      activeSection.classList.add('active-section');
    }
  }

