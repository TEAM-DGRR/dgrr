import React, { useEffect, useRef } from "react";
import { StreamManager } from "openvidu-browser";

interface IUserVideoComponent {
  streamManager: StreamManager;
  onGetVideoRef?: Function;
}

export const UserVideoComponent = ({ onGetVideoRef, streamManager }: IUserVideoComponent) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  if (onGetVideoRef !== undefined) onGetVideoRef(videoRef);

  useEffect(() => {
    if (streamManager && !!videoRef.current) {
      streamManager.addVideoElement(videoRef.current);
    }
  }, [streamManager]);

  return (
    <div className="streamcomponent">
      <video autoPlay={true} ref={videoRef} />
    </div>
  );
};
