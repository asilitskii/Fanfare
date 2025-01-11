package io.fanfare.exception;

public class ParseTokenException extends Exception {
    public ParseTokenException(String token) {
        super("Can't parse token: " + token);
    }
}
