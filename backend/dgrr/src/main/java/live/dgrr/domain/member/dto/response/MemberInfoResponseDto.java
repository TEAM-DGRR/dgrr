package live.dgrr.domain.member.dto.response;

import lombok.Getter;

import java.util.List;

@Getter
public class MemberInfoResponseDto {
    private Long memberId;
    private String nickname;
    private String profileImage;
    private String description;
    private List<RatingDto> rating;
    private List<BattleDetailDto> battleList;

}
