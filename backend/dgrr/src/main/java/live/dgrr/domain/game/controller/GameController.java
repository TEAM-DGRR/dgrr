package live.dgrr.domain.game.controller;

import live.dgrr.domain.game.entity.enums.RoundResult;
import live.dgrr.domain.game.service.GameService;
import live.dgrr.global.security.jwt.JwtProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller @RequiredArgsConstructor @Slf4j
public class GameController {

    private final GameService gameService;

    @MessageMapping("/matching")
    public void processMessageFromClient(Principal principal, @Payload String token) {
        log.info("Now Principal {}", principal.getName());
        gameService.handleMatchingRequest(principal.getName(), token.replace(JwtProperties.TOKEN_PREFIX, ""));;
    }

    @MessageMapping("/imgTest")
    public void test(Principal principal, @Payload String message) {
        gameService.handleFirstRoundEnd(message, RoundResult.LAUGH, 0.6);
    }

    @MessageMapping("/imgTest2")
    public void test2(Principal principal, @Payload String message) {
        gameService.handleSecondRoundEnd(message, RoundResult.LAUGH, 0.6);
    }

}
