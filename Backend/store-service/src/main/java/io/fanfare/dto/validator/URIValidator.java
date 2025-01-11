package io.fanfare.dto.validator;

import io.fanfare.dto.customconstraint.URIConstraint;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.net.URI;

public class URIValidator implements ConstraintValidator<URIConstraint, URI> {

    int minLength;
    int maxLength;

    @Override
    public void initialize(URIConstraint constraintAnnotation) {
        minLength = constraintAnnotation.minLength();
        maxLength = constraintAnnotation.maxLength();
    }

    @Override
    public boolean isValid(URI uri, ConstraintValidatorContext constraintValidatorContext) {
        if (uri == null) {
            return true;
        }
        if (uri.toString().length() < minLength) {
            constraintValidatorContext.disableDefaultConstraintViolation();
            constraintValidatorContext.buildConstraintViolationWithTemplate("URI length must be larger than " + minLength).addConstraintViolation();
            return false;
        }
        if (uri.toString().length() > maxLength) {
            constraintValidatorContext.disableDefaultConstraintViolation();
            constraintValidatorContext.buildConstraintViolationWithTemplate("URI length must be smaller than " + maxLength).addConstraintViolation();
            return false;
        }
        return true;
    }
}
