import { test, expect } from "@fixtures/fixtures";
import fs from 'fs';
import { faker } from '@faker-js/faker';
import { readFromReusableDataFile} from "@helpers/reusable_data_user"

const productIdLength = 24;

function sendRequestStoresPutLogo(request, bodyData, headersData, paramsData) {
    return request.put(`${process.env.URL}/products/${paramsData}/logo`, {
      multipart: bodyData,
      headers: headersData
    });
}

export default function createPutProductLogoTests() {
    test("PUT with valid logo product as seller @happy", async ({ request }) => {
        const bodyData = {
            "logo":{
                name: "logo_store.png",
                mimeType: "image/png",
                buffer: await fs.promises.readFile('tests/store_service/logo_store.png')
            }
        };

        var buf = readFromReusableDataFile();
        const headersData = {'Authorization': `Bearer ${buf.access_token}`}

        const response = await sendRequestStoresPutLogo(request, bodyData, headersData, buf.product_id);

        expect(response.status()).toBe(200);
    });

    test("PUT with valid logo product, but not as seller@happy", async ({ request }) => {
        const bodyData = {
            "logo":{
                name: "logo_store.png",
                mimeType: "image/png",
                buffer: await fs.promises.readFile('tests/store_service/logo_store.png')
            }
        };

        const responseLogin = await request.post(`${process.env.URL}/auth/login`, {
            data: {email: process.env.EMAIL_NOT_SELLER, password: process.env.PASSWORD_NOT_SELLER}
        });
      
        const resBody = JSON.parse(await responseLogin.text());   
        const access_token = resBody.access_token;
        const headersData = {'Authorization': `Bearer ${access_token}`}

        var buf = readFromReusableDataFile();
        const response = await sendRequestStoresPutLogo(request, bodyData, headersData, buf.product_id);
    
        expect(response.status()).toBe(403);
      });
    
      test("PUT with valid logo product, but product not found@happy", async ({ request }) => {
        const bodyData = {
            "logo":{
                name: "logo_store.png",
                mimeType: "image/png",
                buffer: await fs.promises.readFile('tests/store_service/logo_store.png')
            }
        };

        var buf = readFromReusableDataFile();
        const headersData = {'Authorization': `Bearer ${buf.access_token}`}

        const response = await sendRequestStoresPutLogo(request, bodyData, headersData, faker.string.alpha(productIdLength));
    
        expect(response.status()).toBe(404);
      });
}
