import { test, expect } from "@fixtures/fixtures";
import { faker } from '@faker-js/faker';
import { readFromReusableDataFile } from "@helpers/reusable_data_user"


function sendRequestStoresGetMyStores(request, headersData, paramsData) {
    return request.get(`${process.env.URL}/stores/my`, {
      params: paramsData,
      headers: headersData
    });
}

export default function createGetMyStoresTests() {
    test("GET my stores as seller @happy", async ({ request }) => {
        var buf = readFromReusableDataFile();
        const headersData = {'Authorization': `Bearer ${buf.access_token}`}
        const paramsData = {"require_logo": true};

        const response = await sendRequestStoresGetMyStores(request,headersData,paramsData);

        expect(response.status()).toBe(200);
    });

    test("GET my stores, but not authorizated @happy", async ({ request }) => {
        const headersData = {'Authorization': `Bearer ${faker.string.uuid()}`}
        const paramsData = {"require_logo": true};

        const response = await sendRequestStoresGetMyStores(request,headersData,paramsData);

        expect(response.status()).toBe(401);
    });

    test("GET my stores, but not as seller @happy", async ({ request }) => {
        const responseLogin = await request.post(`${process.env.URL}/auth/login`, {
            data: {email: process.env.EMAIL_NOT_SELLER, password: process.env.PASSWORD_NOT_SELLER}
        });
      
        const resBody = JSON.parse(await responseLogin.text());   
        const access_token = resBody.access_token;
        const headersData = {'Authorization': `Bearer ${access_token}`}
        const paramsData = {"require_logo": true};

        const response = await sendRequestStoresGetMyStores(request,headersData,paramsData);

        expect(response.status()).toBe(403);
    });
}