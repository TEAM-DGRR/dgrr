package live.dgrr.domain.game.service;

import live.dgrr.domain.game.entity.BattleDetail;
import live.dgrr.domain.game.repository.BattleDetailRepository;
import live.dgrr.domain.member.entity.Member;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BattleDetailService {
    private final BattleDetailRepository battleDetailRepository;

    public List<BattleDetail> findBattleDetailByMember(Member member) {
        return battleDetailRepository.findByMember_MemberId(member.getMemberId());
    }
}
