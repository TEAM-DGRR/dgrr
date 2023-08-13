package live.dgrr.domain.member.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@Getter
@AllArgsConstructor @ToString
public class MemberResponseDto {

    private Long memberId;
    private String nickname;
    private String profileImage;
    private String description;

}
