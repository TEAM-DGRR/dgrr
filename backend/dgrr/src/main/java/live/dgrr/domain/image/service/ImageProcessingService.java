package live.dgrr.domain.image.service;

import live.dgrr.domain.game.entity.enums.RoundResult;
import live.dgrr.domain.game.service.GameService;
import live.dgrr.domain.image.entity.event.ImageResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageHeaders;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;

import javax.validation.constraints.Null;

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

        // 3. Headers
        JSONObject headers = (JSONObject) analyzingDataJson.get("headers");

        // 4. nativeHeaders
        JSONObject nativeHeaders = (JSONObject) headers.get("nativeHeaders");

        // 5. result
        JSONObject result = (JSONObject) analyzingDataJson.get("result");

        // 6. sccuess, round, gameSessionId
        String success = (String) result.get("success");
        String round = ((String) ((JSONArray) nativeHeaders.get("round")).get(0));
        String gameSessionId = ((String) ((JSONArray) nativeHeaders.get("gameSessionId")).get(0));
        System.out.println(nativeHeaders);

        // 7. emotion, probability, smileProbability
        String emotion = (String) result.get("emotion");
        double probability = (double) result.get("probability");
        double smileProbability = (double) result.get("smileProbability");
        probability = Math.round(probability * 100) / 100.0;
        smileProbability = Math.round(smileProbability * 100) / 100.0;

        ImageResult imageResult = new ImageResult(success, emotion, probability, smileProbability);

        if (success.equals("true")) {

            // 이미지 판정 결과가 Smile이라면 gameService 호출.
            if (emotion.equals("Smile") && probability >= THRESHOLD) {
                if(round.equals("round 1")) {
                    gameService.handleFirstRoundEnd(gameSessionId, RoundResult.LAUGH, probability);
                }
                if(round.equals("round 2")) {
                    gameService.handleSecondRoundEnd(gameSessionId, RoundResult.LAUGH, probability);
                }
            }
        }
        gameService.sendImageResult(gameSessionId, imageResult);
    }


}
