package live.dgrr.domain.rating.entity;

import live.dgrr.domain.member.entity.Member;
import live.dgrr.global.domain.BaseEntity;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@NoArgsConstructor
@Getter
public class Rating extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long rankingId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "memberId")
    private Member member;

    private int season;

    private int rating;

    public Rating(Member member, int rating, int season) {
        this.member = member;
        this.rating = rating;
        this.season = season;
    }

    public void addRatingAfterGame(int plus) {
        this.rating = this.rating + plus;
    }
}
