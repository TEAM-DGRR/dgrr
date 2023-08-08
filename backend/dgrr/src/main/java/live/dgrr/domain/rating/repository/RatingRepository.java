package live.dgrr.domain.rating.repository;

import live.dgrr.domain.rating.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {

    List<Rating> findByMember_MemberId(Long memberId);
}
