package io.fanfare.dto.customconstraint;

import io.fanfare.dto.validator.CharacteristicValueValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = CharacteristicValueValidator.class)
public @interface CharacteristicValueConstraint {
    String message() default "Invalid characteristic value";

    int maxLength() default 32;

    int minLength() default 0;

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
