package io.fanfare.service;

import io.fanfare.api.AccessToken;
import io.fanfare.dto.*;
import io.fanfare.entities.Product;
import io.fanfare.exception.BrokenCrossDocumentRelationException;
import io.fanfare.exception.ProductNotFoundException;
import io.fanfare.exception.StoreNotFoundException;
import io.fanfare.exception.UserIsNotOwnerException;
import io.fanfare.minio.MinioAdapter;
import io.fanfare.repository.ProductsRepository;
import io.fanfare.repository.StoresRepository;
import io.fanfare.service.util.ProductMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
@Slf4j
@RequiredArgsConstructor
public class ProductsService {

    private final ProductMapper productMapper;

    private final ProductsRepository productsRepository;

    private final MinioAdapter minioAdapter;

    private final StoresRepository storesRepository;

    public String addProduct(CreateProductModel createProductModel, String storeId, AccessToken accessToken) throws StoreNotFoundException, UserIsNotOwnerException {
        Product product = new Product();
        productMapper.toModel(createProductModel, product);
        product.setStoreId(storeId);
        if (storesRepository.findById(storeId).isEmpty()) {
            throw new StoreNotFoundException(storeId);
        }
        if (!Objects.equals(storesRepository.findById(storeId).get().getOwnerId(), accessToken.getSub())) {
            throw new UserIsNotOwnerException(storeId, accessToken.getSub());
        }
        Product addedProduct = productsRepository.insert(product);
        log.info("Product: {} added", addedProduct);
        return addedProduct.getProductId();
    }

    public List<ProductShortInfo> getProductList(String storeId) throws StoreNotFoundException {
        if (storesRepository.findById(storeId).isEmpty()) {
            throw new StoreNotFoundException(storeId);
        }
        List<Product> productList;
        productList = productsRepository.findProducts(storeId);
        List<ProductShortInfo> productShortInfoList = new ArrayList<>();
        productMapper.toModel(productList, productShortInfoList);
        return productShortInfoList;
    }

    @Transactional
    public DetailResponse updateProduct(UpdateProductModel updateProductModel, String productId, AccessToken accessToken) throws ProductNotFoundException, UserIsNotOwnerException {
        if (productsRepository.findById(productId).isEmpty()) {
            throw new ProductNotFoundException(productId);
        }
        String storeId = productsRepository.findById(productId).get().getStoreId();
        if (storesRepository.findById(storeId).isEmpty()) {
            throw new BrokenCrossDocumentRelationException(productId, storeId);
        }
        if (!storesRepository.findById(storeId).get().getOwnerId().equals(accessToken.getSub())) {
            throw new UserIsNotOwnerException(storeId, accessToken.getSub());
        }
        Product product = productsRepository.findById(productId).get();
        log.info("Updating product: {}", product);
        productMapper.toModel(updateProductModel, product);
        productsRepository.save(product);
        log.info("Product: {} updated", product);
        return new DetailResponse("Product successfully updated");
    }

    public ProductShortInfo getProductInfoShort(String productId) throws ProductNotFoundException {
        if (productsRepository.findById(productId).isEmpty()) {
            throw new ProductNotFoundException(productId);
        }
        Product product = productsRepository.findById(productId).get();
        ProductShortInfo productShortInfo = new ProductShortInfo();
        productMapper.toModel(product, productShortInfo);
        return productShortInfo;
    }

    public ProductFullInfo getProductInfoFull(String productId) throws ProductNotFoundException {
        if (productsRepository.findById(productId).isEmpty()) {
            throw new ProductNotFoundException(productId);
        }
        Product product = productsRepository.findById(productId).get();
        ProductFullInfo productFullInfo = new ProductFullInfo();
        productMapper.toModel(product, productFullInfo);
        return productFullInfo;
    }

    @Transactional
    public LogoUpdatedResponse updateProductLogo(String productId, MultipartFile logo, AccessToken accessToken) throws ProductNotFoundException, UserIsNotOwnerException {
        if (productsRepository.findById(productId).isEmpty()) {
            throw new ProductNotFoundException(productId);
        }
        String storeId = productsRepository.findById(productId).get().getStoreId();
        if (storesRepository.findById(storeId).isEmpty()) {
            throw new BrokenCrossDocumentRelationException(productId, storeId);
        }
        if (!storesRepository.findById(storeId).get().getOwnerId().equals(accessToken.getSub())) {
            throw new UserIsNotOwnerException(storeId, accessToken.getSub());
        }
        URI logoUrl = minioAdapter.uploadProductLogo(logo);
        Product product = productsRepository.findById(productId).get();
        productMapper.toModel(logoUrl, product);
        productsRepository.save(product);
        log.info("Product: {} logo updated", product);
        return new LogoUpdatedResponse(logoUrl);
    }
}
