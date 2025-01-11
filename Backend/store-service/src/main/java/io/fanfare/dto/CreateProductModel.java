package io.fanfare.dto;

import io.fanfare.dto.customconstraint.ProductCharacteristicsListConstraint;
import io.fanfare.dto.customconstraint.ProductDescriptionConstraint;
import io.fanfare.dto.customconstraint.ProductPriceConstraint;
import io.fanfare.dto.customconstraint.ProductTitleConstraint;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.validation.annotation.Validated;

import java.util.List;

@Data
@Validated
public class CreateProductModel {

    @NotNull
    @Schema(example = "Product title", description = "Title of the product")
    @ProductTitleConstraint
    private final String title;

    @NotNull
    @Schema(example = "Product description", description = "Description of the product")
    @ProductDescriptionConstraint
    private final String description;

    @NotNull
    @Schema(example = "100000", description = "Price of the product in kopecks")
    @ProductPriceConstraint
    private final int price;

    @NotNull
    @Schema(description = "Characteristics of the product")
    @ProductCharacteristicsListConstraint
    private final List<Characteristic> characteristics;

}
