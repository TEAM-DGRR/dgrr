import LoadingSoundPath from "assets/audio/game-loading.mp3";
import arrowleft from "assets/images/ico_arrow-left_24px.svg";
import LoadingLogo from "assets/images/logo_character.png";
import "assets/scss/Loding.scss";
import { IGameConfig } from "components/Game";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGameContext } from "./GameContext";

const LoadingMessage = "게임을 찾는 중입니다";

export const GameLoading = () => {
  const loadingSound = useRef(new Audio(LoadingSoundPath)).current;
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(0);

  // Stomp and GameContext integration
  const {
    stompClient,
    setGameConfig,
    connectStompClient,
    getGameConfiguration,
  } = useGameContext();

  // eslint-disable-next-line
  useEffect(() => {
    loadingSound.play();

    const tryConnectStomp = async () => {
      if (!stompClient) {
        const client = await connectStompClient({});
        startGameSession(await getGameConfiguration(client));
      }
    };

    const startGameSession = (message: IGameConfig) => {
      if (message.success === "true") {
        setGameConfig(message);
        loadingSound.pause();
        navigate("/game/match");
      } else {
        console.log("게임 설정 수신 오류");
      }
    };

    tryConnectStomp();

    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    // Cleanup on unmount
    return () => {
      clearInterval(interval);
      loadingSound.pause();
      loadingSound.currentTime = 0;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  return (
    <div className="GameLoadingScreen">
      <div className="navbar">
        <div className="navbar-left">
          <img
            src={arrowleft}
            alt="뒤로가기"
            onClick={() => {
              navigate("/main");
            }}
          />
        </div>
      </div>
      <div className="RotatingElement">
        <img src={LoadingLogo} alt="a" />
      </div>
      <div className="Timer">{seconds}s</div>
      <div className="LoadingText">
        {Array.from(LoadingMessage).map((char, index) => (
          <span key={index}>{char}</span>
        ))}
      </div>
    </div>
  );
};
