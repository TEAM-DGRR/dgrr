package live.dgrr.domain.game.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter @AllArgsConstructor
public class GameRoomUser {


    private String sessionId;
    private Long memberId;
    private String nickname;
    private String image;
    private String description;
    private int rating;
}
