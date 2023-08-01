import { IMessage } from "@stomp/stompjs";
import {
  connectWebSocket,
  onUnhandledMessage,
  publishMessage,
  subscribeURI,
} from "../../src/components/Game/stomp";
import { captureImage } from "../../components/GameImage/captureImage";
import React, { useEffect, useRef } from "react";

export const GamePlay = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isWebSocketConnected = useRef<Boolean>(false);

  const startWebcamCapture = () => {
    const captureInterval = 1000;

    const sendImage = (base64data: string) => {
      if (isWebSocketConnected.current) {
        publishMessage("/app/imageData", base64data);
        console.log(base64data);
        console.log("/app/imageData uri로 이미지 데이터 전송했음.");
      } else {
        console.log("웹소켓 연결이 끊겨서 이미지를 전송할 수 없습니다.");
      }
    };

    setInterval(() => {
      if (isWebSocketConnected.current) {
        if (videoRef.current && canvasRef.current) {
          captureImage(videoRef.current, canvasRef.current, sendImage);
        }
      } else {
        connectWebSocket({});
      }
    }, captureInterval);
  };

  // useEffect(() => {
  //   const tryConnectWebSocket = async () => {
  //     try {
  //       await connectWebSocket({});
  //       isWebSocketConnected.current = true;
  //       console.log("WebSocket 연결 성공");

  //       subscribeURI(
  //         "/topic/analyzingData",
  //         (message: IMessage) => {
  //           console.log("서버로부터 메시지 수신:", message.body);
  //         },
  //         {}
  //       );

  //       startWebcamCapture();

  //       onUnhandledMessage((message: IMessage) => {
  //         console.log("Received message:", message);
  //       });
  //     } catch (error) {
  //       console.error("Failed to connect:", error);
  //     }
  //   };

  //   tryConnectWebSocket();
  // }, []);

  useEffect(() => {
    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("웹캠 스트림을 가져오는 중 오류가 발생했습니다:", error);
      }
    };

    startWebcam();
  }, []);

  return (
    <div>
      <h1>WebSocket and Webcam Example</h1>
      <video ref={videoRef} width="640" height="480" autoPlay muted></video>
      <canvas ref={canvasRef} style={{ display: "none" }} width="640" height="480"></canvas>
      <button className="btn">버튼</button>
    </div>
  );
};
