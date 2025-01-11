package io.fanfare.repository;

import io.fanfare.entities.Store;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface StoresRepository extends MongoRepository<Store, String> {

    @Query("{'title' : {$regex: ?0, $options: 'i'}}")
    List<Store> findStores(String search);

    @Query("{'owner_id' : ?0}")
    List<Store> findStoresByOwner(String ownerId);

}
