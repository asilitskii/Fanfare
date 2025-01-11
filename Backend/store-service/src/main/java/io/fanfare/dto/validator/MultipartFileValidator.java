package io.fanfare.dto.validator;

import io.fanfare.dto.customconstraint.MultipartFileConstraint;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;

public class MultipartFileValidator implements ConstraintValidator<MultipartFileConstraint, MultipartFile> {

    int minSizeBytes;
    int maxSizeBytes;

    @Override
    public void initialize(MultipartFileConstraint multipartFileConstraint) {
        this.minSizeBytes = multipartFileConstraint.minSizeBytes();
        this.maxSizeBytes = multipartFileConstraint.maxSizeBytes();
    }

    @Override
    public boolean isValid(MultipartFile multipartFile, ConstraintValidatorContext constraintValidatorContext) {
        if (multipartFile == null) {
            return true;
        }
        if (multipartFile.getSize() > maxSizeBytes) {
            constraintValidatorContext.disableDefaultConstraintViolation();
            constraintValidatorContext.buildConstraintViolationWithTemplate("File too big").addConstraintViolation();
            return false;
        }
        if (multipartFile.getSize() < minSizeBytes) {
            constraintValidatorContext.disableDefaultConstraintViolation();
            constraintValidatorContext.buildConstraintViolationWithTemplate("File too small").addConstraintViolation();
            return false;
        }
        String fileType = multipartFile.getContentType();
        if (fileType == null | (!fileType.equals(MediaType.IMAGE_PNG.toString()) && !fileType.equals(MediaType.IMAGE_JPEG.toString()) &&
                !fileType.equals("image/webp") && !fileType.equals("image/svg+xml"))) {
            constraintValidatorContext.disableDefaultConstraintViolation();
            constraintValidatorContext.buildConstraintViolationWithTemplate("File must be png, jpeg, webp or svg image type").addConstraintViolation();
            return false;
        }
        return true;
    }
}
