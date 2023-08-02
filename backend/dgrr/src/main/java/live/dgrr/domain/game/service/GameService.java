package live.dgrr.domain.game.service;

import live.dgrr.domain.game.entity.GameRoom;
import live.dgrr.domain.game.entity.GameRoomUser;
import live.dgrr.domain.game.entity.WaitingMember;
import live.dgrr.domain.openvidu.service.OpenViduService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.lang.Nullable;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageHeaders;
import org.springframework.messaging.simp.SimpAttributesContextHolder;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.messaging.SessionConnectEvent;

import javax.annotation.PostConstruct;
import java.security.Principal;
import java.util.Map;
import java.util.Queue;
import java.util.UUID;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.ConcurrentHashMap;

@Service @Slf4j @RequiredArgsConstructor
public class GameService {

    private Queue<WaitingMember> waitingQueue;
    private Map<String, GameRoom> gameRoomMap;
    private final SimpMessagingTemplate template;
    private final OpenViduService openViduService;

    /**
    Bean 생성시, map 과 queue 초기화.
     */
    @PostConstruct
    private void initialize() {
        waitingQueue = new ArrayBlockingQueue<>(10);
        gameRoomMap = new ConcurrentHashMap<>();
    }

    public void printQ() {
        waitingQueue.forEach(System.out::println);
    }

    /**
     * Session 생성시 발생 이벤트
     * waitingQueue 에 삽입 or Queue 에 대기자 존재시 게임 시작.
     */
    @EventListener
    public void handleSessionConnected(SessionConnectEvent event) {
        Long memberId = 1L;

        SimpMessageHeaderAccessor wrap = SimpMessageHeaderAccessor.wrap(event.getMessage());
        Principal principal = wrap.getUser();

        WaitingMember nowWaitingMember = new WaitingMember(principal.getName(),memberId);
        waitingQueue.offer(nowWaitingMember);

        if(waitingQueue.size() > 2) {
            WaitingMember waitingMemberOne = waitingQueue.poll();
            WaitingMember waitingMemberTwo = waitingQueue.poll();
            gameStart(waitingMemberOne, waitingMemberTwo);
        }

    }

    private void gameStart(WaitingMember memberOne, WaitingMember memberTwo) {
        //GameRoom 생성.
        GameRoomUser roomUser1 = new GameRoomUser(memberOne.getPrincipalName(), memberOne.getMemberId(), "","","", 0);
        GameRoomUser roomUser2 = new GameRoomUser(memberTwo.getPrincipalName(), memberTwo.getMemberId(), "","","", 0);

        String gameSessionId = UUID.randomUUID().toString();
        GameRoom gameRoom = new GameRoom(roomUser1,roomUser2,gameSessionId);
        gameRoomMap.put(gameSessionId,gameRoom);
        //Openvidu 생성

        openViduService.createSession(gameSessionId);

        //Client에 시작 시그널, User 정보 전송.
        template.convertAndSendToUser(roomUser1.getPrincipalName(),"/recv/game", roomUser2);
        template.convertAndSendToUser(roomUser2.getPrincipalName(),"/recv/game", roomUser1);

    }
}
