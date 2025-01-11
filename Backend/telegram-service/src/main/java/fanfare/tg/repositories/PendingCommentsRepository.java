package fanfare.tg.repositories;


import fanfare.tg.model.entities.PendingCommentEntity;
import fanfare.tg.model.entities.PendingCommentEntityEmbeddedId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;


public interface PendingCommentsRepository extends JpaRepository<PendingCommentEntity, PendingCommentEntityEmbeddedId> {

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    default void insert(PendingCommentEntity pendingBoostEntity){
        if (this.existsById(pendingBoostEntity.getId())){
            return;
        }
        this.save(pendingBoostEntity);
    }

    List<PendingCommentEntity> findById_TgChatIdAndTimeLessThan(long tgChatId, Date time);
}