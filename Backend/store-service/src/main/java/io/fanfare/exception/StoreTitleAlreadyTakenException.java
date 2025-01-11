package io.fanfare.exception;

public class StoreTitleAlreadyTakenException extends Exception {
    public StoreTitleAlreadyTakenException(String message) {
        super(message);
    }

    public StoreTitleAlreadyTakenException(String title, Throwable cause) {
        super("Store with title: " + title + "already exists", cause);
    }
}
