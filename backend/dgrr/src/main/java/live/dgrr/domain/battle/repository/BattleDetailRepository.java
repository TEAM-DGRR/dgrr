package live.dgrr.domain.battle.repository;

import live.dgrr.domain.battle.entity.BattleDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BattleDetailRepository extends JpaRepository<BattleDetail,Long> {

    List<BattleDetail> findTop3ByMember_MemberIdOrderByCreatedAtAsc(Long memberId);

    List<BattleDetail> findByMember_MemberIdOrderByCreatedAtAsc(Long memberId);

    @Query("SELECT bd " +
            "FROM BattleDetail bd " +
            "WHERE bd.battle.battleId = :battleId " +
            "AND bd.member.memberId != :memberId")
    BattleDetail findByMember_OpponentMemberIdForBattleDetail(@Param("battleId") Long battleId, @Param("memberId")Long memberId);
}
