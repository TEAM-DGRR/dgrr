# 파이썬 3.11을 베이스로 하는 이미지
FROM python:3.11.4-slim-buster

# 작업 디렉토리 설정
WORKDIR /app

#libgl1-mesa-glx 패키지 설치
RUN apt-get update && apt-get -y install libgl1-mesa-glx
RUN apt-get update && apt-get install ffmpeg libsm6 libxext6  -y

#pip upgrade
RUN pip install --upgrade pip

# 의존성 설치
COPY requirements.txt .
RUN pip install -r requirements.txt

# 앱 코드 복사
COPY . .

#Uvicorn 실행 명령어
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
