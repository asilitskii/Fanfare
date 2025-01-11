package fanfare.tg.services.impl;

import fanfare.tg.exceptions.NotOwnerException;
import fanfare.tg.exceptions.StoreAlreadyExistsException;
import fanfare.tg.exceptions.StoreNotFoundException;
import fanfare.tg.model.dto.ChatDto;
import fanfare.tg.model.dto.ChatDtoNullable;
import fanfare.tg.model.entities.ChatEntity;
import fanfare.tg.repositories.ChatsRepository;
import fanfare.tg.services.ChatsService;
import fanfare.tg.services.StoreService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChatsServiceImpl implements ChatsService {
    private final ChatsRepository chatsRepository;
    private final StoreService storeService;
    private final ModelMapper modelMapper;


    @Transactional
    @Override
    public void addChat(ChatDto chatDto, UUID bloggerId) {
        if (!storeService.isOwner(chatDto.getStoreId(), bloggerId)) {
            throw new NotOwnerException("user " + bloggerId + "does not own store " + chatDto.getStoreId());
        }

        if (chatsRepository.existsById(chatDto.getStoreId()) ||
                chatsRepository.existsByTgChatId(chatDto.getTgChatId()) ||
                chatsRepository.existsByTgChannelId(chatDto.getTgChannelId())){
            throw new StoreAlreadyExistsException("Store with tg_chat_id " + chatDto.getTgChatId() + " or store_id " 
                    + chatDto.getStoreId() + " or channel_id " + chatDto.getTgChannelId() +  " already exists");
        }

        ChatEntity chat = modelMapper.map(chatDto, ChatEntity.class);
        chat.setBloggerId(bloggerId);

        chatsRepository.save(chat);
    }

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    @Override
    public void deleteChat(String storeId, UUID bloggerId) {
        //we don't check ownership with order-service because we have bloggerId in DataBase

        Optional<ChatEntity> chat = chatsRepository.findById(storeId);
        if (chat.isEmpty()){
            throw new StoreNotFoundException("Store with id " + storeId + " not found");
        }
        if (!chat.get().getBloggerId().equals(bloggerId)){
            throw new NotOwnerException("User " + bloggerId + " is not owner of store " + storeId);
        }

        chatsRepository.deleteById(chat.get().getStoreId());
    }

    @Override
    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public void updateChat(ChatDtoNullable chatDto, UUID bloggerId) {
        //we don't check ownership with order-service because we have bloggerId in DataBase

        Optional<ChatEntity> chatOptional = chatsRepository.findById(chatDto.getStoreId());
        if (chatOptional.isEmpty()){
            throw new StoreNotFoundException("Store with id " + chatDto.getStoreId() + " not found");
        }
        
        if (chatDto.getTgChatId() != null && chatOptional.get().getTgChatId() != chatDto.getTgChatId() 
                && chatsRepository.existsByTgChatId(chatDto.getTgChatId())){
            throw new StoreAlreadyExistsException("Store with id " + chatDto.getTgChatId() + " already exists");
        }

        if (chatDto.getTgChannelId() != null && chatOptional.get().getTgChannelId() != chatDto.getTgChannelId()
                && chatsRepository.existsByTgChannelId(chatDto.getTgChannelId())){
            throw new StoreAlreadyExistsException("Store with id " + chatDto.getTgChatId() + " already exists");
        }

        if (!chatOptional.get().getBloggerId().equals(bloggerId)){
            throw new NotOwnerException("User " + bloggerId + " is not owner of store " + chatDto.getStoreId());
        }

        makeChatEntityFromNullableDto(chatDto, chatOptional.get());
        chatsRepository.save(chatOptional.get());
    }

    private static void makeChatEntityFromNullableDto(ChatDtoNullable chatDto, ChatEntity chat) {

        if (chatDto.getTgChatId() != null){
            chat.setTgChatId(chatDto.getTgChatId());
        }
        if (chatDto.getBoostTimeWait() != null){
            chat.setBoostTimeWait(chatDto.getBoostTimeWait());
        }
        if (chatDto.getCommentTimeWait() != null){
            chat.setCommentTimeWait(chatDto.getCommentTimeWait());
        }
        if (chatDto.getFanfCoinsPerBoost() != null){
            chat.setFanfCoinsPerBoost(chatDto.getFanfCoinsPerBoost());
        }
        if (chatDto.getFanfCoinsPerComment() != null){
            chat.setFanfCoinsPerComment(chatDto.getFanfCoinsPerComment());
        }
        if (chatDto.getTgChannelId() != null){
            chat.setTgChannelId(chatDto.getTgChannelId());
        }
    }

    @Override
    public ChatDto getChatByTgChatId(long tgChatId) {
        Optional<ChatEntity> chat = chatsRepository.findByTgChatId(tgChatId);
        return chat.map(chatEntity -> modelMapper.map(chatEntity, ChatDto.class)).orElse(null);
    }

    @Override
    public ChatDto getChatByTgChannelId(long tgChannelId) {
        return chatsRepository.findByTgChannelId(tgChannelId).map(chatEntity -> modelMapper.map(chatEntity, ChatDto.class)).orElse(null);
    }

    @Override
    public ChatDto getChatByStoreId(String storeId) {
        Optional<ChatEntity> chat = chatsRepository.findById(storeId);
        if (chat.isEmpty()){
            throw new StoreNotFoundException("Store with id " + storeId + " not found");
        }
        return chat.map(chatEntity -> modelMapper.map(chatEntity, ChatDto.class)).orElse(null);
    }

    @Override
    public List<ChatDto> getChats() {
        return chatsRepository.findAll().stream().map(
                chatEntity -> modelMapper.map(chatEntity, ChatDto.class)).toList();
    }

}
