package live.dgrr.domain.rating.service;

import live.dgrr.domain.member.entity.Member;
import live.dgrr.domain.rating.entity.Rating;
import live.dgrr.domain.rating.repository.RatingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RatingService {
    private final RatingRepository ratingRepository;
    private final int INITIAL_RATING = 1400;
    private final int CURRENT_SEASON = 1;

    public List<Rating> findRatingByMember(Member member) {
        return ratingRepository.findByMember_MemberId(member.getMemberId());
    }

    public void addRating(Member member) {
        Rating rating = new Rating(member, INITIAL_RATING, CURRENT_SEASON);
        ratingRepository.save(rating);
    }
}
