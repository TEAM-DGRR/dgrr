import sys, os

# import json
import simplejson as json
import numpy as np


sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))
from emotion_analyze_module.imageDataToNp import image_data_to_np
from emotion_analyze_module.analyzingImage import analyze_image


async def receive_and_process_message(websocket, face_cascade, emotion_model, emotions):
    send_count = 1
    while True:
        # 메시지 수신 대기 및 처리
        message = await websocket.recv()  # 웹소켓 서버로부터 메시지 받음
        body, original_headers = await extract_body(
            message
        )  # 메시지의 헤더와 바디를 분리하여 바디와 원래의 헤더를 추출
        processed_image = await image_data_to_np(body)  # 분리된 body를 np배열로 변환
        emotion_result = await analyze_image(  # np배열로 변환된 데이터로, 표정분석
            processed_image, face_cascade, emotion_model, emotions
        )

        # 분석 결과와 원래의 헤더를 JSON 형태로 변환
        result_with_headers = {"headers": original_headers, "result": emotion_result}
        print("result_with_headers : ", result_with_headers)

        result_with_headers_json = json.dumps(
            result_with_headers,
            default=lambda o: float(o) if isinstance(o, np.float32) else o,
        )

        # /app/analyze 엔드포인트로 분석 결과 전송
        analyze_message = (
            f"SEND\ndestination:/send/imgResult\n\n{result_with_headers_json}\0"
        )
        send_count += 1
        await websocket.send(analyze_message)


async def extract_body(message):
    # 두 개의 연속된 개행 문자를 기준으로 헤더와 본문을 분리
    headers, body = message.split("\n\n", 1)
    body = body[:-1]
    body_to_json = json.loads(body)
    original_headers = body_to_json["headers"]["headers"]
    original_payload = body_to_json["payload"]
    return original_payload, original_headers


async def numpy_default(obj):
    if isinstance(obj, np.ndarray):
        return obj.tolist()
    if isinstance(obj, np.bool_):
        return bool(obj)
    raise TypeError
