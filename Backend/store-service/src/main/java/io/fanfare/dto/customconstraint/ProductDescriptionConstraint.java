package io.fanfare.dto.customconstraint;

import io.fanfare.dto.validator.ProductDescriptionValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ProductDescriptionValidator.class)
public @interface ProductDescriptionConstraint {
    String message() default "Invalid product description";

    int maxLength() default 4096;

    int minLength() default 0;

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
