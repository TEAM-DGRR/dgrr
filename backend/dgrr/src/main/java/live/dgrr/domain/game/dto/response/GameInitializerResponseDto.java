package live.dgrr.domain.game.dto.response;

import live.dgrr.domain.game.entity.GameRoomMember;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class GameInitializerResponseDto {

    public GameInitializerResponseDto(GameRoomMember myInfo,GameRoomMember enemyInfo, String gameSessionId, String openViduToken, LocalDateTime startTime, String turn) {
        this.myInfo = myInfo;
        this.enemyInfo = enemyInfo;
        this.success = "true";
        this.gameSessionId = gameSessionId;
        this.openViduToken = openViduToken;
        this.turn = turn;
        this.startTime = startTime;
    }

    private GameRoomMember myInfo;
    private GameRoomMember enemyInfo;

    private String success;
    private String gameSessionId;
    private String openViduToken;
    private String turn;
    private LocalDateTime startTime;
}
