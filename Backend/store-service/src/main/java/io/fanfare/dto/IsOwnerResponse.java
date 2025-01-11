package io.fanfare.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.validation.annotation.Validated;

@Data
@Validated
public class IsOwnerResponse {

    @NotNull
    @Schema(example = "true", description = "Is the user the owner of the store")
    private final boolean owner;

}
