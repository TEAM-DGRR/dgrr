package live.dgrr.domain.battle.controller;

import live.dgrr.domain.battle.dto.response.BattleDetailWithOpponentInfoResponseDto;
import live.dgrr.domain.battle.service.BattleService;
import live.dgrr.domain.member.service.MemberService;
import live.dgrr.global.security.jwt.JwtProperties;
import lombok.RequiredArgsConstructor;
import org.apache.hc.client5.http.classic.methods.HttpHead;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api/v1/battle")
@CrossOrigin(exposedHeaders = "Authorization")
@RequiredArgsConstructor
public class BattleController {

    private final BattleService battleService;
    private final MemberService memberService;

    //mypage-battleDetail
    @GetMapping
    public ResponseEntity<?> getBattleDetail(HttpServletRequest request) {
        String token = request.getHeader("Authorization").replace(JwtProperties.TOKEN_PREFIX, "");
        Long memberId = memberService.getIdFromToken(token);
        List<BattleDetailWithOpponentInfoResponseDto> battleDetails = battleService.findBattleDetailByMemberId(memberId);
        return new ResponseEntity<>(battleDetails, HttpStatus.OK);
    }

    @GetMapping("/test")
    public String test(HttpServletRequest request) {
        return "Test Done";
    }


}
