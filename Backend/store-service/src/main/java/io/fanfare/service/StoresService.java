package io.fanfare.service;

import io.fanfare.api.AccessToken;
import io.fanfare.dto.*;
import io.fanfare.entities.Store;
import io.fanfare.exception.StoreNotFoundException;
import io.fanfare.exception.StoreTitleAlreadyTakenException;
import io.fanfare.exception.UserIsNotOwnerException;
import io.fanfare.exception.UserIsNotSellerException;
import io.fanfare.minio.MinioAdapter;
import io.fanfare.repository.StoresRepository;
import io.fanfare.service.util.StoreMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class StoresService {

    private final StoreMapper storeMapper;

    private final MinioAdapter minioAdapter;

    private final StoresRepository storesRepository;

    @Transactional
    public String addStore(CreateStoreModel createStoreModel, AccessToken accessToken) throws StoreTitleAlreadyTakenException, UserIsNotSellerException {
        if (!accessToken.isSeller()) {
            throw new UserIsNotSellerException(accessToken.getSub());
        }
        if(!storesRepository.findStores(createStoreModel.getTitle()).isEmpty()){
            throw new StoreTitleAlreadyTakenException(createStoreModel.getTitle());
        }
        Store store = new Store();
        storeMapper.toModel(createStoreModel, store);
        store.setOwnerId(accessToken.getSub());
        Store addedStore = storesRepository.insert(store);
        log.info("Store: {} added", addedStore);
        return addedStore.getStoreId();
    }

    public List<StoreShortInfo> getStoresList(String search) {
        search = Optional.ofNullable(search).orElse("");
        List<Store> storeList;
        storeList = storesRepository.findStores(search);
        List<StoreShortInfo> storeShortInfoList = new ArrayList<>();
        storeMapper.toModel(storeList, storeShortInfoList);
        return storeShortInfoList;
    }

    @Transactional
    public DetailResponse updateStore(String storeId, UpdateStoreModel updateStoreModel, AccessToken accessToken) throws StoreTitleAlreadyTakenException, StoreNotFoundException, UserIsNotOwnerException {
        if (storesRepository.findById(storeId).isEmpty()) {
            throw new StoreNotFoundException(storeId);
        }
        if(!storesRepository.findStores(updateStoreModel.getTitle()).isEmpty()){
            throw new StoreTitleAlreadyTakenException(updateStoreModel.getTitle());
        }
        if (!storesRepository.findById(storeId).get().getOwnerId().equals(accessToken.getSub())) {
            throw new UserIsNotOwnerException(storeId, accessToken.getSub());
        }
        Store store = storesRepository.findById(storeId).get();
        log.info("Updating store: {}", store);
        storeMapper.toModel(updateStoreModel, store);
        storesRepository.save(store);
        log.info("Store: {} updated", store);
        return new DetailResponse("Store successfully updated");
    }

    public StoreShortInfo getStoreInfoShort(String storeId) throws StoreNotFoundException {
        if (storesRepository.findById(storeId).isEmpty()) {
            throw new StoreNotFoundException(storeId);
        }
        Store store = storesRepository.findById(storeId).get();
        StoreShortInfo storeShortInfo = new StoreShortInfo();
        storeMapper.toModel(store, storeShortInfo);
        return storeShortInfo;
    }

    public StoreFullInfo getStoreInfoFull(String storeId) throws StoreNotFoundException {
        if (storesRepository.findById(storeId).isEmpty()) {
            throw new StoreNotFoundException(storeId);
        }
        Store store = storesRepository.findById(storeId).get();
        StoreFullInfo storeFullInfo = new StoreFullInfo();
        storeMapper.toModel(store, storeFullInfo);
        return storeFullInfo;
    }

    public List<StoreShortInfo> getMyStoresList(AccessToken accessToken) throws UserIsNotSellerException {
        if (!accessToken.isSeller()) {
            throw new UserIsNotSellerException(accessToken.getSub());
        }
        List<Store> storeList;
        storeList = storesRepository.findStoresByOwner(accessToken.getSub());
        List<StoreShortInfo> storeShortInfoList = new ArrayList<>();
        storeMapper.toModel(storeList, storeShortInfoList);
        return storeShortInfoList;
    }

    @Transactional
    public LogoUpdatedResponse updateStoreLogo(String storeId, MultipartFile logo, AccessToken accessToken) throws StoreNotFoundException, UserIsNotOwnerException {
        if (storesRepository.findById(storeId).isEmpty()) {
            throw new StoreNotFoundException(storeId);
        }
        if (!storesRepository.findById(storeId).get().getOwnerId().equals(accessToken.getSub())) {
            throw new UserIsNotOwnerException(storeId, accessToken.getSub());
        }
        URI logoUrl = minioAdapter.uploadStoreLogo(logo);
        Store store = storesRepository.findById(storeId).get();
        storeMapper.toModel(logoUrl, store);
        storesRepository.save(store);
        log.info("Store: {} logo updated", store);
        return new LogoUpdatedResponse(logoUrl);
    }

    public IsOwnerResponse isStoreOwner(String storeId, String userId) throws StoreNotFoundException {
        if (storesRepository.findById(storeId).isEmpty()) {
            throw new StoreNotFoundException(storeId);
        }
        return new IsOwnerResponse(storesRepository.findById(storeId).get().getOwnerId().equals(userId));
    }

    public List<StoreIdModel> getUserStores(String userId) {
        return storesRepository.findStoresByOwner(userId).stream().map(x -> new StoreIdModel(x.getStoreId())).toList();
    }
}
