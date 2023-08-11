// GameLoading.tsx

import LoadingLogo from "assets/images/logo_character.png";
import "assets/scss/Loding.scss";
import { IGameConfig } from "components/Game";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGameContext } from "./GameContext";
const LoadingMessage = "게임을 찾는 중입니다";

export const GameLoading = () => {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(0);

  // Stomp and GameContext integration
  const { 
    stompClient, 
    setGameConfig, 
    connectStompClient, 
    getGameConfiguration,
    isStompConnected,
  } = useGameContext();

  useEffect(() => {
    // 1) 소켓 통신 연결
    const tryConnectStomp = async () => {
      if (!stompClient) {
        const client = await connectStompClient({});
        console.log("Loding의 isStompConnected : ", isStompConnected);


        // 2) 구독, 구독 완료 메시지 전송, 게임 시작 메시지를 수신하도록 대기
        startGameSession(await getGameConfiguration(client));
      }
    };

    // 3) 게임 시작 메시지 수신 시, 게임 설정 요소 저장하고 게임 세션 시작
    const startGameSession = (message: IGameConfig) => {
      if (message.success === "true") {
        setGameConfig(message);
        console.log("message : ", message);
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
