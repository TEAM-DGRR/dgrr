package live.dgrr.domain.game.service;

import live.dgrr.domain.battle.entity.Battle;
import live.dgrr.domain.battle.entity.BattleDetail;
import live.dgrr.domain.battle.entity.BattleType;
import live.dgrr.domain.battle.repository.BattleDetailRepository;
import live.dgrr.domain.battle.repository.BattleRepository;
import live.dgrr.domain.game.dto.response.GameFirstRoundEndResponseDto;
import live.dgrr.domain.game.dto.response.GameInitializerResponseDto;
import live.dgrr.domain.game.dto.response.GameResultResponseDto;
import live.dgrr.domain.game.entity.GameRoom;
import live.dgrr.domain.game.entity.GameRoomMember;
import live.dgrr.domain.game.entity.WaitingMember;
import live.dgrr.domain.game.entity.enums.GameResult;
import live.dgrr.domain.game.entity.enums.GameStatus;
import live.dgrr.domain.game.entity.enums.RoundResult;
import live.dgrr.domain.game.repository.GameRepository;
import live.dgrr.domain.image.entity.event.ImageResult;
import live.dgrr.domain.member.entity.Member;
import live.dgrr.domain.member.repository.MemberRepository;
import live.dgrr.domain.member.service.MemberService;
import live.dgrr.domain.openvidu.service.OpenViduService;
import live.dgrr.domain.rating.entity.Rating;
import live.dgrr.domain.rating.repository.RatingRepository;
import live.dgrr.domain.rating.service.RatingService;
import live.dgrr.global.utils.DgrrUtils;
import live.dgrr.global.utils.Rank;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service @Slf4j @RequiredArgsConstructor
public class GameService {

    private Map<String, GameRoom> gameRoomMap;
    private final SimpMessagingTemplate template;
    private final OpenViduService openViduService;
    private final GameRepository gameRepository;
    private final MemberService memberService;
    private final RatingService ratingService;
    private final RatingRepository ratingRepository;
    private final BattleRepository battleRepository;
    private final MemberRepository memberRepository;
    private final BattleDetailRepository battleDetailRepository;

    //단위 : 초
    private static final int FIRST_ROUND_TIME = 35;
    private static final int SECOND_ROUND_TIME = 35;

    //보상
    private static final int WIN_REWARD = 20;
    private static final int DRAW_REWARD = 5;
    private static final int LOSE_REWARD = 0;

    /**
    Bean 생성시, map 과 queue 초기화.
     */
    @PostConstruct
    private void initialize() {
        gameRoomMap = new ConcurrentHashMap<>();
    }

    /**
     * 매칭 버튼 클릭 시 실행.
     * waitingQueue 에 삽입 or Queue 에 대기자 존재시 게임 시작.
     */


    public void handleMatchingRequest(String principalName, String token) {
        log.info("Matching Session Started: {}", principalName);
        log.info("Matching Session Check Token:{}", token);
        Long memberId = memberService.getIdFromToken(token);
        log.info("Matching MemberId: {}", memberId);

        //신규 매칭 요청.
        WaitingMember nowWaitingMember = new WaitingMember(principalName, memberId);
        //db에 저장되어 있던 요청
        WaitingMember pollWaitingMember = gameRepository.poll();
        //만약 db에 저장되어 있던 요청이 없다면 신규 요청을 db에 저장하고 return
        if(pollWaitingMember == null) {
            gameRepository.saveQueue(nowWaitingMember);
            return;
        }
        //db에 저장되어 있던 요청이 존재한다면 게임 시작.
        gameStart(pollWaitingMember,nowWaitingMember);
    }

    /**
     * 멤버 두명이 들어와서 GameRoom 생성
     * Openvidu 채널 생성
     * Client에 시작 정보 제공, 1라운드 스타트.
     */
    private void gameStart(WaitingMember memberOne, WaitingMember memberTwo) {
        log.info("Game Started");
        //GameRoom 생성.
        Member member1 = memberService.getMemberByMemberId(memberOne.getMemberId()).get();
        Member member2 = memberService.getMemberByMemberId(memberTwo.getMemberId()).get();

        int ratingOne = ratingService.findRatingByMember(member1).get(0).getRating();
        int ratingTwo = ratingService.findRatingByMember(member2).get(0).getRating();

        GameRoomMember roomMember1 = new GameRoomMember(memberOne.getPrincipalName(),
                memberOne.getMemberId(), member1.getNickname(),member1.getProfileImage(),member1.getDescription(),
                ratingOne, DgrrUtils.rankCalculator(ratingOne));
        GameRoomMember roomMember2 = new GameRoomMember(memberTwo.getPrincipalName(),
                memberTwo.getMemberId(), member2.getNickname(),member2.getProfileImage(),member2.getDescription(),
                ratingTwo, DgrrUtils.rankCalculator(ratingTwo));

        log.info("GameRoomMemberOne: {}", roomMember1);
        log.info("GameRoomMemberTwo: {}", roomMember2);

        //GameSessionId 생성
        String gameSessionId = UUID.randomUUID().toString();
        GameRoom gameRoom = new GameRoom(roomMember1,roomMember2,gameSessionId);
        gameRoomMap.put(gameSessionId,gameRoom);

        //Openvidu 생성
        openViduService.createSession(gameSessionId);
        String openViduToken1 = openViduService.createConnection(gameSessionId);
        String openViduToken2 = openViduService.createConnection(gameSessionId);

        //첫번째 라운드 시간 생성.(UTC 기준)
        LocalDateTime firstRoundStartTime = LocalDateTime.now(ZoneId.of("UTC"));
        gameRoom.setFirstRoundStartTime(firstRoundStartTime.plusHours(9));

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
            Thread.sleep(FIRST_ROUND_TIME * 1000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        LocalDateTime recordEndTime = LocalDateTime.now();
        Duration between = Duration.between(recordStartTime, recordEndTime);
        log.info("First Round Time Passed: {}", between.getNano());

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

        //2라운드 시작 시간 설정.
        LocalDateTime secondRoundStartTime = LocalDateTime.now(ZoneId.of("UTC"));

        gameRoom.changeStatusFirstRoundEnded(secondRoundStartTime.plusHours(9), result);
        gameRoomMap.put(gameSessionId, gameRoom);

        //GameRound 변화 정보 전송
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
            Thread.sleep(SECOND_ROUND_TIME * 1000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        LocalDateTime recordEndTime = LocalDateTime.now();
        Duration between = Duration.between(recordStartTime, recordEndTime);
        log.info("Second Round Time Passed: {}", between.getNano());

        //대기 후 라운드 2라운드 종료 메소드 실행.
        handleSecondRoundEnd(gameSessionId, RoundResult.HOLD_BACK, 0);
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
        gameRoom.changeStatusSecondRoundEnded(LocalDateTime.now(ZoneId.of("UTC")).plusHours(9), result);
        gameRoomMap.put(gameSessionId, gameRoom);

        //게임 결과 처리.
        processGameResult(gameRoom);
    }

    /**
     * 게임 결과 처리후, 각 유저에게 결과내용 전송하는 메소드
     */
    private void processGameResult(GameRoom gameRoom) {
        //라운드별 진행 시간
        long firstRoundTime = Duration.between(gameRoom.getFirstRoundStartTime(), gameRoom.getFirstRoundEndTime()).toMillis();
        long secondRoundTime = Duration.between(gameRoom.getSecondRoundStartTime(), gameRoom.getSecondRoundEndTime()).toMillis();

        log.info("firstRoundTime: {}", firstRoundTime);
        log.info("secondRoundTime: {}", secondRoundTime);

        //멤버들 게임 결과 판정
        GameResult resultForMemberOne = judgeGameResult(gameRoom, firstRoundTime, secondRoundTime,true);
        GameResult resultForMemberTwo = judgeGameResult(gameRoom, firstRoundTime, secondRoundTime, false);

        //결과에 따른 reward 확인
        int memberOneReward = reward(resultForMemberOne);
        int memberTwoReward = reward(resultForMemberTwo);

        //Reward 이후 rank 변경사항.
        Rank memberOneAfterRank = DgrrUtils.rankCalculator(gameRoom.getMemberOne().getRating() + memberOneReward);
        Rank memberTwoAfterRank = DgrrUtils.rankCalculator(gameRoom.getMemberTwo().getRating() + memberTwoReward);

        //게임 결과 반환하는 DTO 생성
        GameResultResponseDto memberOneResultDto = new GameResultResponseDto(gameRoom.getMemberOne(), gameRoom.getMemberTwo(),
                firstRoundTime, secondRoundTime, resultForMemberOne, memberOneReward, memberOneAfterRank);
        GameResultResponseDto memberTwoResultDto = new GameResultResponseDto(gameRoom.getMemberTwo(), gameRoom.getMemberOne(),
                firstRoundTime, secondRoundTime, resultForMemberTwo, memberTwoReward, memberTwoAfterRank);

        //dto 전송
        template.convertAndSendToUser(gameRoom.getMemberOne().getPrincipalName(), "/recv/result", memberOneResultDto);
        template.convertAndSendToUser(gameRoom.getMemberTwo().getPrincipalName(), "/recv/result", memberTwoResultDto);

        //openvidu connection 종료
        openViduService.closeConnection(gameRoom.getGameSessionId());

        //아이디가 같으면 저장 안함.
        if(gameRoom.getMemberOne().getMemberId() == gameRoom.getMemberTwo().getMemberId()) {
            gameRoom = null;
            return;
        }

        //db에 battle 저장
        saveGameResult(gameRoom, firstRoundTime, secondRoundTime, resultForMemberOne, resultForMemberTwo, memberOneReward, memberTwoReward);

        //GameRoom 메모리 반환
        gameRoom = null;
    }

    @Transactional
    public void saveGameResult(GameRoom gameRoom, long firstRoundTime, long secondRoundTime, GameResult resultForMemberOne, GameResult resultForMemberTwo, int memberOneReward, int memberTwoReward) {
        Battle battle = new Battle(BattleType.ONE_ON_ONE, firstRoundTime + secondRoundTime);
        battleRepository.save(battle);

        //battleDetail 저장.
        Member memberOne = memberRepository.findById(gameRoom.getMemberOne().getMemberId()).get();
        Member memberTwo = memberRepository.findById(gameRoom.getMemberTwo().getMemberId()).get();


        BattleDetail battleDetailMemberOne = new BattleDetail(battle, memberOne, "FIRST", secondRoundTime,
                resultForMemberOne, 50L);
        BattleDetail battleDetailMemberTwo = new BattleDetail(battle, memberTwo, "SECOND", firstRoundTime,
                resultForMemberTwo, 50L);

        battleDetailRepository.save(battleDetailMemberOne);
        battleDetailRepository.save(battleDetailMemberTwo);

        Rating memberOneRating = ratingService.findById(gameRoom.getMemberOne().getMemberId()).get(0);
        Rating memberTwoRating = ratingService.findById(gameRoom.getMemberTwo().getMemberId()).get(0);

        memberOneRating.addRatingAfterGame(memberOneReward);
        memberTwoRating.addRatingAfterGame(memberTwoReward);

        ratingRepository.save(memberOneRating);
        ratingRepository.save(memberTwoRating);
    }

    /**
     * 게임 결과 판정 하는 로직
     */
    private GameResult judgeGameResult(GameRoom gameRoom, long firstRoundTime, long secondRoundTime, boolean userFlag) {
        //둘 다 안 웃은 경우
        if(gameRoom.getFirstRoundResult() == RoundResult.HOLD_BACK
        && gameRoom.getSecondRoundResult() == RoundResult.HOLD_BACK) {
            return GameResult.DRAW;
        }

        //MemberOne만 웃은 경우
        if(gameRoom.getFirstRoundResult() == RoundResult.HOLD_BACK) {
            if(userFlag) {
                return GameResult.LOSE;
            }
            return GameResult.WIN;
        }
        //MemberTwo 만 웃은 경우
        if(gameRoom.getSecondRoundResult() == RoundResult.HOLD_BACK) {
            if(userFlag) {
                return GameResult.WIN;
            }
            return GameResult.LOSE;
        }

        //두 명다 웃은경우
        //MemberOne이 더 빨리 웃은경우
        if(firstRoundTime >  secondRoundTime) {
            if(userFlag) {
                return GameResult.LOSE;
            }
            return GameResult.WIN;
        }
        //MemberTwo가 더 빨리 웃은경우
        if(firstRoundTime < secondRoundTime) {
            if(userFlag) {
                return GameResult.WIN;
            }
            return GameResult.LOSE;
        }

        return GameResult.INVALID;
    }

    /**
     * 게임 Reward 반환하는 로직
     */
    private int reward(GameResult result) {
        if(result == GameResult.WIN) {
            return WIN_REWARD;
        }
        if(result == GameResult.DRAW) {
            return DRAW_REWARD;
        }
        return LOSE_REWARD;
    }

    /**
     * 이미지 전송 로직
     */
    public void sendImageResult(String gameSessionId, ImageResult imageResult) {
        if(!gameRoomMap.containsKey(gameSessionId)) {
            return;
        }
        GameRoom gameRoom = gameRoomMap.get(gameSessionId);
        template.convertAndSendToUser(gameRoom.getMemberOne().getPrincipalName(), "/recv/imgResult",imageResult);
        template.convertAndSendToUser(gameRoom.getMemberTwo().getPrincipalName(), "/recv/imgResult", imageResult);
    }
}
