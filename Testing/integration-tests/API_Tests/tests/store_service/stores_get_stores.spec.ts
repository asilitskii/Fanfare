import { test, expect } from "@fixtures/fixtures";
import { readFromReusableDataFile} from "@helpers/reusable_data_user"

function sendRequestStoresGetStoresList(request, paramsData) {
    return request.get(`${process.env.URL}/stores`, {
      params: paramsData
    });
}

export default function createGetStoreListTests() {
    test("GET list of existing stores@happy", async ({ request }) => {

        const paramsData = {"search": process.env.TAKEN_TITLE_STORE, "require_logo": true};
        
        const response = await sendRequestStoresGetStoresList(request, paramsData);

        expect(response.status()).toBe(200);
    });
}
