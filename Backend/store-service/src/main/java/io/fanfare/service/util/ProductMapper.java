package io.fanfare.service.util;

import io.fanfare.dto.CreateProductModel;
import io.fanfare.dto.ProductFullInfo;
import io.fanfare.dto.ProductShortInfo;
import io.fanfare.dto.UpdateProductModel;
import io.fanfare.entities.Product;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.net.URI;
import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void toModel(CreateProductModel createProductModel, @MappingTarget Product product);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void toModel(UpdateProductModel updateProductModel, @MappingTarget Product product);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void toModel(URI logoUrl, @MappingTarget Product product);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void toModel(Product product, @MappingTarget ProductShortInfo productShortInfo);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void toModel(Product product, @MappingTarget ProductFullInfo productFullInfo);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void toModel(List<Product> products, @MappingTarget List<ProductShortInfo> productShortInfos);
}

