package live.dgrr.domain.game.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
@Getter
@NoArgsConstructor
public class WaitingMember {

    public WaitingMember(String principalName, Long memberId) {
        this.principalName = principalName;
        this.memberId = memberId;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long waitingMemberId;
    private String principalName;
    private Long memberId;
}
