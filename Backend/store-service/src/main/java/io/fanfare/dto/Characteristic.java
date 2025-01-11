package io.fanfare.dto;

import io.fanfare.dto.customconstraint.CharacteristicNameConstraint;
import io.fanfare.dto.customconstraint.CharacteristicValueConstraint;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.validation.annotation.Validated;

@Data
@Validated
public class Characteristic {

    @NotNull
    @Schema(example = "Characteristic name", description = "Name of the characteristic")
    @CharacteristicNameConstraint
    private final String name;

    @NotNull
    @Schema(example = "Characteristic nam value", description = "Value of the characteristic")
    @CharacteristicValueConstraint
    private final String value;

}
