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

    public List<Rating> findRatingByMember(Member member) {
        return ratingRepository.findByMember_MemberId(member.getMemberId());
    }
}
