package io.fanfare.exception;

public class UserIsNotSellerException extends Exception {
    public UserIsNotSellerException(String userId) {
        super("User with id: " + userId + "doesn't have seller role");
    }
}
