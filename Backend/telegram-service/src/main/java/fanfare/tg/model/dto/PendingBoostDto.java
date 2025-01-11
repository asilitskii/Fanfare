package fanfare.tg.model.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PendingBoostDto {
    private long tgUserId;

    private long tgChannelId;

    private String boostId;

    private Timestamp time;
}
