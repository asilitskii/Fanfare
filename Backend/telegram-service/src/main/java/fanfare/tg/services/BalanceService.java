package fanfare.tg.services;

import fanfare.tg.model.dto.ClientDto;
import fanfare.tg.model.dto.PendingBoostDto;
import fanfare.tg.model.dto.PendingCommentDto;

public interface BalanceService {

    void processPendingBoost(PendingBoostDto pendingBoost, String storeId, int boostValue);

    void processPendingComment(PendingCommentDto pendingComment, String storeId, int commentValue);

    void addPendingBoost(PendingBoostDto pendingBoost);

    void addPendingComment(PendingCommentDto pendingComment);

    void deletePendingBoost(String boostId);

    void sendClientBalance(ClientDto client);
}
