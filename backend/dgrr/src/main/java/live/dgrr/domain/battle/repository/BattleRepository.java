package live.dgrr.domain.battle.repository;

import live.dgrr.domain.battle.entity.Battle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BattleRepository extends JpaRepository<Battle,Long> {


}
