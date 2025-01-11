package io.fanfare.exception;

public class UserIsNotOwnerException extends Exception {
    public UserIsNotOwnerException(String storeId, String userId) {
        super("User with id: " + userId + " isn't the owner of the store with id: " + storeId);
    }
}
