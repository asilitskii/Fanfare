package io.fanfare.entities;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.net.URI;

@Document(collection = "stores")
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class Store {

    @Id
    private String storeId;

    @Indexed(unique = true)
    private String title;

    private String description;

    @Indexed
    @Field("owner_id")
    private String ownerId;

    @Field("logo_url")
    private URI logoUrl;

}
