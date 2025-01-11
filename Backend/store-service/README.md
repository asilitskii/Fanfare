# Store Service

## Launch

1. **Copy the Example Environment File** : Duplicate the `example-env` file and rename it to `.env`. This file contains
   credentials and configuration for MongoDB and MinIO.

```bash
cp example-env .env
```

2. **Edit Environment Variables** : Open the `.env` file and set your desired credentials for MongoDB and MinIO. For
   example:

```
SERVER_PORT: порт сервера

MULTIPART_FILE_MAX_SIZE: максимальный допустимый размер multipart-файла
REQUEST_MAX_SIZE: максимальный допустимый размер запроса

MONGO_INITDB_ROOT_USERNAME: имя root-пользователя mongodb
MONGO_INITDB_ROOT_PASSWORD: пароль root-пользователя mongodb
MONGO_DATABASE_NAME: наименование базы данных mongodb
MONGO_HOST: хост mongodb
MONGO_PORT: порт mongodb

MINIO_ROOT_USER: имя root-пользователя minio
MINIO_ROOT_PASSWORD: пароль root-пользователя minio
MINIO_CONNECT_HOST: хост minio
MINIO_CONNECT_PORT: порт minio
MINIO_IMAGE_URL_PREFIX: полный префикс ссылки на изображение
MINIO_STORES_BUCKET_NAME: наименование бакета с лого магазинов
MINIO_PRODUCTS_BUCKET_NAME: наименование бакета с лого продуктов
```

3. **Start the Services** : Run the following command to start the MongoDB and MinIO services in detached mode.

```bash
docker-compose up -d
```

#### Accessing Services

- **MongoDB** : Connect to MongoDB by navigating to `mongodb://localhost:27017` in your MongoDB client or using the
  following credentials from your `.env` file:
    - **Username** : `MONGO_INITDB_ROOT_USERNAME`

    - **Password** : `MONGO_INITDB_ROOT_PASSWORD`

- **MinIO S3** : Access the MinIO web interface by going to `http://localhost:9001` in your browser. Login using:
    - **Username** : `MINIO_ROOT_USER`

    - **Password** : `MINIO_ROOT_PASSWORD`

Now, you’re ready to use MongoDB and MinIO for your store-service application.

## Documentation

Documentation of launched server:

http://localhost:8000/docs
