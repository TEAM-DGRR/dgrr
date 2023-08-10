package live.dgrr.domain.member.controller;

import live.dgrr.domain.member.dto.request.MemberRequestDto;
import live.dgrr.domain.member.dto.response.KakaoLoginResponseDto;
import live.dgrr.domain.member.dto.response.LoginResponseDto;
import live.dgrr.domain.member.dto.response.MemberInfoResponseDto;
import live.dgrr.domain.member.dto.response.NicknameCheckResponseDto;
import live.dgrr.domain.member.service.MemberService;
import live.dgrr.domain.member.entity.Member;
import live.dgrr.global.security.jwt.JwtProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/member")
@CrossOrigin(exposedHeaders = "Authorization")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

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

        return memberService.addMember(member);
    }

    @GetMapping("/login")
    public ResponseEntity login(@RequestParam("kakaoId") String kakaoId) {
        String token = memberService.createToken(memberService.getMemberByKakaoId(kakaoId));
        LoginResponseDto response = new LoginResponseDto(JwtProperties.TOKEN_PREFIX + token, memberService.getMemberByKakaoId(kakaoId));
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
    public ResponseEntity<?> mypage(HttpServletRequest request) {
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
    public String test() {
        return "Test has done";
    }

}
