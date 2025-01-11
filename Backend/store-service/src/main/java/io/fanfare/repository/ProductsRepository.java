package io.fanfare.repository;

import io.fanfare.entities.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface ProductsRepository extends MongoRepository<Product, String> {

    @Query("{'store_id' : ?0}")
    List<Product> findProducts(String storeId);

}
