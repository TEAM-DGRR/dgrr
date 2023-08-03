package live.dgrr.domain.member;

import live.dgrr.global.domain.BaseEntity;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@NoArgsConstructor
@Setter
public class Member extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long memberId;

    private String kakaoId;

    private String nickname;

    private String profileImage;

    private String description;

    // refreshToken은 객체 따로 만들기

    @Enumerated(EnumType.STRING)
    private RoleType memberRole;

    private String status;

}
