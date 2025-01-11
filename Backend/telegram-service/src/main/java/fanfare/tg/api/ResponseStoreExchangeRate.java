package fanfare.tg.api;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ResponseStoreExchangeRate {
    @JsonProperty(value = "per_comment_points", required = true)
    @Schema(example = "2", requiredMode = Schema.RequiredMode.REQUIRED, description = "FanfCoin awarded per comment (must be greater than 0)")
    @Min(1)
    @Digits(fraction = 0, integer = 10)
    private int fanfCoinsPerComment;

    @JsonProperty(value = "per_boost_points", required = true)
    @Schema(example = "100", requiredMode = Schema.RequiredMode.REQUIRED, description = "FanfCoin awarded per boost (must be greater than 0)")
    @Min(1)
    @Digits(fraction = 0, integer = 10)
    private int fanfCoinsPerBoost;
}
