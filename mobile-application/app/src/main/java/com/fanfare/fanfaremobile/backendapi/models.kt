package com.fanfare.fanfaremobile.backendapi

import com.google.gson.annotations.SerializedName

class LoginRequest(val email: String, val password: String)

class LoginResponse(val detail: String, val access_token: String, val refresh_token: String)

class LogoutRequest(val refresh_token: String)

class LogoutResponse(val detail: String)

class RefreshRequest(val refresh_token: String)

class RefreshResponse(val detail: String, val access_token: String, val refresh_token: String)

data class StoreShortInfo(
    @SerializedName("store_id") val id: String,
    @SerializedName("title") val name: String,
    @SerializedName("logo_url") val logoUrl: String
)

class ErrorResponse(val detail: String)

class ErrorResponse422(
    val detail: Array<ErrorResponse422Single>
)

class ErrorResponse422Single(
    val type: String,
    val loc: Array<String>,
    val msg: String,
    val input: String,
//    val ctx: Map<String, String>
)

class StoreCreateRequest(val title: String, val description: String)

class StoreUploadLogoResponse(val logo_url: String, detail: String)

class SellerStatusRequest(
    val comment: String
)

class SellerStatusResponse(
    val detail: String
)

//[TG_ID]
class UpdateTgIdRequest(
    val tg_id: Int
)

class UpdateTgIdResponse(
    val detail: String
)
