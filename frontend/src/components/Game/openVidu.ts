// openVidu.ts

import axios from "axios";
import { OpenVidu, Session } from "openvidu-browser";
import { openViduConfig } from "./config";

const { APPLICATION_SERVER_URL, PUBLISHER_PROPERTIES } = openViduConfig;

// 세션을 생성하고 세션 ID를 반환
export const createSession = async (sessionId: string): Promise<string> => {
  const response = await axios.post(
    `${APPLICATION_SERVER_URL}api/sessions`,
    { customSessionId: sessionId },
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.data;
};

// 토큰을 생성하고 반환
export const createToken = async (sessionId: string): Promise<string> => {
  const response = await axios.post(
    `${APPLICATION_SERVER_URL}api/sessions/${sessionId}/connections`,
    {},
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.data;
};

// 세션 ID를 사용하여 토큰을 가져옴
export const getToken = async (mySessionId: string) => {
  const sessionId = await createSession(mySessionId);
  return await createToken(sessionId);
};

// 게임을 초기화하고 OpenVidu와 세션 객체를 반환
export const initGame = async () => {
  const OV = new OpenVidu();
  const session = OV.initSession();
  session.on("exception", (exception) => {
    console.warn(exception);
  });
  return { OV, session };
};

// 세션에 참여하고 발행자 및 현재 비디오 장치를 반환
export const joinSession = async (
  OV: OpenVidu,
  session: Session,
  token: string,
  myUserName: string
) => {
  await session.connect(token, { clientData: myUserName });

  const publisher = await OV.initPublisherAsync(undefined, PUBLISHER_PROPERTIES);
  session.publish(publisher);

  const devices = await OV.getDevices();
  const videoDevices = devices.filter(device => device.kind === "videoinput");
  const currentVideoDeviceId = publisher.stream.getMediaStream().getVideoTracks()[0].getSettings().deviceId;
  const currentVideoDevice = videoDevices.find(device => device.deviceId === currentVideoDeviceId);

  return { publisher, currentVideoDevice };
};
