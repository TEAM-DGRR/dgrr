package live.dgrr.domain.image.service;

import live.dgrr.domain.game.entity.enums.RoundResult;
import live.dgrr.domain.game.service.GameService;
import live.dgrr.domain.image.entity.event.LaughEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageHeaders;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;

@Service @Slf4j @RequiredArgsConstructor
public class ImageProcessingService {
    private final SimpMessagingTemplate template;
    private final GameService gameService;
    private final static double THRESHOLD = 0.5;

    public void sendImageDataToPythonClient(String imageData, MessageHeaders headers) {

        // 메세지에 imageData와 headers 붙임
        Message<String> message = MessageBuilder.withPayload(imageData).setHeader("headers", headers).build();

        // 파이썬 클라이언트로 헤더와 imageData를 포함한 메세지 보냄
        this.template.convertAndSend("/recv/imgData", message);
    }

    public void parsingImageResult(String analyzingData) throws ParseException {
        //파이썬 클라이언트로부터 받은 결과를 JSONParser를 통해 헤더와 결과를 분리
        // 1. JSONParser 인스턴스 생성
        JSONParser parser = new JSONParser();

        // 2. String Data를 JSON객체로 파싱
        JSONObject analyzingDataJson = (JSONObject) parser.parse(analyzingData);

        // 3. Header 추출
        JSONObject headers = (JSONObject) analyzingDataJson.get("headers");

        // 4. result 추출
        JSONObject result = (JSONObject) analyzingDataJson.get("result");

        // 5. sessionId, gameSessionId, round 추출
        String sessionId = (String) headers.get("simpSessionId");
        String gameSessionId = (String) headers.get("gameSessionId");
        String round = (String) headers.get("round");

        // 6. emotion, probability 추출
        String emotion = (String) result.get("emotion"); // emotion
        double probability = Double.parseDouble((String) result.get("probability")); // 감정 확률

        // 이미지 판정 결과가 Smile이라면 이벤트를 발생시킴
        if (emotion.equals("Smile") && probability >= THRESHOLD) {
            if(round.equals("first")) {
                gameService.handleFirstRoundEnd(gameSessionId, RoundResult.LAUGH, probability);
            }
            if(round.equals("second")) {
                gameService.handleSecondRoundEnd(gameSessionId, RoundResult.LAUGH, probability);
            }
        }

    }


}
