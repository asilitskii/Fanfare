import { test } from '@playwright/test';
import createAuthLoginTests from './auth_service/auth_login.spec';
import { createAuthValidatePositiveTest, createAuthValidateNegativeTests } from './auth_service/auth_validate.spec';
import { createAuthRefreshPositiveTest, createAuthRefreshNegativeTests } from './auth_service/auth_refresh.spec';
import createAuthLogoutTests from './auth_service/auth_logout.spec';
import { createUsersPositiveTest, createUsersNegativeTests } from './user_service/users.spec';
import { createVerifyEmailPositiveTest, createVerifyEmailNegativeTest } from './user_service/users_verify_email.spec';
import { createUsersFindPostiveTest, createUsersFindNegativeTests } from './user_service/users_find.spec';
import { createUsersMePositiveTest, createUsersMeNegativeTests } from './user_service/users_me.spec';

/*** 
Use this Test List only after BugFix of Bug #13122 reported in AIRedMine: https://ai.nsu.ru/issues/13122
***/

/***
Tests for User_Service endpoints: /users, /users/verify-email{code}, /users/find

Used temp-mail-io for creating temp emails to receive mails with verification codes
(link: https://github.com/JaLe29/temp-mail-io)

First, set up env variables URL, TEST_LIST_PATTERN, EMAIL and PASSWORD (look at example.env).
Second, run tests.
***/

test.describe("/users POST request positive test case @user", createUsersPositiveTest);
test.describe("/users POST request negative test cases @user", createUsersNegativeTests);

test.describe("/users/verify-email POST request positive test case @user", createVerifyEmailPositiveTest);
test.describe("/users/verify-email POST request negative test case @user", createVerifyEmailNegativeTest);

test.describe("/users/find GET request positive test case @user", createUsersFindPostiveTest);
test.describe("/users/find GET request negative test cases @user", createUsersFindNegativeTests);

/***
Tests for Auth_Service endpoints: /auth/login, /auth/validate, /auth/refresh, /auth/logout

Tests for User_Service endpoint: /users/me
***/

test.describe("/auth/login POST requests @auth", createAuthLoginTests);
test.describe("/auth/validate POST request positive test case @auth", createAuthValidatePositiveTest);
test.describe("/auth/refresh POST request positive test case @auth", createAuthRefreshPositiveTest);
test.describe("/auth/refresh POST requests negative test cases @auth", createAuthRefreshNegativeTests);

test.describe("/users/me GET request positive test case @user", createUsersMePositiveTest);

test.describe("/auth/logout POST requests @auth", createAuthLogoutTests);

test.describe("/users/me GET request negative test cases @user", createUsersMeNegativeTests);
test.describe("/auth/validate POST requests negative test cases after 200 response on /auth/logout @auth", createAuthValidateNegativeTests);
test.describe("/auth/refresh POST requests negative test cases after 200 response on /auth/logout @auth", createAuthRefreshNegativeTests);

test.describe("/auth/login POST request after logout request @auth", createAuthLoginTests);
