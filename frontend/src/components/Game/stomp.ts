import { Client, IMessage, StompHeaders, messageCallbackType } from "@stomp/stompjs";

export const connectStomp = (headers: StompHeaders) => {
  const client = new Client({
    brokerURL: "ws://localhost:8080/ws",
    connectHeaders: {
      username: "1234",
      password: "1234",
      "heart-beat": "10000,10000", // Heartbeat 메시지 주기 설정
      ...headers,
    },
    debug: function (str) {
      console.log("[Stomp Debug]", str); // 웹소켓 디버깅 로그 추가
    },
  });

  client.activate();

  return new Promise<Client>((resolve) => {
    client.onConnect = (frame) => {
      console.log("Stomp 연결 성공");
      resolve(client);
    };
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

export const onUnhandledMessage = (client: Client, callback: Function) => {
  client.onUnhandledMessage = (message: IMessage) => {
    console.log(message);
    callback(message);
  };
};

export const subscribeURI = (
  client: Client,
  destination: string,
  callback: Function,
  headers: StompHeaders
) => {
  client.subscribe(destination, callback as messageCallbackType, headers);
};
