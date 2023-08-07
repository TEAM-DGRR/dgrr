package live.dgrr.domain.image.controller;

import live.dgrr.domain.image.service.ImageProcessingService;
import org.json.simple.parser.ParseException;
import org.springframework.messaging.MessageHeaders;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.web.bind.annotation.RestController;
@RestController
public class ImageController {
    private final ImageProcessingService imageProcessingService;

    public ImageController(ImageProcessingService imageProcessingService) {
        this.imageProcessingService = imageProcessingService;
    }

    @MessageMapping("/imgData")
    public void processImageDataFromReactClient(@Payload String imageData, MessageHeaders headers) throws Exception {
        imageProcessingService.sendImageDataToPythonClient(imageData, headers);

    }

    @MessageMapping("/imgResult")
    public void receiveAnalyzingDataFromPythonClient(@Payload String analyzingData) throws ParseException {
        imageProcessingService.parsingImageResult(analyzingData);
    }
}