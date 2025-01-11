import { test, expect } from "@fixtures/fixtures";
import { faker } from '@faker-js/faker';
import { readFromReusableDataFile, writeToReusableDataFile} from "@helpers/reusable_data_user"

const positiveTitleStringLength = 10;
const positiveDescriptionStringLength = 200;
const negativeTitleStringLength = 35;
const negativeDescriptionStringLength = 601;

const storeIdLength = 24

function sendRequestStoresGetFullInfo(request, paramsData) {
  return request.get(`${process.env.URL}/stores/${paramsData}/full`, {});
}

function sendRequestStoresPatch(request, bodyData, headersData, paramsData) {
  return request.patch(`${process.env.URL}/stores/${paramsData}`, {
    data: bodyData,
    headers: headersData
  });
}

export function createStoreChangeInfoPositiveTests() {
  test("PATCH with valid data as seller @happy", async ({ request }) => {
    const title = faker.string.alpha(positiveTitleStringLength);
    const description = faker.string.alpha(positiveDescriptionStringLength)
    const bodyData = {
      "title": title,
      "description": description
    }

    var buf = readFromReusableDataFile();
    const headersData = {'Authorization': `Bearer ${buf.access_token}`}
    
    const responsePatch = await sendRequestStoresPatch(request, bodyData,headersData, buf.store_id);

    expect(responsePatch.status()).toBe(200);

    const responseGet = await sendRequestStoresGetFullInfo(request, buf.store_id);
    const resBodyGet = JSON.parse(await responseGet.text()); 
    expect(resBodyGet.title).toBe(title);
    expect(resBodyGet.description).toBe(description);

    buf.taken_store_title = title;
    writeToReusableDataFile(buf);
  });
}

export function createStoreChangeInfoNegativeTests() {
  test("PATCH with invalid data as seller@happy", async ({ request }) => {
    const bodyData = {
      "title": faker.string.alpha(negativeTitleStringLength),
      "description": faker.string.alpha(negativeDescriptionStringLength)
    }
    
    var buf = readFromReusableDataFile();
    const headersData = {'Authorization': `Bearer ${buf.access_token}`}
    
    const response = await sendRequestStoresPatch(request, bodyData, headersData, buf.store_id);

    expect(response.status()).toBe(422);
  });

  test("PATCH with valid data as seller, but title already taken @happy", async ({ request }) => {
    var buf = readFromReusableDataFile();
    const bodyData = {
      "title": buf.taken_store_title,
      "description": faker.string.alpha(positiveDescriptionStringLength)
    }

    const headersData = {'Authorization': `Bearer ${buf.access_token}`}
    
    const response = await sendRequestStoresPatch(request, bodyData,headersData, buf.store_id);

    expect(response.status()).toBe(409);
  });

  test("PATCH with valid data, but not authorizated@happy", async ({ request }) => {
    const bodyData = {
      "title": faker.string.alpha(negativeTitleStringLength),
      "description": faker.string.alpha(negativeDescriptionStringLength)
    }

    var buf = readFromReusableDataFile();
    
    const response = await sendRequestStoresPatch(request, bodyData,{},buf.store_id);

    expect(response.status()).toBe(401);
  });

  test("PATCH with valid data, but not as seller@happy", async ({ request }) => {
    const bodyData = {
      "title": faker.string.alpha(positiveTitleStringLength),
      "description": faker.string.alpha(positiveDescriptionStringLength)
    }

    const responseLogin = await request.post(`${process.env.URL}/auth/login`, {
      data: {email: process.env.EMAIL_NOT_SELLER, password: process.env.PASSWORD_NOT_SELLER}
    });

    const resBody = JSON.parse(await responseLogin.text());   
    const access_token = resBody.access_token;
    const headersData = {'Authorization': `Bearer ${access_token}`}
    
    var buf = readFromReusableDataFile();
    const response = await sendRequestStoresPatch(request, bodyData, headersData, buf.store_id);

    expect(response.status()).toBe(403);
  });

  test("PATCH with valid data, but store not found@happy", async ({ request }) => {
    const bodyData = {
      "title": faker.string.alpha(positiveTitleStringLength),
      "description": faker.string.alpha(positiveDescriptionStringLength)
    }

    var buf = readFromReusableDataFile();
    const headersData = {'Authorization': `Bearer ${buf.access_token}`}

    const invalidStoreId = faker.string.alpha(storeIdLength);
    
    const response = await sendRequestStoresPatch(request, bodyData, headersData, invalidStoreId);

    expect(response.status()).toBe(404);
  });
}
