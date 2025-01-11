package io.fanfare.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.fanfare.dto.customconstraint.URIConstraint;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.validation.annotation.Validated;

import java.net.URI;

@Data
@Validated
public class LogoUpdatedResponse {

    @NotNull
    @JsonProperty("logo_url")
    @Schema(example = "https://i.pinimg.com/736x/5a/38/a6/5a38a6077eb3115b5ab1da7825d80032.jpg", description = "Logo image")
    @URIConstraint
    private final URI logoUrl;

}
