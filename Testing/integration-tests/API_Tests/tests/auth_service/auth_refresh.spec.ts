import { test, expect } from "@fixtures/fixtures";
import { readFromReusableDataFile,  writeToReusableDataFile} from "@helpers/reusable_data_user"

function sendRequestRefresh(request, jsonData) {
  return request.post(`${process.env.URL}/auth/refresh`, {
    data: jsonData
  });
}

export function createAuthRefreshPositiveTest() {
  test("POST with valid refresh_token @happy", async ({ request }) => {
    var buf = readFromReusableDataFile();
    const jsonData = {"refresh_token": `${buf.refresh_token}`}
    const response = await sendRequestRefresh(request, jsonData);

    expect(response.status()).toBe(200);

    const resBody = JSON.parse(await response.text());

    buf.blacklisted_access_token = buf.access_token;
    buf.blacklisted_refresh_token = buf.refresh_token;

    const access_token = resBody.access_token;
    const refresh_token = resBody.refresh_token;

    buf.access_token = access_token;
    buf.refresh_token = refresh_token;
    writeToReusableDataFile(buf);
  });
}

export function createAuthRefreshNegativeTests() {

  test("POST with blacklisted refresh_token @happy", async ({ request }) => {
    var buf = readFromReusableDataFile();
    const jsonData = {"refresh_token": `${buf.blacklisted_refresh_token}`}
    const response = await sendRequestRefresh(request, jsonData);

    expect(response.status()).toBe(401);
  });

  test("POST with invalid refresh_token @happy", async ({ request }) => {
    const jsonData = {"refresh_token": `${process.env.INVALID_REFRESH_TOKEN}`}
    const response = await sendRequestRefresh(request, jsonData);

    expect(response.status()).toBe(401);
  });

  test("POST with no refresh_token @happy", async ({ request }) => {
    const response = await sendRequestRefresh(request, {});
  
    expect(response.status()).toBe(422);
  });
}
