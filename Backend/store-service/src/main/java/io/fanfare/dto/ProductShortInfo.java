package io.fanfare.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.fanfare.dto.customconstraint.ProductPriceConstraint;
import io.fanfare.dto.customconstraint.ProductTitleConstraint;
import io.fanfare.dto.customconstraint.URIConstraint;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.validation.annotation.Validated;

import java.net.URI;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Validated
public class ProductShortInfo {

    @NotNull
    @JsonProperty("product_id")
    @Schema(example = "507f1f77bcf86cd799439042", description = "Id of the product")
    private String productId;

    @NotNull
    @Schema(example = "Product title", description = "Title of the product")
    @ProductTitleConstraint
    private String title;

    @NotNull
    @Schema(example = "100000", description = "Price of the product in kopecks")
    @PositiveOrZero
    @ProductPriceConstraint
    private Integer price;

    @Nullable
    @JsonProperty("logo_url")
    @Schema(example = "https://i.pinimg.com/736x/5a/38/a6/5a38a6077eb3115b5ab1da7825d80032.jpg", description = "Image of the product")
    @URIConstraint
    private URI logoUrl;

}
