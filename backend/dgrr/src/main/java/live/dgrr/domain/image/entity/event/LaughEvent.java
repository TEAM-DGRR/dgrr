package live.dgrr.domain.image.entity.event;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LaughEvent {

    private String sessionId;
    private String gameSessionId;
    private String emotion;
    private String probability;
}
