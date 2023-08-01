import { OpenVidu, Publisher, Subscriber } from "openvidu-browser";
import { getToken } from "./getToken";

export const joinSession = async (sessionId: string, myUserName: string) => {
  const OV = new OpenVidu();
  const session = OV.initSession();

  let subscriber: Subscriber | undefined = undefined;
  session.on("streamCreated", (event) => {
    subscriber = session.subscribe(event.stream, undefined);
  });

  session.on("exception", (exception) => {
    console.warn(exception);
  });

  const token = await getToken(sessionId);
  await session.connect(token, { clientData: myUserName });

  let publisher = await OV.initPublisherAsync(undefined, {
    audioSource: undefined,
    videoSource: undefined,
    publishAudio: true,
    publishVideo: true,
    resolution: "640x480",
    frameRate: 30,
    insertMode: "APPEND",
    mirror: false,
  });

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

  return { session, publisher, subscriber, currentVideoDevice };
};
