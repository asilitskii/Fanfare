package fanfare.tg.scheduler;

import fanfare.tg.model.dto.ChatDto;
import fanfare.tg.model.dto.ClientDto;
import fanfare.tg.model.dto.PendingBoostDto;
import fanfare.tg.model.dto.PendingCommentDto;
import fanfare.tg.services.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import java.sql.Timestamp;
import java.util.List;
import java.util.logging.Level;

@EnableScheduling
@Configuration
@RequiredArgsConstructor
@Log
public class CronBalanceJob {

    private final ChatsService chatsService;
    private final ClientsService clientsService;
    private final BalanceService balanceService;
    private final PendingBoostsService pendingBoostsService;
    private final PendingCommentsService pendingCommentsService;


    @Scheduled(fixedRateString = "${spring.scheduler.fixed_rate}")
    public void balanceJob(){
        chatsJob();
        clientsJob();
    }

    //process all ready comments and boosts in chats
    private void chatsJob(){
        List<ChatDto> chats;
        try {
            chats = chatsService.getChats();
        }
        catch (Exception e){
            log.log(Level.SEVERE, "Error getting chats", e);
            return;
        }

        for (var chat : chats) {
            collectBalancesInChat(chat);
        }
    }

    //try to send positive balances to OrderService
    private void clientsJob(){
        List<ClientDto> clients;

        try{
            clients = clientsService.getClientsWithPositiveBalance();
        }
        catch (Exception e){
            log.log(Level.SEVERE, "Error getting clients", e);
            return;
        }

        for (var client : clients) {
            try {
                balanceService.sendClientBalance(client);
            }
            catch (Exception ignored){}
        }
    }


    private void collectBalancesInChat(ChatDto chat){
        try {
            List<PendingCommentDto> comments = collectPendingCommentsInChat(chat);

            for (PendingCommentDto comment : comments) {
                try{
                    balanceService.processPendingComment(comment, chat.getStoreId(), chat.getFanfCoinsPerComment());
                }
                catch (Exception e){
                    log.log(Level.WARNING, "error during processing comment" + comment, e);
                }
            }

        }
        catch (Exception e){
            log.log(Level.WARNING, "error processing pending comments", e);
        }


        try {
            List<PendingBoostDto> boosts = collectPendingBoostsInChat(chat);

            for (PendingBoostDto boost : boosts) {
                try{
                    balanceService.processPendingBoost(boost, chat.getStoreId(), chat.getFanfCoinsPerBoost());
                }
                catch (Exception e){
                    log.log(Level.WARNING, "error during processing boost" + boost, e);
                }
            }

        }
        catch (Exception e){
            log.log(Level.WARNING, "error processing pending boost", e);
        }
    }




    private List<PendingCommentDto> collectPendingCommentsInChat(ChatDto chat){
        long timeDiff = convertHourToMillisecond(chat.getCommentTimeWait());
        Timestamp timestamp = new Timestamp(System.currentTimeMillis() - timeDiff);
        return pendingCommentsService.getAllInChatBefore(chat.getTgChatId(), timestamp);
    }


    private List<PendingBoostDto> collectPendingBoostsInChat(ChatDto chat){
        long timeDiff = convertHourToMillisecond(chat.getBoostTimeWait());
        Timestamp timestamp = new Timestamp(System.currentTimeMillis() - timeDiff);
        return pendingBoostsService.getAllInChannelBefore(chat.getTgChannelId(), timestamp);
    }


    private long convertHourToMillisecond(int hour){
        return (long) hour * 60 * 60 * 1000;
    }
}
