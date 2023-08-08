package live.dgrr.domain.member.controller;

import live.dgrr.domain.member.dto.request.MemberRequestDto;
import live.dgrr.domain.member.dto.response.MemberInfoResponseDto;
import live.dgrr.domain.member.service.MemberService;
import live.dgrr.domain.member.entity.Member;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/member")
@CrossOrigin
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @GetMapping("/kakao-callback")
    public ResponseEntity<?> getLogin(@RequestParam String code, HttpServletResponse response) {
        String reponses;
        String token = memberService.getKakaoAccessToken(code);
        String id = memberService.createKakaoMember(token);
        Member member = memberService.getMemberByKakaoId(id);

        if(member == null) {
            HashMap<String, String> map = new HashMap<>();
            reponses = "signUp";
            map.put("key", reponses);
            map.put("id", id);
            return new ResponseEntity<>(map, HttpStatus.OK);

        }else {
            return new ResponseEntity<>(member, HttpStatus.OK);
        }
    }

    @PostMapping({"/", ""})
    public Member addMember(@RequestBody Member member) {
        memberService.addMember(member);
        return member;
    }

    // nickname 중복 처리
    @GetMapping("/nickname-check")
    public ResponseEntity<?> searchMemberByNickname(@RequestParam(value="nickname") String nickname) {
        Map<String, String> result = new HashMap<>();
        String nicknameExists;
        String message;
        boolean isThereNickname = memberService.findMemberByNickname(nickname);
        message = "NICKNAME '" + nickname + "' DOES NOT EXIST";
        nicknameExists = "false";
        if(isThereNickname) {
            message = "NICKNAME '" + nickname + "' ALREADY EXISTS";
            nicknameExists = "true";
        }
        result.put("nicknameExists", nicknameExists);
        result.put("message", message);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    //mypage
    @GetMapping("/member-id")
    public ResponseEntity<?> mypage() {
        Long id = 1L;
        MemberInfoResponseDto memberInfoDto = memberService.getMemberInfoWithRatingAndBattleDetail(id);
        return new ResponseEntity<>(memberInfoDto,HttpStatus.OK);
    }

    //mypage-update
    @PutMapping
    public ResponseEntity<?> updateMember(@RequestBody MemberRequestDto memberRequestDto) {
        memberService.updateByMember(memberRequestDto);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
