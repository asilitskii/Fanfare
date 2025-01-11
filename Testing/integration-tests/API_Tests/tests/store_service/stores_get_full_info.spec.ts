import { test, expect } from "@fixtures/fixtures";
import { faker } from '@faker-js/faker';
import { readFromReusableDataFile } from "@helpers/reusable_data_user";

const storeIdLength = 24;

function sendRequestStoresGetFullInfo(request, paramsData) {
    return request.get(`${process.env.URL}/stores/${paramsData}/full`, {});
}

export default function createGetFullInfoStoreTests() {
    test("GET full info about existing store@happy", async ({ request }) => {
        var buf = readFromReusableDataFile();
        const response = await sendRequestStoresGetFullInfo(request, buf.store_id);

        expect(response.status()).toBe(200);

        const resBody = JSON.parse(await response.text());  

        const keys = Object.keys(resBody);

        expect(resBody.store_id).toBe(buf.store_id);
    });

    test("GET full info about non-existing store@happy", async ({ request }) => {
        const response = await sendRequestStoresGetFullInfo(request, faker.string.alpha(storeIdLength));

        expect(response.status()).toBe(404);
    });
}
