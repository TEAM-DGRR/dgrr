package live.dgrr.domain.game.service;

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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.socket.client.WebSocketClient;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;

import java.lang.reflect.Type;
import java.util.concurrent.*;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Transactional
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
        if(stompSession1 != null && stompSession1.isConnected()) {
            stompSession1.disconnect();
        }
        if(stompSession2 != null && stompSession2.isConnected()) {
            stompSession2.disconnect();
        }
    }

    /**
     * 대량의 connection이 언결되었을 때 게임 생성 다 가능한지 체크
     */
    @Test
    public void bunchOfConnection() throws ExecutionException, InterruptedException, TimeoutException {
        BlockingQueue<String> blockingQueue = new LinkedBlockingQueue<>();
        CountDownLatch latch = new CountDownLatch(1);

        int numberOfConnection = 40;

        //Client array 생성, 초기화
        WebSocketStompClient[] clientArr = new WebSocketStompClient[numberOfConnection];
        for(int i = 0; i < numberOfConnection; i++) {
            clientArr[i] = new WebSocketStompClient(new StandardWebSocketClient());
        }

        //Session Arr 생성, 초기화
        StompSession[] sessionArr = new StompSession[numberOfConnection];
        for(int i = 0; i < numberOfConnection; i++) {
            sessionArr[i] = clientArr[i].connect(WEBSOCKET_URI, new StompSessionHandlerAdapter() {
            }).get(1, TimeUnit.SECONDS);
        }

        //Subscribe
        for(int i = 0; i < numberOfConnection; i++) {
            sessionArr[i].subscribe("/user/recv/game", new StompFrameHandler() {
                @Override
                public Type getPayloadType(StompHeaders headers) {
                    return byte[].class;
                }

                @Override
                public void handleFrame(StompHeaders headers, Object payload) {
                    blockingQueue.offer(new String((byte[]) payload));
                }
            });
        }
        String message = "m";
        for(int i = 0; i < numberOfConnection/2; i++) {
            sessionArr[i].send("/send/matching", message.getBytes());
            latch.await(1,TimeUnit.SECONDS);
        }
        latch.await(5, TimeUnit.SECONDS);
//        for(int i = 0; i < numberOfConnection/2; i++) {
//            sessionArr[i].send("/send/matching", message.getBytes());
//        }

        latch.await(4,TimeUnit.SECONDS);
        Assertions.assertThat(blockingQueue.size()).isEqualTo(numberOfConnection);
    }

    /**
     * GameRoom 만들어지고, gameSessionId 를 포함한 게임 시작 정보 전송이 되는지 테스트
     */
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
        latch.await(1,TimeUnit.SECONDS);
        stompSession2.send("/send/matching", confirmMessage.getBytes());

        latch.await(2,TimeUnit.SECONDS);
        Assertions.assertThat(blockingQueue.size()).isEqualTo(2);
    }

    /**
     * 웃지 않고 첫라운드가 끝까지 진행되는지 테스트
     */
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
        latch.await(1,TimeUnit.SECONDS);
        stompSession2.send("/send/matching", confirmMessage.getBytes());

        latch.await(ROUND_TIME + 2,TimeUnit.SECONDS);

        //도착한 메세지의 result 값이 "HOLD_BACK" 인지 확인
        String poll = blockingQueue.poll();
        JSONObject json = new JSONObject(poll);
        String result = json.getString("result");
        Assertions.assertThat(result).isEqualTo("HOLD_BACK");
    }

    /**
     * 웃은 경우 첫라운드 상태가 잘 전환되는지 테스트
     */
    @Test
    public void firstRoundEndLaugh() throws ExecutionException, InterruptedException, TimeoutException, JSONException {
        BlockingQueue<String> blockingQueue1 = new LinkedBlockingQueue<>();
        BlockingQueue<String> blockingQueue2 = new LinkedBlockingQueue<>();

        CountDownLatch latch = new CountDownLatch(1);
        stompSession1 = null;
        stompSession2 = null;
        //세션 2 명 열기.
        stompSession1 = stompClient1.connect(WEBSOCKET_URI, new StompSessionHandlerAdapter() {
        }).get(1, TimeUnit.SECONDS);
        stompSession2 = stompClient1.connect(WEBSOCKET_URI, new StompSessionHandlerAdapter() {
        }).get(1, TimeUnit.SECONDS);

        //gameSessionId 를 받기위해 subscribe
        stompSession1.subscribe("/user/recv/game", new StompFrameHandler() {
            @Override
            public Type getPayloadType(StompHeaders headers) {
                return byte[].class;
            }

            @Override
            public void handleFrame(StompHeaders headers, Object payload) {
                blockingQueue1.offer(new String((byte[]) payload));
            }
        });

        //1라운드 결과 subscribe
        stompSession1.subscribe("/user/recv/status", new StompFrameHandler() {
            @Override
            public Type getPayloadType(StompHeaders headers) {
                return byte[].class;
            }

            @Override
            public void handleFrame(StompHeaders headers, Object payload) {
                blockingQueue2.offer(new String((byte[]) payload));
            }
        });
        stompSession2.subscribe("/user/recv/status", new StompFrameHandler() {
            @Override
            public Type getPayloadType(StompHeaders headers) {
                return byte[].class;
            }

            @Override
            public void handleFrame(StompHeaders headers, Object payload) {
                blockingQueue2.offer(new String((byte[]) payload));
            }
        });

        //매칭 시그널 전송.
        String confirmMessage = "sent Message";
        stompSession1.send("/send/matching", confirmMessage.getBytes());
        latch.await(1,TimeUnit.SECONDS);
        stompSession2.send("/send/matching", confirmMessage.getBytes());

        latch.await(1,TimeUnit.SECONDS);

        //도착한 게임 세션 아이디 저장.
        String poll = blockingQueue1.poll();
        JSONObject json = new JSONObject(poll);
        String gameSessionId = json.getString("gameSessionId");
        //웃음판정 메세지 전송.
        stompSession1.send("/send/imgTest", gameSessionId.getBytes());

        //첫번째 라운드 결과가 웃음 이라고 판정났는지 확인.
        latch.await(ROUND_TIME + 2,TimeUnit.SECONDS);
        String firstRoundResult = blockingQueue2.poll();
        JSONObject firstRoundJson = new JSONObject(firstRoundResult);
        String result = firstRoundJson.getString("result");
        Assertions.assertThat(result).isEqualTo("LAUGH");
    }

    /**
     * 아무도 웃지 않고 둘째라운드가 끝까지 진행되는지 테스트
     */
    @Test
    public void totalRoundHoldBack() throws ExecutionException, InterruptedException, TimeoutException, JSONException {
        BlockingQueue<String> blockingQueue1 = new LinkedBlockingQueue<>();
        BlockingQueue<String> blockingQueue2 = new LinkedBlockingQueue<>();

        CountDownLatch latch = new CountDownLatch(1);
        stompSession1 = null;
        stompSession2 = null;
        //세션 2 명 열기.
        stompSession1 = stompClient1.connect(WEBSOCKET_URI, new StompSessionHandlerAdapter() {
        }).get(1, TimeUnit.SECONDS);
        stompSession2 = stompClient1.connect(WEBSOCKET_URI, new StompSessionHandlerAdapter() {
        }).get(1, TimeUnit.SECONDS);

        //gameSessionId 를 받기위해 subscribe
        stompSession1.subscribe("/user/recv/game", new StompFrameHandler() {
            @Override
            public Type getPayloadType(StompHeaders headers) {
                return byte[].class;
            }

            @Override
            public void handleFrame(StompHeaders headers, Object payload) {
                blockingQueue1.offer(new String((byte[]) payload));
            }
        });

        //2라운드 결과 subscribe
        stompSession1.subscribe("/user/recv/result", new StompFrameHandler() {
            @Override
            public Type getPayloadType(StompHeaders headers) {
                return byte[].class;
            }

            @Override
            public void handleFrame(StompHeaders headers, Object payload) {
                blockingQueue2.offer(new String((byte[]) payload));
            }
        });

        //매칭 시그널 전송.
        String confirmMessage = "sent Message";
        stompSession1.send("/send/matching", confirmMessage.getBytes());
        latch.await(1,TimeUnit.SECONDS);
        stompSession2.send("/send/matching", confirmMessage.getBytes());

        latch.await(1,TimeUnit.SECONDS);

        //도착한 게임 세션 아이디 저장.
        String poll = blockingQueue1.poll();
        JSONObject json = new JSONObject(poll);
        String gameSessionId = json.getString("gameSessionId");

        //게임 최종 결과가 비김 판정났는지 확인.
        latch.await(ROUND_TIME*2 + 4,TimeUnit.SECONDS);
        String secondRoundResult = blockingQueue2.poll();
        JSONObject firstRoundJson = new JSONObject(secondRoundResult);
        String result = firstRoundJson.getString("gameResult");
        Assertions.assertThat(result).isEqualTo("DRAW");
    }

    /**
     * 첫번째 라운드만 웃은 경우 결과 테스트
     */
    @Test
    public void onlyFirstRoundLaugh() throws ExecutionException, InterruptedException, TimeoutException, JSONException {
        BlockingQueue<String> blockingQueue1 = new LinkedBlockingQueue<>();
        BlockingQueue<String> blockingQueue2 = new LinkedBlockingQueue<>();

        CountDownLatch latch = new CountDownLatch(1);
        stompSession1 = null;
        stompSession2 = null;
        //세션 2 명 열기.
        stompSession1 = stompClient1.connect(WEBSOCKET_URI, new StompSessionHandlerAdapter() {
        }).get(1, TimeUnit.SECONDS);
        stompSession2 = stompClient1.connect(WEBSOCKET_URI, new StompSessionHandlerAdapter() {
        }).get(1, TimeUnit.SECONDS);

        //gameSessionId 를 받기위해 subscribe
        stompSession1.subscribe("/user/recv/game", new StompFrameHandler() {
            @Override
            public Type getPayloadType(StompHeaders headers) {
                return byte[].class;
            }

            @Override
            public void handleFrame(StompHeaders headers, Object payload) {
                blockingQueue1.offer(new String((byte[]) payload));
            }
        });

        //2라운드 결과 subscribe
        stompSession1.subscribe("/user/recv/result", new StompFrameHandler() {
            @Override
            public Type getPayloadType(StompHeaders headers) {
                return byte[].class;
            }

            @Override
            public void handleFrame(StompHeaders headers, Object payload) {
                blockingQueue2.offer(new String((byte[]) payload));
            }
        });

        //매칭 시그널 전송.
        String confirmMessage = "sent Message";
        stompSession1.send("/send/matching", confirmMessage.getBytes());
        latch.await(1,TimeUnit.SECONDS);
        stompSession2.send("/send/matching", confirmMessage.getBytes());

        latch.await(1,TimeUnit.SECONDS);

        //도착한 게임 세션 아이디 저장.
        String poll = blockingQueue1.poll();
        JSONObject json = new JSONObject(poll);
        String gameSessionId = json.getString("gameSessionId");

        //웃음판정 메세지 전송.
        stompSession1.send("/send/imgTest", gameSessionId.getBytes());

        //게임 최종 결과가 MemberOne 이 승리 판정인지 확인
        latch.await(ROUND_TIME*2 + 4,TimeUnit.SECONDS);
        String secondRoundResult = blockingQueue2.poll();
        JSONObject firstRoundJson = new JSONObject(secondRoundResult);
        String result = firstRoundJson.getString("gameResult");
        Assertions.assertThat(result).isEqualTo("WIN");
    }

    /**
     * 두번째 라운드만 웃은 경우 결과 테스트
     */
    @Test
    public void onlySecondRoundLaugh() throws ExecutionException, InterruptedException, TimeoutException, JSONException {
        BlockingQueue<String> blockingQueue1 = new LinkedBlockingQueue<>();
        BlockingQueue<String> blockingQueue2 = new LinkedBlockingQueue<>();

        CountDownLatch latch = new CountDownLatch(1);
        stompSession1 = null;
        stompSession2 = null;
        //세션 2 명 열기.
        stompSession1 = stompClient1.connect(WEBSOCKET_URI, new StompSessionHandlerAdapter() {
        }).get(1, TimeUnit.SECONDS);
        stompSession2 = stompClient1.connect(WEBSOCKET_URI, new StompSessionHandlerAdapter() {
        }).get(1, TimeUnit.SECONDS);

        //gameSessionId 를 받기위해 subscribe
        stompSession1.subscribe("/user/recv/game", new StompFrameHandler() {
            @Override
            public Type getPayloadType(StompHeaders headers) {
                return byte[].class;
            }

            @Override
            public void handleFrame(StompHeaders headers, Object payload) {
                blockingQueue1.offer(new String((byte[]) payload));
            }
        });

        //2라운드 결과 subscribe
        stompSession1.subscribe("/user/recv/result", new StompFrameHandler() {
            @Override
            public Type getPayloadType(StompHeaders headers) {
                return byte[].class;
            }

            @Override
            public void handleFrame(StompHeaders headers, Object payload) {
                blockingQueue2.offer(new String((byte[]) payload));
            }
        });

        //매칭 시그널 전송.
        String confirmMessage = "sent Message";
        stompSession1.send("/send/matching", confirmMessage.getBytes());
        latch.await(1,TimeUnit.SECONDS);
        stompSession2.send("/send/matching", confirmMessage.getBytes());

        latch.await(1,TimeUnit.SECONDS);

        //도착한 게임 세션 아이디 저장.
        String poll = blockingQueue1.poll();
        JSONObject json = new JSONObject(poll);
        String gameSessionId = json.getString("gameSessionId");

        latch.await(ROUND_TIME+1, TimeUnit.SECONDS);

        //웃음판정 메세지 전송.
        stompSession1.send("/send/imgTest2", gameSessionId.getBytes());

        //게임 최종 결과가 MemberOne이 패배 판정인지 확인
        latch.await(ROUND_TIME*2 + 4,TimeUnit.SECONDS);
        String secondRoundResult = blockingQueue2.poll();
        JSONObject firstRoundJson = new JSONObject(secondRoundResult);
        String result = firstRoundJson.getString("gameResult");
        Assertions.assertThat(result).isEqualTo("LOSE");
    }
}