package io.fanfare.dto.customconstraint;

import io.fanfare.dto.validator.StoreDescriptionValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = StoreDescriptionValidator.class)
public @interface StoreDescriptionConstraint {
    String message() default "Invalid store description";

    int maxLength() default 600;

    int minLength() default 0;

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
