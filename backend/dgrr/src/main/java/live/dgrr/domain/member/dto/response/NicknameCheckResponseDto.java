package live.dgrr.domain.member.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class NicknameCheckResponseDto {
    private final String nicknameExists;
    private final String message;
}
