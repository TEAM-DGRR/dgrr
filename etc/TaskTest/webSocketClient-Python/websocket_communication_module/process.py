import sys, os
import json
import numpy as np


sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))
from emotion_analyze_module.imageDataToNp import image_data_to_np
from emotion_analyze_module.analyzingImage import analyze_image


async def receive_and_process_message(websocket, face_cascade, emotion_model, emotions):
    send_count = 1
    while True:
        # 메시지 수신 대기 및 처리
        message = await websocket.recv()  # 웹소켓 서버로부터 메시지 받음
        body = await extract_body(message)  # 메시지의 헤더와 바디를 분리하여 바디만 추출
        processed_image = await image_data_to_np(body)  # 분리된 body를 np배열로 변환
        emotion_result = await analyze_image(  # np배열로 변환된 데이터로, 표정분석
            processed_image, face_cascade, emotion_model, emotions
        )

        # 분석 결과를 JSON 형태로 변환
        emotion_result_json = json.dumps(
            emotion_result,
            default=lambda x: bool(x) if isinstance(x, np.bool_) else x,
        )

        # /app/analyze 엔드포인트로 분석 결과 전송
        analyze_message = (
            f"SEND\ndestination:/app/analyzingData\n\n{emotion_result_json}\0"
        )
        send_count += 1
        print(f"이미지 분석 결과를 웹소켓 서버로 전송합니다. count = {send_count}")
        await websocket.send(analyze_message)


async def extract_body(message):
    # 먼저 bytes를 문자열로 변환
    message = message.decode("utf-8")

    # 두 개의 연속된 개행 문자를 기준으로 헤더와 본문을 분리
    headers, body = message.split("\n\n", 1)

    # 본문을 다시 bytes로 변환
    return body.encode()
