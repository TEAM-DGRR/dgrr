package live.dgrr.domain.game.entity;

import live.dgrr.global.domain.BaseEntity;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;

@Entity
@NoArgsConstructor
@Getter
public class Battle extends BaseEntity {
    @Id
    private Long battleId;

    @Enumerated(EnumType.STRING)
    private BattleType battleType;

    private Long battleTime;
}
