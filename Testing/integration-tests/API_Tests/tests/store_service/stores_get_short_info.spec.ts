import { test, expect } from "@fixtures/fixtures";
import { faker } from '@faker-js/faker';
import { readFromReusableDataFile} from "@helpers/reusable_data_user"

const storeIdLength = 24;

function sendRequestStoresGetShortInfo(request, paramsData) {
    return request.get(`${process.env.URL}/stores/${paramsData}/short`, {});
}

export default function createGetShortInfoStoreTests() {
    test("GET short info about existing store@happy", async ({ request }) => {
        var buf = readFromReusableDataFile();
        const response = await sendRequestStoresGetShortInfo(request, buf.store_id);

        expect(response.status()).toBe(200);

        const resBody = JSON.parse(await response.text());

        expect(resBody.store_id).toBe(buf.store_id);
    });

    test("GET short info about non-existing store@happy", async ({ request }) => {
        const response = await sendRequestStoresGetShortInfo(request, faker.string.alpha(storeIdLength));

        expect(response.status()).toBe(404);
    });
}