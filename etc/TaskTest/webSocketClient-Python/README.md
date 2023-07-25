<aside>
💡 **Setting**

운영체제 : Window 10

언어 : Python==3.11.4

패키지 매니저 : pip==23.2

웹 프레임워크 : fastapi==0.68.2

ASGI : uvicorn**==**0.15.0

모델 프레임 워크 : tensorflow==2.12.0

패키지 리스트 : requirements.txt

</aside>

## 파이썬 웹소켓 클라이언트 서버 빌드 방법

1. 아래 링크에서 git clone을 받습니다.

   [](https://lab.ssafy.com/s09-webmobile1-sub2/S09P12A503/-/tree/master/etc/TaskTest/webSocketClient-Python)

2. python version이 3.11.4임을 확인합니다.

   ```bash
   # bash 쉘에서 python 버전 확인
   python --versoin # 3.11.4
   ```

   2-1. 만약 python이 설치되어 있지 않거나, 3.11.4버전이 없다면 아래 링크에서 다운받습니다.

   microsoft store에서 다운받으면 알아서 환경변수 설정도 해줍니다.

   [Get Python 3.11 from the Microsoft Store](https://www.microsoft.com/store/productId/9NRWMJP3717K)

3. pip 버전을 업그레이드 해줍니다.

   ```bash
   # pip 버전 업그레이드
   pip install --upgradae pip

   # 만약 위 방법이 안된다면 아래 명령어 실행
   python.exe -m pip install --upgrade pip

   # pip 버전 확인
   pip --version # pip-23.2 (23년 7월 25일 기준)
   ```

4. 파이썬은 프로젝트 단위로 패키지를 관리하는 것이 좋습니다. 가상환경을 만들어줍니다.

   ```bash
   # 현재 사용하는 python 버전(3.11.4)으로 가상환경 venv 생성
   python -m venv venv
   ```

5. 가상환경에 진입합니다.

   ```bash
   # 상대 경로를 사용할 것이기 때문에, venv 폴더가 있는 디렉토리에서 실행해야 합니다.
   # 가상환경 진입
   source ./venv/Scripts/activatbe
   ```

6. 패키지 설치

   가상환경에 들어왔다면 가상환경에서 패키지 관리해야합니다.

   가상환경에 패키지를 설치해줍니다.

   requirements.txt 파일이 있는 디렉토리로 이동한 다음, 아래 명령어를 실행합니다.

   ```bash
   # 패키지 목록 설치
   pip install -r requirements.txt
   ```

7. 서버 실행(23년 7월 25일 개발 상황 기준)

   ```bash
   # main.py 파일이 있는 폴더에서 아래 명령어를 상황에 맞게 실행

   # 모든 ip에서 접속 가능하고, 8000번 포트로 엽니다.
   uvicorn main:app --host=0.0.0.0 --port=8000

   # 필요에 따라 host와 port를 변경합니다.
   ```
