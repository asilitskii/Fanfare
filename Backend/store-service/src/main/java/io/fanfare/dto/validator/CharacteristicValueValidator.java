package io.fanfare.dto.validator;

import io.fanfare.dto.customconstraint.CharacteristicValueConstraint;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class CharacteristicValueValidator implements ConstraintValidator<CharacteristicValueConstraint, String> {

    int minLength;
    int maxLength;

    @Override
    public void initialize(CharacteristicValueConstraint constraintAnnotation) {
        minLength = constraintAnnotation.minLength();
        maxLength = constraintAnnotation.maxLength();
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext constraintValidatorContext) {
        if (value == null) {
            return true;
        }
        if (value.length() < minLength) {
            constraintValidatorContext.disableDefaultConstraintViolation();
            constraintValidatorContext.buildConstraintViolationWithTemplate("Characteristic value length must be larger than " + minLength).addConstraintViolation();
            return false;
        }
        if (value.length() > maxLength) {
            constraintValidatorContext.disableDefaultConstraintViolation();
            constraintValidatorContext.buildConstraintViolationWithTemplate("Characteristic value length must be smaller than " + maxLength).addConstraintViolation();
            return false;
        }
        return true;
    }
}
