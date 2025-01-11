package fanfare.tg.services;

import fanfare.tg.model.dto.ChatDto;
import fanfare.tg.model.dto.ChatDtoNullable;

import java.util.List;
import java.util.UUID;

public interface ChatsService {

    void addChat(ChatDto chatDto, UUID bloggerId);

    void deleteChat(String storeId, UUID BloggerId);

    void updateChat(ChatDtoNullable chatDto, UUID bloggerId);

    ChatDto getChatByTgChatId(long tgChatId);

    ChatDto getChatByTgChannelId(long tgChannelId);

    ChatDto getChatByStoreId(String storeId);

    List<ChatDto> getChats();
}
