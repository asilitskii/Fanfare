package io.fanfare.dto.customconstraint;

import io.fanfare.dto.validator.URIValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = URIValidator.class)
public @interface URIConstraint {
    String message() default "Invalid uri";

    int maxLength() default 2083;

    int minLength() default 1;

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
