package io.fanfare.dto;

import io.fanfare.dto.customconstraint.StoreDescriptionConstraint;
import io.fanfare.dto.customconstraint.StoreTitleConstraint;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import org.springframework.validation.annotation.Validated;

@Data
@Validated
public class UpdateStoreModel {

    @Schema(example = "Store title", description = "Title of the store")
    @StoreTitleConstraint
    private final String title;

    @Schema(example = "Store description", description = "Description of the store")
    @StoreDescriptionConstraint
    private final String description;

}
