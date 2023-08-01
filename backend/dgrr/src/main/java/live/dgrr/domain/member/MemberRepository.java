package live.dgrr.domain.member;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, Long> {

    public Member findByKakaoId(Long kakaoId);

}
