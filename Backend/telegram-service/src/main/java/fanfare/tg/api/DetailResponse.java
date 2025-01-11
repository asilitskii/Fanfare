package fanfare.tg.api;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DetailResponse {

    @Schema(example = "detailed explain of result")
    private String detail;
}
