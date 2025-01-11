package io.fanfare.dto.validator;

import io.fanfare.dto.customconstraint.ProductDescriptionConstraint;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class ProductDescriptionValidator implements ConstraintValidator<ProductDescriptionConstraint, String> {

    int minLength;
    int maxLength;

    @Override
    public void initialize(ProductDescriptionConstraint constraintAnnotation) {
        minLength = constraintAnnotation.minLength();
        maxLength = constraintAnnotation.maxLength();
    }

    @Override
    public boolean isValid(String description, ConstraintValidatorContext constraintValidatorContext) {
        if (description == null) {
            return true;
        }
        if (description.length() < minLength) {
            constraintValidatorContext.disableDefaultConstraintViolation();
            constraintValidatorContext.buildConstraintViolationWithTemplate("Description of the product length must be larger than " + minLength).addConstraintViolation();
            return false;
        }
        if (description.length() > maxLength) {
            constraintValidatorContext.disableDefaultConstraintViolation();
            constraintValidatorContext.buildConstraintViolationWithTemplate("Description of the product length must be smaller than " + maxLength).addConstraintViolation();
            return false;
        }
        return true;
    }
}
