package io.fanfare.dto.customconstraint;

import io.fanfare.dto.validator.CharacteristicNameValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = CharacteristicNameValidator.class)
public @interface CharacteristicNameConstraint {
    String message() default "Invalid characteristic name";

    int maxLength() default 64;

    int minLength() default 0;

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
