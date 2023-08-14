package live.dgrr.domain.member.dto.request;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class MemberRequestDto {
    private Long memberId;
    private String nickname;
    private String profileImage;
    private String description;


}
