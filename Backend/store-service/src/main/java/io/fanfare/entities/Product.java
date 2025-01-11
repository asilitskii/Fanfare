package io.fanfare.entities;

import io.fanfare.dto.Characteristic;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.index.TextIndexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.net.URI;
import java.util.List;

@Document(collection = "products")
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class Product {

    @Id
    private String productId;

    @TextIndexed
    private String title;

    private String description;

    @Indexed
    private int price;

    @Indexed
    @Field("store_id")
    private String storeId;

    private List<Characteristic> characteristics;

    @Field("logo_url")
    private URI logoUrl;

}
