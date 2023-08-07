package live.dgrr.domain.member.dto.response;

import live.dgrr.domain.game.entity.BattleDetail;
import live.dgrr.domain.member.entity.Member;
import live.dgrr.domain.rating.entity.Rating;
import lombok.Getter;

import java.util.List;

@Getter
public class MemberInfoResponseDto {
    private final Member member;
    private final List<Rating> ratingList;
    private final List<BattleDetail> battleDetailList;

    public MemberInfoResponseDto(Member member, List<Rating> ratingList, List<BattleDetail> battleDetailList) {
        this.member = member;
        this.ratingList = ratingList;
        this.battleDetailList = battleDetailList;
    }

    public static MemberInfoResponseDto of(Member member,  List<Rating> ratingList, List<BattleDetail> battleDetailList) {

        return new MemberInfoResponseDto(member, ratingList, battleDetailList);
    }
}
