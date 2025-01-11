package fanfare.tg.repositories;

import fanfare.tg.model.entities.PendingBoostEntity;
import fanfare.tg.model.entities.PendingBoostEntityEmbeddedId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;


public interface PendingBoostsRepository extends JpaRepository<PendingBoostEntity, PendingBoostEntityEmbeddedId> {

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    default void insert(PendingBoostEntity pendingBoostEntity){
        if (this.existsById(pendingBoostEntity.getId())){
            return;
        }
        this.save(pendingBoostEntity);
    }

    List<PendingBoostEntity> findById_TgChannelIdAndTimeLessThan(long tgChannelId, Date time);

    void deleteById_BoostId(String boostId);

}

