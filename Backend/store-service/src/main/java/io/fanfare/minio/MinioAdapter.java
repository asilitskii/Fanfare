package io.fanfare.minio;

import io.fanfare.exception.UploadLogoException;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class MinioAdapter {

    private final MinioClient minioClient;

    @Value("${spring.minio.image-url-prefix}")
    private String imageUrlPrefix;

    @Value("${spring.minio.stores-bucket-name}")
    private String storesBucketName;

    @Value("${spring.minio.products-bucket-name}")
    private String productsBucketName;

    public URI uploadStoreLogo(MultipartFile logoFile) throws UploadLogoException {
        return uploadImageToBucket(logoFile, storesBucketName);
    }

    public URI uploadProductLogo(MultipartFile logoFile) throws UploadLogoException {
        return uploadImageToBucket(logoFile, productsBucketName);
    }

    public URI uploadImageToBucket(MultipartFile logoFile, String bucketName) throws UploadLogoException {
        try {
            String imageName = generateUniqueFileName();
            minioClient.putObject(PutObjectArgs.builder()
                    .bucket(bucketName)
                    .object(imageName)
                    .contentType(logoFile.getContentType())
                    .stream(logoFile.getInputStream(), logoFile.getSize(), -1)
                    .build());
            return new URI(imageUrlPrefix + "/" + bucketName + "/" + imageName);
        } catch (Exception e) {
            throw new UploadLogoException(e);
        }
    }

    String generateUniqueFileName() {
        return new Date().getTime() + ":" + RandomStringUtils.randomAlphanumeric(13);
    }
}