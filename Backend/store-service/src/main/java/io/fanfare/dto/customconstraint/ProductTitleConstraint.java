package io.fanfare.dto.customconstraint;

import io.fanfare.dto.validator.ProductTitleValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ProductTitleValidator.class)
public @interface ProductTitleConstraint {
    String message() default "Invalid product title";

    int maxLength() default 128;

    int minLength() default 1;

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
