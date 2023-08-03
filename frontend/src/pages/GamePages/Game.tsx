import react, { useEffect, useRef, useState } from "react";
import { connectStomp, getGameConfig } from "components/Game/stomp";
import { Client, IMessage } from "@stomp/stompjs";
import { Route, Routes, useNavigate } from "react-router-dom";
import { GameLoading } from "./GameLoading";
import { GamePlay } from "./GamePlay";
import { IGameConfig } from "components/Game";

export interface IGameProps {
  stompClient: Client | undefined;
  isStompConnected: boolean;
  gameConfig: IGameConfig;
}

export const Game = () => {
  const [num, setNum] = useState<Number>(0);
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
      const client = await connectStomp({});
      setStompClient(client);
      isStompConnected.current = true;

      // 구독, 게임 시작 메시지를 수신하도록 대기
      startGame(await getGameConfig(client));
    };

    tryConnectStomp();
  }, [navigate]);

  return (
    <div>
      <Routes>
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
      </Routes>
    </div>
  );
};
