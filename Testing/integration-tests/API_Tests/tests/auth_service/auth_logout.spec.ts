import { test, expect } from "@fixtures/fixtures";
import { readFromReusableDataFile,  writeToReusableDataFile} from "@helpers/reusable_data_user"

function sendRequestLogout(request, jsonData, headersData) {
  return request.post(`${process.env.URL}/auth/logout`, {
    data: jsonData,
    headers: headersData
  });
}

export default function createAuthLogoutTests() {

  test("POST with valid tokens @happy", async ({ request }) => {
    var buf = readFromReusableDataFile();
    const jsonData = {"refresh_token": `${buf.refresh_token}`}
    const headersData = {'Authorization': `Bearer ${buf.access_token}`}
    const response = await sendRequestLogout(request, jsonData, headersData)

    expect(response.status()).toBe(200);

    buf.blacklisted_access_token = buf.access_token;
    buf.blacklisted_refresh_token = buf.refresh_token;
    writeToReusableDataFile(buf);
  });

  test("POST with no refresh token @happy", async ({ request }) => {
    var buf = readFromReusableDataFile();
    const headersData = {'Authorization': `Bearer ${buf.access_token}`}
    const response = await sendRequestLogout(request, {}, headersData)

    expect(response.status()).toBe(422);
  });
}
