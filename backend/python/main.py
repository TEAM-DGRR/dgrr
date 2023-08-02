from fastapi import FastAPI
import uvicorn

import cv2

import asyncio
import websockets
import base64

from keras.models import load_model


from websocket_communication_module.connect import connect_to_server
from websocket_communication_module.process import receive_and_process_message

face_cascade = cv2.CascadeClassifier("./models/haarcascade_frontalface_default.xml")
emotion_model = load_model("./models/emotion_model.hdf5")

# 감정 레이블
emotions = ["Angry", "Disgust", "Fear", "Smile", "Sad", "Surprise", "Neutral"]


app = FastAPI()


@app.on_event("startup")
async def startup_event():
    asyncio.create_task(client())  # 웹 서버가 시작되면, 웹소켓 클라이언트 코드를 비동기적으로 실행


async def client():
    while True :
        try:
            uri = "ws://localhost:8080/ws"  # 자바 웹소켓 서버의 주소

            # Spring boot Security 사용자 이름
            username = "1234"

            # Spring Boot Security 비밀번호
            password = "1234"
            encoded_credentials = base64.b64encode(
                f"{username}:{password}".encode()
            ).decode()

            # 웹소켓 서버에 연결
            async with websockets.connect(
                uri, extra_headers={"Authorization": f"Basic {encoded_credentials}"}
            ) as websocket:
                await connect_to_server(websocket)
                await receive_and_process_message(
                    websocket, face_cascade, emotion_model, emotions
                )
        except Exception as e:
            print(f"웹소켓 클라이언트에서 예외 발생: {e}")
            print(f"3초 후에 재연결을 시도합니다.)")
            await asyncio.sleep(3)  # 3초 동안 대기


if __name__ == "__main__":
    # FastAPI 서버 실행
    uvicorn.run(app, host="0.0.0.0", port=8000)
