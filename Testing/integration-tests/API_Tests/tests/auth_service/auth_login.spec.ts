import { test, expect } from "@fixtures/fixtures";
import { jwtDecode } from "jwt-decode";
import { readFromReusableDataFile,  writeToReusableDataFile} from "@helpers/reusable_data_user"

function sendRequestLogin(request, jsonData) {
  return request.post(`${process.env.URL}/auth/login`, {
    data: jsonData
  });
} 

export default function createAuthLoginTests() {
  test("POST with valid credentials @happy", async ({ request }) => {
    const jsonData = {email: process.env.EMAIL, password: process.env.PASSWORD}
    const response = await sendRequestLogin(request, jsonData);

    expect(response.status()).toBe(200);

    const resBody = JSON.parse(await response.text());  
    
    const access_token = resBody.access_token;
    
    const decoded_access_token = jwtDecode(access_token);
    
    const refresh_token = resBody.refresh_token;

    var buf = readFromReusableDataFile();
    buf.access_token = access_token;
    buf.refresh_token = refresh_token;
    writeToReusableDataFile(buf);
  });

  test("POST with invalid credentials @happy", async ({ request }) => {
    const jsonData = {email: process.env.INVALID_EMAIL, password: process.env.INVALID_PASSWORD}
    const response = await sendRequestLogin(request, jsonData);
    
    expect(response.status()).toBe(400);
  });

  test("POST with no email @happy", async ({ request }) => {
    const jsonData = {password: process.env.PASSWORD}
    const response = await sendRequestLogin(request, jsonData);

    expect(response.status()).toBe(422);
  });

  test("POST with no password @happy", async ({ request }) => {
    const jsonData = {password: process.env.EMAIL}
    const response = await sendRequestLogin(request, jsonData);

    expect(response.status()).toBe(422);
  });
}
