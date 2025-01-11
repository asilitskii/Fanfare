package io.fanfare.api;

import com.google.gson.Gson;
import io.fanfare.exception.ParseTokenException;
import lombok.Getter;

import java.util.Base64;

@Getter
public class AccessToken {

    private long exp;

    private String sub;

    private boolean seller;

    static public AccessToken parseFromString(String token) throws ParseTokenException {
        try {
            String[] chunks = token.split("\\.");
            Base64.Decoder decoder = Base64.getUrlDecoder();
            String payload = new String(decoder.decode(chunks[1]));
            return new Gson().fromJson(payload, AccessToken.class);
        } catch (Exception e) {
            throw new ParseTokenException(token);
        }
    }

}
