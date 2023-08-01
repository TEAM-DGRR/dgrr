import { UserVideoComponent } from "./UserVideoComponent";
import { IGameProps } from "./Game";
import { joinSession } from "components/Game/openVidu";
import { useEffect, useRef, useState } from "react";
import { Device, Publisher, Session, Subscriber } from "openvidu-browser";
import { connectStomp, publishMessage } from "components/Game/stomp";
import { captureImage } from "components/Game/captureImage";

export const GamePlay = (props: IGameProps) => {
  // OpenVidu
  const [OVSession, setOVSession] = useState<Session>();
  const [publisher, setPublisher] = useState<Publisher>();
  const [subscriber, setSubscriber] = useState<Subscriber>();
  const currentVideoDeviceRef = useRef<Device>();

  // Stomp
  const { stompClient, isStompConnected } = props;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // OpenVidu 세션 입장
  useEffect(() => {
    joinSession("SessionA", "faegawfd")
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

  // 이미지 캡처
  const startWebcamCapture = () => {
    const captureInterval = 1000;

    setInterval(() => {
      if (isStompConnected) {
        if (videoRef.current && canvasRef.current) {
          captureImage(videoRef.current, canvasRef.current, (base64data: string) => {
            publishMessage(stompClient, "/app/imageData", base64data);
          });
        }
      } else {
        connectStomp({});
      }
    }, captureInterval);
  };

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
