package live.dgrr.domain.game.service;

import live.dgrr.domain.game.dto.response.GameFirstRoundEndResponseDto;
import live.dgrr.domain.game.dto.response.GameInitializerResponseDto;
import live.dgrr.domain.game.dto.response.GameResultResponseDto;
import live.dgrr.domain.game.entity.GameRoom;
import live.dgrr.domain.game.entity.GameRoomMember;
import live.dgrr.domain.game.entity.WaitingMember;
import live.dgrr.domain.game.entity.enums.GameResult;
import live.dgrr.domain.game.entity.enums.GameStatus;
import live.dgrr.domain.game.entity.enums.RoundResult;
import live.dgrr.domain.game.entity.event.FirstRoundEndEvent;
import live.dgrr.domain.game.entity.event.SecondRoundEndEvent;
import live.dgrr.domain.openvidu.service.OpenViduService;
import live.dgrr.global.utils.Rank;
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
     * 매칭 버튼 클릭 시 실행.
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
        GameRoomMember roomMember1 = new GameRoomMember(memberOne.getPrincipalName(),
                memberOne.getMemberId(), "","","", 0, Rank.BRONZE);
        GameRoomMember roomMember2 = new GameRoomMember(memberTwo.getPrincipalName(),
                memberTwo.getMemberId(), "","","", 0, Rank.BRONZE);

        //GameSessionId 생성
        String gameSessionId = UUID.randomUUID().toString();
        GameRoom gameRoom = new GameRoom(roomMember1,roomMember2,gameSessionId);
        gameRoomMap.put(gameSessionId,gameRoom);

        //Openvidu 생성

        openViduService.createSession(gameSessionId);
        String openViduToken1 = openViduService.createConnection(gameSessionId);
        String openViduToken2 = openViduService.createConnection(gameSessionId);

        LocalDateTime firstRoundStartTime = LocalDateTime.now(ZoneId.of("UTC"));
        gameRoom.setFirstRoundStartTime(firstRoundStartTime);

        //Client에 상대 user 정보, gameSessionId, openviduSession Token, 선공여부
        template.convertAndSendToUser(roomMember1.getPrincipalName(),"/recv/game",
                new GameInitializerResponseDto(roomMember1, roomMember2, gameSessionId,openViduToken1,firstRoundStartTime,"first"));
        template.convertAndSendToUser(roomMember2.getPrincipalName(),"/recv/game",
                new GameInitializerResponseDto(roomMember2, roomMember1, gameSessionId,openViduToken2,firstRoundStartTime,"second"));

        //1라운드 시작
        runFirstRound(gameSessionId);
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
        log.info("First Round Time Passed: {}", between.getSeconds());

        //대기 후 라운드 종료 알리는 이벤트 발생.
        handleFirstRoundEnd(gameSessionId, RoundResult.HOLD_BACK, 0);
    }

    /**
     첫 라운드 시간이 다 되서 끝났을 시 메소드.
     */
    public void handleFirstRoundEnd(String gameSessionId, RoundResult result, double probability) {
        //gameRoom 객체 동시성 관리
        if(!gameRoomMap.containsKey(gameSessionId)) {
            return;
        }
        GameRoom gameRoom = gameRoomMap.get(gameSessionId);
        if(gameRoom.getGameStatus() == GameStatus.SECOND_ROUND) {
            return;
        }
        gameRoomMap.remove(gameSessionId);
        gameRoom.changeStatusFirstRoundEnded(LocalDateTime.now(), result);
        gameRoomMap.put(gameSessionId, gameRoom);

        //GameRound 변화 정보 전송
        LocalDateTime secondRoundStartTime = LocalDateTime.now();
        template.convertAndSendToUser(gameRoom.getMemberOne().getPrincipalName(), "/recv/status",
                new GameFirstRoundEndResponseDto("round changed", gameRoom.getFirstRoundResult(),secondRoundStartTime));
        template.convertAndSendToUser(gameRoom.getMemberTwo().getPrincipalName(), "/recv/status",
                new GameFirstRoundEndResponseDto("round changed", gameRoom.getFirstRoundResult(),secondRoundStartTime));

        //두번째 라운드 시작.
        runSecondRound(gameSessionId);
    }

    /**
     * 두번째 라운드 시작하는 로직.
     */
    private void runSecondRound(String gameSessionId) {
        LocalDateTime recordStartTime = LocalDateTime.now();
        //시간 대기
        try {
            Thread.sleep(10000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        LocalDateTime recordEndTime = LocalDateTime.now();
        Duration between = Duration.between(recordStartTime, recordEndTime);
        log.info("Second Round Time Passed: {}", between.getSeconds());

        //대기 후 라운드 2라운드 종료 메소드 실행.
        handleSecondRoundEnd(gameSessionId, RoundResult.LAUGH, 0);
    }

    /**
     두번째 라운드 종료 처리 메소드.
     */
    public void handleSecondRoundEnd(String gameSessionId, RoundResult result, double probability) {
        //gameRoom 객체 동시성 관리
        if(!gameRoomMap.containsKey(gameSessionId)) {
            return;
        }
        GameRoom gameRoom = gameRoomMap.get(gameSessionId);
        if(gameRoom.getGameStatus() == GameStatus.END) {
            return;
        }
        gameRoomMap.remove(gameSessionId);
        gameRoom.changeStatusSecondRoundEnded(LocalDateTime.now(), result);
        gameRoomMap.put(gameSessionId, gameRoom);

        //게임 결과 처리.
        processGameResult(gameRoom);
    }

    /**
     * 게임 결과 처리후, 각 유저에게 결과내용 전송하는 메소드
     */
    private void processGameResult(GameRoom gameRoom) {
        long firstRoundTime = Duration.between(gameRoom.getFirstRoundStartTime(), gameRoom.getFirstRoundEndTime()).toMillis();
        long secondRoundTime = Duration.between(gameRoom.getFirstRoundStartTime(), gameRoom.getFirstRoundEndTime()).toMillis();

        GameResult result = judgeGameResult(gameRoom);

        GameResultResponseDto memberOneResultDto = new GameResultResponseDto(gameRoom.getMemberOne(), gameRoom.getMemberTwo(),
                firstRoundTime, secondRoundTime, result, 20, Rank.BRONZE);
        GameResultResponseDto memberTwoResultDto = new GameResultResponseDto(gameRoom.getMemberTwo(), gameRoom.getMemberOne(),
                firstRoundTime, secondRoundTime, result, 20, Rank.BRONZE);

        template.convertAndSendToUser(gameRoom.getMemberOne().getPrincipalName(), "/recv/result", memberOneResultDto);
        template.convertAndSendToUser(gameRoom.getMemberTwo().getPrincipalName(), "/recv/result", memberTwoResultDto);
    }

    /**
     * 게임 결과 판정 하는 로직
     */
    private GameResult judgeGameResult(GameRoom gameRoom) {
        return GameResult.DRAW;
    }
}
