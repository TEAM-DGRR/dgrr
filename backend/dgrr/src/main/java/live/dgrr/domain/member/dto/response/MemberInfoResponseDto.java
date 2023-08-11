package live.dgrr.domain.member.dto.response;

import live.dgrr.domain.battle.dto.response.BattleDetailResponseDto;
import live.dgrr.domain.rating.dto.response.RatingResponseDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class MemberInfoResponseDto {
    private MemberResponseDto member;
    private List<RatingResponseDto> ratingList;
    private List<BattleDetailResponseDto> battleDetailList;

}
