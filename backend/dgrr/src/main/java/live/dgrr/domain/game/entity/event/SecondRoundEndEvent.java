package live.dgrr.domain.game.entity.event;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter @AllArgsConstructor
public class SecondRoundEndEvent {

    private String gameSessionId;
}
