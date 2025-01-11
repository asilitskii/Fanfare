package fanfare.tg.repositories;

import fanfare.tg.model.entities.ClientEntity;
import fanfare.tg.model.entities.ClientEntityEmbeddedId;
import jakarta.validation.constraints.Min;
import org.springframework.data.repository.ListCrudRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ClientRepository extends ListCrudRepository<ClientEntity, ClientEntityEmbeddedId> {

    Optional<ClientEntity> findById_TgChatIdAndUserId(long tgChatId, UUID userId);

    List<ClientEntity> findAllByUserId(UUID userId);

    Optional<ClientEntity> findById_TgChannelIdAndId_TgUserId(long tgChannelId, long tgUserId);

    Optional<ClientEntity> findById_TgChatIdAndId_TgUserId(long tgChatId, long tgUserId);

    List<ClientEntity> findAllByBalanceGreaterThan(@Min(0) int balanceIsGreaterThan);
}
