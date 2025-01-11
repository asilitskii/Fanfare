package fanfare.tg.services.impl;

import fanfare.tg.exceptions.StoreNotFoundException;
import fanfare.tg.exceptions.UserIsNotSubscribed;
import fanfare.tg.model.dto.ChatDto;
import fanfare.tg.model.dto.ClientDto;
import fanfare.tg.model.entities.ChatEntity;
import fanfare.tg.model.entities.ClientEntity;
import fanfare.tg.model.entities.ClientEntityEmbeddedId;
import fanfare.tg.repositories.ChatsRepository;
import fanfare.tg.repositories.ClientRepository;
import fanfare.tg.services.ClientsService;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class ClientsServiceImpl implements ClientsService {

    private final ModelMapper modelMapper;
    private final ChatsRepository chatsRepository;
    private final ClientRepository clientRepository;

    @Override
    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public void addClient(long tgUserId, String storeId, UUID userId) {
        Optional<ChatEntity> chat = chatsRepository.findById(storeId);
        if (chat.isEmpty()){
            throw new StoreNotFoundException("Store not found " + storeId);
        }
        Optional<ClientEntity> testUnique = clientRepository.findById_TgChatIdAndId_TgUserId(chat.get().getTgChatId(), tgUserId);

        if (testUnique.isPresent()){
            return;
        }

        testUnique = clientRepository.findById_TgChatIdAndUserId(chat.get().getTgChatId(), userId);

        ClientEntity client = new ClientEntity();
        client.setId(new ClientEntityEmbeddedId(tgUserId, chat.get().getTgChatId(), chat.get().getTgChannelId()));
        client.setUserId(userId);
        if (testUnique.isPresent()){
            clientRepository.delete(testUnique.get());
            client.setBalance(testUnique.get().getBalance());
        }
        else {
            client.setBalance(0);
        }

        clientRepository.save(client);
    }

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    @Override
    public void deleteClient(String storeId, UUID userId) {
        Optional<ChatEntity> chat = chatsRepository.findById(storeId);
        if (chat.isEmpty()){
            throw new StoreNotFoundException("Store not found " + storeId);
        }

        Optional<ClientEntity> client = clientRepository.findById_TgChatIdAndUserId(chat.get().getTgChatId(), userId);
        if (client.isEmpty()){
            throw new UserIsNotSubscribed("User " + userId + " is not subscribed on store " + storeId);
        }

        clientRepository.delete(client.get());
    }

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    @Override
    public void addBalanceByTgChatId(long tgUserId, long tgChatId, int balanceDiff) {
        Optional<ClientEntity> client = clientRepository.findById_TgChatIdAndId_TgUserId(tgChatId, tgUserId);
        if (client.isEmpty()){
            return;
        }
        ClientEntity clientUpdated = client.get();
        clientUpdated.setBalance(balanceDiff + clientUpdated.getBalance());
        clientRepository.save(clientUpdated);
    }

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    @Override
    public void addBalanceByTgChannelId(long tgUserId, long tgChannelId, int balanceDiff) {
        Optional<ClientEntity> client = clientRepository.findById_TgChannelIdAndId_TgUserId(tgChannelId, tgUserId);
        if (client.isEmpty()){
            return;
        }
        ClientEntity clientUpdated = client.get();
        clientUpdated.setBalance(balanceDiff + clientUpdated.getBalance());
        clientRepository.save(clientUpdated);
    }

    @Override
    public UUID getUserIdByTgUserIdAndTgChatId(long tgUserId, long tgChatId) {
        Optional<ClientEntity> client = clientRepository.findById_TgChatIdAndId_TgUserId(tgChatId, tgUserId);
        return client.map(ClientEntity::getUserId).orElse(null);
    }

    @Override
    public UUID getUserIdByTgUserIdAndTgChannelId(long tgUserId, long tgChannelId) {
        Optional<ClientEntity> client = clientRepository.findById_TgChannelIdAndId_TgUserId(tgChannelId, tgUserId);
        return client.map(ClientEntity::getUserId).orElse(null);
    }

    @Override
    public List<ChatDto> getUserStores(UUID userId) {
        List<ClientEntity> allEntities = clientRepository.findAllByUserId(userId);
        List<ChatEntity> chats = new ArrayList<>();
        for (ClientEntity clientEntity : allEntities){
            chatsRepository.findByTgChatId(clientEntity.getId().getTgChatId()).map(chats::add);
        }
        return chats.stream().map(chat -> modelMapper.map(chat, ChatDto.class)).toList();
    }

    @Override
    public boolean isExist(UUID userId, String storeId) {
        Optional<ChatEntity> chat = chatsRepository.findById(storeId);
        if (chat.isEmpty()){
            throw new StoreNotFoundException("Store not found " + storeId);
        }
        Optional<ClientEntity> client = clientRepository.findById_TgChatIdAndUserId(chat.get().getTgChatId(), userId);
        return client.isPresent();
    }

    @Override
    public List<ClientDto> getClientsWithPositiveBalance() {
        return clientRepository.findAllByBalanceGreaterThan(0).stream()
                .map(entity -> modelMapper.map(entity, ClientDto.class)).toList();
    }

    @Override
    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public void subClientBalance(ClientDto client) {
        Optional<ClientEntity> clientEntity = clientRepository.findById_TgChatIdAndId_TgUserId(client.getTgChatId(), client.getTgUserId());
        if (clientEntity.isEmpty()){
            return;
        }
        ClientEntity clientToSave = clientEntity.get();

        clientToSave.setBalance(clientToSave.getBalance() - client.getBalance());
        clientRepository.save(clientToSave);
    }
}
