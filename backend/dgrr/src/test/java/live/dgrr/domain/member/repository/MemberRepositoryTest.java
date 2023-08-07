package live.dgrr.domain.member.repository;

import live.dgrr.domain.game.entity.BattleDetail;
import live.dgrr.domain.game.entity.enums.GameResult;
import live.dgrr.domain.game.repository.BattleDetailRepository;
import live.dgrr.domain.member.dto.response.MemberInfoResponseDto;
import live.dgrr.domain.member.entity.Member;
import live.dgrr.domain.member.entity.RoleType;
import live.dgrr.domain.member.service.MemberService;
import live.dgrr.domain.rating.entity.Rating;
import live.dgrr.domain.rating.repository.RatingRepository;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import javax.transaction.Transactional;

@ExtendWith(SpringExtension.class)
@SpringBootTest
@Transactional
class MemberRepositoryTest {
    @Autowired
    private MemberRepository memberRepository;
    @Autowired
    private RatingRepository ratingRepository;
    @Autowired
    private BattleDetailRepository battleDetailRepository;
    @Autowired
    private MemberService memberService;


    @BeforeEach
    @DisplayName("멤버가 저장이 잘 되는지 확인")
    void saveMember() {
        Member member = new Member("kakaoId", "닉네임", "프로필이미지", "상태 메세지", RoleType.USER, "EXIST");
        memberRepository.save(member);

        Rating rating = new Rating(member, 11, 1);
        ratingRepository.save(rating);

        BattleDetail battleDetail = new BattleDetail(member, "True", 10L, GameResult.WIN, 90L);
        battleDetailRepository.save(battleDetail);

    }



    @Test
    public void testGetMemberInfo() {
        Long memberId = memberRepository.findAll().get(0).getMemberId();
        MemberInfoResponseDto memberInfoResponseDto = memberService.getMemberInfoWithRatingAndBattleDetail(memberId);

        Assertions.assertThat(memberInfoResponseDto.getMember().getMemberId()).isEqualTo(memberId);
        Assertions.assertThat(memberInfoResponseDto.getRatingList().get(0).getMember().getMemberId()).isEqualTo(memberId);

    }


}