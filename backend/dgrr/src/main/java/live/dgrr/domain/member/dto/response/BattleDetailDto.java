package live.dgrr.domain.member.dto.response;

import lombok.Getter;

@Getter
public class BattleDetailDto {
    private Long battleDetailId;
    private Long battleId;
    private String firstFlag;
    private Long holdingTime;
    private String battleResult;
    private Long laughAmount;
}
