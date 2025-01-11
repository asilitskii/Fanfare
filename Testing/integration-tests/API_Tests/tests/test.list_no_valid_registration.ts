import { test } from '@playwright/test';
import createAuthLoginTests from './auth_service/auth_login.spec';
import { createAuthValidatePositiveTest, createAuthValidateNegativeTests } from './auth_service/auth_validate.spec';
import { createAuthRefreshPositiveTest, createAuthRefreshNegativeTests } from './auth_service/auth_refresh.spec';
import createAuthLogoutTests from './auth_service/auth_logout.spec';
import { createUsersNegativeTests } from './user_service/users.spec';
import { createUsersMePositiveTest, createUsersMeNegativeTests } from './user_service/users_me.spec';

/***
Tests for Auth_Service endpoints: /auth/login, /auth/validate, /auth/refresh, /auth/logout

Tests for User_Service endpoint: /users/me, /users (only negative test cases)

First, you need to create account. 
Second, set up env variables URL, TEST_LIST_PATTERN, EMAIL and PASSWORD (look at example.env).
Third, run tests.
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
