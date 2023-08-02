package live.dgrr.domain.game.controller;

import live.dgrr.domain.game.service.GameService;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.Nullable;
import org.springframework.messaging.MessageHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequiredArgsConstructor
public class TestController {

    private final SimpMessagingTemplate template;
    private final GameService gameService;

    @MessageMapping("/testM")
    public void processMessageFromClient(@Payload String messageData, MessageHeaders headers, @Header(name = "simpSessionId") String sessionId) {
        template.convertAndSendToUser(sessionId,"/recv/sendM", "단일 보내기", createHeaders(sessionId));
    }

    private MessageHeaders createHeaders(@Nullable String sessionId) {
        SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor.create(SimpMessageType.MESSAGE);
        if (sessionId != null) headerAccessor.setSessionId(sessionId);
        headerAccessor.setLeaveMutable(true);
        return headerAccessor.getMessageHeaders();
    }

    @GetMapping("/testIn")
    @ResponseBody
    public String testQueue() {
        gameService.printQ();
        return "123";
    }

}
