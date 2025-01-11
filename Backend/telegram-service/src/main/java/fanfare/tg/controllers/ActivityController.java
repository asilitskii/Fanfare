package fanfare.tg.controllers;

import fanfare.tg.api.*;
import fanfare.tg.model.dto.ChatDto;
import fanfare.tg.model.dto.ChatDtoNullable;
import fanfare.tg.services.ChatsService;
import fanfare.tg.services.ClientsService;
import lombok.AllArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.logging.Level;

@RestController
@Log
@AllArgsConstructor
public class ActivityController implements ActivityApi {

    private final ChatsService chatsService;
    private final ClientsService clientsService;


    @Override
    public ResponseEntity<DetailResponse> createChannelActivity(ChatDto chat, TokenPayload principal) {

        log.log(Level.INFO, "create activity request store_id " + chat.getStoreId() + " for user " + principal.getSub());

        chatsService.addChat(chat, principal.getSub());

        return new ResponseEntity<>(new DetailResponse("Ok"), HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<DetailResponse> patchChannelActivity(ChatDtoNullable chat, TokenPayload principal) {

        log.log(Level.INFO, "patch activity request " + chat + " for user " + principal.getSub());

        chatsService.updateChat(chat, principal.getSub());

        return new ResponseEntity<>(new DetailResponse("Ok"), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<DetailResponse> deleteChannelActivity(String storeId, TokenPayload principal) {

        log.log(Level.INFO, "delete activity request store_id " + storeId + " for user " + principal.getSub());

        chatsService.deleteChat(storeId, principal.getSub());

        return new ResponseEntity<>(new DetailResponse("Ok"), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<DetailResponse> addChannelSubscription(String storeId, ActivitySubscriptionBody body, TokenPayload principal) {

        log.log(Level.INFO, "add activity subscription request store_id " + storeId + " for user " + principal.getSub());

        clientsService.addClient(body.getTgUserId(), storeId, principal.getSub());

        return new ResponseEntity<>(new DetailResponse("Ok"), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<DetailResponse> deleteChannelSubscription(String storeId, TokenPayload principal) {

        log.log(Level.INFO, "delete activity subscription request store_id " + storeId + " for user " + principal.getSub());

        clientsService.deleteClient(storeId, principal.getSub());

        return new ResponseEntity<>(new DetailResponse("Ok"), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<List<ChatDto>> getSubscriptions(TokenPayload principal) {

        log.log(Level.INFO, "get activity subscription request for user " + principal.getSub());

        List<ChatDto> result = clientsService.getUserStores(principal.getSub());

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<ResponseStoreExchangeRate> getStoreExchangeRates(String storeId) {

        log.log(Level.INFO, "get activity exchange rate request for store_id " + storeId);

        ChatDto chat = chatsService.getChatByStoreId(storeId);

        return new ResponseEntity<>(new ResponseStoreExchangeRate(chat.getFanfCoinsPerComment(), chat.getFanfCoinsPerBoost()), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<IsSubscribeResponse> isSubscribe(String storeId, TokenPayload principal) {

        log.log(Level.INFO, "is subscribe request store_id " + storeId +  " for user " + principal.getSub());

        IsSubscribeResponse res = new IsSubscribeResponse(clientsService.isExist(principal.getSub(), storeId));

        return new ResponseEntity<>(res, HttpStatus.OK);
    }
}
