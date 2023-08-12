package live.dgrr.domain.battle.dto.response;

import live.dgrr.domain.game.entity.enums.GameResult;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class BattleDetailWithOpponentInfoResponseDto {

    private Long battleDetailId;

    private String firstFlag;

    private Long holdingTime;

    private GameResult battleResult;

    private Long laughAmount;

    private LocalDateTime createdAt;

    //상대 멤버 정보
    private String opponentNickname;
    private String opponentProfileImage;
    private String opponentDescription;
}
