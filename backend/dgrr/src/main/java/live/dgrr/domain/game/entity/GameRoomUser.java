package live.dgrr.domain.game.entity;

import live.dgrr.global.utils.Rank;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter @AllArgsConstructor
public class GameRoomUser {

    private String principalName;
    private Long memberId;
    private String nickname;
    private String image;
    private String description;
    private int rating;
    private Rank rank;
}
