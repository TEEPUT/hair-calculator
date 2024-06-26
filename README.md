<h1>📌 Stack</h1><br>
<div align=center> 
  <img src="https://img.shields.io/badge/python-3776AB?style=for-the-badge&logo=python&logoColor=white"> 
  <img src="https://img.shields.io/badge/flask-000000?style=for-the-badge&logo=flask&logoColor=white"> 
  <img src="https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white">
  <img src="https://img.shields.io/badge/css-1572B6?style=for-the-badge&logo=css3&logoColor=white">
  <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
  <img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white"><br>
  <img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white">
  <img src="https://img.shields.io/badge/expo-000020?style=for-the-badge&logo=expo&logoColor=white">
</div>

<h1>📌 Plan</h1><br>
범용적이고 접근성 좋은 방식이 어플리케이션으로 생각하여 어플리케이션을 주로 전체 프론트를 설계했습니다.<br><br>

Ios, android 를 따로 개발하려면 따로 개발자를 사용 해야하고 서로 다른 부분도 많이 발생하며 버그도 두 os마다 따로 잡아야 한다고 생각하여 React native expo를 사용하여 반응형 웹 제작 후 웹뷰 어플리케이션으로 다시 컴파일 하는 형식을 목표로 처음 기획했습니다 

<br><br>
<h1>📌 Implementation</h1><br>


<div align="center">
<strong>메인 화면</strong>
</div>
로그인 할 때 session 에 필요한 정보를 쿠키로 저장하고 해당 데이터에 맞춰서 닉네임 정보 로그아웃 프로필이 나오게 구현 했으며 네비게이션 또한 로그인 상태를 session 으로 확인 후 로그인 네비게이션이 정보수정 네비게이션으로 바뀌도록 로직을 넣었습니다 flask 의 jinja2 엔진을 사용하여 쉽게 구현할 수 있었습니다 <br><br>
프로필의 경우 session 으로 users 테이블에서 저장했던 사업자 번호로 profiles 테이블을 검색하여 일치하는 사업자 번호가 없을 시 프로필 생성 html로 이동하도록 구현했습니다 일치하는 경우 profiles 테이블에서 다른 데이터들을 읽어서 프로필 화면에 잘 나오도록 구현했습니다 <br><br>
<div align="center">
<strong>로그인 및 회원가입</strong>
</div>
유저의 경우 아이디, 성명, 닉네임 등 필요한 정보를 입력하고 사업자의 경우 회사명, 회사 위치, 사업자 등록 번호 등 데이터베이스에 저장하고 불러오기 위한 정보들을 추가적으로 입력하게 만들었습니다 <br>
사업자 등록 번호의 경우 공공 데이터 포탈에서 사업자 번호 확인을 위한 API를 가져왔습니다 <br><br>
주소 같은 경우에도 카카오에서 도로명 주소나 지역명을 입력하면 찾아주는 API를 가져왔습니다 <br><br>
<div align="center">
<strong>정보 수정</strong>
</div>
데이터베이스에서 Users 테이블을 Select 하여 비밀번호를 제외 한 모든 데이터들을 읽어 미리 입력되게 하였고 비밀번호는 현재 비밀번호와 새로운 비밀번호를 입력하여 일치 하는지 확인하고 일치 해야 정보가 변경되게 만들었습니다 <br><br>
<div align="center">
<strong>지도 검색</strong>
</div>
GPS 를 기반으로 현재 위치에 대한 데이터를 가져와서 해당 위치에 마커를 생성하도록 만들었습니다 그 외 다른 미용실은 고정된 값이며 만약 정상 서비스 시 스타일러들이 회원가입으로 데이터 증가 및 위치에 대한 진위 확인 후 추가적으로 마커를 생성하여 더 다양한 컨텐츠를 보여줄 수 있을거라고 확신합니다<br><br>
맵의 경우 kakao map API를 사용하여 만들었습니다<br><br>
지도에서 미용실 마커의 경우 유저가 선택을 하여 클릭 시 백엔드에서 해당하는 사업자 번호를 읽어 그 외 다른 데이터들을 추가적으로 읽고 이에 맞춰서 프로필이 보이도록 생성됩니다 마찬가지로 session 에서 사업자 번호를 읽는 로직과 같이 해당 페이지로 이동 후 사업자 번호가 일치하면 헤어필터 만들기가 추가적으로 보이도록 만들었습니다<br><br>
<div align="center">
<strong>헤어 필터</strong>
</div>
mediapipe의 image segmentation 모델을 사용했고 codepan에 업로드 돼 있는 오픈소스를 java script 로 다시 컴파일 하여 추가적인 코드를 삽입했습니다 <br><br>
업로드 형식으로 코드를 1차 수정하였고 <br><br>
데이터베이스에서 선택한 파일을 가져올 수 있도록 2차 수정, <br><br>
데이터베이스에서 선택한 파일을 오버레이 되도록 3차로 코드를 추가 삭제하며 수정, <br><br>
마지막으로 헤어 부분에 자동으로 대입시켜주는 형식으로 추가할려 했으나 가이드 라인을 주어도 해결할 수 없는 이미지 크기(카메라와 사람의 거리, 대상의 머리 둘레 등 고려할 점이 무수히 많습니다) ,미세한 조정이 현재 지식수준으로 해결할 수 없을 것 같아 버튼으로 조절하는 형식으로 변형했습니다<br><br>
결과적으로 문제없이 여러 다른 결과물을 볼 수 있었고 만족도 또한 좋다고 생각하여 이 방법 그대로 가는 것으로 채택했습니다<br><br>
<div align="center">
  
![image (1)](https://github.com/TEEPUT/hair-calculator/assets/129711481/049f8afc-4d2b-46ef-babb-53f45141d8b7)
<br>
원본<br>
![image](https://github.com/TEEPUT/hair-calculator/assets/129711481/dce1b764-b117-4db0-99bf-9561d0f94afd)
<br>
결과<br>
</div><br><br>
<div align="center">
<strong>헤어 필터 제작</strong>
</div>
지도에서 말씀드린것과 같이 session 에 사업자 번호가 있어야만 들어갈 수 있으며 헤어 필터 부분에서 만든것과 대부분 동일하게 만들었습니다<br><br>
mediapipe의 모델을 불러와서 헤어 부분에 마스크를 씌웁니다<br><br>
마스크를 씌운 부분을 제외하고 다른 부분의 배경을 삭제합니다<br><br>
해당 스타일 명을 입력하고 저장하기를 클릭하면 파일명과, 아이디, 사업자번호, 스타일로 images 데이터베이스 테이블에 저장하도록 로직을 구현했습니다 사진 같은 경우 uploads 파일을 따로 만들어서 아이디 중복을 피하기 위해 1.png, 2.png 이런식으로 숫자 1부터 증가하는 형식으로 만들었습니다<br><br>
<div align="center">
  
![image (2)](https://github.com/TEEPUT/hair-calculator/assets/129711481/cc5d8d21-706b-435f-9544-63fe67142baf)
<br>
원본<br>
![image (4)](https://github.com/TEEPUT/hair-calculator/assets/129711481/fe20e464-c7f0-491e-adee-194b8f3ecd71)
<br>
결과<br>
</div><br><br>
<div align="center">
<strong>퍼스널 컬러</strong>
</div>
res 가 학습에 필요한 이미지를 저장하는 파일이고 src 파일이 퍼스널 컬러 진단 부분입니다 퍼스널컬러 진단 파이썬 코드는 제가 작성한 코드가 아닙니다 백엔드에서 로직만 구현 했습니다<br><br>
퍼스널 컬러를 클릭 시 이미지를 업로드 하는 화면이 나오는데 자신의 이미지 파일이나 사진을 업로드하고 결과 보기를 클릭하면 personal 데이터베이스 테이블에 입력 되도록 하였습니다 퍼스널 컬러의 경우 추가적인 데이터 수집이 따로 필요 없으므로 결과화면에서 어떤 사진을 가져올지 필요한 파일 이름과 퍼스널 컬러도 로그인이 필요하여 로그인한 id만 데이터베이스에 저장하도록 하였습니다<br><br>
추가적으로 로직에 대해 설명해드리면 데이터베이스에 사진이 저장되면 가장 최근에 저장했던 이미지 파일 명으로 src 파일에 들어 가 ’ python personal.py —image 데이터베이스에 저정한 이미지 파일명 ‘ 명령어를 실행합니다 그러면 해당 이미지 파일의 퍼스널컬러를 진단하고 그 결과를 줍니다 이 결과값이 디코딩 형식으로 전달되는데 utf-8 로 다시 인코딩합니다 다음으로 필요한 데이터를 추출하여 jinja2 엔진을 사용하여 결과값을 html에 보냅니다 보낸 값을 자바 스크립트 제이스델리버 chart 를 사용하여 표로 보여줍니다 그리고 결과 값에 맞춰서 데이터셋에 준비한 염색추천 데이터를 랜덤으로 4가지 선택하여 css랑 html에 보여주도록 설계 및 구현했습니다<br><br>
문제 : 퍼스널컬러 결과 값이 session 가장 최근에 들어갔던 정보를 기분으로 분석하여 띄워주는데 동시에 다른 기기에서 해당 분석을 클릭하면 분석하는 단계에서 결과보기를 후에 클릭한 인원의 이미지가 나오는 문제점이 있습니다<br><br>

<div align="center">
  <img src="https://github.com/TEEPUT/hair-calculator/assets/129711481/f3f4f49b-e127-4076-8887-1ddb7c2a1750" alt="메인 헤더" width="700"/>
  <p>퍼스널컬러</p>
</div>



<br><br><br><br>
<h1>📌 Last </h1><br>
이렇게 웹 사이트를 구현하여 현재 웹 사이트에 도메인을 주려고 여러가지 공부했으나 Docker, Aws, Gcp 등 여러가지 시도하면서 마감기한까지 공부시간이 부족과 리눅스에 모든 환경을 옮길 시간이 부족하다 판단하고 리눅스 기반이 아닌 ngrok로 윈도우 기반으로 도메인를 주었습니다<br><br>

Ngrok로 받은 도메인을 기반으로 node js와 react native 를 통해 어플리케이션으로 전환 시켰습니다 ios의 경우 안드로이드와는 별개의 설치 형태이고 윈도우 환경에서는 컴파일이 불가능 하여 안드로이드만 패키징 하여 어플리케이션 이미지와 대기 화면을 삽입하여 만들었고 ios의 경우 expo go 어플리케이션으로만 들어 갈 수 있도록 만들었습니다<br><br>
Ngrok가 아닌 aws 를 사용하여 도메인을 주고 개발 환경을 옮기면 ios도 어플리케이션으로써 충분히 앱스토어에 등록 가능할 만큼 컴파일 할 수 있을 것으로 예상됩니다<br><br>
마지막으로 server_start.bat 파일로 클릭 시 ngrok와 expo 어플리케이션을 실행 할 수 있도록 자동화 까지 끝냈습니다
