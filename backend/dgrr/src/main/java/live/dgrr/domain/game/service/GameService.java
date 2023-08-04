package live.dgrr.domain.game.service;

import live.dgrr.domain.game.dto.response.GameInitializerResponseDto;
import live.dgrr.domain.game.entity.GameRoom;
import live.dgrr.domain.game.entity.GameRoomUser;
import live.dgrr.domain.game.entity.WaitingMember;
import live.dgrr.domain.game.entity.enums.RoundResult;
import live.dgrr.domain.game.entity.event.RoundEndEvent;
import live.dgrr.domain.openvidu.service.OpenViduService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneId;
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
    private final ApplicationEventPublisher publisher;

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

            //game 시작
            gameStart(waitingMemberOne, waitingMemberTwo);
        }

    }

    /**
     * 멤버 두명이 들어와서 GameRoom 생성
     * Openvidu 채널 생성
     * Client에 시작 정보 제공, 1라운드 스타트.
     */
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

        LocalDateTime now = LocalDateTime.now(ZoneId.of("UTC"));

        //Client에 상대 user 정보, gameSessionId, openviduSession Token, 선공여부
        template.convertAndSendToUser(roomUser1.getPrincipalName(),"/recv/game", new GameInitializerResponseDto(roomUser1,gameSessionId,openViduToken1,now,"first"));
        template.convertAndSendToUser(roomUser2.getPrincipalName(),"/recv/game", new GameInitializerResponseDto(roomUser2,gameSessionId,openViduToken2,now,"second"));
        runFirstRound(gameSessionId);
    }

    /**
    첫 라운드 시간이 다 되서 끝났을 시 이벤트 처리 로직.
     */
    @EventListener
    public void handleFirstRoundEndHoldBack(RoundEndEvent event) {
        log.info("eventListenerTime: {}", LocalDateTime.now());
        String gameSessionId = event.getGameSessionId();
        GameRoom gameRoom = gameRoomMap.get(gameSessionId);
        gameRoom.changeStatusFirstRoundEnded(LocalDateTime.now(), RoundResult.HOLD_BACK);
    }

    /**
     * 첫번째 라운드 시작하는 로직.
     */
    private void runFirstRound(String gameSessionId) {
        LocalDateTime recordStartTime = LocalDateTime.now();
        //시간 대기
        try {
            Thread.sleep(10000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        LocalDateTime recordEndTime = LocalDateTime.now();
        Duration between = Duration.between(recordStartTime, recordEndTime);
        log.info("Time Passed: {}", between.getSeconds());
        log.info("timebefore Publish: {}", recordEndTime);

        //대기 후 라운드 종료 알리는 이벤트 발생.
        publisher.publishEvent(new RoundEndEvent(gameSessionId));
    }
}
