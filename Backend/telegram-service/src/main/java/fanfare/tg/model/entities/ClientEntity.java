package fanfare.tg.model.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "clients", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"tg_user_id", "tg_chat_id"}),
        @UniqueConstraint(columnNames = {"tg_chat_id", "tg_channel_id"}),
        @UniqueConstraint(columnNames = {"tg_chat_id", "tg_channel_id", "tg_user_id"})
})
@NoArgsConstructor
@Getter
@Setter
public class ClientEntity {

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Min(0)
    @Column(name = "balance", nullable = false)
    private int balance;

    @EmbeddedId
    private ClientEntityEmbeddedId id;
}
