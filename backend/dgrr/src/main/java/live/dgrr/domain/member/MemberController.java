package live.dgrr.domain.member;

import live.dgrr.domain.oauth.OauthToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;

@RestController
@RequestMapping("/member")
public class MemberController {

    @Autowired
    private MemberService memberService;

    @GetMapping("/kakaoCallback")
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
}
