package fanfare.tg.model.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.*;

@Embeddable
@Table(name = "pending_comments", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"tg_user_id", "tg_chat_id", "tg_post_id"})
})
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PendingCommentEntityEmbeddedId {
    @Column(name = "tg_user_id", nullable = false)
    private long tgUserId;

    @Column(name = "tg_chat_id", nullable = false)
    private long tgChatId;

    @Column(name = "tg_post_id", nullable = false)
    private long tgPostId;
}
