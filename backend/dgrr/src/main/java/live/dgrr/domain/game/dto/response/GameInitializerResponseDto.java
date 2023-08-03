package live.dgrr.domain.game.dto.response;

import live.dgrr.domain.game.entity.GameRoomUser;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class GameInitializerResponseDto {

    public GameInitializerResponseDto(GameRoomUser gameRoomUser, String gameSessionId, String openViduToken, LocalDateTime startTime, String turn) {
        this.gameRoomUser = gameRoomUser;
        this.success = "true";
        this.gameSessionId = gameSessionId;
        this.openViduToken = openViduToken;
        this.turn = turn;
        this.startTime = startTime;
    }

    GameRoomUser gameRoomUser;

    private String success;
    private String turn;
    private String gameSessionId;
    private String openViduToken;
    private LocalDateTime startTime;
}
