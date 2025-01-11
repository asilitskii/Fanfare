package com.fanfare.fanfaremobile.backendapi

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import com.auth0.jwt.JWT
import com.fanfare.fanfaremobile.LoginActivity
import com.google.gson.GsonBuilder
import com.google.gson.Strictness
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.ResponseBody
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.Multipart
import retrofit2.http.PATCH
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Part
import retrofit2.http.Query
import retrofit2.http.Url
import java.util.Date


class BackendAPI(context: Context) {

    data class JWTTokens(val accessToken: String, val refreshToken: String)

    interface AuthApiService {
        @POST("/api/auth/login")
        suspend fun login(@Body loginRequest: LoginRequest): Response<LoginResponse>

        @POST("/api/auth/logout")
        suspend fun logout(
            @Body logoutRequest: LogoutRequest,
            @Header("Authorization") token: String
        ): Response<LoginResponse>

        @POST("/api/auth/refresh")
        suspend fun refresh(
            @Body logoutRequest: RefreshRequest,
            @Header("Authorization") token: String
        ): Response<RefreshResponse>
    }

    interface ArbitraryAPIService {
        @POST
        suspend fun postRequest(
            @Url url: String,
            @Body loginRequest: RequestBody,
            @Header("Authorization") token: String? = null
        ): Response<ResponseBody>

        @GET
        suspend fun getRequest(
            @Url url: String,
            @Body loginRequest: RequestBody,
            @Header("Authorization") token: String? = null
        ): Response<ResponseBody>

        @PUT
        suspend fun putRequest(
            @Url url: String,
            @Body loginRequest: RequestBody,
            @Header("Authorization") token: String? = null
        ): Response<ResponseBody>

        @DELETE
        suspend fun deleteRequest(
            @Url url: String,
            @Body loginRequest: RequestBody,
            @Header("Authorization") token: String? = null
        ): Response<ResponseBody>

        @POST
        suspend fun postEmptyRequest(
            @Url url: String,
            @Header("Authorization") token: String? = null
        ): Response<ResponseBody>

        @GET
        suspend fun getEmptyRequest(
            @Url url: String,
            @Header("Authorization") token: String? = null
        ): Response<ResponseBody>

        @PUT
        suspend fun putEmptyRequest(
            @Url url: String,
            @Header("Authorization") token: String? = null
        ): Response<ResponseBody>

        @DELETE
        suspend fun deleteEmptyRequest(
            @Url url: String,
            @Header("Authorization") token: String? = null
        ): Response<ResponseBody>

        @Multipart
        @PUT
        suspend fun putMultipartRequest(
            @Url url: String,
            @Part image: MultipartBody.Part,
            @Header("Authorization") token: String? = null
        ): Response<ResponseBody>
    }

    interface StoreApiService {
        @GET("/api/stores")
        suspend fun getStoreList(
            @Query("search") search: String? = null
        ): Response<Array<StoreShortInfo>>
    }

    private fun clearExpiredTokens() {
        if (tokens != null) {
            val decodedRefresh = JWT.decode(tokens!!.refreshToken)
            val currentDatePlusTwelveHours = Date(System.currentTimeMillis() + 10 * 60 * 1000)
            if (decodedRefresh.expiresAt.before(currentDatePlusTwelveHours)) {
                tokens = null
                val editor = sharedPreferences.edit()
                editor.remove("accessTokens")
                editor.apply()
            }
        }
    }

    private suspend fun checkAndRefreshTokens() {
        if (tokens == null) {
            return
        }
        val currentDatePlusTwelveHours = Date(System.currentTimeMillis() + 10 * 60 * 1000)
        val accessToken = tokens!!.accessToken
        val decodedAccess = JWT.decode(accessToken)
        if (decodedAccess.expiresAt.after(currentDatePlusTwelveHours)) {
            return
        }
        val response = authApiService.refresh(
            RefreshRequest(tokens!!.refreshToken),
            "Bearer ${tokens!!.accessToken}"
        )
        if (!response.isSuccessful) {
            cleanupTokens()
            throw Exception("Refresh failed: ${response.code()}\n${response.errorBody()?.string()}")
        }
        val respTokens = response.body() ?: throw Exception("Refresh failed: response body is null")
        tokens = JWTTokens(respTokens.access_token, respTokens.refresh_token)
        val editor = sharedPreferences.edit()
        editor.putString("accessTokens", gson.toJson(tokens))
        editor.apply()
        return
    }

    val gson = GsonBuilder()
        .setStrictness(Strictness.LENIENT)
        .create()

    private val sharedPreferences: SharedPreferences =
        context.getSharedPreferences("TOKENS", Context.MODE_PRIVATE)

    private var tokens: JWTTokens? = sharedPreferences.getString("accessTokens", null).let {
        gson.fromJson(it, JWTTokens::class.java)
    }

    private val retrofit: Retrofit = Retrofit.Builder()
        .baseUrl("http://90.156.226.187/")
        .addConverterFactory(GsonConverterFactory.create(gson))
        .build()

    private val authApiService: AuthApiService = retrofit.create(AuthApiService::class.java)
    private val storeApiService: StoreApiService = retrofit.create(StoreApiService::class.java)

    suspend fun login(loginRequest: LoginRequest): Response<LoginResponse> {
        val response = authApiService.login(loginRequest)
        if (!response.isSuccessful) {
            throw Exception("Login failed: ${response.code()}\n${response.errorBody()?.string()}")
        }
        val respTokens = response.body() ?: throw Exception("Login failed: response body is null")
        tokens = JWTTokens(respTokens.access_token, respTokens.refresh_token)
        val editor = sharedPreferences.edit()
        editor.putString("accessTokens", gson.toJson(tokens))
        editor.apply()
        return response
    }

    private fun cleanupTokens() {
        tokens = null
        val editor = sharedPreferences.edit()
        editor.remove("accessTokens")
        editor.apply()
    }

    suspend fun logout(): Response<LoginResponse>? {
        if (tokens == null) {
            return null
        }
        val previousTokens = tokens!!
        cleanupTokens()
        val response = authApiService.logout(
            LogoutRequest(previousTokens.refreshToken),
            "Bearer ${previousTokens.accessToken}"
        )
        if (!response.isSuccessful) {
            throw Exception("Logout failed: ${response.code()}\n${response.errorBody()?.string()}")
        }
        return response
    }

    suspend fun getStoreList(search: String?): Array<StoreShortInfo> {
        val response = storeApiService.getStoreList(search)
        if (!response.isSuccessful) {
            throw Exception(
                "Store list fetch failed: ${response.code()}\n${
                    response.errorBody()?.string()
                }"
            )
        }
        val responseBody = response.body() ?: throw Exception("Response body is null")

        return responseBody
    }


    private val arbitraryApiService: ArbitraryAPIService =
        retrofit.create(ArbitraryAPIService::class.java)

    fun isLoggedIn(): Boolean {
        clearExpiredTokens()
        return tokens != null
    }

    fun ensureLoggedIn(activity: Activity) {
        Intent(activity, LoginActivity::class.java).also {
            activity.startActivityForResult(it, 0)
        }
    }

    suspend fun makeRawRequest(url: String, method: String = "POST"): Response<ResponseBody> {
        checkAndRefreshTokens()
        val authHeader = if (tokens != null) "Bearer ${tokens!!.accessToken}" else null
        return when (method) {
            "GET" -> arbitraryApiService.getEmptyRequest(url, authHeader)
            "POST" -> arbitraryApiService.postEmptyRequest(url, authHeader)
            "PUT" -> arbitraryApiService.putEmptyRequest(url, authHeader)
            "DELETE" -> arbitraryApiService.deleteEmptyRequest(url, authHeader)
            else -> throw IllegalArgumentException("Invalid method: $method")
        }
    }

    suspend fun makeRawRequest(
        url: String,
        body: MultipartBody.Part,
        method: String = "POST"
    ): Response<ResponseBody> {
        checkAndRefreshTokens()
        val authHeader = if (tokens != null) "Bearer ${tokens!!.accessToken}" else null
        return when (method) {
            "PUT" -> arbitraryApiService.putMultipartRequest(url, body, authHeader)
            else -> throw IllegalArgumentException("Invalid method: $method")
        }
    }

    suspend fun makeRawRequest(
        url: String,
        body: RequestBody,
        method: String = "POST"
    ): Response<ResponseBody> {
        checkAndRefreshTokens()
        val authHeader = if (tokens != null) "Bearer ${tokens!!.accessToken}" else null
        return when (method) {
            "GET" -> arbitraryApiService.getRequest(url, body, authHeader)
            "POST" -> arbitraryApiService.postRequest(url, body, authHeader)
            "PUT" -> arbitraryApiService.putRequest(url, body, authHeader)
            "DELETE" -> arbitraryApiService.deleteRequest(url, body, authHeader)
            else -> throw IllegalArgumentException("Invalid method: $method")
        }
    }

    suspend inline fun <reified V> makeRequest(url: String, method: String = "POST"): Response<V> {
        val response = makeRawRequest(url, method)
        if (!response.isSuccessful) {
            return Response.error(response.code(), response.errorBody())
        }
        val deserializedBody = gson.fromJson(response.body()?.string(), V::class.java)
        val rtResponse = Response.success(deserializedBody, response.raw())
        return rtResponse
    }

    suspend inline fun <reified V> makeRequest(
        url: String,
        body: MultipartBody.Part,
        method: String = "POST"
    ): Response<V> {
        val response = makeRawRequest(url, body, method)
        if (!response.isSuccessful) {
            return Response.error(response.code(), response.errorBody())
        }
        val deserializedBody = gson.fromJson(response.body()?.string(), V::class.java)
        val rtResponse = Response.success(deserializedBody, response.raw())
        return rtResponse
    }

    suspend inline fun <T, reified V> makeRequest(
        url: String,
        body: T,
        method: String = "POST"
    ): Response<V> {
        val serializedBody = gson.toJson(body)
        val requestBody = serializedBody.toRequestBody("application/json".toMediaTypeOrNull())
        val response = makeRawRequest(url, requestBody, method)
        if (!response.isSuccessful) {
            return Response.error(response.code(), response.errorBody())
        }
        val deserializedBody = gson.fromJson(response.body()?.string(), V::class.java)
        val rtResponse = Response.success(deserializedBody, response.raw())
        return rtResponse
    }

    suspend inline fun <T, reified V> get(url: String, body: T) =
        makeRequest<T, V>(url, body, "GET")

    suspend fun get(url: String, body: RequestBody) = makeRawRequest(url, body, "GET")
    suspend inline fun <reified V> get(url: String) = makeRequest<V>(url, "GET")

    suspend inline fun <T, reified V> post(url: String, body: T) =
        makeRequest<T, V>(url, body, "POST")

    suspend fun post(url: String, body: RequestBody) = makeRawRequest(url, body, "POST")
    suspend inline fun <reified V> post(url: String) = makeRequest<V>(url, "POST")

    suspend inline fun <T, reified V> put(url: String, body: T) =
        makeRequest<T, V>(url, body, "PUT")

    suspend fun put(url: String, body: RequestBody) = makeRawRequest(url, body, "PUT")
    suspend inline fun <reified V> put(url: String) = makeRequest<V>(url, "PUT")
    suspend inline fun <reified V> put(url: String, body: MultipartBody.Part) =
        makeRequest<V>(url, body, "PUT")

    suspend inline fun <T, reified V> delete(url: String, body: T) =
        makeRequest<T, V>(url, body, "DELETE")

    suspend fun delete(url: String, body: RequestBody) = makeRawRequest(url, body, "DELETE")
    suspend inline fun <reified V> delete(url: String) = makeRequest<V>(url, "DELETE")

    interface UserApiService {
        @POST("/api/users/seller-status")
        suspend fun sendSellerStatusRequest(
            @Body sellerStatusRequest: SellerStatusRequest,
            @Header("Authorization") token: String
        ): Response<SellerStatusResponse>

        @PATCH("/api/users/social-links/tg")
        suspend fun updateTgIdRequest(
            @Body updateTgIdRequest: UpdateTgIdRequest,
            @Header("Authorization") token: String
        ): Response<UpdateTgIdResponse>
    }

    private val userApiService: UserApiService = retrofit.create(UserApiService::class.java)

    suspend fun sendRequestSellerStatus(): Response<SellerStatusResponse>? {
        if (tokens == null) {
            return null
        }

        val response = userApiService.sendSellerStatusRequest(
            SellerStatusRequest("I want to be a seller"),
            "Bearer ${tokens!!.accessToken}"
        )
        if (!response.isSuccessful) {
            throw Exception("Logout failed: ${response.code()}\n${response.errorBody()?.string()}")
        }

        return response
    }

    //[TG_ID]
    suspend fun updateTgId(tgId: Int): Response<UpdateTgIdResponse>? {
        if (tokens == null) {
            return null
        }

        val response = userApiService.updateTgIdRequest(
            UpdateTgIdRequest(tgId),
            "Bearer ${tokens!!.accessToken}"
        )
        if (!response.isSuccessful) {
            throw Exception("Logout failed: ${response.code()}\n${response.errorBody()?.string()}")
        }

        return response
    }
}
