package fanfare.tg.api;

import fanfare.tg.model.dto.ChatDto;
import fanfare.tg.model.dto.ChatDtoNullable;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;

import java.util.List;


@RequestMapping(value = "/tg/activity")
public interface ActivityApi  {

    @PostMapping(
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    @Operation(summary = "Create TG channel activity collection for a store",
            description = "Creates a store for a blogger with settings for awarding FanfCoin for comments and boosts",
            security = {@SecurityRequirement(name = "bearerAuth")})
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201",
                    description = "Store created successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = DetailResponse.class))),

            @ApiResponse(responseCode = "409",
                    description = "Store already exists or tg_chat_id or tg_channel_id is taken by different store",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = DetailResponse.class))),

            @ApiResponse(responseCode = "403",
                    description = "User is not the owner of this store",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = DetailResponse.class))),

            @ApiResponse(responseCode = "422",
                    description = "Validation error",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = DetailResponse.class))),

            @ApiResponse(responseCode = "401",
                    description = "Invalid or missing access token",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = DetailResponse.class)))})
    ResponseEntity<DetailResponse> createChannelActivity(@NotNull @RequestBody @Valid ChatDto chat, @AuthenticationPrincipal TokenPayload principal);

    @PatchMapping(
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    @Operation(summary = "Update TG channel activity collection settings",
            description = "Updates the FanfCoin award rates and comment waiting time for a store",
            security = {@SecurityRequirement(name = "bearerAuth")})
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "Store settings updated successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = DetailResponse.class))),

            @ApiResponse(responseCode = "404",
                    description = "Store not found",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = DetailResponse.class))),

            @ApiResponse(responseCode = "403",
                    description = "User is not the owner of this store",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = DetailResponse.class))),

            @ApiResponse(responseCode = "422",
                    description = "Validation error",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = DetailResponse.class))),

            @ApiResponse(responseCode = "401",
                    description = "Invalid or missing access token",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = DetailResponse.class)))})
    ResponseEntity<DetailResponse> patchChannelActivity(@NotNull @RequestBody @Valid ChatDtoNullable chat,
                                                        @AuthenticationPrincipal TokenPayload principal);

    @DeleteMapping(
            produces = MediaType.APPLICATION_JSON_VALUE,
            params = "store_id"
    )
    @Operation(summary = "Stop TG channel activity tracking in store",
            description = "Stops tracking activity for the specified store",
            security = {@SecurityRequirement(name = "bearerAuth")})
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "Activity tracking stopped successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = DetailResponse.class))),

            @ApiResponse(responseCode = "404",
                    description = "Store not found",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = DetailResponse.class))),

            @ApiResponse(responseCode = "403",
                    description = "User is not the owner of this store",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = DetailResponse.class))),

            @ApiResponse(responseCode = "422",
                    description = "Validation error",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = DetailResponse.class))),

            @ApiResponse(responseCode = "401",
                    description = "Invalid or missing access token",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = DetailResponse.class)))})
    ResponseEntity<DetailResponse> deleteChannelActivity(@NotNull @RequestParam("store_id") @Size(min = 24, max = 24) @Valid String storeId,
                                                         @AuthenticationPrincipal TokenPayload principal);

    @PostMapping( value = "/{store_id}/subscribe",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    @Operation(summary = "Subscribe to TG channel activity updates",
            description = "Allows a user to subscribe to activity updates for a specific store",
            security = {@SecurityRequirement(name = "bearerAuth")})
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "Successfully subscribed to store activity",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = DetailResponse.class))),

            @ApiResponse(responseCode = "404",
                    description = "Store not found",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = DetailResponse.class))),

            @ApiResponse(responseCode = "422",
                    description = "Validation error",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = DetailResponse.class))),

            @ApiResponse(responseCode = "401",
                    description = "Invalid or missing access token",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = DetailResponse.class))) })
    ResponseEntity<DetailResponse> addChannelSubscription(@NotNull @PathVariable("store_id") @Size(min = 24, max = 24) @Valid String storeId,
                                                          @NotNull @RequestBody @Valid ActivitySubscriptionBody body,
                                                          @AuthenticationPrincipal TokenPayload principal);
    @PostMapping( value = "/{store_id}/unsubscribe",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    @Operation(summary = "Unsubscribe from TG channel activity updates",
            description = "Allows a user to unsubscribe from activity updates for a specific store",
            security = {@SecurityRequirement(name = "bearerAuth")})
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "Successfully unsubscribed from store activity",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = DetailResponse.class))),

            @ApiResponse(responseCode = "404",
                    description = "Store not found",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = DetailResponse.class))),

            @ApiResponse(responseCode = "422",
                    description = "Validation error",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = DetailResponse.class))),

            @ApiResponse(responseCode = "401",
                    description = "Invalid or missing access token",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = DetailResponse.class))) })
    ResponseEntity<DetailResponse> deleteChannelSubscription(@NotNull @PathVariable("store_id") @Size(min = 24, max = 24) @Valid String storeId,
                                                             @AuthenticationPrincipal TokenPayload principal);

    @GetMapping( value = "/subscriptions",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    @Operation(summary = "Get list of TG channel subscriptions",
            description = "Retrieves a list of all stores to which the user is subscribed, including store ID, TG chat ID, and activity tracking settings",
            security = {@SecurityRequirement(name = "bearerAuth")})
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "List of subscribed stores retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = ChatDto.class)))),

            @ApiResponse(responseCode = "401",
                    description = "Invalid or missing access token",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = DetailResponse.class))) })
    ResponseEntity<List<ChatDto>>  getSubscriptions(@AuthenticationPrincipal TokenPayload principal);


    @GetMapping( value = "/{store_id}",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    @Operation(summary = "Get Info about exchange rates on specific store",
            description = "Retrieves info about specific store that present in data base")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "Info about exchange rates",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ResponseStoreExchangeRate.class))),

            @ApiResponse(responseCode = "404",
                    description = "Store not found",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = DetailResponse.class))) })
    ResponseEntity<ResponseStoreExchangeRate>  getStoreExchangeRates(@NotNull @PathVariable("store_id") @Size(min = 24, max = 24) @Valid String storeId);

    @GetMapping( value = "/{store_id}/subscribe",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    @Operation(summary = "Get subscribe status for store_id",
            description = "Allows to get user subscribe status for a store",
            security = {@SecurityRequirement(name = "bearerAuth")})
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "Successfully get subscribe status",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = IsSubscribeResponse.class))),

            @ApiResponse(responseCode = "404",
                    description = "Store not found",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = DetailResponse.class))),

            @ApiResponse(responseCode = "422",
                    description = "Validation error",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = DetailResponse.class))),

            @ApiResponse(responseCode = "401",
                    description = "Invalid or missing access token",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = DetailResponse.class))) })
    ResponseEntity<IsSubscribeResponse> isSubscribe(@NotNull @PathVariable("store_id") @Size(min = 24, max = 24) @Valid String storeId,
                                                    @AuthenticationPrincipal TokenPayload principal);
}
