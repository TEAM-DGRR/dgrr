import react, { useEffect, useRef, useState } from "react";
import { connectStomp, onUnhandledMessage, subscribeURI } from "components/Game/stomp";
import { Client, IMessage } from "@stomp/stompjs";
import { Route, Routes, useNavigate } from "react-router-dom";
import { GameLoading } from "./GameLoading";
import { GamePlay } from "./GamePlay";

export interface IGameProps {
  stompClient: Client;
  isStompConnected: boolean;
}

export const Game = () => {
  const [stompClient, setStompClient] = useState<Client>();
  const isStompConnected = useRef<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 게임 창으로 진입시 소켓 통신 연결
    const tryConnectStomp = async () => {
      try {
        await connectStomp({}).then((client) => {
          setStompClient(client);
        });

        if (stompClient === undefined) throw "Stomp client가 존재하지 않음";
        isStompConnected.current = true;
        console.log("Stomp 연결 성공");

        onUnhandledMessage(stompClient, (message: IMessage) => {
          console.log("Received message:", message);
          navigate("/game/play");
        });
      } catch (error) {
        console.error("Failed to connect:", error);
      }
    };

    tryConnectStomp();
  }, []);

  return (
    <div>
      <Routes>
        {stompClient !== undefined ? (
          <>
            <Route
              path="/game/loading"
              element={<GameLoading stompClient={stompClient} isStompConnected />}
            />
            <Route
              path="/game/play"
              element={<GamePlay stompClient={stompClient} isStompConnected />}
            />
          </>
        ) : null}
      </Routes>
    </div>
  );
};
