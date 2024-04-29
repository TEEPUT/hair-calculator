FROM python:3.7.9

# 소스 코드를 이미지에 복사합니다.
COPY . /AppWorkSpace

# 필요한 패키지를 설치합니다.
RUN pip3 install -r AppWorkSpace/requirements.txt

# 작업 디렉토리를 설정합니다.
WORKDIR /AppWorkSpace

# Flask 애플리케이션을 실행합니다.
CMD ["python3", "-m", "flask", "run", "--host=0.0.0.0"]
