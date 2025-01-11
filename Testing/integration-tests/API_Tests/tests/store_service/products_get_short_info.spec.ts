import { test, expect } from "@fixtures/fixtures";
import { faker } from '@faker-js/faker';
import { readFromReusableDataFile } from "@helpers/reusable_data_user";

const productIdLength = 24;

function sendRequestProductsGetShortInfo(request, paramsData) {
    return request.get(`${process.env.URL}/products/${paramsData}/short`, {});
}

export default function createGetShortInfoProductTests() {
    test("GET short info about existing product@happy", async ({ request }) => {
        var buf = readFromReusableDataFile();
        const response = await sendRequestProductsGetShortInfo(request, buf.product_id);

        expect(response.status()).toBe(200);

        const resBody = JSON.parse(await response.text());  

        expect(resBody.product_id).toBe(buf.product_id);
    });

    test("GET short info about non-existing product@happy", async ({ request }) => {
        const response = await sendRequestProductsGetShortInfo(request, faker.string.alpha(productIdLength));

        expect(response.status()).toBe(404);
    });
}
