import { test } from '@playwright/test';
import createAuthLoginTests from './auth_service/auth_login.spec';

import createStoreCreationTests from './store_service/stores_post.spec';
import createPutStoreLogoTests from './store_service/stores_put_logo.spec';
import createGetFullInfoStoreTests from './store_service/stores_get_full_info.spec';
import createGetMyStoresTests from './store_service/stores_get_my_stores.spec';
import createGetShortInfoStoreTests from './store_service/stores_get_short_info.spec';
import createGetStoreListTests from './store_service/stores_get_stores.spec';
import { createStoreChangeInfoPositiveTests, createStoreChangeInfoNegativeTests } from './store_service/stores_patch_store.spec';

import createProductCreationTests from './store_service/products_post.spec';
import createPutProductLogoTests from './store_service/products_put_logo.spec';
import createGetFullInfoProductTests from './store_service/products_get_full_info.spec';
import createGetShortInfoProductTests from './store_service/products_get_short_info.spec';
import createGetProductListTests from './store_service/products_get_products.spec';
import createProductChangeInfoTests from './store_service/products_patch_product.spec';


/***
Tests for Auth_Service endpoints: /auth/login, /auth/validate, /auth/refresh, /auth/logout

Tests for Store_Service endpoints

First, you need to create account. 
Second, set up env variables URL, TEST_LIST_PATTERN, EMAIL and PASSWORD (look at example.env).
Third, run tests.
***/

test.describe("/auth/login POST requests @auth", createAuthLoginTests);
test.describe("/stores POST requests @stores", createStoreCreationTests);
test.describe("/products POST requests @products", createProductCreationTests);

test.describe("/stores/{store_id}/logo PUT requests @stores", createPutStoreLogoTests);
test.describe("/products/{product_id}/logo PUT requests @stores", createPutProductLogoTests);

test.describe("/stores/{store_id}/full GET requests @stores", createGetFullInfoStoreTests);
test.describe("/stores/{store_id}/short GET requests @stores", createGetShortInfoStoreTests);
test.describe("/stores GET requests @stores", createGetStoreListTests);
test.describe("/stores/my GET requests @stores", createGetMyStoresTests);

test.describe("/products/{product_id}/full GET requests @stores", createGetFullInfoProductTests);
test.describe("/products/{product_id}/short GET requests @stores", createGetShortInfoProductTests);
test.describe("/products GET requests @stores", createGetProductListTests);

test.describe("/stores/{store_id} PATCH requests @stores", createStoreChangeInfoPositiveTests);
test.describe("/stores/{store_id} PATCH requests @stores", createStoreChangeInfoNegativeTests);
test.describe("/products/{product_id} PATCH requests @stores", createProductChangeInfoTests);
