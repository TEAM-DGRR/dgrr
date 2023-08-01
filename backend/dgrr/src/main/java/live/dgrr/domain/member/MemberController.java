package live.dgrr.domain.member;

import live.dgrr.domain.oauth.OauthToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/member")
public class MemberController {

    @Autowired
    private MemberService memberService;

    @GetMapping("/oauth/token")
    public OauthToken getLogin(@RequestParam("code") String code) {
        OauthToken oauthToken = memberService.getAccessToken(code);

        return oauthToken;
    }
}
