package live.dgrr.domain.battle.dto.response;

import live.dgrr.domain.game.entity.Battle;
import live.dgrr.domain.game.entity.enums.GameResult;
import live.dgrr.domain.member.entity.Member;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class BattleDetailResponseDto {

    private Long battleDetailId;

    private Battle battle;

    private Member member;

    private String firstFlag;

    private Long holdingTime;

    private GameResult battleResult;

    private Long laughAmount;
}
