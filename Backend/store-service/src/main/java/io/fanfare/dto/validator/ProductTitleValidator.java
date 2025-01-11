package io.fanfare.dto.validator;

import io.fanfare.dto.customconstraint.ProductTitleConstraint;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class ProductTitleValidator implements ConstraintValidator<ProductTitleConstraint, String> {

    int minLength;
    int maxLength;

    @Override
    public void initialize(ProductTitleConstraint constraintAnnotation) {
        minLength = constraintAnnotation.minLength();
        maxLength = constraintAnnotation.maxLength();
    }

    @Override
    public boolean isValid(String title, ConstraintValidatorContext constraintValidatorContext) {
        if (title == null) {
            return true;
        }
        if (title.length() < minLength) {
            constraintValidatorContext.disableDefaultConstraintViolation();
            constraintValidatorContext.buildConstraintViolationWithTemplate("Tile of the product length must be larger than " + minLength).addConstraintViolation();
            return false;
        }
        if (title.length() > maxLength) {
            constraintValidatorContext.disableDefaultConstraintViolation();
            constraintValidatorContext.buildConstraintViolationWithTemplate("Title of the product length must be smaller than " + maxLength).addConstraintViolation();
            return false;
        }
        return true;
    }
}
