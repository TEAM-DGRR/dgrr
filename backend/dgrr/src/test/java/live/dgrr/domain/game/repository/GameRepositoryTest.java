package live.dgrr.domain.game.repository;

import live.dgrr.domain.game.entity.WaitingMember;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class GameRepositoryTest {

    @Autowired
    private GameRepository gameRepository;


    @Test
    public void poll() {
        //given
        WaitingMember waitingMember = new WaitingMember("a", 2L);
        WaitingMember waitingMember2 = new WaitingMember("b", 2L);
        WaitingMember waitingMember3 = new WaitingMember("c", 2L);
        WaitingMember waitingMember4 = new WaitingMember("d", 2L);

        gameRepository.saveQueue(waitingMember);
        gameRepository.saveQueue(waitingMember2);
        gameRepository.saveQueue(waitingMember3);
        gameRepository.saveQueue(waitingMember4);

        //when
        WaitingMember poll = gameRepository.poll();
        WaitingMember poll2 = gameRepository.poll();

        //then
        Assertions.assertThat(poll.getPrincipalName()).isEqualTo("a");
        Assertions.assertThat(poll2.getPrincipalName()).isEqualTo("b");
    }

    @Test
    public void emptyPoll() {
        WaitingMember poll = gameRepository.poll();
        Assertions.assertThat(poll).isNull();
    }
}