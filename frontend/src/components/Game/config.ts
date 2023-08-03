//Stomp
export const stompConfig = {
  BROKER_URL: "ws://localhost:8080/ws",
  CONNECT_HEADER: {
    username: "1234",
    password: "1234",
    "heart-beat": "10000,10000",
  },
  DESTINATION_URI: {
    GAME_URI: "/user/recv/game",
    IMAGE_DATA_URI: "/send/imgData",
    IMAGE_RESULT_URI: "user/recv/imgResult",
    STATUS_URI: "user/recv/status",
    RESULT_URI: "user/recv/result",
  },
};

export interface IGameConfig {
  gameSessionId: string;
  opUserId: string;
  opUserDesc: string;
  opUserProfileImg: string;
  opUserTier: string;
}

//OpenVidu
export const openViduConfig = {
  APPLICATION_SERVER_URL: "https://demos.openvidu.io/",
  PUBLISHER_PROPERTIES: {
    audioSource: undefined,
    videoSource: undefined,
    publishAudio: true,
    publishVideo: true,
    resolution: "640x480",
    frameRate: 30,
    insertMode: "APPEND",
    mirror: false,
  },
};
