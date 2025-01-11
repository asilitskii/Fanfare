package io.fanfare.dto.validator;

import io.fanfare.dto.customconstraint.CharacteristicNameConstraint;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class CharacteristicNameValidator implements ConstraintValidator<CharacteristicNameConstraint, String> {

    int minLength;
    int maxLength;

    @Override
    public void initialize(CharacteristicNameConstraint constraintAnnotation) {
        minLength = constraintAnnotation.minLength();
        maxLength = constraintAnnotation.maxLength();
    }

    @Override
    public boolean isValid(String name, ConstraintValidatorContext constraintValidatorContext) {
        if (name == null) {
            return true;
        }
        if (name.length() < minLength) {
            constraintValidatorContext.disableDefaultConstraintViolation();
            constraintValidatorContext.buildConstraintViolationWithTemplate("Characteristic name length must be larger than " + minLength).addConstraintViolation();
            return false;
        }
        if (name.length() > maxLength) {
            constraintValidatorContext.disableDefaultConstraintViolation();
            constraintValidatorContext.buildConstraintViolationWithTemplate("Characteristic name length must be smaller than " + maxLength).addConstraintViolation();
            return false;
        }
        return true;
    }
}
