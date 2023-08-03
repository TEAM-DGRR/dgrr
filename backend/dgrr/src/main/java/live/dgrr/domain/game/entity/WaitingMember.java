package live.dgrr.domain.game.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.security.Principal;

@Getter @AllArgsConstructor
public class WaitingMember {

    private String principalName;
    private Long memberId;
}
