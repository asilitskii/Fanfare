import { test, expect } from "@fixtures/fixtures";
import { newEmail } from 'temp-mail-io';

export function createUsersPositiveTest() {
  test("/users POST with valid credentials @happy", async ({ request }) => {

    console.log("Creating new email")
    const tempemail = newEmail();
    process.env.EMAIL = (await tempemail).email;

    const response = await request.post(`${process.env.URL}/users`, {
      data: {
        "birthdate": "2000-12-12",
        "email": process.env.EMAIL,
        "first_name": "Names",
        "last_name": "Sur",
        "password": process.env.PASSWORD
      },
    });

    expect(response.status()).toBe(200);
  });
}

export function createUsersNegativeTests() {
  test("/users POST with no birthdate @happy", async ({ request }) => {

    console.log("Creating new email")
    const tempemail = newEmail();
    process.env.EMAIL = (await tempemail).email;

    const response = await request.post(`${process.env.URL}/users`, {
      data: {
        "email": process.env.EMAIL,
        "first_name": "Names",
        "last_name": "Sur",
        "password": process.env.PASSWORD
      },
    });

    expect(response.status()).toBe(422);
  });

  test("/users POST with no first_name @happy", async ({ request }) => {

    console.log("Creating new email")
    const tempemail = newEmail();
    process.env.EMAIL = (await tempemail).email;

    const response = await request.post(`${process.env.URL}/users`, {
      data: {
        "birthdate": "2000-12-12",
        "email": process.env.EMAIL,
        "last_name": "Sur",
        "password": process.env.PASSWORD
      },
    });

    expect(response.status()).toBe(422);
  });

  test("/users POST with no last_name @happy", async ({ request }) => {

    console.log("Creating new email")
    const tempemail = newEmail();
    process.env.EMAIL = (await tempemail).email;

    const response = await request.post(`${process.env.URL}/users`, {
      data: {
        "birthdate": "2000-12-12",
        "email": process.env.EMAIL,
        "first_name": "Names",
        "password": process.env.PASSWORD
      },
    });

    expect(response.status()).toBe(422);
  });

  test("/users POST with no email @happy", async ({ request }) => {

    console.log("Creating new email")
    const tempemail = newEmail();
    process.env.EMAIL = (await tempemail).email;

    const response = await request.post(`${process.env.URL}/users`, {
      data: {
        "birthdate": "2000-12-12",
        "first_name": "Names",
        "last_name": "Sur",
        "password": process.env.PASSWORD
      },
    });

    expect(response.status()).toBe(422);
  });

  test("/users POST with no password @happy", async ({ request }) => {

    console.log("Creating new email")
    const tempemail = newEmail();
    process.env.EMAIL = (await tempemail).email;

    const response = await request.post(`${process.env.URL}/users`, {
      data: {
        "birthdate": "2000-12-12",
        "email": process.env.EMAIL,
        "first_name": "Names",
        "last_name": "Sur",
      },
    });

    expect(response.status()).toBe(422);
  });
}
