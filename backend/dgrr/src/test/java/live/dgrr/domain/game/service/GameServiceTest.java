package live.dgrr.domain.game.service;

import live.dgrr.domain.game.entity.enums.RoundResult;
import org.assertj.core.api.Assertions;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.messaging.simp.stomp.*;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.web.socket.client.WebSocketClient;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;

import java.lang.reflect.Type;
import java.util.concurrent.*;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class GameServiceTest {

    private static final int ROUND_TIME = 3;
    String WEBSOCKET_URI;

    WebSocketStompClient stompClient1;
    WebSocketStompClient stompClient2;
    StompSession stompSession1;
    StompSession stompSession2;

    @LocalServerPort
    private Integer port;

    @BeforeEach
    void setUp() {
        WEBSOCKET_URI = "ws://localhost:" + port +"/ws";
        WebSocketClient webSocketClient = new StandardWebSocketClient();
        stompClient1 = new WebSocketStompClient(webSocketClient);

        WebSocketClient webSocketClient2 = new StandardWebSocketClient();
        stompClient2 = new WebSocketStompClient(webSocketClient2);

    }

    @AfterEach
    void clear() {
        if(stompSession1.isConnected()) {
            stompSession1.disconnect();
        }
        if(stompSession2 != null && stompSession2.isConnected()) {
            stompSession2.disconnect();
        }
    }

    @Test
    public void testGameRoomMade() throws ExecutionException, InterruptedException, TimeoutException {
        BlockingQueue<String> blockingQueue = new LinkedBlockingQueue<>();
        CountDownLatch latch = new CountDownLatch(1);
        stompSession1 = null;
        stompSession2 = null;
        //세션 2 명 열기.
        stompSession1 = stompClient1.connect(WEBSOCKET_URI, new StompSessionHandlerAdapter() {
        }).get(1, TimeUnit.SECONDS);
        stompSession2 = stompClient1.connect(WEBSOCKET_URI, new StompSessionHandlerAdapter() {
        }).get(1, TimeUnit.SECONDS);

        //세션 1,2 subscribe
        stompSession1.subscribe("/user/recv/game", new StompFrameHandler() {
            @Override
            public Type getPayloadType(StompHeaders headers) {
                return byte[].class;
            }

            @Override
            public void handleFrame(StompHeaders headers, Object payload) {
                blockingQueue.offer(new String((byte[]) payload));
            }
        });
        stompSession2.subscribe("/user/recv/game", new StompFrameHandler() {
            @Override
            public Type getPayloadType(StompHeaders headers) {
                return byte[].class;
            }

            @Override
            public void handleFrame(StompHeaders headers, Object payload) {
                blockingQueue.offer(new String((byte[]) payload));
            }
        });

        //매칭 시그널 전송.
        String confirmMessage = "sent Message";
        stompSession1.send("/send/matching", confirmMessage.getBytes());
        stompSession2.send("/send/matching", confirmMessage.getBytes());

        latch.await(1,TimeUnit.SECONDS);
        Assertions.assertThat(blockingQueue.size()).isEqualTo(2);
    }

    @Test
    public void firstRoundEndHoldBack() throws ExecutionException, InterruptedException, TimeoutException, JSONException {
        BlockingQueue<String> blockingQueue = new LinkedBlockingQueue<>();
        CountDownLatch latch = new CountDownLatch(1);
        stompSession1 = null;
        stompSession2 = null;
        //세션 2 명 열기.
        stompSession1 = stompClient1.connect(WEBSOCKET_URI, new StompSessionHandlerAdapter() {
        }).get(1, TimeUnit.SECONDS);
        stompSession2 = stompClient1.connect(WEBSOCKET_URI, new StompSessionHandlerAdapter() {
        }).get(1, TimeUnit.SECONDS);

        //세션 1,2 subscribe
        stompSession1.subscribe("/user/recv/status", new StompFrameHandler() {
            @Override
            public Type getPayloadType(StompHeaders headers) {
                return byte[].class;
            }

            @Override
            public void handleFrame(StompHeaders headers, Object payload) {
                blockingQueue.offer(new String((byte[]) payload));
            }
        });
        stompSession2.subscribe("/user/recv/status", new StompFrameHandler() {
            @Override
            public Type getPayloadType(StompHeaders headers) {
                return byte[].class;
            }

            @Override
            public void handleFrame(StompHeaders headers, Object payload) {
                blockingQueue.offer(new String((byte[]) payload));
            }
        });

        //매칭 시그널 전송.
        String confirmMessage = "sent Message";
        stompSession1.send("/send/matching", confirmMessage.getBytes());
        stompSession2.send("/send/matching", confirmMessage.getBytes());

        latch.await(ROUND_TIME + 2,TimeUnit.SECONDS);

        //도착한 메세지의 result 값이 "HOLD_BACK" 인지 확인
        String poll = blockingQueue.poll();
        JSONObject json = new JSONObject(poll);
        String result = json.getString("result");
        Assertions.assertThat(result).isEqualTo("HOLD_BACK");
    }
}