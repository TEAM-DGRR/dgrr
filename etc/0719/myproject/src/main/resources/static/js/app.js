let stompClient = null;

function connectAndJoin(name) {
    var socket = new SockJS('/ws');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function(frame) {
        // '/topic/room' 주제를 구독하여 메시지를 처리하는 콜백 함수 등록
        stompClient.subscribe('/topic/room', function(roomUpdate) {
            console.log("connectAndJoin :: ", roomUpdate.body);
            handleRoomUpdate(JSON.parse(roomUpdate.body));
        });

        // Connect callback: 연결이 성립되었으므로 메시지를 보내도 안전합니다.
        stompClient.send("/app/join", {}, JSON.stringify({'name': name}));
    });
    console.log("웹소켓 연결에 성공하였습니다. ");
}

function join(name) {
    if (stompClient && stompClient.connected) {
        // 이미 연결된 상태이므로 메시지를 전송합니다.
        stompClient.send("/app/join", {}, JSON.stringify({'name': name}));
        console.log("join이 완료되었습니다. name: ", name);
    } else {
        // 연결되어 있지 않거나 연결이 끊어진 경우, 연결을 설정한 후 메시지를 전송합니다.
        console.log("웹 소켓 연결이 되어있지 않습니다. 연결을 시도합니다.");
        connectAndJoin(name);
    }
}

function handleRoomUpdate(room) {
    console.log("Room ID: " + room.roomId);
    console.log("Status: " + room.status);

    const members = room.members;
    for (let i = 0; i < members.length; i++) {
        console.log("Member " + (i + 1) + ": " + members[i].name);
    }

    if (room.status === "waiting") {
        console.log("매칭을 기다리는 중입니다.");
    } else if (room.status === "matched") {
        console.log("매칭이 완료되었습니다.");
        alert(members[0].name + "님과 " + members[1].name + "님과 매칭되었습니다.");
    }
}
