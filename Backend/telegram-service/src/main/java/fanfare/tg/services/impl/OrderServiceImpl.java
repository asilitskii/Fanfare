package fanfare.tg.services.impl;

import com.fasterxml.jackson.annotation.JsonProperty;
import fanfare.tg.services.OrderService;
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
public class OrderServiceImpl implements OrderService {
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    private static class AddBalanceBody{
        @JsonProperty("user_id")
        UUID userId;

        @JsonProperty("store_id")
        String storeId;

        int delta;
    }

    @Value("${spring.order-service.connection_string}")
    private String connectionString;

    private final RestTemplate restTemplate;

    @Autowired
    public OrderServiceImpl(RestTemplateBuilder restTemplateBuilder) {
        restTemplate = restTemplateBuilder.errorHandler(new NoOpResponseErrorHandler()).build();
    }

    @Override
    public boolean addBalance(UUID userId, String storeId, int amount) {
        String serviceUrl = "%s/balances".formatted(
                connectionString
        );
        AddBalanceBody body = new AddBalanceBody(userId, storeId, amount);
        try {
            log.log(Level.INFO, "Sending balance to order-service with body {0}", body);
            ResponseEntity<String> res = restTemplate.postForEntity(
                    serviceUrl, body,
                    String.class
            );
            if (res.getStatusCode() != HttpStatus.OK) {
                log.log(Level.WARNING, "got unexpected status code from order-service "
                        + res.getStatusCode() + " " + serviceUrl + " send body " +  body);
                return false;
            }
            if (res.getBody() == null) {
                log.log(Level.WARNING, "got null response from order-service " + serviceUrl + " send body " +  body);
                return false;
            }
            return true;
        }
        catch (RestClientException e) {
            log.log(Level.WARNING, "can't make request to order-service :"
                    + serviceUrl + " exception " + e.getMessage());
            return false;
        }
    }
}
