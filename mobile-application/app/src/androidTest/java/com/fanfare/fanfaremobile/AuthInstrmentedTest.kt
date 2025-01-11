package com.fanfare.fanfaremobile

import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import com.fanfare.fanfaremobile.backendapi.BackendAPI
import com.fanfare.fanfaremobile.backendapi.LoginRequest
import com.fanfare.fanfaremobile.backendapi.LoginResponse
import kotlinx.coroutines.test.runTest
import okhttp3.MediaType
import okhttp3.RequestBody

import org.junit.Test
import org.junit.runner.RunWith

/**
 * Instrumented test, which will execute on an Android device.
 *
 * See [testing documentation](http://d.android.com/tools/testing).
 */
@RunWith(AndroidJUnit4::class)
class AuthInstrmentedTest {
    @Test
    fun nonExistedUserLogin() = runTest {
        try {
            val appContext = InstrumentationRegistry.getInstrumentation().targetContext
            val api = BackendAPI(appContext)
            api.login(LoginRequest("user@example.com", "pASSword123"))
            assert(false)
        } catch (Exception: Exception) {
            println(Exception)
            assert(true)
        }
    }

    @Test
    fun authorizationApiRequestForbidden() = runTest {

        // Context of the app under test.
        val appContext = InstrumentationRegistry.getInstrumentation().targetContext
        val api = BackendAPI(appContext)
        val response = api.get<UserMeResponse>("/api/users/me")
        assert(!response.isSuccessful)
    }

    @Test
    fun existedUserLogin() = runTest {
        // Context of the app under test.
        val appContext = InstrumentationRegistry.getInstrumentation().targetContext
        val api = BackendAPI(appContext)
        val response = api.login(LoginRequest("dyziry@teleg.eu", "pASSword123"))
        println(response.body())
    }

    class UserMeResponse (
        val birthday: String,
        val created_at: String,
        val email: String,
        val first_name: String,
        val is_seller: Boolean,
        val last_name: String,
        val seller_request_status: String,
        val tg_id: Int,
        val updated_at: String,
        val vk_id: Int
    )

    @Test
    fun authorizedApiRequestOk() = runTest {

        // Context of the app under test.
        val appContext = InstrumentationRegistry.getInstrumentation().targetContext
        val api = BackendAPI(appContext)
        val loginResponse = api.login(LoginRequest("dyziry@teleg.eu", "pASSword123"))
        assert(loginResponse.isSuccessful)
        val meResponse = api.get<UserMeResponse>("/api/users/me")
        assert(meResponse.isSuccessful)
    }

    @Test
    fun authorizedApiRequestAfterLogout() = runTest {

        // Context of the app under test.
        val appContext = InstrumentationRegistry.getInstrumentation().targetContext
        val api = BackendAPI(appContext)
        val loginResponse = api.login(LoginRequest("dyziry@teleg.eu", "pASSword123"))
        assert(loginResponse.isSuccessful)
        val meResponse = api.get<UserMeResponse>("/api/users/me")
        assert(meResponse.isSuccessful)
        val logoutResponse = api.logout()
        assert(logoutResponse!!.isSuccessful)
        val meResponseAfterLogout = api.get<UserMeResponse>("/api/users/me")
        assert(!meResponseAfterLogout.isSuccessful)
    }
}