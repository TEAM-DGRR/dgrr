import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { StreamManager } from "openvidu-browser";
import { ChildMethods } from "pages/GamePages/GamePlay";

interface IUserVideoComponent {
  streamManager: StreamManager | undefined;
}

export const UserVideoComponent = forwardRef<ChildMethods, IUserVideoComponent>(
  ({ streamManager }: IUserVideoComponent, ref) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    // 외부에서 사용할 함수 또는 프로퍼티 정의
    useImperativeHandle(ref, () => ({
      // 외부에서 video 요소에 접근할 수 있는 함수 제공
      getVideoElement: () => {
        return videoRef.current;
      },
    }));

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
  }
);
