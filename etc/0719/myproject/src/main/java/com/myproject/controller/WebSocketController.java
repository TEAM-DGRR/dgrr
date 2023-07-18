// src/main/java/com/myproject/controller/WebSocketController.java

package com.myproject.controller;

import com.myproject.domain.Member;
import com.myproject.service.MatchingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
public class WebSocketController {

    private final MatchingService matchingService;

    public WebSocketController(MatchingService matchingService) {
        this.matchingService = matchingService;
    }

    @MessageMapping("/join")
    public void join(@Payload Map<String, String> payload, SimpMessageHeaderAccessor headerAccessor) {
        String sessionId = headerAccessor.getSessionAttributes().get("sessionId").toString();
        String name = payload.get("name");
        System.out.println("sessionID : " + sessionId);
        System.out.println("name : " + name);
        matchingService.join(new Member(name, sessionId));
    }
}
