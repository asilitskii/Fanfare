import { test, expect } from "@fixtures/fixtures";
import { faker } from '@faker-js/faker';
import { readFromReusableDataFile } from "@helpers/reusable_data_user";

const productIdLength = 24;

function sendRequestProductsGetFullInfo(request, paramsData) {
    return request.get(`${process.env.URL}/products/${paramsData}/full`, {});
}

export default function createGetFullInfoProductTests() {
    test("GET full info about existing product@happy", async ({ request }) => {
        var buf = readFromReusableDataFile();
        const response = await sendRequestProductsGetFullInfo(request, buf.product_id);

        expect(response.status()).toBe(200);

        const resBody = JSON.parse(await response.text());  

        expect(resBody.product_id).toBe(buf.product_id);
    });

    test("GET full info about non-existing product@happy", async ({ request }) => {
        const response = await sendRequestProductsGetFullInfo(request, faker.string.alpha(productIdLength));

        expect(response.status()).toBe(404);
    });
}
