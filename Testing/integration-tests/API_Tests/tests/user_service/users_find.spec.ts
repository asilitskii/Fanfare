import { test, expect } from "@fixtures/fixtures";

function sendRequestUsersFind(request, paramsData) {
  return request.get(`${process.env.URL}/users/find`, {
    params: paramsData
  });
}

export function createUsersFindPostiveTest() {
  test("/users/find GET with valid credentials @happy", async ({ request }) => {
    const paramsData = {"email": process.env.EMAIL, "password": process.env.PASSWORD}
    const response = sendRequestUsersFind(request, paramsData);

    expect(response.status()).toBe(200);
  });
}

export function createUsersFindNegativeTests() {
  test("/users/find GET with wrong email @happy", async ({ request }) => {
    const paramsData = {"email": process.env.INVALID_EMAIL, "password": process.env.PASSWORD}
    const response = sendRequestUsersFind(request, paramsData);

    expect(response.status()).toBe(404);
  });

  test("/users/find GET with wrong password @happy", async ({ request }) => {
    const paramsData = {"email": process.env.EMAIL, "password": process.env.INVALID_PASSWORD}
    const response = sendRequestUsersFind(request, paramsData);

    expect(response.status()).toBe(404);
  });

  test("/users/find GET with no email and password @happy", async ({ request }) => {
    const response = sendRequestUsersFind(request, {});

    expect(response.status()).toBe(422);
  });
}
