import { test, expect } from "@fixtures/fixtures";
import { readFromReusableDataFile} from "@helpers/reusable_data_user"
import { faker } from '@faker-js/faker';

const storeIdLength = 24;

function sendRequestProductsGetProductsList(request, paramsData) {
    return request.get(`${process.env.URL}/products`, {
      params: paramsData
    });
}

export default function createGetProductListTests() {
    test("GET list of existing products in store@happy", async ({ request }) => {
        var buf = readFromReusableDataFile();
        const paramsData = {"store_id": buf.store_id, "require_logo": true};
        
        const response = await sendRequestProductsGetProductsList(request, paramsData);

        expect(response.status()).toBe(200); 
    });

    test("GET list of products in non-existing store@happy", async ({ request }) => {
        var buf = readFromReusableDataFile();
        const paramsData = {"store_id": faker.string.alpha(storeIdLength), "require_logo": true};

        const response = await sendRequestProductsGetProductsList(request, paramsData);
    
        expect(response.status()).toBe(404);
      });
}