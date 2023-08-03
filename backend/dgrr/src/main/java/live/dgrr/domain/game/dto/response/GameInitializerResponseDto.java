package live.dgrr.domain.game.dto.response;

import live.dgrr.domain.game.entity.GameRoomUser;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class GameInitializerResponseDto {

    public GameInitializerResponseDto(GameRoomUser gameRoomUser, String gameSessionId, String openViduToken, LocalDateTime startTime) {
        this.success = "true";
        this.gameSessionId = gameSessionId;
        this.openViduToken = openViduToken;
        this.nickname = gameRoomUser.getNickname();
        this.profileImage = gameRoomUser.getImage();
        this.description = gameRoomUser.getDescription();
        this.rating = gameRoomUser.getRating();
        this.startTime = startTime;
    }

    private String success;
    private String gameSessionId;
    private String openViduToken;
    private String nickname;
    private String profileImage;
    private String description;
    private int rating;
    private LocalDateTime startTime;
}
