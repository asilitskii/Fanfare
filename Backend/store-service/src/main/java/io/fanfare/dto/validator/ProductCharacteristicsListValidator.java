package io.fanfare.dto.validator;

import io.fanfare.dto.Characteristic;
import io.fanfare.dto.customconstraint.ProductCharacteristicsListConstraint;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.List;

public class ProductCharacteristicsListValidator implements ConstraintValidator<ProductCharacteristicsListConstraint, List<Characteristic>> {

    int minSize;
    int maxSize;

    @Override
    public void initialize(ProductCharacteristicsListConstraint constraintAnnotation) {
        minSize = constraintAnnotation.minSize();
        maxSize = constraintAnnotation.maxSize();
    }

    @Override
    public boolean isValid(List<Characteristic> characteristics, ConstraintValidatorContext constraintValidatorContext) {
        if (characteristics == null) {
            return true;
        }
        if (characteristics.size() < minSize) {
            constraintValidatorContext.disableDefaultConstraintViolation();
            constraintValidatorContext.buildConstraintViolationWithTemplate("Size of characteristics list of the product must be larger than " + minSize).addConstraintViolation();
            return false;
        }
        if (characteristics.size() > maxSize) {
            constraintValidatorContext.disableDefaultConstraintViolation();
            constraintValidatorContext.buildConstraintViolationWithTemplate("Size of characteristics list of the product must be smaller than " + maxSize).addConstraintViolation();
            return false;
        }
        return true;
    }
}
