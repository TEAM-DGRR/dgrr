package live.dgrr.domain.game.entity;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

import java.time.Duration;
import java.time.LocalDateTime;

@Getter @Slf4j
public class GameRoom {

    public GameRoom(GameRoomUser userOne, GameRoomUser userTwo, String gameSessionId) {
        this.userOne = userOne;
        this.userTwo = userTwo;
        this.gameSessionId = gameSessionId;
        this.gameStatus = GameStatus.READY;
    }

    /**
     * UserOne 이 언제나 선공이다.
     */

    private final GameRoomUser userOne;
    private final GameRoomUser userTwo;

    private final String gameSessionId;
    private GameStatus gameStatus;
    private LocalDateTime firstRoundStartTime;
    private LocalDateTime firstLaughTime;
    private LocalDateTime secondRoundStartTime;
    private LocalDateTime secondLaughTime;

    //일라운드 진행 메소드
    public void runFirstRound() {
        LocalDateTime recordStartTime = LocalDateTime.now();
        try {
            Thread.sleep(10000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        LocalDateTime recordEndTime = LocalDateTime.now();
        Duration between = Duration.between(recordStartTime, recordEndTime);
        log.info("Time Passed: {}", between.getSeconds());
    }

    public void setGameStatus(GameStatus gameStatus) {
        this.gameStatus = gameStatus;
    }

    public void setFirstRoundStartTime(LocalDateTime firstRoundStartTime) {
        this.firstRoundStartTime = firstRoundStartTime;
    }

    public void setFirstLaughTime(LocalDateTime firstLaughTime) {
        this.firstLaughTime = firstLaughTime;
    }

    public void setSecondRoundStartTime(LocalDateTime secondRoundStartTime) {
        this.secondRoundStartTime = secondRoundStartTime;
    }

    public void setSecondLaughTime(LocalDateTime secondLaughTime) {
        this.secondLaughTime = secondLaughTime;
    }
}

