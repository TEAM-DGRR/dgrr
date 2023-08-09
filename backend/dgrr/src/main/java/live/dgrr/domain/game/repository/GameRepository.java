package live.dgrr.domain.game.repository;

import live.dgrr.domain.game.entity.WaitingMember;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

@Repository
public class GameRepository {

    @PersistenceContext
    EntityManager em;

    @Transactional
    public void saveQueue(WaitingMember waitingMember) {
        em.persist(waitingMember);
    }

    @Transactional
    public WaitingMember poll() {
        List<WaitingMember> resultList = em.createQuery("select w from WaitingMember w order by w.waitingMemberId ASC", WaitingMember.class)
                .setMaxResults(1).getResultList();
        if(resultList.isEmpty()) {
            return null;
        }
        em.remove(resultList.get(0));
        return resultList.get(0);
    }
}
