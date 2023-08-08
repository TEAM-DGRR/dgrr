package live.dgrr.domain.member.dto.response;

import live.dgrr.domain.battle.entity.BattleDetail;
import live.dgrr.domain.member.entity.Member;
import live.dgrr.domain.rating.entity.Rating;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class MemberInfoResponseDto {
    private final Member member;
    private final List<Rating> ratingList;
    private final List<BattleDetail> battleDetailList;

}
