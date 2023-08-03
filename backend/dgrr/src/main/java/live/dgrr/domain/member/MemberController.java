package live.dgrr.domain.member;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;

@RestController
@RequestMapping("/member")
@CrossOrigin
public class MemberController {

    @Autowired
    private MemberService memberService;

    @GetMapping("/kakao-callback")
    public ResponseEntity<?> getLogin(@RequestParam("code") String code, HttpServletResponse response) {
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
        String result = "";
        boolean isThereNickname = memberService.findMemberByNickname(nickname);
        if(isThereNickname) {
            result = "NICKNAME '" + nickname + "' ALREADY EXISTS";
            return new ResponseEntity<>(result, HttpStatus.OK);
        }
        result = "NICKNAME '" + nickname + "' DOES NOT EXIST";
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
