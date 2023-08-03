package live.dgrr.domain.game.service;

import live.dgrr.domain.game.dto.response.GameInitializerResponseDto;
import live.dgrr.domain.game.entity.GameRoom;
import live.dgrr.domain.game.entity.GameRoomUser;
import live.dgrr.domain.game.entity.WaitingMember;
import live.dgrr.domain.openvidu.service.OpenViduService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.time.LocalDateTime;
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

    /**
     * Session 생성시 발생 이벤트
     * waitingQueue 에 삽입 or Queue 에 대기자 존재시 게임 시작.
     */

    public void handleMatchingRequest(String principalName) {
        Long memberId = 1L;

        WaitingMember nowWaitingMember = new WaitingMember(principalName,memberId);
        waitingQueue.offer(nowWaitingMember);

        log.info("Session Started: {}", principalName);

        if(waitingQueue.size() > 2) {
            WaitingMember waitingMemberOne = waitingQueue.poll();
            WaitingMember waitingMemberTwo = waitingQueue.poll();

            //Session 이 실제 살아있는지 확인

            gameStart(waitingMemberOne, waitingMemberTwo);
        }

    }

    private void gameStart(WaitingMember memberOne, WaitingMember memberTwo) {
        //GameRoom 생성.
        GameRoomUser roomUser1 = new GameRoomUser(memberOne.getPrincipalName(), memberOne.getMemberId(), "","","", 0);
        GameRoomUser roomUser2 = new GameRoomUser(memberTwo.getPrincipalName(), memberTwo.getMemberId(), "","","", 0);

        //GameSessionId 생성
        String gameSessionId = UUID.randomUUID().toString();
        GameRoom gameRoom = new GameRoom(roomUser1,roomUser2,gameSessionId);
        gameRoomMap.put(gameSessionId,gameRoom);

        //Openvidu 생성

        openViduService.createSession(gameSessionId);
        String openViduToken1 = openViduService.createConnection(gameSessionId);
        String openViduToken2 = openViduService.createConnection(gameSessionId);

        LocalDateTime now = LocalDateTime.now();

        //Client에 상대 user 정보, gameSessionId, openviduSession Token
        template.convertAndSendToUser(roomUser1.getPrincipalName(),"/recv/game", new GameInitializerResponseDto(roomUser1,gameSessionId,openViduToken1,now));
        template.convertAndSendToUser(roomUser2.getPrincipalName(),"/recv/game", new GameInitializerResponseDto(roomUser2,gameSessionId,openViduToken2,now));

    }
}
