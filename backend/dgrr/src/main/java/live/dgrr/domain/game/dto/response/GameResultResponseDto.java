package live.dgrr.domain.game.dto.response;

import live.dgrr.domain.game.entity.GameRoomMember;
import live.dgrr.domain.game.entity.enums.GameResult;
import live.dgrr.global.utils.Rank;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter @AllArgsConstructor
public class GameResultResponseDto {

    private GameRoomMember myInfo;
    private GameRoomMember enemyInfo;

    private long firstRoundTime;
    private long secondRoundTime;
    private GameResult gameResult;
    private int reward;
    private Rank afterRank;
}
