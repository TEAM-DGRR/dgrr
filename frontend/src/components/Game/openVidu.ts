import axios from "axios";
import { openViduConfig } from "./config";
import { OpenVidu, Subscriber } from "openvidu-browser";

const { APPLICATION_SERVER_URL, PUBLISHER_PROPERTIES } = openViduConfig;

export const createSession = async (sessionId: string): Promise<string> => {
  const response = await axios.post(
    APPLICATION_SERVER_URL + "api/sessions",
    { customSessionId: sessionId },
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.data; // The sessionId
};

export const createToken = async (sessionId: string): Promise<string> => {
  const response = await axios.post(
    APPLICATION_SERVER_URL + "api/sessions/" + sessionId + "/connections",
    {},
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.data; // The token
};

export const getToken = async (mySessionId: string) => {
  const sessionId = await createSession(mySessionId);
  return await createToken(sessionId);
};

export const joinSession = async (token: string, myUserName: string) => {
  const OV = new OpenVidu();
  const session = OV.initSession();

  // let subscriber: Subscriber | undefined = undefined;
  // session.on("streamCreated", (event) => {
  //   subscriber = session.subscribe(event.stream, undefined);
  // });

  session.on("exception", (exception) => {
    console.warn(exception);
  });

  // const token = await getToken(sessionId);
  await session.connect(token, { clientData: myUserName });

  let publisher = await OV.initPublisherAsync(undefined, PUBLISHER_PROPERTIES);

  session.publish(publisher);

  const devices = await OV.getDevices();
  const videoDevices = devices.filter((device) => device.kind === "videoinput");
  const currentVideoDeviceId = publisher.stream
    .getMediaStream()
    .getVideoTracks()[0]
    .getSettings().deviceId;
  const currentVideoDevice = videoDevices.find(
    (device) => device.deviceId === currentVideoDeviceId
  );

  return { session, publisher, currentVideoDevice };
};
