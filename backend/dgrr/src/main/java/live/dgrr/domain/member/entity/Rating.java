package live.dgrr.domain.member.entity;

import live.dgrr.global.domain.BaseEntity;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
@NoArgsConstructor
@Getter
public class Rating extends BaseEntity {

    @Id
    private Long rankingId;

    private Long memberId;

    private int season;

    private int rating;
}
