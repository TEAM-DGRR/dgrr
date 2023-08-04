async def connect_to_server(websocket):
    # /connect에 연결 요청 메시지 전송
    connect_message = "CONNECT\naccept-version:1.1,1.0\nheart-beat:10000,10000\n\n\0"
    await websocket.send(connect_message)

    # 연결 응답 대기 (ACK 메시지 수신)
    response = await websocket.recv()
    print(response)
    print("연결 완료!!!!")

    # /topic/messages 주제를 구독하는 메시지 전송
    subscribe_message = "SUBSCRIBE\nid:sub-0\ndestination:/recv/imgData\n\n\0"
    await websocket.send(subscribe_message)
    print("/recv/imgData uri를 구독합니다.")
