package fanfare.tg.services.impl;

import fanfare.tg.exceptions.StoreNotFoundException;
import fanfare.tg.services.StoreService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.NoOpResponseErrorHandler;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.UUID;
import java.util.logging.Level;

@Service
@Log
public class StoreServiceImpl implements StoreService {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    private static class IsOwnerBody{
        boolean owner;
    }


    @Value("${spring.store-service.connection_string}")
    private String connectionString;

    private final RestTemplate restTemplate;

    @Autowired
    public StoreServiceImpl(RestTemplateBuilder restTemplateBuilder) {
        restTemplate = restTemplateBuilder.errorHandler(new NoOpResponseErrorHandler()).build();
    }

    @Override
    public boolean isOwner(String storeId, UUID userId) {
        String serviceUrl = "%s/stores/%s/is-owner-by-user-id?user_id=%s".formatted(
                connectionString,
                storeId,
                userId.toString()
        );
        try {
            log.log(Level.INFO, "sending is-owner request to store service store_id {0} user_id {1}", new Object[]{storeId, userId});
            ResponseEntity<IsOwnerBody> res = restTemplate.getForEntity(
                    serviceUrl,
                    IsOwnerBody.class
            );

            if (res.getStatusCode() == HttpStatus.NOT_FOUND) {
                throw new StoreNotFoundException("Store with id " + storeId + " not found");
            }
            if (res.getStatusCode() != HttpStatus.OK) {
                throw new RuntimeException("got unexpected status code from store-service "
                                                + res.getStatusCode() + " " + serviceUrl);
            }
            if (res.getBody() == null) {
                throw new RuntimeException("got null response from store-service " + serviceUrl);
            }
            return res.getBody().owner;

        }
        catch (RestClientException e) {
            throw new RuntimeException("can't make request to store-service :"
                                                + serviceUrl + " exception " + e.getMessage(), e);
        }

    }

}
