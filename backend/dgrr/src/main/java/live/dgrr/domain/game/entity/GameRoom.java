package live.dgrr.domain.game.entity;

import live.dgrr.domain.game.entity.enums.GameStatus;
import live.dgrr.domain.game.entity.enums.RoundResult;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;

@Getter @Slf4j
public class GameRoom {

    public GameRoom(GameRoomMember memberOne, GameRoomMember memberTwo, String gameSessionId) {
        this.memberOne = memberOne;
        this.memberTwo = memberTwo;
        this.gameSessionId = gameSessionId;
        this.gameStatus = GameStatus.FIRST_ROUND;
    }

    /**
     * memberOne 이 언제나 선공이다.
     */
    private final GameRoomMember memberOne;
    private final GameRoomMember memberTwo;

    private final String gameSessionId;
    private GameStatus gameStatus;
    private LocalDateTime firstRoundStartTime;
    private LocalDateTime firstRoundEndTime;
    private RoundResult firstRoundResult;
    private LocalDateTime secondRoundStartTime;
    private LocalDateTime secondRoundEndTime;
    private RoundResult secondRoundResult;

    public void changeStatusFirstRoundEnded(LocalDateTime time, RoundResult result) {
        gameStatus = GameStatus.SECOND_ROUND;
        firstRoundEndTime = time;
        secondRoundStartTime = time;
        firstRoundResult = result;
    }

    public void changeStatusSecondRoundEnded(LocalDateTime time, RoundResult result) {
        gameStatus = GameStatus.END;
        secondRoundEndTime = time;
        secondRoundResult = result;
    }

    public void setFirstRoundStartTime(LocalDateTime firstRoundStartTime) {
        this.firstRoundStartTime = firstRoundStartTime;
    }
}

