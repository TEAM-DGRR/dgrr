// GameContext.tsx

import { Client, StompHeaders } from "@stomp/stompjs";

import { IGameConfig, IGameResult } from "components/Game";
import {
  connectStomp,
  getGameConfig,
  onStompError,
  publishMessage,
} from "components/Game/stomp";
import { ReactNode, createContext, useContext, useRef, useState } from "react";

export interface IGamePlayProps {
  stompClient: Client | undefined;
  setStompClient: React.Dispatch<React.SetStateAction<Client | undefined>>;
  isStompConnected: boolean;
  gameConfig: IGameConfig;
  setGameConfig: React.Dispatch<React.SetStateAction<IGameConfig>>;
  myGameResult: IGameResult;
  setMyGameResult: React.Dispatch<React.SetStateAction<IGameResult>>;
  connectStompClient: (headers: StompHeaders) => Promise<Client>;
  disconnectStompClient: () => void;
  getGameConfiguration: (client: Client) => Promise<IGameConfig>;
  handleErrorOnStomp: (client: Client, callback: Function) => void;
  sendMessage: (client: Client, destination: string, body: string) => void;
}

export const GameContext = createContext<IGamePlayProps | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [stompClient, setStompClient] = useState<Client>();
  const [gameConfig, setGameConfig] = useState<IGameConfig>({} as IGameConfig);
  const [myGameResult, setMyGameResult] = useState<IGameResult>(
    {} as IGameResult
  );
  const isStompConnected = useRef<boolean>(false);

  const connectStompClient = async (headers: StompHeaders) => {
    console.log("Stomp 연결을 대기중입니다...");
    const client = await connectStomp(headers);
    setStompClient(client);
    isStompConnected.current = true;
    console.log("Stomp연결에 성공하였습니다.");
    return client;
  };

  const disconnectStompClient = () => {
    if (stompClient) {
      console.log("Stomp 연결을 해제합니다!");
      isStompConnected.current = false;
      stompClient.deactivate();
      setStompClient(undefined);
      return;
    }
  };

  const getGameConfiguration = async (client: Client) => {
    return getGameConfig(client);
  };

  const handleErrorOnStomp = (client: Client, callback: Function) => {
    onStompError(client, callback);
  };

  const sendMessage = (client: Client, destination: string, body: string) => {
    publishMessage(client, destination, body);
  };

  return (
    <GameContext.Provider
      value={{
        stompClient,
        setStompClient,
        isStompConnected: isStompConnected.current,
        gameConfig,
        setGameConfig,
        myGameResult,
        setMyGameResult,
        connectStompClient,
        disconnectStompClient,
        getGameConfiguration,
        handleErrorOnStomp,
        sendMessage,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error(
      "useGameContext는 GameProvider 내부에서 사용되어야 함!!!!!!."
    );
  }
  return context;
};
