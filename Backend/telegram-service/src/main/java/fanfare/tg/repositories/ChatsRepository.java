package fanfare.tg.repositories;


import fanfare.tg.model.entities.ChatEntity;
import org.springframework.data.repository.ListCrudRepository;

import java.util.Optional;

public interface ChatsRepository extends ListCrudRepository<ChatEntity, String> {
    Optional<ChatEntity> findByTgChatId(long tgChatId);

    Optional<ChatEntity> findByTgChannelId(long tgChannelId);

    boolean existsByTgChatId(long tgChatId);

    boolean existsByTgChannelId(long tgChannelId);
}
