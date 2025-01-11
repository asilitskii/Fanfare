package fanfare.tg.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PendingCommentDto {
    private long tgUserId;

    private long tgChatId;

    private long tgPostId;

    private Timestamp time;
}
