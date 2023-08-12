// GameContext.tsx

import { Client, StompHeaders } from "@stomp/stompjs";

import { IGameConfig } from "components/Game";
import { connectStomp, getGameConfig, onStompError, publishMessage } from "components/Game/stomp";
import { ReactNode, createContext, useContext, useRef, useState } from "react";

export interface IGamePlayProps {
  stompClient: Client | undefined;
  setStompClient: React.Dispatch<React.SetStateAction<Client | undefined>>;
  isStompConnected: boolean;
  gameConfig: IGameConfig;
  setGameConfig: React.Dispatch<React.SetStateAction<IGameConfig>>;
  connectStompClient: (headers: StompHeaders) => Promise<Client>;
  getGameConfiguration: (client: Client) => Promise<IGameConfig>;
  handleErrorOnStomp: (client: Client, callback: Function) => void;
  sendMessage: (client: Client, destination: string, body: string) => void;
}

export const GameContext = createContext<IGamePlayProps | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [stompClient, setStompClient] = useState<Client>();
  const [gameConfig, setGameConfig] = useState<IGameConfig>({} as IGameConfig);
  const isStompConnected = useRef<boolean>(false); 

  const connectStompClient = async (headers: StompHeaders) => {
    const client = await connectStomp(headers);
    setStompClient(client);
    isStompConnected.current = true;
    return client;
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
        connectStompClient,
        getGameConfiguration,
        handleErrorOnStomp,
        sendMessage
      }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameContext는 GameProvider 내부에서 사용되어야 함!!!!!!.");
  }
  return context;
};