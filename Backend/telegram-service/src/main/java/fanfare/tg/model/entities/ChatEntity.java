package fanfare.tg.model.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "chats")
@Getter
@Setter
@NoArgsConstructor
public class ChatEntity {

    @Id
    @Column(name = "store_id", nullable = false, length = 24, unique = true)
    private String storeId;

    @Column(name = "blogger_id", nullable = false)
    private UUID bloggerId;

    @Column(name = "fanfcoins_per_comment", nullable = false)
    @Min(1)
    private int fanfCoinsPerComment;

    @Column(name = "fanfcoins_per_boost", nullable = false)
    @Min(1)
    private int fanfCoinsPerBoost;

    @Column(name = "comment_time_wait", nullable = false)
    @Min(0) @Max(168)
    private int commentTimeWait;

    @Column(name = "boost_time_wait", nullable = false)
    @Min(0) @Max(168)
    private int boostTimeWait;

    @Column(name = "tg_chat_id",nullable = false, unique = true)
    private long tgChatId;

    @Column(name = "tg_channel_id", nullable = false, unique = true)
    private long tgChannelId;
}
