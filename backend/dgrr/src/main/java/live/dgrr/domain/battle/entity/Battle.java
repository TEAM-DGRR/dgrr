package live.dgrr.domain.battle.entity;

import live.dgrr.global.domain.BaseEntity;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@NoArgsConstructor
@Getter
public class Battle extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long battleId;

    @Enumerated(EnumType.STRING)
    private BattleType battleType;

    private Long battleTime;
}
