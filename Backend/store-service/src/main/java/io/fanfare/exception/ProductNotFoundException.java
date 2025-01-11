package io.fanfare.exception;

public class ProductNotFoundException extends Exception {
    public ProductNotFoundException(String productId) {
        super("Product with id: " + productId + " does not exist");
    }
}
