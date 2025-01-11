package io.fanfare.exception;

import io.fanfare.dto.DetailResponse;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.method.MethodValidationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(value = {ParseTokenException.class, UserIsNotSellerException.class, UserIsNotOwnerException.class})
    public ResponseEntity<DetailResponse> authException(Exception ex, WebRequest request) {
        log.warn("403 error, access denied {}", ex.getMessage());
        DetailResponse detailResponse = new DetailResponse(ex.getMessage());
        return new ResponseEntity<>(detailResponse, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(value = {StoreTitleAlreadyTakenException.class})
    public ResponseEntity<DetailResponse> storeTitleAlreadyTakenException(Exception ex, WebRequest request) {
        log.warn("409 error, store title already taken {}", ex.getMessage());
        DetailResponse detailResponse = new DetailResponse(ex.getMessage());
        return new ResponseEntity<>(detailResponse, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(value = {StoreNotFoundException.class})
    public ResponseEntity<DetailResponse> storeNotFoundException(Exception ex, WebRequest request) {
        log.warn("404 error, store not found {}", ex.getMessage());
        DetailResponse detailResponse = new DetailResponse(ex.getMessage());
        return new ResponseEntity<>(detailResponse, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = {ProductNotFoundException.class})
    public ResponseEntity<DetailResponse> productNotFoundException(Exception ex, WebRequest request) {
        log.warn("404 error, product not found {}", ex.getMessage());
        DetailResponse detailResponse = new DetailResponse(ex.getMessage());
        return new ResponseEntity<>(detailResponse, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = {ConstraintViolationException.class, MethodArgumentNotValidException.class, HttpMessageNotReadableException.class, MethodValidationException.class})
    public ResponseEntity<DetailResponse> validationException(Exception ex, WebRequest request) {
        log.warn("422 error, validation error {}", ex.getMessage());
        DetailResponse detailResponse = new DetailResponse(ex.getMessage());
        return new ResponseEntity<>(detailResponse, HttpStatus.UNPROCESSABLE_ENTITY);
    }

}
