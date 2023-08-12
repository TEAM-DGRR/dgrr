package live.dgrr.domain.member.repository;

import live.dgrr.domain.battle.dto.response.BattleDetailResponseDto;
import live.dgrr.domain.battle.dto.response.BattleDetailWithOpponentInfoResponseDto;
import live.dgrr.domain.battle.service.BattleService;
import live.dgrr.domain.battle.entity.BattleDetail;
import live.dgrr.domain.game.entity.enums.GameResult;
import live.dgrr.domain.battle.repository.BattleDetailRepository;
import live.dgrr.domain.member.dto.request.MemberRequestDto;
import live.dgrr.domain.member.dto.response.MemberInfoResponseDto;
import live.dgrr.domain.member.entity.Member;
import live.dgrr.domain.member.entity.RoleType;
import live.dgrr.domain.member.service.MemberService;
import live.dgrr.domain.rating.entity.Rating;
import live.dgrr.domain.rating.repository.RatingRepository;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import javax.transaction.Transactional;
import java.util.List;

@ExtendWith(SpringExtension.class)
@SpringBootTest
@Transactional
class MemberRepositoryTest {
    @Autowired
    private MemberRepository memberRepository;
    @Autowired
    private RatingRepository ratingRepository;
    @Autowired
    private BattleDetailRepository battleRepository;
    @Autowired
    private MemberService memberService;
    @Autowired
    private BattleService battleService;


    @Test
    public void testGetMemberInfoWithBattleDetailAndRating() {
        //given
        Member member = new Member("kakaoId", "닉네임", "프로필이미지", "상태 메세지", RoleType.USER, "EXIST");
        memberRepository.save(member);

        int ratingNum = 3;
        for (int i = 0; i < ratingNum; i++) {
            Rating rating = new Rating(member, i, 1);
            ratingRepository.save(rating);
        }

        long battleDetailNum = 5;
        for (long i = 0; i < battleDetailNum; i++) {
            BattleDetail battleDetail = new BattleDetail(member, "True", 10L, GameResult.WIN, i);
            battleRepository.save(battleDetail);
        }

        //when
        Long memberId = member.getMemberId();
        MemberInfoResponseDto memberInfoResponseDto = memberService.getMemberInfoWithRatingAndBattleDetail(memberId);


        //then
        Assertions.assertThat(memberInfoResponseDto.getMember().getMemberId()).isEqualTo(memberId);
        Assertions.assertThat(memberInfoResponseDto.getRatingList().get(ratingNum-1).getMember().getMemberId()).isEqualTo(memberId);
        Assertions.assertThat(memberInfoResponseDto.getBattleDetailList().get(0).getMember().getMemberId()).isEqualTo(memberId);

    }

    @Test
    public void memberRepositorySaveAndFind() {
        Member member = new Member("kakaoId", "닉네임", "프로필이미지", "상태 메세지", RoleType.USER, "EXIST");
        memberRepository.save(member);
        Assertions.assertThat(memberService.getMemberByMemberId(member.getMemberId()).get().getKakaoId()).isEqualTo("kakaoId");


    }

    @Test
    public void testUpdateMemberInfo() {
        //given
        Member member = new Member("kakaoId", "닉네임", "프로필이미지", "상태 메세지", RoleType.USER, "EXIST");
        memberRepository.save(member);


        Rating rating = new Rating(member, 11, 1);
        ratingRepository.save(rating);

        long battleDetailNum = 5;
        for (long i = 0; i < battleDetailNum; i++) {
            BattleDetail battleDetail = new BattleDetail(member, "True", 10L, GameResult.WIN, i);
            battleRepository.save(battleDetail);
        }

        //given-update 할 데이터들
        Long memberId = member.getMemberId();
        String newNickname = "닉네임 수정테스트";
        String newProfileImage = "프로필이미지 수정테스트";
        String newDescription = "상태메세지 수정테스트";

        //when
        MemberRequestDto memberRequestDto = new MemberRequestDto(memberId, newNickname, newProfileImage, newDescription);
        memberService.updateByMember(memberRequestDto);

        //then
        Assertions.assertThat(memberRepository.findById(memberId).get().getNickname()).isEqualTo(newNickname);
        Assertions.assertThat(memberRepository.findById(memberId).get().getProfileImage()).isEqualTo(newProfileImage);
        Assertions.assertThat(memberRepository.findById(memberId).get().getDescription()).isEqualTo(newDescription);
    }

    @Test
    public void testBattleDetailList() {
        //given
        Member member = new Member("kakaoId", "닉네임", "프로필이미지", "상태 메세지", RoleType.USER, "EXIST");
        memberRepository.save(member);

        long num = 4;
        for (long i = 0; i < num; i++) {
            BattleDetail battleDetail = new BattleDetail(member, "True", 10L, GameResult.WIN, i);
            battleRepository.save(battleDetail);
        }

        //when
        Long memberId = member.getMemberId();
        List<BattleDetailWithOpponentInfoResponseDto> battleDetails = battleService.findBattleDetailByMemberId(memberId);

        //then
        Assertions.assertThat(battleDetails.size()).isEqualTo(num);

    }
}