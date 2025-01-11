package com.fanfare.fanfaremobile

import android.app.Application
import com.fanfare.fanfaremobile.backendapi.BackendAPI

class FanfareApplication : Application() {

    private var _backendAPI: BackendAPI? = null

    val backendAPI: BackendAPI
        get() {
            if (_backendAPI == null) {
                _backendAPI = BackendAPI(this)
            }
            return _backendAPI!!
        }

}