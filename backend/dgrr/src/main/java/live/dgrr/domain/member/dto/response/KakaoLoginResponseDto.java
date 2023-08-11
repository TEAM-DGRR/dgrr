package live.dgrr.domain.member.dto.response;

import live.dgrr.domain.member.entity.Member;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class KakaoLoginResponseDto {
    private final String key;
    private final String id;
    private final Member member;
}