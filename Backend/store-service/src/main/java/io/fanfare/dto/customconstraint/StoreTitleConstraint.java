package io.fanfare.dto.customconstraint;

import io.fanfare.dto.validator.StoreTitleValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = StoreTitleValidator.class)
public @interface StoreTitleConstraint {
    String message() default "Invalid store title";

    int maxLength() default 32;

    int minLength() default 2;

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
