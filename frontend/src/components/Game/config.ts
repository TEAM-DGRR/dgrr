//Stomp
export const stompConfig = {
  CONNECT_HEADER: {
    "heart-beat": "10000,10000",
  },

  DESTINATION_URI: {
    MATCHING_URI: "/send/matching",
    GAME_URI: "/user/recv/game",
    IMAGE_DATA_URI: "/send/imgData",
    IMAGE_RESULT_URI: "/user/recv/imgResult",
    STATUS_URI: "/user/recv/status",
    RESULT_URI: "/user/recv/result",
  },
  CAPTURE_INTERVAL: 1000,
};

//OpenVidu
export const openViduConfig = {
  APPLICATION_SERVER_URL: "",
  PUBLISHER_PROPERTIES: {
    audioSource: undefined,
    videoSource: undefined,
    publishAudio: true,
    publishVideo: true,
    resolution: "1280x720",
    frameRate: 60,
    insertMode: "APPEND",
    mirror: true,
  },
};
