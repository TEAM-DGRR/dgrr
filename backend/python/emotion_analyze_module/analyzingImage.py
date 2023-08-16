import cv2
import numpy as np


async def analyze_image(image, face_cascade, emotion_model, emotions):
    # 이미지를 그레이스케일로 변환
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    # 얼굴 검출을 수행
    faces = face_cascade.detectMultiScale(gray_image, 1.3, 5)

    for x, y, w, h in faces:
        # 얼굴 영역을 추출하고 사이즈를 조정합니다.
        roi_gray = gray_image[y : y + h, x : x + w]
        roi_gray = cv2.resize(roi_gray, (64, 64), interpolation=cv2.INTER_AREA)
        # 이미지를 정규화

        roi_gray = roi_gray / 255.0
        # Keras 모델에 입력하기 위해 차원을 확장
        roi_gray = np.expand_dims(roi_gray, axis=0)

        # 감정 예측
        prediction = emotion_model.predict(roi_gray)
        probabilities = prediction[0]

        # 각각의 감정에 대한 확률을 딕셔너리로 생성
        labeled_probabilities = {
            emotion: float(prob) for emotion, prob in zip(emotions, probabilities)
        }

        # "Smile" 감정의 확률 찾기
        smile_index = emotions.index("Smile")
        smile_prob = probabilities[smile_index]

        # 가장 높은 확률을 가진 감정을 결정
        max_index = np.argmax(probabilities)
        emotion = emotions[max_index]
        emotion_prob = probabilities[max_index]

        return {
            "success": "true",
            "emotion": emotion,
            "probability": emotion_prob,
            "smileProbability": smile_prob,
        }

    return {
        "success": "false",
        "emotion": "Not Detected",
        "probability": 0.0,
        "smileProbability": 0.0,
    }
