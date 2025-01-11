package fanfare.tg.controllers;

import fanfare.tg.api.DetailResponse;
import fanfare.tg.exceptions.*;
import lombok.extern.java.Log;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.method.annotation.HandlerMethodValidationException;

import java.util.logging.Level;

@ControllerAdvice
@Log
public class ControllerAdvisor{

    @ExceptionHandler(NotOwnerException.class)
    public ResponseEntity<DetailResponse> handleNotOwnerException(NotOwnerException e) {
        log.log(Level.WARNING, e.getMessage());
        return new ResponseEntity<>(new DetailResponse("User is not owner of store"), HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(StoreAlreadyExistsException.class)
    public ResponseEntity<DetailResponse> handleStoreAlreadyExistsException(StoreAlreadyExistsException e) {
        log.log(Level.WARNING, e.getMessage());
        return new ResponseEntity<>(new DetailResponse("Store already exists"), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(StoreNotFoundException.class)
    public ResponseEntity<DetailResponse> handleStoreNotFoundException(StoreNotFoundException e) {
        log.log(Level.WARNING, e.getMessage());
        return new ResponseEntity<>(new DetailResponse("Store not found"), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(UserIsNotSubscribed.class)
    public ResponseEntity<DetailResponse> handleUserIsNotSubscribed(UserIsNotSubscribed e) {
        log.log(Level.WARNING, e.getMessage());
        return new ResponseEntity<>(new DetailResponse("User is not subscribed"), HttpStatus.OK);
    }

    @ExceptionHandler(RuntimeException.class)
    protected ResponseEntity<DetailResponse> handleRuntimeException(RuntimeException ex) {
        log.log(Level.WARNING, ex.getMessage(), ex);
        return new ResponseEntity<>(new DetailResponse("Internal Server Error"), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler({InvalidTokenException.class, MissingTokenException.class})
    public ResponseEntity<DetailResponse> handleJwtValidationException(Exception ex) {
        log.log(Level.WARNING, ex.getMessage());

        return new ResponseEntity<>(new DetailResponse("Invalid or missing access token"), HttpStatus.UNAUTHORIZED);
    }


    @ExceptionHandler({HandlerMethodValidationException.class, HttpMessageNotReadableException.class})
    public ResponseEntity<DetailResponse> handleException(Exception ex) {
        log.log(Level.WARNING, ex.getMessage());
        return new ResponseEntity<>(new DetailResponse("Arguments not valid"), HttpStatus.UNPROCESSABLE_ENTITY);
    }
}
