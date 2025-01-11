package fanfare.tg.services.impl;

import fanfare.tg.model.dto.ChatDto;
import fanfare.tg.model.dto.ClientDto;
import fanfare.tg.model.dto.PendingBoostDto;
import fanfare.tg.model.dto.PendingCommentDto;
import fanfare.tg.services.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BalanceServiceImpl implements BalanceService {

    private final ClientsService clientsService;
    private final PendingBoostsService pendingBoostsService;
    private final PendingCommentsService pendingCommentsService;
    private final ChatsService chatsService;
    private final OrderService orderService;

    @Transactional
    public void processPendingBoost(PendingBoostDto pendingBoost, String storeId, int boostValue){
        UUID userId = clientsService.getUserIdByTgUserIdAndTgChannelId(pendingBoost.getTgUserId(), pendingBoost.getTgChannelId());
        pendingBoostsService.deleteBoost(pendingBoost);
        orderService.addBalance(userId, storeId, boostValue);

        clientsService.addBalanceByTgChannelId(pendingBoost.getTgUserId(), pendingBoost.getTgChannelId(), boostValue);
    }


    @Transactional
    public void processPendingComment(PendingCommentDto pendingComment, String storeId, int commentValue){
        UUID userId = clientsService.getUserIdByTgUserIdAndTgChatId(pendingComment.getTgUserId(), pendingComment.getTgChatId());
        pendingCommentsService.deleteComment(pendingComment);
        orderService.addBalance(userId, storeId, commentValue);
        clientsService.addBalanceByTgChatId(pendingComment.getTgUserId(), pendingComment.getTgChatId(), commentValue);
    }

    @Override
    public void addPendingBoost(PendingBoostDto pendingBoost) {
        ChatDto chat = chatsService.getChatByTgChannelId(pendingBoost.getTgChannelId());
        if (chat == null)
            return;
        if (chat.getBoostTimeWait() != 0) {
            pendingBoostsService.addBoost(pendingBoost);
            return;
        }

        UUID userId = clientsService.getUserIdByTgUserIdAndTgChannelId(pendingBoost.getTgUserId(), pendingBoost.getTgChannelId());
        if (userId == null)
            return;

        if (orderService.addBalance(userId, chat.getStoreId(), chat.getFanfCoinsPerBoost()))
            return;

        clientsService.addBalanceByTgChannelId(pendingBoost.getTgUserId(), pendingBoost.getTgChannelId(), chat.getFanfCoinsPerBoost());
    }

    @Override
    public void addPendingComment(PendingCommentDto pendingComment) {
        ChatDto chat = chatsService.getChatByTgChatId(pendingComment.getTgChatId());
        if (chat == null)
            return;

        if (chat.getCommentTimeWait() != 0) {
            pendingCommentsService.addComment(pendingComment);
            return;
        }

        UUID userId = clientsService.getUserIdByTgUserIdAndTgChatId(pendingComment.getTgUserId(), pendingComment.getTgChatId());

        if (userId == null)
            return;

        if (orderService.addBalance(userId, chat.getStoreId(), chat.getFanfCoinsPerComment()))
            return;
        clientsService.addBalanceByTgChatId(pendingComment.getTgUserId(), pendingComment.getTgChatId(), chat.getFanfCoinsPerComment());
    }

    @Transactional
    @Override
    public void sendClientBalance(ClientDto client) {
        ChatDto chat = chatsService.getChatByTgChatId(client.getTgChatId());
        if (chat == null)
            return;

        clientsService.subClientBalance(client);

        if (!orderService.addBalance(client.getUserId(), chat.getStoreId(), client.getBalance()))
            throw new RuntimeException("can't send balance");
    }


    @Override
    public void deletePendingBoost(String boostId) {
        pendingBoostsService.deleteBoost(boostId);
    }
}
