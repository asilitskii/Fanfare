package io.fanfare.dto.customconstraint;

import io.fanfare.dto.validator.ProductPriceValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ProductPriceValidator.class)
public @interface ProductPriceConstraint {
    String message() default "Invalid product price";

    int maxPrice() default 999999999;

    int minPrice() default 0;

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
