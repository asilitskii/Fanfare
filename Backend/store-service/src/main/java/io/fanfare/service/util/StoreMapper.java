package io.fanfare.service.util;

import io.fanfare.dto.*;
import io.fanfare.entities.Store;
import org.mapstruct.*;

import java.net.URI;
import java.util.List;

@Mapper(componentModel = "spring")
public interface StoreMapper {
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void toModel(CreateStoreModel createStoreModel, @MappingTarget Store store);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void toModel(UpdateStoreModel updateStoreModel, @MappingTarget Store store);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void toModel(URI logoUrl, @MappingTarget Store store);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, unmappedTargetPolicy = ReportingPolicy.IGNORE)
    void toModel(Store store, @MappingTarget StoreShortInfo storeShortInfo);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, unmappedTargetPolicy = ReportingPolicy.IGNORE)
    void toModel(Store store, @MappingTarget StoreFullInfo storeFullInfo);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, unmappedTargetPolicy = ReportingPolicy.IGNORE)
    void toModel(List<Store> stores, @MappingTarget List<StoreShortInfo> storeShortInfos);
}

