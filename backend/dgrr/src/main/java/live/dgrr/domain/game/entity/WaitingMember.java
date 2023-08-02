package live.dgrr.domain.game.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter @AllArgsConstructor
public class WaitingMember {

    private String sessionId;
    private Long memberId;
}
