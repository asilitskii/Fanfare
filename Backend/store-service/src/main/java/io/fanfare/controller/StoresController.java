package io.fanfare.controller;

import io.fanfare.api.AccessToken;
import io.fanfare.api.StoresApi;
import io.fanfare.dto.*;
import io.fanfare.exception.*;
import io.fanfare.service.StoresService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@Slf4j
@RequiredArgsConstructor
public class StoresController implements StoresApi {

    private final StoresService storesService;

    @Override
    public ResponseEntity<StoreCreatedResponse> createStore(String token, CreateStoreModel createStoreModel)
            throws StoreTitleAlreadyTakenException, ParseTokenException, UserIsNotSellerException {
        log.info("POST request. Save store : {}", createStoreModel);
        String storeId = storesService.addStore(createStoreModel, AccessToken.parseFromString(token));
        StoreCreatedResponse storeCreatedResponse = new StoreCreatedResponse(storeId);
        return ResponseEntity.ok(storeCreatedResponse);
    }

    @Override
    public ResponseEntity<List<StoreShortInfo>> getStoreList(String search) {
        log.info("GET request. Get stores list. Search: {}", search);
        List<StoreShortInfo> storeShortInfos = storesService.getStoresList(search);
        return ResponseEntity.ok(storeShortInfos);
    }

    @Override
    public ResponseEntity<DetailResponse> updateStore(String token, String storeId, UpdateStoreModel updateStoreModel)
            throws StoreTitleAlreadyTakenException, StoreNotFoundException, ParseTokenException, UserIsNotOwnerException {
        log.info("PATCH request. Update Store. Store id: {}   Request body: {}", storeId, updateStoreModel);
        return ResponseEntity.ok(storesService.updateStore(storeId, updateStoreModel, AccessToken.parseFromString(token)));
    }

    @Override
    public ResponseEntity<StoreShortInfo> getStoreInfoShort(String storeId)
            throws StoreNotFoundException {
        log.info("GET request. Get store short info: {}", storeId);
        return ResponseEntity.ok(storesService.getStoreInfoShort(storeId));
    }

    @Override
    public ResponseEntity<StoreFullInfo> getStoreInfoFull(String storeId)
            throws StoreNotFoundException {
        log.info("GET request. Get store full info: {}", storeId);
        return ResponseEntity.ok(storesService.getStoreInfoFull(storeId));
    }

    @Override
    public ResponseEntity<List<StoreShortInfo>> getMyStores(String token)
            throws ParseTokenException, UserIsNotSellerException {
        AccessToken accessToken = AccessToken.parseFromString(token);
        log.info("GET request. Get my stores. UserId: {}", accessToken.getSub());
        List<StoreShortInfo> storeShortInfos = storesService.getMyStoresList(accessToken);
        return ResponseEntity.ok(storeShortInfos);
    }

    @Override
    public ResponseEntity<LogoUpdatedResponse> updateStoreLogo(String token, String storeId, MultipartFile logo)
            throws StoreNotFoundException, ParseTokenException, UserIsNotOwnerException {
        log.info("PUT request. Update store logo. Store id: {}   Logo: {}", storeId, logo);
        return ResponseEntity.ok(storesService.updateStoreLogo(storeId, logo, AccessToken.parseFromString(token)));
    }

    @Override
    public ResponseEntity<IsOwnerResponse> isStoreOwner(String token, String storeId) throws StoreNotFoundException, ParseTokenException {
        String userId = AccessToken.parseFromString(token).getSub();
        log.info("GET request. Is user with user id: {} the owner of the store with store id: {}", userId, storeId);
        IsOwnerResponse isOwnerResponse = storesService.isStoreOwner(storeId, userId);
        return ResponseEntity.ok(isOwnerResponse);
    }

    @Override
    public ResponseEntity<IsOwnerResponse> isStoreOwnerByUserId(String userId, String storeId) throws StoreNotFoundException {
        log.info("Internal GET request. Is user with user id: {} the owner of the store with store id: {}", userId, storeId);
        IsOwnerResponse isOwnerResponse = storesService.isStoreOwner(storeId, userId);
        return ResponseEntity.ok(isOwnerResponse);
    }

    @Override
    public ResponseEntity<List<StoreIdModel>> getUserStores(String userId) {
        log.info("Internal GET request. Get stores by user id: {}", userId);
        List<StoreIdModel> storeIdModel = storesService.getUserStores(userId);
        return ResponseEntity.ok(storeIdModel);
    }

}
