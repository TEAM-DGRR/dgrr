package live.dgrr.domain.member.entity;

import live.dgrr.global.domain.BaseEntity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@NoArgsConstructor
@Getter
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

    public Member(String kakaoId, String nickname, String profileImage, String description, RoleType memberRole, String status) {
        this.kakaoId = kakaoId;
        this.nickname = nickname;
        this.profileImage = profileImage;
        this.description = description;
        this.memberRole = memberRole;
        this.status = status;
    }
}
