package live.dgrr.domain.game.entity;

import live.dgrr.domain.game.entity.enums.GameResult;
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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long battleDetailId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "battleId")
    private Battle battle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "memberId")
    private Member member;

    private String firstFlag;

    private Long holdingTime;

    @Enumerated(EnumType.STRING)
    private GameResult battleResult;

    private Long laughAmount;

    public BattleDetail(Member member, String firstFlag, Long holdingTime, GameResult battleResult, Long laughAmount) {
        this.member = member;
        this.firstFlag = firstFlag;
        this.holdingTime = holdingTime;
        this.battleResult = battleResult;
        this.laughAmount = laughAmount;
    }
}
