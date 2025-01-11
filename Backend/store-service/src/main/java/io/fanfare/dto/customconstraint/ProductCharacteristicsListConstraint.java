package io.fanfare.dto.customconstraint;

import io.fanfare.dto.validator.ProductCharacteristicsListValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ProductCharacteristicsListValidator.class)
public @interface ProductCharacteristicsListConstraint {
    String message() default "Invalid product characteristics list size";

    int maxSize() default 128;

    int minSize() default 0;

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
