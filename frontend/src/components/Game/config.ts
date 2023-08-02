export const APPLICATION_SERVER_URL =
  process.env.NODE_ENV === "production" ? "" : "https://demos.openvidu.io/";

export const stompConfig = {
  BROKER_URL: "ws://localhost:8080/ws",
  CONNECT_HEADER: {
    username: "1234",
    password: "1234",
    "heart-beat": "10000,10000",
  },
  DESTINATION_URI: {
    GAME_URI: "/recv/game",
    IMAGE_DATA_URI: "/send/imgData",
    IMAGE_RESULT_URI: "/recv/imgResult",
    STATUS_URI: "/recv/status",
    RESULT_URI: "/recv/result",
  },
};

export interface IGameConfig {
  gameSessionId: string;
  opUserId: string;
  opUserDesc: string;
  opUserProfileImg: string;
  opUserTier: string;
}
