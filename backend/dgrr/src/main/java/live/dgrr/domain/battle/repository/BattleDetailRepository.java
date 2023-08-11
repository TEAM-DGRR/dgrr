package live.dgrr.domain.battle.repository;

import live.dgrr.domain.battle.entity.BattleDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BattleDetailRepository extends JpaRepository<BattleDetail,Long> {

    List<BattleDetail> findTop3ByMember_MemberIdOrderByCreatedAtAsc(Long memberId);

    List<BattleDetail> findByMember_MemberIdOrderByCreatedAtAsc(Long memberId);
}
