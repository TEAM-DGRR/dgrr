package live.dgrr.domain.battle.service;

import live.dgrr.domain.battle.dto.response.BattleDetailResponseDto;
import live.dgrr.domain.battle.entity.BattleDetail;
import live.dgrr.domain.battle.repository.BattleRepository;
import live.dgrr.domain.member.entity.Member;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BattleService {
    private final BattleRepository battleRepository;

    public List<BattleDetailResponseDto> findTop3BattleDetailByMemberId(Member member) {
        List<BattleDetail> battleDetails = battleRepository.findTop3ByMember_MemberIdOrderByCreatedAtAsc(member.getMemberId());
        return getBattleDetailResponseDto(battleDetails);
    }

    public List<BattleDetailResponseDto> findBattleDetailByMemberId(Long memberId) {
        List<BattleDetail> battleDetails = battleRepository.findByMember_MemberIdOrderByCreatedAtAsc(memberId);
        return getBattleDetailResponseDto(battleDetails);
    }

    private List<BattleDetailResponseDto> getBattleDetailResponseDto(List<BattleDetail> battleDetails) {
        List<BattleDetailResponseDto> responseDtoList = new ArrayList<>();

        for (BattleDetail battleDetail : battleDetails) {
            BattleDetailResponseDto responseDto = new BattleDetailResponseDto(battleDetail.getBattleDetailId(), battleDetail.getMember(),battleDetail.getFirstFlag(), battleDetail.getHoldingTime(), battleDetail.getBattleResult(), battleDetail.getLaughAmount());
            responseDtoList.add(responseDto);
        }
        return responseDtoList;
    }

}
