import { Client, IMessage } from "@stomp/stompjs";
import "assets/scss/GamePlay.scss";
import {
  IGameResult,
  IGameStatus,
  IImageResult,
  openViduConfig,
  stompConfig,
} from "components/Game";
import { captureImage } from "components/Game/captureImage";
import { initGame, joinSession } from "components/Game/openVidu";
import {
  Device,
  OpenVidu,
  Publisher,
  Session,
  Subscriber,
} from "openvidu-browser";
import { connectStomp, publishMessage } from "components/Game/stomp";
import { parseDate, timeRemaining } from "components/Game/parseDate";
import "assets/scss/GamePlay.scss";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGameContext } from "./GameContext";
import { UserVideoComponent } from "./UserVideoComponent";
import { Timer } from "components/Game/Timer";
import attackIco from "assets/images/match-attack.png";
import defendIco from "assets/images/match-defense.png";
import { RoundChangeModal } from "components/Game/RoundChangeModal";
import ProbabilityGauge from "components/Game/ProbabilityGauge";

export interface ChildMethods {
  getVideoElement: () => HTMLVideoElement | null;
}

export const GamePlay = () => {
  const {
    stompClient,
    isStompConnected,
    gameConfig,
    myGameResult,
    setMyGameResult,
  } = useGameContext();
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

  // 이미지 수신 정보 시각화
  const [recognition, setRecognition] = useState<string>("");
  const [emotion, setEmotion] = useState<string>("");
  const [probability, setPropbability] = useState<string>("");
  const isRecognitionMessage = "얼굴 인식 성공";
  const isNotRecognitionMessage = "얼굴 인식 실패";

  // OpenVidu
  const [OV, setOV] = useState<OpenVidu>();
  const [OVSession, setOVSession] = useState<Session>();
  const [publisher, setPublisher] = useState<Publisher>();
  const [subscriber, setSubscriber] = useState<Subscriber>();
  const currentVideoDeviceRef = useRef<Device>();
  const { PUBLISHER_PROPERTIES } = openViduConfig;

  // 게임 상태
  const [role, setRole] = useState<string>(""); // 초기 상태
  const [round, setRound] = useState<string>("round 1"); // 초기 상태 "round 1"

  // 턴 정보 모달창
  const SHOW_TURN_CHANGE_MODAL_TIME = 3 * 1000;
  const [showTurnChangeModal, setShowTurnChangeModal] = useState(false);

  // 게임 종료 모달창
  const SHOW_GAME_ENDED_MODAL_TIME = 3 * 1000;
  const [showGameEndedModal, setShowGameEndedModal] = useState(false);

  // gameConfig의 turn에 따라 role을 설정
  useEffect(() => {
    if (gameConfig.turn === "first") {
      setRole("attack");
    } else if (gameConfig.turn === "second") {
      setRole("defense");
    }
    setShowTurnChangeModal(true);
    setTimeout(
      () => setShowTurnChangeModal(false),
      SHOW_TURN_CHANGE_MODAL_TIME
    );
  }, [gameConfig]);

  // GamePlay 렌더링 시 OvenVidu 연결
  useEffect(() => {
    initGame().then(({ OV, session }) => {
      console.log("THE FIRST OV INItialte");
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
    const roundEnd = (gameStatus: IGameStatus) => {
      const roundStart = () => {};

      if (gameStatus.status === "round changed") {
        console.log("2라운드를 진행합니다.");
      } else {
        // gameStatus.status === "End"
        console.log("게임 상태 파싱 오류 : 라운드 전환 불가");
      }

      setTimeout(roundStart, timeRemaining(gameStatus.startTime));
    };

    const gameEnd = (gameResult: IGameResult) => {
      console.log("게임 종료");
      setShowGameEndedModal(true);

      setTimeout(() => {
        setShowGameEndedModal(false);
        stompClient?.deactivate();
        OVSession?.disconnect();
        navigate("/game/result");
      }, SHOW_GAME_ENDED_MODAL_TIME);
    };

    // Stomp 엔드포인트 구독
    if (stompClient !== undefined) {
      // 1. 이미지 결과 받기
      stompClient.subscribe(IMAGE_RESULT_URI, (message: IMessage) => {
        console.log("이미지 분석 수신 : " + message.body);
        try {
          const imageResult: IImageResult = JSON.parse(message.body);
          setRecognition(imageResult.success);
          setEmotion(imageResult.emotion);
          if (imageResult.emotion === "Smile") {
            setPropbability(imageResult.probability);
          } else {
            setPropbability("0");
          }
        } catch {
          console.log("이미지 분석 파싱 오류");
        }
      });

      // 2. 게임 라운드가 변경되면 게임 status를 받음
      stompClient.subscribe(STATUS_URI, (message: IMessage) => {
        console.log("게임 상태를 수신합니다.@@@@@@@@@@@ : " + message.body);
        try {
          const gameStatus: IGameStatus = JSON.parse(message.body);

          // 서버로부터 "round changed" 메시지를 받을 때 round와 role을 변경
          console.log();
          if (gameStatus.status === "round changed") {
            if (round === "round 1") {
              setRound("round 2");
              setRole((prevRole) =>
                prevRole === "attack" ? "defense" : "attack"
              );
            } else if (round === "round 2") {
              setRound("round 1");
              setRole((prevRole) =>
                prevRole === "attack" ? "defense" : "attack"
              );
            }
            // 3초간 모달 보여주기
            setShowTurnChangeModal(true);
            setTimeout(
              () => setShowTurnChangeModal(false),
              SHOW_TURN_CHANGE_MODAL_TIME
            );
          }

          roundEnd(gameStatus);
        } catch {
          console.log("게임 상태 파싱 오류");
        }
      });

      // 3. 게임이 종료되면 게임 Result를 받음
      stompClient.subscribe(RESULT_URI, (message: IMessage) => {
        console.log("게임 결과를 수신합니다. " + message.body);
        try {
          const myGameResult: IGameResult = JSON.parse(message.body);

          // 게임 결과 정보를 Provider에 업데이트
          setMyGameResult(myGameResult);
          gameEnd(myGameResult);
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
          captureImage(
            videoElement,
            canvasRef.current,
            (base64data: string) => {
              console.log(IMAGE_DATA_URI, "로 이미지를 보냅니다.");
              stompClient.publish({
                destination: IMAGE_DATA_URI,
                headers: {
                  round: round, // 여기에서 round 값을 동적으로 사용
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
  }, [stompClient, round]);

  useEffect(() => {
    if (role === "defense") {
      console.log("메시지 전송 시작");
      startWebcamCapture.current = setInterval(
        webcamCapture.current,
        CAPTURE_INTERVAL
      );
    } else {
      // role이 defense가 아닌 경우에는 웹캠 캡쳐 중지
      if (startWebcamCapture.current) {
        clearInterval(startWebcamCapture.current);
      }
    }
  }, [role]);

  const navigate = useNavigate();

  return (
    <div className="gameplay-page">
      <div className="gameplay-navbar">
        {showTurnChangeModal === false && showGameEndedModal === false ? (
          <>
            <div id="noticeIsRecognitionInfo">
              <p>{isRecognitionMessage}</p>
            </div>
            <div id="noticeIsNotRecognitionInfo">
              <p>{isNotRecognitionMessage}</p>
            </div>
          </>
        ) : null}

        {/* space 균등하게 주기 위한 더미 */}
        {/* <div style={{width: 28}} /> */}
        <Timer role={role} />
        {/* 누르면 진짜 나갈건지 물어보는 모달 띄우기 / 현재 나가기가 없음 */}
        {/* <img hidden src={exitIco} alt="나가기버튼" style={{width: 28}} /> */}
      </div>
      <div id="main-video">
        {/* 상대 비디오 */}
        {role === "attack" ? (
          <img id="defend" src={defendIco} alt="방어상태" />
        ) : (
          <img id="attack" src={attackIco} alt="공격상태" />
        )}
        <UserVideoComponent streamManager={subscriber} />
      </div>
      <div id="main-video">
        {/* 내 비디오 */}
        {role !== "defense" && !showTurnChangeModal ? (
          <img id="attack" src={attackIco} alt="공격상태" />
        ) : null}
        {role !== "attack" && !showTurnChangeModal ? (
          <img id="defend" src={defendIco} alt="방어상태" />
        ) : null}
        {/* 이미지 분석 결과를 시각화 */}

        {emotion == "Smile" ? (
          <ProbabilityGauge probability={parseFloat(probability)} />
        ) : (
          <ProbabilityGauge probability={parseFloat(probability)} />
        )}
        {showTurnChangeModal === false && showGameEndedModal === false ? (
          recognition === "true" ? (
            <div id="isFaceRecognition"></div>
          ) : (
            <div id="isNotFaceRecognition"></div>
          )
        ) : null}

        <UserVideoComponent ref={childRef} streamManager={publisher} />
      </div>
      {showTurnChangeModal === false && showGameEndedModal === false ? (
        <canvas
          ref={canvasRef}
          style={{ display: "none" }}
          width="640"
          height="480"
        ></canvas>
      ) : null}
      {showTurnChangeModal ? <RoundChangeModal role={role} /> : null}
    </div>
  );
};
