package fanfare.tg.model.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;

@Entity
@Table(name = "pending_comments", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"tg_user_id", "tg_chat_id", "tg_post_id"})
})
@NoArgsConstructor
@Getter
@Setter
public class PendingCommentEntity {

    @EmbeddedId
    private PendingCommentEntityEmbeddedId id;

    @Column(name = "time", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Timestamp time;
}
