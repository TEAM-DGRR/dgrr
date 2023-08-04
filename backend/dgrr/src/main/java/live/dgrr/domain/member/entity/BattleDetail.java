package live.dgrr.domain.member.entity;

import live.dgrr.global.domain.BaseEntity;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
@NoArgsConstructor
@Getter
public class BattleDetail extends BaseEntity {

    @Id
    private Long battleDetailId;

    private Long battleId;

    private Long memberId;

    private String firstFlag;

    private Long holdingTime;

    private String battleResult;

    private Long laughAmount;
}
