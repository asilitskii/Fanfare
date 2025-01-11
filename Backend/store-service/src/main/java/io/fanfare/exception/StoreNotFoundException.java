package io.fanfare.exception;

public class StoreNotFoundException extends Exception {
    public StoreNotFoundException(String storeId) {
        super("Store with id: " + storeId + " does not exist");
    }
}
