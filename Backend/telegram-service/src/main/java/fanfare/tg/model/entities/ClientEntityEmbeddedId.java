package fanfare.tg.model.entities;

import jakarta.persistence.*;
import lombok.*;

@Embeddable
@Table(name = "clients")
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ClientEntityEmbeddedId {
    @Column(name = "tg_user_id", nullable = false)
    private long tgUserId;

    @Column(name = "tg_chat_id", nullable = false)
    private long tgChatId;

    @Column(name = "tg_channel_id", nullable = false)
    private long tgChannelId;
}
