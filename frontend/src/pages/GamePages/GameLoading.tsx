import { connectStomp, getGameConfig } from "components/Game/stomp";
import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import { IGameConfig } from "components/Game";
import LoadingLogo from "assets/images/logo_character.png";
import "assets/scss/Loding.scss";
import { useNavigate } from "react-router-dom";

const LoadingMessage = "게임을 찾는 중입니다";

export interface IGamePlayProps {
  stompClient: Client | undefined;
  isStompConnected: boolean;
  gameConfig: IGameConfig;
}

export const GameLoading = () => {
  const [stompClient, setStompClient] = useState<Client>();
  const [gameConfig, setGameConfig] = useState<IGameConfig>({} as IGameConfig);
  const isStompConnected = useRef<boolean>(false);
  const navigate = useNavigate();

  const [seconds, setSeconds] = useState(0);

  useEffect(() => {

    // 1) 소켓 통신 연결
    const tryConnectStomp = async () => {
      const client = await connectStomp({});
      setStompClient(client);
      isStompConnected.current = true;

      // 2) 구독, 구독 완료 메시지 전송, 게임 시작 메시지를 수신하도록 대기
      startGameSession(await getGameConfig(client));
    };

    // 3) 게임 시작 메시지 수신 시, 게임 설정 요소 저장하고 게임 세션 시작
    const startGameSession = (message: IGameConfig) => {
      if (message.success === "true") {
        setGameConfig(message);
        navigate("/game/match");
      } else {
        console.log("게임 설정 수신 오류");
      }
    };
    tryConnectStomp();
    
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    // Cleanup on unmount
    return () => clearInterval(interval);

    

  }, []);

  
  return (
    <div className="GameLoadingScreen">
      <div className="RotatingElement">
        <img src={LoadingLogo} alt="a"/>
      </div>
      <div className="Timer">{seconds}s</div> {/* This is the new timer display */}
      <div className="LoadingText">
        {Array.from(LoadingMessage).map((char, index) => (
          <span key={index}>{char}</span>
        ))}
      </div>
    </div>
  );
};