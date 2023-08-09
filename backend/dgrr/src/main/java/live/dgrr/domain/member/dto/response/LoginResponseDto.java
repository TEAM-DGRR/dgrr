package live.dgrr.domain.member.dto.response;

import live.dgrr.domain.member.entity.Member;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResponseDto {
    private final String token;
    private final Member member;
}