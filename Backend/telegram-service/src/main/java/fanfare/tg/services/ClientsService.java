package fanfare.tg.services;


import fanfare.tg.model.dto.ChatDto;
import fanfare.tg.model.dto.ClientDto;

import java.util.List;
import java.util.UUID;

public interface ClientsService {

    void addClient(long tgUserId, String storeId, UUID userId);

    void deleteClient(String storeId, UUID UserId);

    void addBalanceByTgChatId(long tgUserId, long tgChatId, int balanceDiff);

    void addBalanceByTgChannelId(long tgUserId, long tgChannelId, int balanceDiff);

    UUID getUserIdByTgUserIdAndTgChatId(long tgUserId, long tgChatId);

    UUID getUserIdByTgUserIdAndTgChannelId(long tgUserId, long tgChannelId);

    List<ChatDto> getUserStores(UUID userId);

    boolean isExist(UUID userId, String storeId);

    List<ClientDto> getClientsWithPositiveBalance();

    void subClientBalance(ClientDto client);
}
