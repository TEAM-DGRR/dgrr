package live.dgrr.domain.game.entity;

import live.dgrr.domain.game.entity.enums.GameStatus;
import live.dgrr.domain.game.entity.enums.RoundResult;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;

@Getter @Slf4j
public class GameRoom {

    public GameRoom(GameRoomMember userOne, GameRoomMember userTwo, String gameSessionId) {
        this.userOne = userOne;
        this.userTwo = userTwo;
        this.gameSessionId = gameSessionId;
        this.gameStatus = GameStatus.READY;
    }

    /**
     * UserOne 이 언제나 선공이다.
     */

    private final GameRoomMember userOne;
    private final GameRoomMember userTwo;

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
        firstRoundResult = result;
    }

    public void setFirstRoundStartTime(LocalDateTime firstRoundStartTime) {
        this.firstRoundStartTime = firstRoundStartTime;
    }

    public void setSecondRoundStartTime(LocalDateTime secondRoundStartTime) {
        this.secondRoundStartTime = secondRoundStartTime;
    }
}

