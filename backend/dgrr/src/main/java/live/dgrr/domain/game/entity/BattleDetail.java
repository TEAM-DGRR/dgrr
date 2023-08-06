package live.dgrr.domain.game.entity;

import live.dgrr.domain.member.entity.Member;
import live.dgrr.global.domain.BaseEntity;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@NoArgsConstructor
@Getter
public class BattleDetail extends BaseEntity {

    @Id
    private Long battleDetailId;

    @ManyToOne
    private Battle battle;

    @ManyToOne
    private Member member;

    private String firstFlag;

    private Long holdingTime;

    @Enumerated(EnumType.STRING)
    private ResultType battleResult;

    private Long laughAmount;
}
