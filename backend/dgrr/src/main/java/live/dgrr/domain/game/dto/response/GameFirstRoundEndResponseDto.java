package live.dgrr.domain.game.dto.response;

import live.dgrr.domain.game.entity.enums.RoundResult;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter @AllArgsConstructor
public class GameFirstRoundEndResponseDto {

    private String status;
    private RoundResult result;
    private LocalDateTime startTime;

}
