import React, { useEffect, useState, useRef } from "react";
// import logo from './assets/logo.svg';
import "./App.css";

function App() {
  // socket test
  const [socketConnected, setSocketConnected] = useState(false);
  const [sendMsg, setSendMsg] = useState(false);
  const [items, setItems] = useState([]);

  // const username = "1234";
  // const password = "1234";
  // const webSocketUrl = `ws://70.12.247.73:8080/ws`;
  // let ws = useRef(null);
  // let stompClient;
  // let socket;

  // function connect() {
  //   socket = new WebSocket("ws://localhost:8080/ws");
  //   stompClient = Stomp.over(socket);
  //   stompClient.connect({}, function(frame) {
  //     console.log("Connected: " + frame);
  //     stompClient.subscribe("/topic/messages", function(messageOutput) {
  //       console.log("Received: " + messageOutput.body);
  //     });
  //   });
  // }
  // function sendMessage() {
  //   stompClient.send("/app/receive", {}, JSON.stringify({ name: "test" }));
  // }

  // // 소켓 객체 생성
  // useEffect(() => {
  //   if (!socket) {
  //     // connect();
  //     // socket = new WebSocket(
  //     //   webSocketUrl +
  //     //     "?username=" +
  //     //     encodeURIComponent(username) +
  //     //     "&password=" +
  //     //     encodeURIComponent(password)
  //     // );
  //     socket.onopen = () => {
  //       console.log("connected to " + webSocketUrl);
  //       console.log(socket);

  //       sendMessage();
  //       setSocketConnected(true);
  //       // 서버에 구독 요청 메시지를 보냅니다.
  //       socket.send(JSON.stringify({ type: "SUBSCRIBE", topic: "/topic/messages" }));
  //       console.log("구독 완료");
  //       // 메시지 보내기
  //       var messageData = "안녕하세요, 서버!";
  //       var jsonData = JSON.stringify({
  //         emotion: "happy",
  //         confidence: 0.98,
  //       });
  //       console.log(jsonData);
  //       var message = `SEND\ndestination:/app/receive\n\n${jsonData}\0`;
  //       socket.send(message);
  //       socket.send(JSON.stringify({ type: "SEND", message: messageData }));
  //       socket.send("HelloWorld");
  //       console.log("메시지 전송 완료");
  //     };
  //     socket.onclose = (error) => {
  //       console.log("disconnect from " + webSocketUrl);
  //       console.log(error);
  //     };
  //     socket.onerror = (error) => {
  //       console.log("connection error " + webSocketUrl);
  //       console.log(error);
  //     };
  //     socket.onmessage = (evt) => {
  //       // const data = JSON.parse(evt.data);
  //       console.log(evt);
  //       // setItems((prevItems) => [...prevItems, evt]);
  //     };
  //   }

  //   // return () => {
  //   //   console.log("clean up");
  //   //   socket.close();
  //   // };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // // 소켓이 연결되었을 시에 send 메소드
  // useEffect(() => {
  //   if (socketConnected) {
  //     socket.send(
  //       JSON.stringify({
  //         message: sendMsg,
  //       })
  //     );

  //     setSendMsg(true);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [socketConnected]);

  // The width and height of the captured photo. We will set the
  // width to the value defined here, but the height will be
  // calculated based on the aspect ratio of the input stream.

  const width = 320; // We will scale the photo width to this
  let height = 0; // This will be computed based on the input stream

  // |streaming| indicates whether or not we're currently streaming
  // video from the camera. Obviously, we start at false.

  let streaming = false;

  // The various HTML elements we need to configure or control. These
  // will be set by the startup() function.

  let video = null;
  let canvas = null;
  let photo = null;
  let startbutton = null;

  function showViewLiveResultButton() {
    if (window.self !== window.top) {
      // Ensure that if our document is in a frame, we get the user
      // to first open it in its own tab or window. Otherwise, it
      // won't be able to request permission for camera access.
      document.querySelector(".contentarea").remove();
      const button = document.createElement("button");
      button.textContent = "View live result of the example code above";
      document.body.append(button);
      // eslint-disable-next-line no-restricted-globals
      button.addEventListener("click", () => window.open(location.href));
      return true;
    }
    return false;
  }

  function startup() {
    if (showViewLiveResultButton()) {
      return;
    }
    video = document.getElementById("video");
    canvas = document.getElementById("canvas");
    photo = document.getElementById("photo");
    startbutton = document.getElementById("startbutton");

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        console.error(`An error occurred: ${err}`);
      });

    video.addEventListener(
      "canplay",
      (ev) => {
        if (!streaming) {
          height = video.videoHeight / (video.videoWidth / width);

          // Firefox currently has a bug where the height can't be read from
          // the video, so we will make assumptions if this happens.

          if (isNaN(height)) {
            height = width / (4 / 3);
          }

          video.setAttribute("width", width);
          video.setAttribute("height", height);
          canvas.setAttribute("width", width);
          canvas.setAttribute("height", height);
          streaming = true;
        }
      },
      false
    );

    startbutton.addEventListener(
      "click",
      () => {
        setInterval(takepicture, 1000);
      },
      false
    );

    clearphoto();
  }

  // Fill the photo with an indication that none has been
  // captured.

  function clearphoto() {
    const context = canvas.getContext("2d");
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    const data = canvas.toDataURL("image/png");
    photo.setAttribute("src", data);
  }

  // Capture a photo by fetching the current contents of the video
  // and drawing it into a canvas, then converting that to a PNG
  // format data URL. By drawing it on an offscreen canvas and then
  // drawing that to the screen, we can change its size and/or apply
  // other changes before drawing it.

  function takepicture() {
    const context = canvas.getContext("2d");
    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);

      const data = canvas.toDataURL();
      console.log(data);
      photo.setAttribute("src", data);
      // canvas.toBlob((data) => {
      //   console.log(data);
      //   // url 생성
      //   const url = window.URL.createObjectURL(data); // blob:http://localhost:1234/28ff8746-94eb-4dbe-9d6c-2443b581dd30

      //   photo.setAttribute("src", url);
      //   // url 사용 후에 메모리에서 제거하기
      //   window.URL.revokeObjectURL(url);
      // });
    } else {
      clearphoto();
    }
  }

  // Set up our event listener to run the startup process
  // once loading is complete.
  window.addEventListener("load", startup, false);

  return (
    <div>
      <div className="contentarea">
        <div className="camera">
          <video id="video">Video stream not available.</video>
          <button id="startbutton">Take photo</button>
        </div>
        <canvas id="canvas"> </canvas>
        <div className="output">
          <img id="photo" alt="The screen capture will appear in this box." />
        </div>
      </div>
      <div>
        <div>socket</div>
        <div>socket connected : {`${socketConnected}`}</div>
        <div>res : </div>
        <div>
          {items.map((item) => {
            return <div>{JSON.stringify(item)}</div>;
          })}
        </div>
        <button className="attack">공격</button>
      </div>
    </div>
  );
}

export default App;
