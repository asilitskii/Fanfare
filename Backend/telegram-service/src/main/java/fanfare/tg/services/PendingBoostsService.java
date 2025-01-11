package fanfare.tg.services;

import fanfare.tg.model.dto.PendingBoostDto;

import java.sql.Timestamp;
import java.util.List;

public interface PendingBoostsService {
    void addBoost(PendingBoostDto pendingBoost);

    void deleteBoost(PendingBoostDto pendingBoost);

    List<PendingBoostDto> getAllInChannelBefore(long tgChannelId, Timestamp timestamp);

    void deleteBoost(String boostId);


}
