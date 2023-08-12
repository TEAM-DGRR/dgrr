import { Client, IMessage } from "@stomp/stompjs";
import { IGameResult, IGameStatus, IImageResult, openViduConfig, stompConfig } from "components/Game";
import { captureImage } from "components/Game/captureImage";
import { joinSession } from "components/Game/openVidu";
import { timeRemaining } from "components/Game/parseDate";
import { Device, Publisher, Session, Subscriber } from "openvidu-browser";
import { useEffect, useRef, useState } from "react";
import { useGameContext } from "./GameContext"; // Assuming GameContext is in the same directory.
import { UserVideoComponent } from "./UserVideoComponent";

export interface ChildMethods {
  getVideoElement: () => HTMLVideoElement | null;
}

export const GamePlay = () => {
  const { stompClient, isStompConnected, gameConfig } = useGameContext();
  const { gameSessionId, openViduToken, startTime, myInfo, enemyInfo } = gameConfig;

  // Stomp
  const { DESTINATION_URI, CAPTURE_INTERVAL } = stompConfig;
  const { IMAGE_DATA_URI, IMAGE_RESULT_URI, STATUS_URI, RESULT_URI } = DESTINATION_URI;

  // 이미지 처리
  const childRef = useRef<ChildMethods | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startWebcamCapture = useRef<NodeJS.Timer>();
  const webcamCapture = useRef<() => void>(() => { });

  // OpenVidu
  const [OVSession, setOVSession] = useState<Session>();
  const [publisher, setPublisher] = useState<Publisher>();
  const [subscriber, setSubscriber] = useState<Subscriber>();
  const currentVideoDeviceRef = useRef<Device>();
  const { PUBLISHER_PROPERTIES } = openViduConfig;

  // 게임 상태
  const [status, setStatus] = useState<string>("ready");
  const [turn, setTurn] = useState<string>("ready");
  const [success, setSuccess] = useState<boolean>(false);
  const [emotion, setEmotion] = useState<string>("");
  const [probability, setProbability] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  // 1) 게임 시작 준비
  useEffect(() => {
    console.log("Stomp Client : ", stompClient);
    if (gameConfig.turn === "first") setTurn("attack");
    else setTurn("defense");

    setMessage(`
    상대 정보 :
        닉네임 : ${enemyInfo.nickname}
        한줄소개 : ${enemyInfo.description}
        티어 : ${enemyInfo.rank}
        점수 : ${enemyInfo.rating}
    내 정보 :
        닉네임 : ${myInfo.nickname}
        한줄소개 : ${myInfo.description}
        티어 : ${myInfo.rank}
        점수 : ${myInfo.rating}
    게임 준비 중...
    나 : ${turn}`);

    const gameStart = () => {
      setStatus("round 1");
      setMessage(`게임 시작! ${turn}`);
    };

    setTimeout(gameStart, timeRemaining(startTime));
  }, []);

  // OpenVidu 세션 입장
  useEffect(() => {
    joinSession(openViduToken, "myUserName")
      .then(({ session, publisher, currentVideoDevice }) => {
        setOVSession(session);
        setPublisher(publisher);
        currentVideoDeviceRef.current = currentVideoDevice;
        console.log("OpenVidu 연결 완료");
      })
      .catch((error) => {
        console.log("OpenVidu 연결 실패", error.code, error.message);
      });
  }, [openViduToken]);

  // 상대방 mediaStream 얻어오기
  useEffect(() => {
    if (OVSession !== undefined) {
      OVSession.on("streamCreated", (event) => {
        setSubscriber(OVSession.subscribe(event.stream, undefined));
      });
    }
  }, [OVSession]);

  useEffect(() => {
    const roundEnd = (gameStatus: IGameStatus) => {
      const roundStart = () => {
        if (gameConfig.turn === "first") setTurn("defense");
        else setTurn("attack");
        setStatus("round 2");
        setMessage(`2라운드 시작! ${turn}`);
      };

      setMessage(`
      1 라운드 종료!
      ${gameStatus.result === "LAUGH" ? "웃음 참기 실패!" : "시간 초과!"}
      2 라운드 준비 중...
      `);
      if (gameStatus.status === "round changed") {
        setTurn("ready");
        setStatus("ready");
      } else {
        console.log("게임 상태 파싱 오류 : 라운드 전환 불가");
      }

      setTimeout(roundStart, timeRemaining(gameStatus.startTime));
    };

    const gameEnd = (gameResult: IGameResult) => {
      console.log("게임 종료");
      setStatus("end");
      setTurn("ready");
      stompClient?.deactivate();
      OVSession?.disconnect();
    };

    // Stomp 엔드포인트 구독
    if (stompClient !== undefined) {
      stompClient.subscribe(IMAGE_RESULT_URI, (message: IMessage) => {
        console.log("이미지 분석 수신 : " + message.body);
        try {
          const imageResult: IImageResult = JSON.parse(message.body);
          setSuccess(imageResult.success);
          setEmotion(imageResult.emotion);
          setProbability(imageResult.probability);
        } catch {
          console.log("이미지 분석 파싱 오류");
        }
      });

      stompClient.subscribe(STATUS_URI, (message: IMessage) => {
        console.log("게임 상태 수신 : " + message.body);
        try {
          const gameStatus: IGameStatus = JSON.parse(message.body);
          roundEnd(gameStatus);
        } catch {
          console.log("게임 상태 파싱 오류");
        }
      });

      stompClient.subscribe(RESULT_URI, (message: IMessage) => {
        console.log("게임 결과 수신 : " + message.body);
        try {
          const gameResult: IGameResult = JSON.parse(message.body);
          gameEnd(gameResult);
        } catch {
          console.log("게임 상태 파싱 오류");
        }
      });
    }
  }, []);

  // 이미지 캡처
  useEffect(() => {
    webcamCapture.current = () => {
      if (isStompConnected && stompClient instanceof Client) {
        const videoElement = childRef.current?.getVideoElement();
        if (videoElement && canvasRef.current) {
          captureImage(videoElement, canvasRef.current, (base64data: string) => {
            stompClient.publish({
              destination: IMAGE_DATA_URI,
              headers: {
                round: status === "round 1" ? "first" : "second",
                gameSessionId: gameSessionId,
              },
              body: base64data,
            });
          });
        }
      } else {
        console.log("이미지 전송 실패. 연결 확인");
      }
    };
  }, [stompClient]);

  useEffect(() => {
    // 웹캠 캡쳐 함수
    clearInterval(startWebcamCapture.current);
    if (turn === "defense") {
      console.log("메시지 전송 시작");
      startWebcamCapture.current = setInterval(webcamCapture.current, CAPTURE_INTERVAL);
    }
  }, [turn]);

  return (
    <div className="gameplay-page">
      {message}
      <div id="main-video">
        <UserVideoComponent streamManager={subscriber} />
      </div>
      <div>{turn}</div>
      <div id="main-video">
        <UserVideoComponent ref={childRef} streamManager={publisher} />
      </div>
      <canvas ref={canvasRef} style={{ display: "none" }} width="640" height="480"></canvas>
    </div>
  );
};