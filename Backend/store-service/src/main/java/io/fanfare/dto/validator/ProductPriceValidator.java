package io.fanfare.dto.validator;

import io.fanfare.dto.customconstraint.ProductPriceConstraint;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class ProductPriceValidator implements ConstraintValidator<ProductPriceConstraint, Integer> {

    int minPrice;
    int maxPrice;

    @Override
    public void initialize(ProductPriceConstraint constraintAnnotation) {
        minPrice = constraintAnnotation.minPrice();
        maxPrice = constraintAnnotation.maxPrice();
    }

    @Override
    public boolean isValid(Integer price, ConstraintValidatorContext constraintValidatorContext) {
        if (price == null) {
            return true;
        }
        if (price < minPrice) {
            constraintValidatorContext.disableDefaultConstraintViolation();
            constraintValidatorContext.buildConstraintViolationWithTemplate("Price of the product must be larger than " + minPrice).addConstraintViolation();
            return false;
        }
        if (price > maxPrice) {
            constraintValidatorContext.disableDefaultConstraintViolation();
            constraintValidatorContext.buildConstraintViolationWithTemplate("Price of the product must be smaller than " + maxPrice).addConstraintViolation();
            return false;
        }
        return true;
    }
}
