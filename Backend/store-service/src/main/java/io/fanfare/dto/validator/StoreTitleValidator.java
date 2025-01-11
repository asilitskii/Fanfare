package io.fanfare.dto.validator;

import io.fanfare.dto.customconstraint.StoreTitleConstraint;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class StoreTitleValidator implements ConstraintValidator<StoreTitleConstraint, String> {

    int minLength;
    int maxLength;

    @Override
    public void initialize(StoreTitleConstraint constraintAnnotation) {
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
            constraintValidatorContext.buildConstraintViolationWithTemplate("Tile of the store length must be larger than " + minLength).addConstraintViolation();
            return false;
        }
        if (title.length() > maxLength) {
            constraintValidatorContext.disableDefaultConstraintViolation();
            constraintValidatorContext.buildConstraintViolationWithTemplate("Title of the store length must be smaller than " + maxLength).addConstraintViolation();
            return false;
        }
        return true;
    }
}
