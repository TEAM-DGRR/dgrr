package live.dgrr.domain.battle.service;

import live.dgrr.domain.battle.dto.response.BattleDetailWithOpponentInfoResponseDto;
import live.dgrr.domain.battle.entity.Battle;
import live.dgrr.domain.battle.entity.BattleDetail;
import live.dgrr.domain.battle.repository.BattleDetailRepository;
import live.dgrr.domain.member.entity.Member;
import live.dgrr.domain.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BattleService {
    private final BattleDetailRepository battleDetailRepository;
    private final MemberRepository memberRepository;

    public List<BattleDetailWithOpponentInfoResponseDto> findTop3BattleDetailByMemberId(Member member) {
        List<BattleDetail> battleDetails = battleDetailRepository.findTop3ByMember_MemberIdOrderByCreatedAtAsc(member.getMemberId());
        return getBattleDetailResponseDto(battleDetails);
    }

    public List<BattleDetailWithOpponentInfoResponseDto> findBattleDetailByMemberId(Long memberId) {
        List<BattleDetail> battleDetails = battleDetailRepository.findByMember_MemberIdOrderByCreatedAtAsc(memberId);
        return getBattleDetailResponseDto(battleDetails);
    }

    private List<BattleDetailWithOpponentInfoResponseDto> getBattleDetailResponseDto(List<BattleDetail> battleDetails) {
        List<BattleDetailWithOpponentInfoResponseDto> responseDtoList = new ArrayList<>();

        for (BattleDetail battleDetail : battleDetails) {
            Member opponentMember = getOpponentMemberForBattle(battleDetail);
            BattleDetailWithOpponentInfoResponseDto responseDto = new BattleDetailWithOpponentInfoResponseDto(
                    battleDetail.getBattleDetailId(),
                    battleDetail.getFirstFlag(),
                    battleDetail.getHoldingTime(),
                    battleDetail.getBattleResult(),
                    battleDetail.getLaughAmount(),
                    battleDetail.getCreatedAt(),
                    opponentMember.getNickname(),
                    opponentMember.getProfileImage(),
                    opponentMember.getDescription());
            responseDtoList.add(responseDto);
        }
        return responseDtoList;
    }

    private Member getOpponentMemberForBattle(BattleDetail battleDetail) {
        Battle battle = battleDetail.getBattle();
        Member member = battleDetail.getMember();

        //상대의 BattleDetail을 가져옴
        BattleDetail opponentBattleDetail = battleDetailRepository.findByMember_OpponentMemberIdForBattleDetail(battle.getBattleId(), member.getMemberId());

        return memberRepository.findByMemberId(opponentBattleDetail.getMember().getMemberId());
    }

}
