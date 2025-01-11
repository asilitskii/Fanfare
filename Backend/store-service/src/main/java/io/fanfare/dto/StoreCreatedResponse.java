package io.fanfare.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.validation.annotation.Validated;

@Data
@Validated
public class StoreCreatedResponse {

    @NotNull
    @JsonProperty("store_id")
    @Schema(example = "507f1f77bcf86cd799439044", description = "Id of the store")
    private final String storeId;

}
