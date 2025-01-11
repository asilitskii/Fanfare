package fanfare.tg.bot;
import fanfare.tg.configuration.BotConfig;
import fanfare.tg.model.dto.PendingBoostDto;
import fanfare.tg.model.dto.PendingCommentDto;
import fanfare.tg.services.BalanceService;
import fanfare.tg.services.ChatsService;
import lombok.extern.java.Log;
import org.springframework.stereotype.Component;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.methods.groupadministration.LeaveChat;
import org.telegram.telegrambots.meta.api.objects.Message;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.api.objects.boost.*;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

import java.sql.Timestamp;
import java.util.logging.Level;

@Component
@Log
public class FanfareBot extends TelegramLongPollingBot {

    private final BotConfig config;
    private final BalanceService balanceService;
    private final ChatsService chatsService;

    public FanfareBot(BotConfig config,
                      BalanceService balanceService,
                      ChatsService chatsService) {
        super(config.getToken());
        this.config = config;
        this.balanceService = balanceService;
        this.chatsService = chatsService;
    }


    private void processUpdates(Update update) {
        if (update.hasChatMember()){
            long chatId = update.getChatMember().getChat().getId();
            if (chatsService.getChatByTgChatId(chatId) == null){
                try {
                    execute(new LeaveChat(Long.toString(chatId)));
                } catch (TelegramApiException e) {
                    log.log(Level.WARNING, "Error while trying to leave chat " + chatId, e);
                }
            }
        }
        if (update.hasMessage()){
            PendingCommentDto commentDto = makePendingComment(update.getMessage());
            if (commentDto == null) {
                return;
            }
            log.log(Level.FINE, "adding comment " + commentDto);
            balanceService.addPendingComment(commentDto);
        }
        if (update.getChatBoost() != null){
            ChatBoostUpdated chatBoost = update.getChatBoost();
            PendingBoostDto boostDto = makePendingBoost(chatBoost);
            if (boostDto != null) {
                log.log(Level.INFO, "adding boost " + boostDto);
                balanceService.addPendingBoost(boostDto);
            }
            else{
                log.log(Level.WARNING, "got invalid boost " + chatBoost);
            }
        }
        if (update.getRemovedChatBoost() != null){
            ChatBoostRemoved chatBoostRemoved = update.getRemovedChatBoost();
            balanceService.deletePendingBoost(chatBoostRemoved.getBoostId());
        }
    }


    @Override
    public void onUpdateReceived(Update update) {
        try {
            processUpdates(update);
        } catch (Exception e) {
            log.log(Level.WARNING, "Error while processing update " + update, e);
        }
    }

    @Override
    public String getBotUsername() {
        return config.getName();
    }


    private PendingBoostDto makePendingBoost(ChatBoostUpdated chatBoost) {
        long chatId = chatBoost.getChat().getId();
        ChatBoostSource boostSource = chatBoost.getBoost().getSource();
        long userId;
        switch (boostSource) {
            case ChatBoostSourceGiftCode source -> userId = source.getUser().getId();
            case ChatBoostSourcePremium source -> userId = source.getUser().getId();
            case ChatBoostSourceGiveaway source -> userId = source.getUser().getId();
            case null, default -> {
                return null;
            }
        }
        Timestamp time = new Timestamp( (long) chatBoost.getBoost().getAddDate() * 1000L);

        return new PendingBoostDto(userId, chatId, chatBoost.getBoost().getBoostId(), time);
    }


    private PendingCommentDto makePendingComment(Message message) {
        if (message.getFrom() == null || message.getMessageThreadId() == null) {
            return null;
        }
        long userId = message.getFrom().getId();
        long chatId = message.getChat().getId();
        long postId = message.getMessageThreadId();
        Timestamp time = new Timestamp( (long) message.getDate() * 1000L);

        return new PendingCommentDto(userId, chatId, postId, time);
    }
}
