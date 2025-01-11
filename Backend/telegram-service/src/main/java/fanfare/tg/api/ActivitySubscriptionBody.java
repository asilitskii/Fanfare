package fanfare.tg.api;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Digits;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.validation.annotation.Validated;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Validated
public class ActivitySubscriptionBody {

    @JsonProperty("tg_user_id")
    @Schema(example = "987654321", description = "Telegram user ID of the subscriber")
    @Digits(fraction = 0, integer = 19)
    private long tgUserId;
}
