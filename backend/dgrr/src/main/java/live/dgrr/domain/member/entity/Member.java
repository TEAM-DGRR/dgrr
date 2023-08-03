package live.dgrr.domain.member.entity;

import live.dgrr.global.domain.BaseEntity;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@NoArgsConstructor
@Getter
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
