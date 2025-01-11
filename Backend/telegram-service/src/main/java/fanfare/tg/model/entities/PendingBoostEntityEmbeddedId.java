package fanfare.tg.model.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.*;

@Embeddable
@Table(name = "pending_boosts", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"tg_user_id", "tg_channel_id", "boost_id"})
})
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PendingBoostEntityEmbeddedId {
    @Column(name = "tg_user_id", nullable = false)
    private long tgUserId;

    @Column(name = "tg_channel_id", nullable = false)
    private long tgChannelId;

    @Column(name = "boost_id", nullable = false)
    private String boostId;
}
