package io.fanfare.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.fanfare.dto.customconstraint.StoreDescriptionConstraint;
import io.fanfare.dto.customconstraint.StoreTitleConstraint;
import io.fanfare.dto.customconstraint.URIConstraint;
import io.fanfare.dto.customconstraint.UUID4Constraint;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.validation.annotation.Validated;

import java.net.URI;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Validated
public class StoreFullInfo {

    @NotNull
    @JsonProperty("store_id")
    @Schema(example = "507f1f77bcf86cd799439044", description = "Id of the store")
    private String storeId;

    @NotNull
    @Schema(example = "Store title", description = "Title of the store")
    @StoreTitleConstraint
    private String title;

    @NotNull
    @Schema(example = "Store description", description = "Description of the store")
    @StoreDescriptionConstraint
    private String description;

    @Nullable
    @JsonProperty("logo_url")
    @Schema(example = "https://i.pinimg.com/736x/5a/38/a6/5a38a6077eb3115b5ab1da7825d80032.jpg", description = "Logo image of the store")
    @URIConstraint
    private URI logoUrl;

}
