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
public interface StoresApi {

    @Operation(
            operationId = "createStore",
            summary = "Create Store",
            tags = {"Stores"},
            responses = {
                    @ApiResponse(responseCode = "200", description = "Store successfully created", content = {
                            @Content(mediaType = "application/json", schema = @Schema(implementation = StoreCreatedResponse.class))
                    }),
                    @ApiResponse(responseCode = "403", description = "Permission denied", content = {
                            @Content(mediaType = "application/json", schema = @Schema(implementation = DetailResponse.class))
                    }),
                    @ApiResponse(responseCode = "409", description = "Title already taken", content = {
                            @Content(mediaType = "application/json", schema = @Schema(implementation = DetailResponse.class))
                    }),
                    @ApiResponse(responseCode = "422", description = "Validation Error", content = {
                            @Content(mediaType = "application/json", schema = @Schema(implementation = DetailResponse.class))
                    })
            },
            security = {
                    @SecurityRequirement(name = "OAuth2PasswordBearer")
            }
    )

    @RequestMapping(
            method = RequestMethod.POST,
            value = "/stores",
            produces = {"application/json"},
            consumes = {"application/json"}
    )
    ResponseEntity<StoreCreatedResponse> createStore(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody CreateStoreModel createStoreModel
    ) throws StoreTitleAlreadyTakenException, ParseTokenException, UserIsNotSellerException;


    @Operation(
            operationId = "getStoreList",
            summary = "Get Store List",
            tags = {"Stores"},
            responses = {
                    @ApiResponse(responseCode = "200", description = "A list of stores", content = {
                            @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = StoreShortInfo.class)))
                    })
            }
    )

    @RequestMapping(
            method = RequestMethod.GET,
            value = "/stores",
            produces = {"application/json"}
    )
    ResponseEntity<List<StoreShortInfo>> getStoreList(
            @Schema(example = "Store name")
            @RequestParam(value = "search", required = false) String search
    );


    @Operation(
            operationId = "updateStore",
            summary = "Update Store",
            tags = {"Stores"},
            responses = {
                    @ApiResponse(responseCode = "200", description = "Store successfully updated", content = {
                            @Content(mediaType = "application/json", schema = @Schema(implementation = DetailResponse.class))
                    }),
                    @ApiResponse(responseCode = "403", description = "Permission denied", content = {
                            @Content(mediaType = "application/json", schema = @Schema(implementation = DetailResponse.class))
                    }),
                    @ApiResponse(responseCode = "404", description = "Store is not found", content = {
                            @Content(mediaType = "application/json", schema = @Schema(implementation = DetailResponse.class))
                    }),
                    @ApiResponse(responseCode = "409", description = "Title already taken", content = {
                            @Content(mediaType = "application/json", schema = @Schema(implementation = DetailResponse.class))
                    }),
                    @ApiResponse(responseCode = "422", description = "Validation Error", content = {
                            @Content(mediaType = "application/json", schema = @Schema(implementation = DetailResponse.class))
                    })
            },
            security = {
                    @SecurityRequirement(name = "OAuth2PasswordBearer")
            }
    )

    @RequestMapping(
            method = RequestMethod.PATCH,
            value = "/stores/{store_id}",
            produces = {"application/json"},
            consumes = {"application/json"}
    )
    ResponseEntity<DetailResponse> updateStore(
            @RequestHeader("Authorization") String token,
            @Schema(example = "507f1f77bcf86cd799439044")
            @PathVariable(name = "store_id") String storeId,
            @Valid @RequestBody UpdateStoreModel updateStoreModel
    ) throws StoreTitleAlreadyTakenException, StoreNotFoundException, ParseTokenException, UserIsNotOwnerException;


    @Operation(
            operationId = "getStoreInfoShort",
            summary = "Get Store Short Info",
            tags = {"Stores"},
            responses = {
                    @ApiResponse(responseCode = "200", description = "Store is found", content = {
                            @Content(mediaType = "application/json", schema = @Schema(implementation = StoreShortInfo.class))
                    }),
                    @ApiResponse(responseCode = "404", description = "Store is not found", content = {
                            @Content(mediaType = "application/json", schema = @Schema(implementation = DetailResponse.class))
                    }),
                    @ApiResponse(responseCode = "422", description = "Validation Error", content = {
                            @Content(mediaType = "application/json", schema = @Schema(implementation = DetailResponse.class))
                    })
            }
    )

    @RequestMapping(
            method = RequestMethod.GET,
            value = "/stores/{store_id}/short",
            produces = {"application/json"}
    )
    ResponseEntity<StoreShortInfo> getStoreInfoShort(
            @Schema(example = "507f1f77bcf86cd799439044")
            @PathVariable(name = "store_id") String storeId
    ) throws StoreNotFoundException;


    @Operation(
            operationId = "getStoreInfoFull",
            summary = "Get Store Full Info",
            tags = {"Stores"},
            responses = {
                    @ApiResponse(responseCode = "200", description = "Store is found", content = {
                            @Content(mediaType = "application/json", schema = @Schema(implementation = StoreFullInfo.class))
                    }),
                    @ApiResponse(responseCode = "404", description = "Store is not found", content = {
                            @Content(mediaType = "application/json", schema = @Schema(implementation = DetailResponse.class))
                    }),
                    @ApiResponse(responseCode = "422", description = "Validation Error", content = {
                            @Content(mediaType = "application/json", schema = @Schema(implementation = DetailResponse.class))
                    })
            }
    )

    @RequestMapping(
            method = RequestMethod.GET,
            value = "/stores/{store_id}/full",
            produces = {"application/json"}
    )
    ResponseEntity<StoreFullInfo> getStoreInfoFull(
            @Schema(example = "507f1f77bcf86cd799439044")
            @PathVariable(name = "store_id") String storeId
    ) throws StoreNotFoundException;


    @RequestMapping(
            method = RequestMethod.GET,
            value = "/stores/my",
            produces = {"application/json"}
    )

    @Operation(
            operationId = "getMyStores",
            summary = "Get My Stores",
            tags = {"Stores"},
            responses = {
                    @ApiResponse(responseCode = "200", description = "Stores are found", content = {
                            @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = StoreShortInfo.class)))
                    }),
                    @ApiResponse(responseCode = "422", description = "Validation Error", content = {
                            @Content(mediaType = "application/json", schema = @Schema(implementation = DetailResponse.class))
                    }),
                    @ApiResponse(responseCode = "403", description = "Permission denied", content = {
                            @Content(mediaType = "application/json", schema = @Schema(implementation = DetailResponse.class))
                    })
            },
            security = {
                    @SecurityRequirement(name = "OAuth2PasswordBearer")
            }
    )
    ResponseEntity<List<StoreShortInfo>> getMyStores(
            @RequestHeader("Authorization") String token
    ) throws ParseTokenException, UserIsNotSellerException;


    @Operation(
            operationId = "updateStoreLogo",
            summary = "Update Store Logo",
            tags = {"Stores"},
            responses = {
                    @ApiResponse(responseCode = "200", description = "Store logo was updated", content = {
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
            value = "/stores/{store_id}/logo",
            produces = {"application/json"},
            consumes = {"multipart/form-data"}
    )
    ResponseEntity<LogoUpdatedResponse> updateStoreLogo(
            @RequestHeader("Authorization") String token,
            @Schema(example = "507f1f77bcf86cd799439044")
            @PathVariable(name = "store_id") String storeId,
            @Parameter(name = "logo", description = "The logo image file (PNG, JPEG, SVG or WEBP) - max 10MB", example = "http://asd/logo.png")
            @Valid @RequestPart(value = "logo") @MultipartFileConstraint MultipartFile logo
    ) throws StoreNotFoundException, ParseTokenException, UserIsNotOwnerException;

    @Operation(
            operationId = "isStoreOwner",
            summary = "Is Store Owner",
            tags = {"Stores"},
            responses = {
                    @ApiResponse(responseCode = "200", description = "Check was completed successfully", content = {
                            @Content(mediaType = "application/json", schema = @Schema(implementation = IsOwnerResponse.class))
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
            method = RequestMethod.GET,
            value = "/stores/{store_id}/is-owner",
            produces = {"application/json"}
    )
    ResponseEntity<IsOwnerResponse> isStoreOwner(
            @RequestHeader("Authorization") String token,
            @Schema(example = "507f1f77bcf86cd799439044")
            @PathVariable(name = "store_id") String storeId
    ) throws StoreNotFoundException, ParseTokenException;

    @Operation(
            operationId = "isStoreOwnerByUserId",
            summary = "Is Store Owner By User Id",
            tags = {"Internal"},
            responses = {
                    @ApiResponse(responseCode = "200", description = "Check was completed successfully", content = {
                            @Content(mediaType = "application/json", schema = @Schema(implementation = IsOwnerResponse.class))
                    }),
                    @ApiResponse(responseCode = "404", description = "Store is not found", content = {
                            @Content(mediaType = "application/json", schema = @Schema(implementation = DetailResponse.class))
                    })
            }
    )

    @RequestMapping(
            method = RequestMethod.GET,
            value = "/stores/{store_id}/is-owner-by-user-id",
            produces = {"application/json"}
    )
    ResponseEntity<IsOwnerResponse> isStoreOwnerByUserId(
            @Schema(example = "1522fd63-32d3-471c-9aa1-764e96dc0ef5")
            @RequestParam(name = "user_id") String userId,
            @Schema(example = "507f1f77bcf86cd799439044")
            @PathVariable(name = "store_id") String storeId
    ) throws StoreNotFoundException;


    @Operation(
            operationId = "storesListByUserId",
            summary = "Stores List By User Id",
            tags = {"Internal"},
            responses = {
                    @ApiResponse(responseCode = "200", description = "Stores list returned", content = {
                            @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = StoreIdModel.class)))
                    })
            }
    )

    @RequestMapping(
            method = RequestMethod.GET,
            value = "/stores/by-owner-id",
            produces = {"application/json"}
    )
    ResponseEntity<List<StoreIdModel>> getUserStores(
            @Schema(example = "1522fd63-32d3-471c-9aa1-764e96dc0ef5")
            @RequestParam(name = "user_id") String userId
    );
}
