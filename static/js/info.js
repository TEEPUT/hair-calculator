function showContent(contentId) {
  // 모든 컨텐츠 숨김
  var contents = document.getElementsByClassName('content');
  for (var i = 0; i < contents.length; i++) {
    contents[i].style.display = 'none';
  }

  // 선택한 컨텐츠 표시
  var selectedContent = document.getElementById(contentId);
  selectedContent.style.display = 'block';
}



function uploadImage(event) {
  const reader = new FileReader();
  reader.onload = function() {
      const coverImage = document.getElementById('cover-image');
      coverImage.src = reader.result;
      addDragFunctionality(coverImage);
  };
  reader.readAsDataURL(event.target.files[0]);
}

function addDragFunctionality(img) {
  let startY = 0, mouseY = 0;

  img.onmousedown = function(e) {
      e.preventDefault();
      startY = e.clientY;
      mouseY = img.offsetTop;

      document.onmouseup = stopDragging;
      document.onmousemove = dragImage;
  }

  function dragImage(e) {
      e.preventDefault();
      const deltaY = e.clientY - startY;
      img.style.top = Math.min(0, Math.max(img.offsetHeight - 315, mouseY + deltaY)) + "px";
  }

  function stopDragging() {
      document.onmouseup = null;
      document.onmousemove = null;
  }
}

document.getElementById('save-position').onclick = function() {
  const coverImage = document.getElementById('cover-image');
  const position = coverImage.offsetTop; // 이미지의 상단 위치

  // AJAX 요청을 사용하여 서버에 위치 정보 전송
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/save-cover-position", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify({ position: position }));

  xhr.onload = function() {
      if (xhr.status == 200) {
          alert("위치가 저장되었습니다.");
      } else {
          alert("오류가 발생했습니다: " + xhr.status);
      }
  }
};

function previewImage(event, imageType) {
  const reader = new FileReader();
  reader.onload = function() {
      const output = imageType === 'cover' ? document.getElementById('cover-image') : document.getElementById('profile-image');
      output.src = reader.result;
  };
  reader.readAsDataURL(event.target.files[0]);
}
