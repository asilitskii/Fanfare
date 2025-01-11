package io.fanfare.api;

import io.fanfare.dto.*;
import io.fanfare.dto.customconstraint.MultipartFileConstraint;
import io.fanfare.exception.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Validated
public interface ProductsApi {

    @Operation(
            operationId = "createProduct",
            summary = "Create Product",
            tags = {"Products"},
            responses = {
                    @ApiResponse(responseCode = "200", description = "Product successfully created", content = {
                            @Content(mediaType = "application/json", schema = @Schema(implementation = ProductCreatedResponse.class))
                    }),
                    @ApiResponse(responseCode = "422", description = "Validation error", content = {
                            @Content(mediaType = "application/json", schema = @Schema(implementation = DetailResponse.class))
                    }),
                    @ApiResponse(responseCode = "403", description = "Permission denied", content = {
                            @Content(mediaType = "application/json", schema = @Schema(implementation = DetailResponse.class))
                    }),
                    @ApiResponse(responseCode = "404", description = "Store is not found", content = {
                            @Content(mediaType = "application/json", schema = @Schema(implementation = DetailResponse.class))
                    })
            },
            security = {
                    @SecurityRequirement(name = "OAuth2PasswordBearer")
            }
    )

    @RequestMapping(
            method = RequestMethod.POST,
            value = "/products",
            produces = {"application/json"},
            consumes = {"application/json"}
    )
    ResponseEntity<ProductCreatedResponse> createProduct(
            @RequestHeader("Authorization") String token,
            @Schema(example = "507f1f77bcf86cd799439044")
            @RequestParam(value = "store_id") String storeId,
            @Valid @RequestBody CreateProductModel createProductModel
    ) throws StoreNotFoundException, StoreTitleAlreadyTakenException, ParseTokenException, UserIsNotOwnerException;


    @Operation(
            operationId = "getProductList",
            summary = "Get Product List",
            tags = {"Products"},
            responses = {
                    @ApiResponse(responseCode = "200", description = "Store is found", content = {
                            @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = ProductShortInfo.class)))
                    }),
                    @ApiResponse(responseCode = "404", description = "Store is not found", content = {
                            @Content(mediaType = "application/json", schema = @Schema(implementation = DetailResponse.class))
                    })
            }
    )

    @RequestMapping(
            method = RequestMethod.GET,
            value = "/products",
            produces = {"application/json"}
    )
    ResponseEntity<List<ProductShortInfo>> getProductList(
            @Schema(example = "507f1f77bcf86cd799439044")
            @RequestParam(value = "store_id") String storeId
    ) throws StoreNotFoundException;


    @Operation(
            operationId = "updateProduct",
            summary = "Update Product",
            tags = {"Products"},
            responses = {
                    @ApiResponse(responseCode = "200", description = "Product successfully updated", content = {
                            @Content(mediaType = "application/json", schema = @Schema(implementation = DetailResponse.class))
                    }),
                    @ApiResponse(responseCode = "422", description = "Validation error", content = {
                            @Content(mediaType = "application/json", schema = @Schema(implementation = DetailResponse.class))
                    }),
                    @ApiResponse(responseCode = "403", description = "Permission denied", content = {
                            @Content(mediaType = "application/json", schema = @Schema(implementation = DetailResponse.class))
                    }),
                    @ApiResponse(responseCode = "404", description = "Product is not found", content = {
                            @Content(mediaType = "application/json", schema = @Schema(implementation = DetailResponse.class))
                    })
            },
            security = {
                    @SecurityRequirement(name = "OAuth2PasswordBearer")
            }
    )

    @RequestMapping(
            method = RequestMethod.PATCH,
            value = "/products/{product_id}",
            produces = {"application/json"},
            consumes = {"application/json"}
    )
    ResponseEntity<DetailResponse> updateProduct(
            @RequestHeader("Authorization") String token,
            @Schema(example = "507f1f77bcf86cd799439042")
            @PathVariable(name = "product_id") String productId,
            @Valid @RequestBody UpdateProductModel updateProductModel
    ) throws ProductNotFoundException, ParseTokenException, UserIsNotOwnerException;


    @Operation(
            operationId = "getProductInfoShort",
            summary = "Get Product Short Info",
            tags = {"Products"},
            responses = {
                    @ApiResponse(responseCode = "200", description = "Product is found", content = {
                            @Content(mediaType = "application/json", schema = @Schema(implementation = ProductShortInfo.class))
                    }),
                    @ApiResponse(responseCode = "404", description = "Product is not found", content = {
                            @Content(mediaType = "application/json", schema = @Schema(implementation = DetailResponse.class))
                    })
            }
    )

    @RequestMapping(
            method = RequestMethod.GET,
            value = "/products/{product_id}/short",
            produces = {"application/json"}
    )
    ResponseEntity<ProductShortInfo> getProductInfoShort(
            @Schema(example = "507f1f77bcf86cd799439042")
            @PathVariable(name = "product_id") String productId
    ) throws ProductNotFoundException;


    @Operation(
            operationId = "getProductInfoFull",
            summary = "Get Product Full Info",
            tags = {"Products"},
            responses = {
                    @ApiResponse(responseCode = "200", description = "Product is found", content = {
                            @Content(mediaType = "application/json", schema = @Schema(implementation = ProductFullInfo.class))
                    }),
                    @ApiResponse(responseCode = "404", description = "Product is not found", content = {
                            @Content(mediaType = "application/json", schema = @Schema(implementation = DetailResponse.class))
                    })
            }
    )

    @RequestMapping(
            method = RequestMethod.GET,
            value = "/products/{product_id}/full",
            produces = {"application/json"}
    )
    ResponseEntity<ProductFullInfo> getProductInfoFull(
            @Schema(example = "507f1f77bcf86cd799439042")
            @PathVariable(name = "product_id") String productId
    ) throws ProductNotFoundException;


    @Operation(
            operationId = "updateProductLogo",
            summary = "Update Product Logo",
            tags = {"Products"},
            responses = {
                    @ApiResponse(responseCode = "200", description = "Product logo was updated", content = {
                            @Content(mediaType = "application/json", schema = @Schema(implementation = LogoUpdatedResponse.class))
                    }),
                    @ApiResponse(responseCode = "422", description = "File format is incorrect", content = {
                            @Content(mediaType = "application/json", schema = @Schema(implementation = DetailResponse.class))
                    }),
                    @ApiResponse(responseCode = "403", description = "Permission denied", content = {
                            @Content(mediaType = "application/json", schema = @Schema(implementation = DetailResponse.class))
                    }),
                    @ApiResponse(responseCode = "404", description = "Product is not found", content = {
                            @Content(mediaType = "application/json", schema = @Schema(implementation = DetailResponse.class))
                    }),
                    @ApiResponse(responseCode = "413", description = "File is too large", content = {
                            @Content(mediaType = "application/json", schema = @Schema(implementation = DetailResponse.class))
                    })
            },
            security = {
                    @SecurityRequirement(name = "OAuth2PasswordBearer")
            }
    )

    @RequestMapping(
            method = RequestMethod.PUT,
            value = "/products/{product_id}/logo",
            produces = {"application/json"},
            consumes = {"multipart/form-data"}
    )
    ResponseEntity<LogoUpdatedResponse> updateProductLogo(
            @RequestHeader("Authorization") String token,
            @Schema(example = "507f1f77bcf86cd799439042")
            @PathVariable(name = "product_id") String productId,
            @Parameter(name = "logo", description = "The logo image file (PNG, JPEG, SVG or WEBP) - max 10MB", example = "http://asd/logo.png")
            @Valid @RequestPart(value = "logo") @MultipartFileConstraint MultipartFile logo
    ) throws ProductNotFoundException, ParseTokenException, UserIsNotOwnerException;

}
