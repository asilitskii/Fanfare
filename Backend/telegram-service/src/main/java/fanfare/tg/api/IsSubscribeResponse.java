package fanfare.tg.api;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class IsSubscribeResponse {
    @JsonProperty(value = "is_subscribe", required = true)
    @Schema(example = "true", requiredMode = Schema.RequiredMode.REQUIRED, description = "True if user is subscribed to given channel.")
    private boolean isSubscribe;
}
