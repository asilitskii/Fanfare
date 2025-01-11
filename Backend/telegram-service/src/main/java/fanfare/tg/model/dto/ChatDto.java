package fanfare.tg.model.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import org.springframework.validation.annotation.Validated;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Validated
public class ChatDto {

    @JsonProperty(value = "store_id", required = true)
    @Schema(example = "123456789012345678901234", requiredMode = Schema.RequiredMode.REQUIRED, description = "Store ID from Store service.")
    @Size(min = 24, max = 24)
    private String storeId;

    //we don't add BloggerId so no one can see it

    @JsonProperty(value = "tg_chat_id", required = true)
    @Schema(example = "123456789", requiredMode = Schema.RequiredMode.REQUIRED, description = "The Telegram chat ID (supergroup) of the blogger")
    @Digits(fraction = 0, integer = 19)
    private long tgChatId;

    @JsonProperty(value = "tg_channel_id", required = true)
    @Schema(example = "1233455543", requiredMode = Schema.RequiredMode.REQUIRED, description = "The Telegram channel ID of the blogger")
    @Digits(fraction = 0, integer = 19)
    private long tgChannelId;

    @JsonProperty(value = "comment_time_wait", required = true)
    @Schema(example = "2", requiredMode = Schema.RequiredMode.REQUIRED, description = "The waiting time before comments are credited (in hours, must be between 1 and 168).")
    @Min(0) @Max(168)
    @Digits(fraction = 0, integer = 3)
    private int commentTimeWait;

    @JsonProperty(value = "per_comment_points", required = true)
    @Schema(example = "2", requiredMode = Schema.RequiredMode.REQUIRED, description = "FanfCoin awarded per comment (must be greater than 0)")
    @Min(1)
    @Digits(fraction = 0, integer = 10)
    private int fanfCoinsPerComment;

    @JsonProperty(value = "boost_time_wait", required = true)
    @Schema(example = "1", requiredMode = Schema.RequiredMode.REQUIRED, description = "The waiting time before boosts are credited (in hours, must be between 1 and 168)")
    @Min(0) @Max(168)
    @Digits(fraction = 0, integer = 3)
    private int boostTimeWait;

    @JsonProperty(value = "per_boost_points", required = true)
    @Schema(example = "100", requiredMode = Schema.RequiredMode.REQUIRED, description = "FanfCoin awarded per boost (must be greater than 0)")
    @Min(1)
    @Digits(fraction = 0, integer = 10)
    private int fanfCoinsPerBoost;
}
