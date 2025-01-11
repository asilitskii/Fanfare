package fanfare.tg.model.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;

@Entity
@Table(name = "pending_boosts", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"tg_user_id", "tg_channel_id", "boost_id"})
})
@NoArgsConstructor
@Getter
@Setter
public class PendingBoostEntity {

    @EmbeddedId
    private PendingBoostEntityEmbeddedId id;

    @Column(name = "time", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Timestamp time;


}
