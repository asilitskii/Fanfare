import { test, expect } from "@fixtures/fixtures";
import { faker } from '@faker-js/faker';
import { readFromReusableDataFile,  writeToReusableDataFile} from "@helpers/reusable_data_user"

const positiveTitleStringLength = faker.number.int(128);
const positiveDescriptionStringLength = faker.number.int(4096);
const negativeTitleStringLength = 129;
const negativeDescriptionStringLength = 4097;

const positivePriceValue = faker.number.int(9999999);
const negativePriceValue = 10000000;

const positiveСharacteristicTitleLength = faker.number.int(64);
const negativeСharacteristicTitleLength = 65;

const positiveСharacteristicValue = faker.number.int(32);
const negativeСharacteristicValue = 33;

const maxCharacteristicsLimit = 128;

function sendRequestProductsPost(request, bodyData, headersData, paramsData) {
    return request.post(`${process.env.URL}/products`, {
      data: bodyData,
      headers: headersData,
      params: paramsData
    });
}

function createValidBodyData() {
    const bodyData = {
        "title": faker.string.alpha(positiveTitleStringLength),
        "description": faker.string.alpha(positiveDescriptionStringLength),
        "price": positivePriceValue,
        "characteristics": [
        {
            "name": faker.string.alpha(positiveСharacteristicTitleLength),
            "value": faker.string.alpha(positiveСharacteristicValue)
        }
        ]
    }

    return bodyData;
}

function createProductCharacteristic() {
    return {
        "name": faker.string.alpha(negativeСharacteristicTitleLength),
        "value": faker.string.alpha(negativeСharacteristicValue)
    }
}

function createInvalidProductCharacteristics(numberOfCharacteristics) {
    return faker.helpers.multiple(createProductCharacteristic, {count: numberOfCharacteristics,});
}

export default function createProductCreationTests() { 
    test("POST product in store with valid data as seller @happy", async ({ request }) => {
        const bodyData = createValidBodyData();
        
        var buf = readFromReusableDataFile();
        const headersData = {'Authorization': `Bearer ${buf.access_token}`};
        const paramsData = {"store_id": buf.store_id};
        
        const response = await sendRequestProductsPost(request,bodyData,headersData,paramsData);

        expect(response.status()).toBe(200);

        const resBody = JSON.parse(await response.text()); 
        const product_id = resBody.product_id;
        buf.product_id = product_id;
        writeToReusableDataFile(buf);
    });

    test("POST product in store with valid data, but not as seller @happy", async ({ request }) => {
        const bodyData = createValidBodyData();

        const responseLogin = await request.post(`${process.env.URL}/auth/login`, {
            data: {email: process.env.EMAIL_NOT_SELLER, password: process.env.PASSWORD_NOT_SELLER}
        });
      
        const resBody = JSON.parse(await responseLogin.text());   
        const access_token = resBody.access_token;
        const headersData = {'Authorization': `Bearer ${access_token}`}

        var buf = readFromReusableDataFile();
        const paramsData = {"store_id": buf.store_id};

        const response = await sendRequestProductsPost(request,bodyData,headersData,paramsData);

        expect(response.status()).toBe(403);
    });

    test("POST product in store with valid data, but not authorizated@happy", async ({ request }) => {
        const bodyData = createValidBodyData();
        
        var buf = readFromReusableDataFile();
        const paramsData = {"store_id": buf.store_id};

        const response = await sendRequestProductsPost(request,bodyData,{},paramsData);
      
        expect(response.status()).toBe(401);
    });

    test("POST product in store with invalid data as seller @happy", async ({ request }) => {
        const invalidCharacteristics = createInvalidProductCharacteristics(maxCharacteristicsLimit);

        const bodyData = {
            "title": faker.string.alpha(negativeTitleStringLength),
            "description": faker.string.alpha(negativeDescriptionStringLength),
            "price": negativePriceValue,
            "characteristics": invalidCharacteristics
        };

        var buf = readFromReusableDataFile();
        const headersData = {'Authorization': `Bearer ${buf.access_token}`};
        const paramsData = {"store_id": buf.store_id};

        const response = await sendRequestProductsPost(request,bodyData,headersData,paramsData);

        expect(response.status()).toBe(422);
    });
}
