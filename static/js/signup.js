//본 예제에서는 도로명 주소 표기 방식에 대한 법령에 따라, 내려오는 데이터를 조합하여 올바른 주소를 구성하는 방법을 설명합니다.
function sample4_execDaumPostcode() {
    new daum.Postcode({
        oncomplete: function(data) {
            // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

            // 도로명 주소의 노출 규칙에 따라 주소를 표시한다.
            // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
            var roadAddr = data.roadAddress; // 도로명 주소 변수
            var extraRoadAddr = ''; // 참고 항목 변수

            // 법정동명이 있을 경우 추가한다. (법정리는 제외)
            // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
            if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
                extraRoadAddr += data.bname;
            }
            // 건물명이 있고, 공동주택일 경우 추가한다.
            if(data.buildingName !== '' && data.apartment === 'Y'){
               extraRoadAddr += (extraRoadAddr !== '' ? ', ' + data.buildingName : data.buildingName);
            }
            // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
            if(extraRoadAddr !== ''){
                extraRoadAddr = ' (' + extraRoadAddr + ')';
            }

            // 우편번호와 주소 정보를 해당 필드에 넣는다.
            document.getElementById('sample4_postcode').value = data.zonecode;
            document.getElementById("sample4_roadAddress").value = roadAddr;
            document.getElementById("sample4_jibunAddress").value = data.jibunAddress;
            
            // 참고항목 문자열이 있을 경우 해당 필드에 넣는다.
            if(roadAddr !== ''){
                document.getElementById("sample4_extraAddress").value = extraRoadAddr;
            } else {
                document.getElementById("sample4_extraAddress").value = '';
            }
        }
    }).open();
}

function onFocus(element) {
    if (element.value === element.defaultValue) {
      element.value = '';
    }
  }
  
  // input box에서 포커스를 잃었을 때
  function onBlur(element) {
    if (element.value === '') {
      element.value = element.defaultValue;
    }
  }
  
  // input box들에 대해서 이벤트를 등록
  document.addEventListener('DOMContentLoaded', function() {
    const inputBoxes = document.querySelectorAll('.input-box');
    inputBoxes.forEach(function(box) {
      box.addEventListener('focus', function() {
        onFocus(box);
      });
      box.addEventListener('blur', function() {
        onBlur(box);
      });
    });
  });

  function removeopacity(inputElement) {
    // 입력된 상태인 경우 opacity 스타일을 제거
    if (inputElement.value !== "") {
      inputElement.style.opacity = "1"; // 입력된 값이 나타나도록 색상 변경
      inputElement.removeAttribute("opacity");
    }
  }

  // 사업자 체크박스
  function toggleBusinessFields() {
    const businessFields = document.getElementById("businessFields");
    if (document.getElementById("isBusiness").checked) {
        businessFields.style.display = "block"; // 체크박스가 선택되면 표시
    } else {
        businessFields.style.display = "none";  // 체크박스가 해제되면 숨김
    }
}

function checkBusinessNumber() {
  const businessNumber = document.querySelector('[name="business_registration_number"]').value;

  if (!businessNumber) {
      alert('사업자 등록 번호를 입력해주세요.');
      return;
  }

  // 인증키는 디코딩된 값을 사용합니다.
  const API_KEY = "q+bAMtJO+luFeeVfOUdGd44HgnCfB1LtgEXuVjI4UZ+GRo0YK3P7XgVEAP+VaMMPokzQQ8N3o/CYSME3Rb3B8A==";
  const BASE_URL = "https://api.odcloud.kr/api"; // 실제 엔드포인트를 추가해야 합니다.
  const URL = `${BASE_URL}/YOUR_ENDPOINT?businessNumber=${businessNumber}&serviceKey=${API_KEY}`;

  axios.get(URL)
      .then(response => {
          if (response.data) {
              document.getElementById('business_check_message').textContent = '사업자 등록 번호가 유효합니다.';
          } else {
              document.getElementById('business_check_message').textContent = '사업자 등록 번호가 유효하지 않습니다.';
          }
      })
      .catch(error => {
          console.error(error);
          document.getElementById('business_check_message').textContent = 'API 호출 중 오류 발생.';
      });
}
