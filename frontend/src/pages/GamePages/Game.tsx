import react, { useEffect, useRef, useState } from "react";
import { connectStomp, getGameConfig } from "components/Game/stomp";
import { Client, IMessage } from "@stomp/stompjs";
import { Route, Routes, useNavigate } from "react-router-dom";
import { GameLoading } from "./GameLoading";
import { GamePlay } from "./GamePlay";
import { IGameConfig } from "components/Game";
import { GameMatch } from "./GameMatch";

export interface IGamePlayProps {
  stompClient: Client | undefined;
  isStompConnected: boolean;
  gameConfig: IGameConfig;
}

export const Game = () => {
  const [stompClient, setStompClient] = useState<Client>();
  const [gameConfig, setGameConfig] = useState<IGameConfig>({} as IGameConfig);
  const isStompConnected = useRef<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 3) 게임 시작 메시지 수신 시, 게임 설정 요소 저장하고 게임 세션 시작
    const startGameSession = (message: IGameConfig) => {
      if (message.success === "true") {
        setGameConfig(message);
        navigate("/game/play");
      } else {
        console.log("게임 설정 수신 오류");
      }
    };

    // 1) 소켓 통신 연결
    const tryConnectStomp = async () => {
      const client = await connectStomp({});
      setStompClient(client);
      isStompConnected.current = true;

      // 2) 구독, 구독 완료 메시지 전송, 게임 시작 메시지를 수신하도록 대기
      startGameSession(await getGameConfig(client));
    };

    tryConnectStomp();
  }, []);

  return (
    <div>
      <Routes>
        <Route index path="/loading" element={<GameLoading />} />
        <Route
          path="/play"
          element={<GamePlay stompClient={stompClient} gameConfig={gameConfig} isStompConnected />}
        />
        <Route path="/match" element={<GameMatch/>}></Route>
      </Routes>
    </div>
  );
};
