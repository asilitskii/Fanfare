import { test, expect } from "@fixtures/fixtures";
import { readFromReusableDataFile} from "@helpers/reusable_data_user"

function sendRequestUsersMe(request, headersData) {
  return request.get(`${process.env.URL}/users/me`, {
    headers: headersData
  });
}

export function createUsersMePositiveTest() {
  test("users/me GET with valid access_token @happy", async ({ request }) => {
    var buf = readFromReusableDataFile();
    const headersData = {'Authorization': `Bearer ${buf.access_token}`}
    const response = await sendRequestUsersMe(request,headersData);

    expect(response.status()).toBe(200);
  });
}

export function createUsersMeNegativeTests() {
  test("users/me GET with blacklisted access_token @happy", async ({ request }) => {
    var buf = readFromReusableDataFile();
    const headersData = {'Authorization': `Bearer ${buf.blacklisted_access_token}`}
    const response = await sendRequestUsersMe(request,headersData);

    expect(response.status()).toBe(401);
  });

  test("users/me GET with invalid access_token @happy", async ({ request }) => {
    const headersData = {'Authorization': `Bearer ${process.env.INVALID_ACCESS_TOKEN}`}
    const response = await sendRequestUsersMe(request,headersData);

    expect(response.status()).toBe(401);
  });
}
