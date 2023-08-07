package live.dgrr.domain.game.repository;

import live.dgrr.domain.game.entity.BattleDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BattleDetailRepository extends JpaRepository<BattleDetail,Long> {

    List<BattleDetail> findByMember_MemberId(Long memberId);
}
