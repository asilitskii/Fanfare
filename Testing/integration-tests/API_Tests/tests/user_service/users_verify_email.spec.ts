import { test, expect } from "@fixtures/fixtures";
import { fetchEmailsWithWait } from 'temp-mail-io';

export function createVerifyEmailPositiveTest() {
  test("POST verify-email with valid code @happy", async ({ request }) => {
    const mails = await fetchEmailsWithWait(process.env.EMAIL, 1, 30000);

    const link = mails[0].bodyHtml.match(/href="(.*?)"/i)[1];

    const code = link.split('/').pop();

    const response = await request.post(`${process.env.URL}/users/verify-email/${code}`);

    expect(response.status()).toBe(200);

    const resBody = JSON.parse(await response.text());

    console.log(resBody.detail)
  });
}

export function createVerifyEmailNegativeTest() {
  test("POST verify-email with invalid code @happy", async ({ request }) => {
    const response = await request.post(`${process.env.URL}/users/verify-email/${process.env.INVALID_VERIFY_CODE}`, {});

    expect(response.status()).toBe(410);

    const resBody = JSON.parse(await response.text());

    console.log(resBody.detail)
  });
}
