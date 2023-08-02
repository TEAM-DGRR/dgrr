import react, { useEffect, useRef, useState } from "react";
import { connectStomp, getGameConfig } from "components/Game/stomp";
import { Client, IMessage } from "@stomp/stompjs";
import { Route, Routes, useNavigate } from "react-router-dom";
import { GameLoading } from "./GameLoading";
import { GamePlay } from "./GamePlay";
import { IGameConfig } from "components/Game";

export interface IGameProps {
  stompClient: Client;
  isStompConnected: boolean;
  gameConfig: IGameConfig;
}

export const Game = () => {
  const [stompClient, setStompClient] = useState<Client>();
  const [gameConfig, setGameConfig] = useState<IGameConfig>({} as IGameConfig);
  const isStompConnected = useRef<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const startGame = (message: IGameConfig) => {
      setGameConfig(message);
      navigate("/game/play");
    };

    // 소켓 통신 연결
    const tryConnectStomp = async () => {
      setStompClient(await connectStomp({}));

      if (stompClient === undefined) throw "Stomp Client가 존재하지 않음";
      isStompConnected.current = true;
      console.log("Stomp 연결 성공");

      // 구독, 게임 시작 메시지를 수신하도록 대기
      startGame(await getGameConfig(stompClient));
    };

    tryConnectStomp();
  }, []);

  return (
    <div>
      <Routes>
        {stompClient !== undefined ? (
          <>
            <Route
              index
              path="/game/loading"
              element={
                <GameLoading stompClient={stompClient} gameConfig={gameConfig} isStompConnected />
              }
            />
            <Route
              path="/game/play"
              element={
                <GamePlay stompClient={stompClient} gameConfig={gameConfig} isStompConnected />
              }
            />
          </>
        ) : null}
      </Routes>
    </div>
  );
};
