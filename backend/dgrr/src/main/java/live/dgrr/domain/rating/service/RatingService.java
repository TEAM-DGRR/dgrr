package live.dgrr.domain.rating.service;

import live.dgrr.domain.member.entity.Member;
import live.dgrr.domain.rating.dto.response.RatingResponseDto;
import live.dgrr.domain.rating.entity.Rating;
import live.dgrr.domain.rating.repository.RatingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RatingService {
    private final RatingRepository ratingRepository;

    public List<RatingResponseDto> findRatingByMember(Member member) {
        List<Rating> ratings = ratingRepository.findByMember_MemberId(member.getMemberId());
        return getRatingResponseDto(ratings);
    }

    private List<RatingResponseDto> getRatingResponseDto(List<Rating> ratings) {
        List<RatingResponseDto> responseDtoList = new ArrayList<>();
        for(Rating rating : ratings) {
            RatingResponseDto responseDto = new RatingResponseDto(rating.getSeason(), rating.getRating());
            responseDtoList.add(responseDto);
        }
        return responseDtoList;
    }
}
