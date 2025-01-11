package fanfare.tg.services;

import java.util.UUID;

public interface StoreService {

    boolean isOwner(String storeId, UUID userId);
}
