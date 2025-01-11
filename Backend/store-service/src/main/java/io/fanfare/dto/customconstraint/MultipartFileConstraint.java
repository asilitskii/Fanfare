package io.fanfare.dto.customconstraint;

import io.fanfare.dto.validator.MultipartFileValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = MultipartFileValidator.class)
public @interface MultipartFileConstraint {

    String message() default "Invalid multipart file";

    int maxSizeBytes() default 10 * 1024 * 1024;

    int minSizeBytes() default 0;

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
