import { UserVideoComponent } from "./UserVideoComponent";
import { IGameProps } from "./Game";
import { joinSession } from "components/Game/openVidu";
import { useEffect, useRef, useState } from "react";
import { Device, Publisher, Session, Subscriber } from "openvidu-browser";
import { connectStomp, publishMessage } from "components/Game/stomp";
import { captureImage } from "components/Game/captureImage";
import { parseDate } from "components/Game/parseDate";
import { Client, IMessage } from "@stomp/stompjs";

export const GamePlay = (props: IGameProps) => {
  // OpenVidu
  const [OVSession, setOVSession] = useState<Session>();
  const [publisher, setPublisher] = useState<Publisher>();
  const [subscriber, setSubscriber] = useState<Subscriber>();
  const currentVideoDeviceRef = useRef<Device>();

  // 게임 상태
  const [status, setStatus] = useState<string>("READY");
  const [turn, setTurn] = useState<string>("");
  const [laugh, setLaugh] = useState<number>(0);

  // 1) 게임 시작 준비
  useEffect(() => {
    const gameStart = () => {
      setStatus("1라운드");
    };

    setTurn(gameConfig.turn);

    const timeRemaining = new Date().getTime() - parseDate(startTime).getTime();
    console.log("남은 시간 : " + timeRemaining);

    setTimeout(gameStart, timeRemaining);
  }, []);

  // OpenVidu 세션 입장
  useEffect(() => {
    joinSession(openViduToken, "faegawfd")
      .then(({ session, publisher, subscriber, currentVideoDevice }) => {
        setOVSession(session);
        setPublisher(publisher);
        setSubscriber(subscriber);
        currentVideoDeviceRef.current = currentVideoDevice;
      })
      .catch((error) => {
        console.log("There was an error connecting to the session:", error.code, error.message);
      });
  }, []);

  // Stomp 엔드포인트 구독
  useEffect(() => {});

  useEffect(() => {
    // Stomp 엔드포인트 구독
    if (stompClient !== undefined) {
      stompClient.subscribe(IMAGE_RESULT_URI, (message: IMessage) => {
        console.log("이미지 분석 수신 : " + message.body);
      });
      stompClient.subscribe(STATUS_URI, (message: IMessage) => {
        console.log("게임 상태 수신 : " + message.body);
      });
      stompClient.subscribe(RESULT_URI, (message: IMessage) => {
        console.log("게임 결과 수신 : " + message.body);
      });
    }
  }, [stompClient]);

  // 이미지 캡처
  useEffect(() => {
    // 웹캠 캡쳐 함수
    const startWebcamCapture = () => {
      setInterval(() => {
        if (isStompConnected && stompClient instanceof Client) {
          if (videoRef.current && canvasRef.current) {
            captureImage(videoRef.current, canvasRef.current, (base64data: string) => {
              publishMessage(stompClient, IMAGE_DATA_URI, base64data);
            });
          }
        } else {
          connectStomp({});
        }
      }, CAPTURE_INTERVAL);
    };

    if (status !== "대기" && status !== "종료") {
      startWebcamCapture();
    }
  }, [stompClient, status, isStompConnected]);

  const handleGetVideoRef = (videoRefFromChild: React.RefObject<HTMLVideoElement>) => {
    videoRef.current = videoRefFromChild.current;
  };

  return (
    <div>
      {subscriber !== undefined ? (
        <div id="main-video">
          <UserVideoComponent streamManager={subscriber} />
        </div>
      ) : null}
      {publisher !== undefined ? (
        <div id="main-video2">
          <UserVideoComponent onGetVideoRef={handleGetVideoRef} streamManager={publisher} />
        </div>
      ) : null}
      <canvas ref={canvasRef} style={{ display: "none" }} width="640" height="480"></canvas>
    </div>
  );
};
