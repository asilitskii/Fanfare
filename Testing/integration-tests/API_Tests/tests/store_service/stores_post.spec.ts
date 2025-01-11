import { test, expect } from "@fixtures/fixtures";
import { faker } from '@faker-js/faker';
import { readFromReusableDataFile,  writeToReusableDataFile} from "@helpers/reusable_data_user"

const positiveTitleStringLength = 10;
const positiveDescriptionStringLength = 200;
const negativeTitleStringLength = 35;
const negativeDescriptionStringLength = 601;

function sendRequestStoresPost(request, bodyData, headersData) {
  return request.post(`${process.env.URL}/stores`, {
    data: bodyData,
    headers: headersData
  });
}

export default function createStoreCreationTests() {
  test("POST with valid data as seller @happy", async ({ request }) => {
    const title = faker.string.alpha(positiveTitleStringLength);
    const bodyData = {
      "title": title,
      "description": faker.string.alpha(positiveDescriptionStringLength)
    }

    var buf = readFromReusableDataFile();
    const headersData = {'Authorization': `Bearer ${buf.access_token}`}
    
    const response = await sendRequestStoresPost(request, bodyData,headersData);

    expect(response.status()).toBe(200);

    const resBody = JSON.parse(await response.text()); 
    const store_id = resBody.store_id;

    buf.store_id = store_id;
    buf.taken_store_title = title;
    writeToReusableDataFile(buf);
  });

  test("POST with invalid data as seller@happy", async ({ request }) => {
    const bodyData = {
      "title": faker.string.alpha(negativeTitleStringLength),
      "description": faker.string.alpha(negativeDescriptionStringLength)
    }
    
    var buf = readFromReusableDataFile();
    const headersData = {'Authorization': `Bearer ${buf.access_token}`}
    
    const response = await sendRequestStoresPost(request, bodyData, headersData);

    expect(response.status()).toBe(422);
  });

  test("POST with valid data as seller, but title already taken @happy", async ({ request }) => {
    const bodyData = {
      "title": process.env.TAKEN_TITLE_STORE,
      "description": faker.string.alpha(positiveDescriptionStringLength)
    }

    var buf = readFromReusableDataFile();
    const headersData = {'Authorization': `Bearer ${buf.access_token}`}
    
    const response = await sendRequestStoresPost(request, bodyData,headersData);

    expect(response.status()).toBe(409);
  });

  test("POST with valid data, but not authorizated@happy", async ({ request }) => {
    const bodyData = {
      "title": faker.string.alpha(negativeTitleStringLength),
      "description": faker.string.alpha(negativeDescriptionStringLength)
    }
    
    const response = await sendRequestStoresPost(request, bodyData, {});

    expect(response.status()).toBe(401);
  });

  test("POST with valid data, but not as seller@happy", async ({ request }) => {
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
    
    const response = await sendRequestStoresPost(request, bodyData, headersData);

    expect(response.status()).toBe(403);
  });
}
