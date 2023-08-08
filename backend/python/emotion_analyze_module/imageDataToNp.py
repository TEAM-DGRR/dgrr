import cv2
import numpy as np
import base64


async def image_data_to_np(image: str):
    try:
        # 데이터 URI에서 Base64로 인코딩된 문자열 부분만 추출
        image = image.split(",", 1)[1]

        # Base64 문자열을 바이트로 디코딩
        image_data = base64.b64decode(image)

        # 바이트 데이터를 numpy 배열로 변환
        image_array = np.frombuffer(image_data, dtype=np.uint8)

        # numpy 배열을 이미지로 디코딩
        result = cv2.imdecode(image_array, flags=cv2.IMREAD_COLOR)

        # 디코딩된 이미지가 None인지 확인 (디코딩 실패 여부 확인)
        if result is None:
            print("cv2.imdecode 실패.")
            return None
        else:
            return result
    except Exception as e:
        # 에러 발생 시, 에러 메시지 출력
        print(f"오류 발생: {e}")
        return None
