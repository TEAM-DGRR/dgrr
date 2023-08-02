package live.dgrr.domain.member;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "member")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_id")
    private Long memberId;

    @Column(name = "kakao_id")
    private Long kakaoId;

    @Column(name = "profile_image")
    private String profileImage;

    private String description;

    // refreshToken은 객체 따로 만들기

    @Enumerated(EnumType.STRING)
    @Column(name = "member_role")
    private RoleType memberRole;

    private String status;

    @Column(name = "created_at")
    @CreationTimestamp
    private Timestamp createdAt;

    @Column(name = "modified_at")
    private Timestamp modifiedAt;

    @Builder
    public Member(Long kakaoId, String memberRole) {
        this.kakaoId = kakaoId;
        this.memberRole = RoleType.valueOf(memberRole);
    }
}
