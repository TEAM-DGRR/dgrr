package live.dgrr.domain.game.controller;

import live.dgrr.domain.game.entity.enums.RoundResult;
import live.dgrr.domain.game.service.GameService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller @RequiredArgsConstructor
public class GameController {

    private final GameService gameService;

    @MessageMapping("/matching")
    public void processMessageFromClient(Principal principal) {
        gameService.handleMatchingRequest(principal.getName());
    }

    @MessageMapping("/imgTest")
    public void test(Principal principal, @Payload String message) {
        gameService.handleFirstRoundEnd(message, RoundResult.LAUGH, 0.6);
    }

}
