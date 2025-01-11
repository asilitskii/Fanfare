package fanfare.tg.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClientDto {
    private long tgUserId;

    private long tgChatId;

    private UUID userId;

    private int balance;
}
