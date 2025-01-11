package io.fanfare.exception;

public class BrokenCrossDocumentRelationException extends RuntimeException {
    public BrokenCrossDocumentRelationException(String storeId, String productId) {
        super("Relation between stores and products collections is broken. Product with id: " + productId + " has store id: "
                + storeId + " ,but there is no store with such id");
    }
}
