// GamePlay.tsx

import { Client, IMessage } from "@stomp/stompjs";
import "assets/scss/GamePlay.scss";
import {
  IGameResult,
  IGameStatus,
  IImageResult,
  openViduConfig,
  stompConfig,
} from "components/Game";
import { AttackState } from "components/Game/AttackState";
import { Timer } from "components/Game/Timer";
import { captureImage } from "components/Game/captureImage";
import { initGame, joinSession } from "components/Game/openVidu";
import { timeRemaining } from "components/Game/parseDate";
import {
  Device,
  OpenVidu,
  Publisher,
  Session,
  Subscriber,
} from "openvidu-browser";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGameContext } from "./GameContext";
import { UserVideoComponent } from "./UserVideoComponent";

export interface ChildMethods {
  getVideoElement: () => HTMLVideoElement | null;
}

export const GamePlay = () => {
  const navigate = useNavigate();
  const { stompClient, isStompConnected, gameConfig } = useGameContext();
  const { gameSessionId, openViduToken, startTime, myInfo, enemyInfo, turn } =
    gameConfig;

  // Stomp
  const { DESTINATION_URI, CAPTURE_INTERVAL } = stompConfig;
  const { IMAGE_DATA_URI, IMAGE_RESULT_URI, STATUS_URI, RESULT_URI } =
    DESTINATION_URI;

  // 이미지 처리
  const childRef = useRef<ChildMethods | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startWebcamCapture = useRef<NodeJS.Timer>();
  const webcamCapture = useRef<() => void>(() => {});

  // OpenVidu
  const [OV, setOV] = useState<OpenVidu>();
  const [OVSession, setOVSession] = useState<Session>();
  const [publisher, setPublisher] = useState<Publisher>();
  const [subscriber, setSubscriber] = useState<Subscriber>();
  const currentVideoDeviceRef = useRef<Device>();
  const { PUBLISHER_PROPERTIES } = openViduConfig;

  // 게임 상태
  const [status, setStatus] = useState<string>("ready");
  const [role, setRole] = useState<string>("");
  const [round, setRound] = useState<string>("round 1");
  const [success, setSuccess] = useState<boolean>(false);
  const [emotion, setEmotion] = useState<string>("");
  const [probability, setProbability] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  // 1) 게임 시작 준비
  useEffect(() => {
    const gameStart = () => {
      console.log("게임을 시작합니다!");
      if (turn === "first") setRole("attack");
      else setRole("defense");
      console.log("round : ", round);
      console.log("role : ", role);
    };

    setTimeout(gameStart, timeRemaining(startTime));
  }, [role, round]);

  //OV, Session Create
  useEffect(() => {
    initGame().then(({ OV, session }) => {
      setOV(OV);
      setOVSession(session);
      session.on("streamCreated", (event) => {
        const ySubscriber = session.subscribe(event.stream, undefined);
        setSubscriber(ySubscriber);
      });

      //연결
      joinSession(OV, session, openViduToken, "myUserName")
        .then(({ publisher, currentVideoDevice }) => {
          setPublisher(publisher);
          currentVideoDeviceRef.current = currentVideoDevice;
          console.log("OpenVidu 연결 완료");
        })
        .catch((error) => {
          console.log("OpenVidu 연결 실패", error.code, error.message);
        });
    });
  }, []);

  useEffect(() => {
    // 라운드가 변경될 때 한번 실행됨.
    const roundEnd = (gameStatus: IGameStatus) => {
      const roundStart = () => {
        if (role === "attack") setRole("defense");
        if (role === "defense") setRole("attack");
        setRound("round 2");
      };

      setTimeout(roundStart, timeRemaining(gameStatus.startTime));
    };

    const gameEnd = (gameResult: IGameResult) => {
      console.log("게임 종료");
      stompClient?.deactivate();
      OVSession?.disconnect();
      navigate("game/result");
    };

    // Stomp 엔드포인트 구독
    if (stompClient !== undefined) {
      stompClient.subscribe(IMAGE_RESULT_URI, (message: IMessage) => {
        try {
          const imageResult: IImageResult = JSON.parse(message.body);
          console.log(imageResult);
          setSuccess(imageResult.success);
          setEmotion(imageResult.emotion);
          setProbability(imageResult.probability);
        } catch {
          console.log("이미지 분석 파싱 오류");
        }
      });

      // 라운드 변경될 때 한 번 메시지 받음.
      stompClient.subscribe(STATUS_URI, (message: IMessage) => {
        console.log("게임의 상태를 수신합니다 : " + message.body);
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
  }, [round]);

  // 이미지 캡처
  useEffect(() => {
    webcamCapture.current = () => {
      if (isStompConnected && stompClient instanceof Client) {
        const videoElement = childRef.current?.getVideoElement();
        if (videoElement && canvasRef.current) {
          captureImage(
            videoElement,
            canvasRef.current,
            (base64data: string) => {
              console.log(IMAGE_DATA_URI, "로 이미지 데이터를 전송합니다.");
              console.log("round : ", round);
              stompClient.publish({
                destination: IMAGE_DATA_URI,
                headers: {
                  round: round,
                  gameSessionId: gameSessionId,
                },
                body: base64data,
              });
            }
          );
        }
      } else {
        console.log("이미지 전송 실패. 연결 확인");
      }
    };
  }, [role]);

  useEffect(() => {
    // 웹캠 캡쳐 함수
    clearInterval(startWebcamCapture.current);
    if (role === "defense") {
      console.log("메시지 전송 시작");
      startWebcamCapture.current = setInterval(
        webcamCapture.current,
        CAPTURE_INTERVAL
      );
    }
  }, [role]);

  return (
    <div className="gameplay-page">
      <div className="gameplay-navbar">
        {/* space 균등하게 주기 위한 더미 */}
        {/* <div style={{width: 28}} /> */}
        <Timer />
        {/* 누르면 진짜 나갈건지 물어보는 모달 띄우기 / 현재 나가기가 없음 */}
        {/* <img hidden src={exitIco} alt="나가기버튼" style={{width: 28}} /> */}
      </div>
      <div id="main-video">
        {role === "attack" ? (
          <AttackState color="blue">방어</AttackState>
        ) : (
          <AttackState color="red">공격</AttackState>
        )}
        <UserVideoComponent streamManager={subscriber} />
      </div>
      {/* <div>{turn}</div> */}
      <div id="main-video">
        {role === "attack" ? (
          <AttackState color="red">공격</AttackState>
        ) : (
          <AttackState color="blue">방어</AttackState>
        )}
        <UserVideoComponent ref={childRef} streamManager={publisher} />
      </div>
      <canvas
        ref={canvasRef}
        style={{ display: "none" }}
        width="640"
        height="480"
      ></canvas>
      <button
        onClick={() => {
          navigate("/main");
        }}
      >
        메인으로
      </button>
    </div>
  );
};
