package live.dgrr.domain.member.controller;

import live.dgrr.domain.member.dto.request.MemberRequestDto;
import live.dgrr.domain.member.dto.response.KakaoLoginResponseDto;
import live.dgrr.domain.member.dto.response.LoginResponseDto;
import live.dgrr.domain.member.dto.response.MemberInfoResponseDto;
import live.dgrr.domain.member.dto.response.NicknameCheckResponseDto;
import live.dgrr.domain.member.service.MemberService;
import live.dgrr.domain.member.entity.Member;
import live.dgrr.domain.rating.service.RatingService;
import live.dgrr.global.security.jwt.JwtProperties;
import live.dgrr.global.security.jwt.TokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.security.Principal;

@RestController
@RequestMapping("/api/v1/member")
@CrossOrigin(exposedHeaders = "Authorization")
@RequiredArgsConstructor
@Slf4j
public class MemberController {

    private final AuthenticationManagerBuilder managerBuilder;
    private final MemberService memberService;
    private final RatingService ratingService;
    private final TokenProvider tokenProvider;

    @GetMapping("/kakao-callback")
    public ResponseEntity<?> kakaoLogin(@RequestParam String code) {
        String responses;
        String token = memberService.getKakaoAccessToken(code);
        String id = memberService.createKakaoMember(token);
        Member member = memberService.getMemberByKakaoId(id);
        KakaoLoginResponseDto response;
        if(member == null) { // 멤버가 없으면 회원가입
            response = new KakaoLoginResponseDto("signUp", id, null);
        }else { // 멤버가 있다면 로그인
            response = new KakaoLoginResponseDto("login", null, member);
        }
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping({"/", ""})
    public Member addMember(@RequestBody Member member) {
        memberService.addMember(member);
        ratingService.addRating(member);
        return member;
    }

    @GetMapping("/login")
    public ResponseEntity login(@RequestParam("kakaoId") String kakaoId) {
        Member member = memberService.getMemberByKakaoId(kakaoId);
        String token = memberService.createToken(member);
        LoginResponseDto response = new LoginResponseDto(JwtProperties.TOKEN_PREFIX+tokenProvider.generateTokenDto(member.getKakaoId(), member.getMemberId()).getAccessToken(), member);
        return new ResponseEntity(response, HttpStatus.OK);
    }

    // member 확인 kakao id로
    @GetMapping("/kakao-id")
    public ResponseEntity<?> searchMemberByKakaoId(@RequestParam String kakaoId) {
        Member member = memberService.getMemberByKakaoId(kakaoId);
        return new ResponseEntity<>(member, HttpStatus.OK);
    }

    // nickname 중복 처리
    @GetMapping("/nickname-check")
    public ResponseEntity<?> searchMemberByNickname(@RequestParam(value="nickname") String nickname) {
        NicknameCheckResponseDto response;
        String nicknameExists;
        String message;
        boolean isThereNickname = memberService.findMemberByNickname(nickname);
        message = "NICKNAME '" + nickname + "' DOES NOT EXIST";
        nicknameExists = "false";
        if(isThereNickname) {
            message = "NICKNAME '" + nickname + "' ALREADY EXISTS";
            nicknameExists = "true";
        }
        response = new NicknameCheckResponseDto(nicknameExists, message);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    //mypage
    @GetMapping("/member-id")
    public ResponseEntity<MemberInfoResponseDto> mypage(HttpServletRequest request) {
        String token = request.getHeader("Authorization").replace(JwtProperties.TOKEN_PREFIX, "");
        Long memberId = memberService.getIdFromToken(token);
        MemberInfoResponseDto memberInfoDto = memberService.getMemberInfoWithRatingAndBattleDetail(memberId);

        return new ResponseEntity<>(memberInfoDto,HttpStatus.OK);
    }

    //mypage-update
    @PutMapping
    public ResponseEntity<?> updateMember(@RequestBody MemberRequestDto memberRequestDto) {
        memberService.updateByMember(memberRequestDto);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/test")
    public String test(HttpServletRequest request) {
        String authorization = request.getHeader("Authorization");
        System.out.println(authorization);
        return "Test has done";
    }

}
