import { bufferToImage } from "./bufferToImage";

export const captureImage = async (
  videoRef: HTMLVideoElement,
  canvasRef: HTMLCanvasElement,
  callback: Function
) => {
  const videoElement = videoRef;
  const canvasElement = canvasRef;
  canvasElement.width = videoElement.videoWidth;
  canvasElement.height = videoElement.videoHeight;
  const context = canvasElement.getContext("2d");
  context?.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

  canvasElement.toBlob((blob) => {
    bufferToImage(blob)
      .then((base64data) => {
        callback(base64data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, "image/png");
};
