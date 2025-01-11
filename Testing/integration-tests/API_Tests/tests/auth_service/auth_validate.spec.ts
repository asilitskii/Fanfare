import { test, expect } from "@fixtures/fixtures";
import { readFromReusableDataFile} from "@helpers/reusable_data_user"

function sendRequestValidate(request, headersData) {
  return request.post(`${process.env.URL}/auth/validate`, {
    headers: headersData
  });
}

export function createAuthValidatePositiveTest() {
  test("POST with valid access_token @happy", async ({ request }) => {
    var buf = readFromReusableDataFile();
    const headersData = {'Authorization': `Bearer ${buf.access_token}`}
    const response = await sendRequestValidate(request,headersData);
  
    expect(response.status()).toBe(200);
  });
}

export function createAuthValidateNegativeTests() {
  test("POST with blacklisted access_token @happy", async ({ request }) => {
    var buf = readFromReusableDataFile();
    const headersData = {'Authorization': `Bearer ${buf.blacklisted_access_token}`}
    const response = await sendRequestValidate(request,headersData);

    expect(response.status()).toBe(401);
  });

  test("POST with invalid access_token @happy", async ({ request }) => {
    const headersData = {'Authorization': `Bearer ${process.env.INVALID_ACCESS_TOKEN}`}
    const response = await sendRequestValidate(request,headersData);

    expect(response.status()).toBe(401);
  });
}
