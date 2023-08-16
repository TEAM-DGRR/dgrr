package live.dgrr.domain.image.entity.event;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@AllArgsConstructor
@RequiredArgsConstructor
public class ImageResult {

    private final String success;
    private String emotion;
    private double probability;
    private double smileProbability;

}
