package live.dgrr.domain.image.controller;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageHeaders;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.web.bind.annotation.RestController;
@RestController
public class ImageController {
    private final SimpMessagingTemplate template;
    public ImageController(SimpMessagingTemplate template) {
        this.template = template;
    }
    @MessageMapping("/imgData")
    public void processImageDataFromReactClient(@Payload String imageData, MessageHeaders headers) throws Exception {

        // 메세지에 imageData와 headers를 붙임
        Message<String> message = MessageBuilder.withPayload(imageData)
                .setHeader("headers", headers)
                .build();

        // 파이썬 클라이언트로 헤더와 imageData를 포함한 메세지 보냄
        this.template.convertAndSend("/recv/imgData", message);
    }
    @MessageMapping("/imgResult")
    public void receiveAnalyzingDataFromPythonClient(@Payload String analyzingData) throws ParseException {

        // 파이썬 클라이언트로부터 받은 결과를 JSONParser를 통해 헤더와 결과를 분리
        // 1. JSONParser 인스턴스 생성
        JSONParser parser = new JSONParser();

        // 2. String Data를 JSON객체로 파싱
        JSONObject analyzingDataJson = (JSONObject) parser.parse(analyzingData);

        // 3. Header 추출
        JSONObject headers = (JSONObject) analyzingDataJson.get("headers");

        // 4. result 추출
        JSONObject result = (JSONObject) analyzingDataJson.get("result");

        // 클라이언트로 보낼 결과
        String emotion = (String) result.get("emotion");
        String sessionId = (String) headers.get("simpSessionId");

        // 커스텀 헤더 생성
        // 특정 사용자에게 메세지를 전달하기 위해 세션ID(gameSessionId로 변경해야 함)를 사용
        MessageHeaders customHeaders = createHeaders(sessionId);

        this.template.convertAndSendToUser(sessionId, "/recv/imgResult", String.format("sessionId : %s\n emotion : %s\n", sessionId, emotion), customHeaders);
    }

    // 세션 ID(변경 필요)를 사용하여 메세지 헤더를 생성하는 메서드
    private MessageHeaders createHeaders(String sessionId) {
        SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor.create(SimpMessageType.MESSAGE);
        if (sessionId != null) {
            headerAccessor.setSessionId(sessionId);
        }
        headerAccessor.setLeaveMutable(true);
        return headerAccessor.getMessageHeaders();
    }
}