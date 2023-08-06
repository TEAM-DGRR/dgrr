package live.dgrr.domain.rating.entity;

import live.dgrr.domain.member.entity.Member;
import live.dgrr.global.domain.BaseEntity;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

@Entity
@NoArgsConstructor
@Getter
public class Rating extends BaseEntity {

    @Id
    private Long rankingId;

    @ManyToOne
    private Member member;

    private int season;

    private int rating;
}
