package live.dgrr.domain.game.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import live.dgrr.global.utils.Rank;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter @AllArgsConstructor
public class GameRoomMember {

    @JsonIgnore
    private String principalName;
    @JsonIgnore
    private Long memberId;
    private String nickname;
    private String image;
    private String description;
    private int rating;
    private Rank rank;
}
