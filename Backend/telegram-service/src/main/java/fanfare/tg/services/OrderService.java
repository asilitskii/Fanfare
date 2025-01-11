package fanfare.tg.services;

import java.util.UUID;

public interface OrderService {

    boolean addBalance(UUID userId, String storeId, int amount);
}
