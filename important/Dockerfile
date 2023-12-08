# Python 이미지를 기반으로 시작합니다.
FROM python:3.7.9

# 작업 디렉토리 설정
WORKDIR /app

# 필요한 Python 라이브러리 설치
# requirements.txt 파일에 Flask 및 필요한 모든 라이브러리를 명시해야 합니다.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 애플리케이션 코드를 이미지에 복사
COPY . .

# 서버를 실행할 때 사용할 포트를 지정
EXPOSE 5000

# Flask 애플리케이션 실행
CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]
