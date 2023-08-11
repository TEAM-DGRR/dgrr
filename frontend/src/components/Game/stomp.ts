import { Client, StompHeaders } from "@stomp/stompjs";
import { stompConfig } from "./config";
import { IGameConfig } from "./interface";

const { CONNECT_HEADER, DESTINATION_URI } = stompConfig;
const { GAME_URI, MATCHING_URI, IMAGE_DATA_URI, IMAGE_RESULT_URI, STATUS_URI, RESULT_URI } =
  DESTINATION_URI;

export const connectStomp = (headers: StompHeaders) => {
  const client = new Client({
    brokerURL: process.env.REACT_APP_BROKER_URL,
    connectHeaders: {
      ...CONNECT_HEADER,
      ...headers,
    },
    debug: (message) => {
      console.log("[Stomp Debug]", message); // 웹소켓 디버깅 로그 추가
    },
  });

  client.activate();

  return new Promise<Client>((resolve) => {
    client.onConnect = (frame) => {
      resolve(client);
    };
  });
};

export const getGameConfig = (client: Client) => {
  return new Promise<IGameConfig>((resolve) => {
    client.subscribe(GAME_URI, (message) => {
      console.log("[GAME Message recieved] : " + message.headers);
      console.log("[body] : " + message.body);
      const gameConfig = JSON.parse(message.body);
      resolve(gameConfig);
    });
    client.publish({
      destination: MATCHING_URI,
      body: "[enter matching queue]",
    });
  });
};

export const onStompError = (client: Client, callback: Function) => {
  client.onStompError = (frame) => {
    callback();
    console.log("Stomp 연결 실패:", frame.headers["message"]);
  };
};

export const publishMessage = (client: Client, destination: string, body: string) => {
  client.publish({ destination, body });
};
