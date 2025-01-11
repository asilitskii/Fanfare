package io.fanfare.controller;

import io.fanfare.api.AccessToken;
import io.fanfare.api.ProductsApi;
import io.fanfare.dto.*;
import io.fanfare.exception.ParseTokenException;
import io.fanfare.exception.ProductNotFoundException;
import io.fanfare.exception.StoreNotFoundException;
import io.fanfare.exception.UserIsNotOwnerException;
import io.fanfare.service.ProductsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@Slf4j
@RequiredArgsConstructor
public class ProductsController implements ProductsApi {

    private final ProductsService productsService;

    @Override
    public ResponseEntity<ProductCreatedResponse> createProduct(String token, String storeId, CreateProductModel createProductModel)
            throws StoreNotFoundException, ParseTokenException, UserIsNotOwnerException {
        log.info("POST request. Save product. Store id: {}   Request body: {}", storeId, createProductModel);
        String productId = productsService.addProduct(createProductModel, storeId, AccessToken.parseFromString(token));
        return ResponseEntity.ok(new ProductCreatedResponse(productId));
    }

    @Override
    public ResponseEntity<List<ProductShortInfo>> getProductList(String storeId) throws StoreNotFoundException {
        log.info("GET request. Get product list. Store id: {}", storeId);
        List<ProductShortInfo> productShortInfoList = productsService.getProductList(storeId);
        return ResponseEntity.ok(productShortInfoList);
    }

    @Override
    public ResponseEntity<DetailResponse> updateProduct(String token, String productId, UpdateProductModel updateProductModel)
            throws ProductNotFoundException, ParseTokenException, UserIsNotOwnerException {
        log.info("PATCH request. Update product. Product id: {}   Request body: {}", productId, updateProductModel);
        DetailResponse detailResponse = productsService.updateProduct(updateProductModel, productId, AccessToken.parseFromString(token));
        return ResponseEntity.ok(detailResponse);
    }

    @Override
    public ResponseEntity<ProductShortInfo> getProductInfoShort(String productId)
            throws ProductNotFoundException {
        log.info("GET request. Get product short info: {}", productId);
        return ResponseEntity.ok(productsService.getProductInfoShort(productId));
    }

    @Override
    public ResponseEntity<ProductFullInfo> getProductInfoFull(String productId)
            throws ProductNotFoundException {
        log.info("GET request. Get product full info: {}", productId);
        return ResponseEntity.ok(productsService.getProductInfoFull(productId));
    }

    @Override
    public ResponseEntity<LogoUpdatedResponse> updateProductLogo(String token, String productId, MultipartFile logo)
            throws ProductNotFoundException, ParseTokenException, UserIsNotOwnerException {
        log.info("PUT request. Update product logo. Product id: {}   Logo: {}", productId, logo);
        return ResponseEntity.ok(productsService.updateProductLogo(productId, logo, AccessToken.parseFromString(token)));
    }

}
