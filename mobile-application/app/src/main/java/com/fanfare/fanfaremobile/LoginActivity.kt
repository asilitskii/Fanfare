package com.fanfare.fanfaremobile

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonColors
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarColors
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shadow
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.TextFieldValue
import androidx.compose.ui.text.style.BaselineShift
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.fanfare.fanfaremobile.backendapi.LoginRequest
import com.fanfare.fanfaremobile.ui.theme.FanfareMobileTheme
import kotlinx.coroutines.launch


class LoginActivity : ComponentActivity() {

    enum class ResultCodes(val value: Int) {
        Success(0),
        Cancelled(-1),
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val backendAPI = (applicationContext as FanfareApplication).backendAPI
        if (backendAPI.isLoggedIn()) {
            setResult(ResultCodes.Success.value)
            finish()
        }
        enableEdgeToEdge()
        setContent {
            FanfareMobileTheme {
                LoginScreen(::onLoginCallback, ::onExitCallback)
            }
        }
    }

    private fun onExitCallback() {
        setResult(ResultCodes.Cancelled.value)
        finish()
    }

    private suspend fun onLoginCallback(username: String, password: String): String {
        val backendAPI = (applicationContext as FanfareApplication).backendAPI
        try {
            val response = backendAPI.login(LoginRequest(username, password))
            if (response.isSuccessful) {
                setResult(ResultCodes.Success.value)
                finish()
                return ""
            } else {
                return response.errorBody()?.string() ?: ""
            }
        } catch (e: Exception) {
            return e.message ?: ""
        }
    }

}

@Preview
@Composable
fun LoginScreen(
    onLoginCallback: suspend (String, String) -> String = { _, _ -> "" },
    onCancelCallback: () -> Unit = {}
) {
    var username by remember { mutableStateOf(TextFieldValue("")) }
    var password by remember { mutableStateOf(TextFieldValue("")) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    val scope = rememberCoroutineScope()

    val scriptStyleSuper = TextStyle(
        baselineShift = BaselineShift.Superscript,
        color = MaterialTheme.colorScheme.error
    )
    val fanfareTextStyle = TextStyle(
        fontFamily = FontFamily.SansSerif, // Or your desired font
        fontWeight = FontWeight.Bold,
        fontSize = 40.sp, // Adjust as needed
        letterSpacing = 2.sp, // Adjust for letter spacing
        color = Color(0xFF19094A),
        shadow = Shadow(
            color = Color.White,
            blurRadius = 110f
        )
    )

    Scaffold(
        topBar = {
            LoginTopBar(onCancelCallback)
        },
        containerColor = Color(0xFFCC73F0)
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Text(
                text = "FANFARE",
                style = fanfareTextStyle,
                modifier = Modifier.padding(bottom = 16.dp)
            )
            Text(
                "Вход",
                style = TextStyle(color = Color(0xFF19094A), fontSize = 24.sp),
                modifier = Modifier.padding(bottom = 16.dp)
            )
            TextField(
                value = username,
                onValueChange = { username = it },
                label = { Text("E-mail") },
                shape = MaterialTheme.shapes.extraLarge
            )
            Spacer(modifier = Modifier.height(16.dp))
            TextField(
                value = password,
                onValueChange = { password = it },
                label = { Text("Пароль") },
                visualTransformation = PasswordVisualTransformation(),
                shape = MaterialTheme.shapes.extraLarge
            )
            Spacer(modifier = Modifier.height(16.dp))
            if (errorMessage != null) {
                Row {
                    Text(
                        text = "*",
                        style = scriptStyleSuper
                    )
                    Text(
                        text = errorMessage!!,
                        color = MaterialTheme.colorScheme.error
                    )
                }
            }
            Button(
                onClick = {
                    scope.launch {
                        errorMessage = onLoginCallback(username.text, password.text)
                    }
                },
                colors = ButtonColors(
                    Color(0xFFD8EAF6),
                    Color(0xFF19094A),
                    Color(0xFFB385F8),
                    Color(0xFF19094A),
                )
            ) {
                Text(
                    "Войти",
                    style = TextStyle(fontSize = 24.sp)
                )
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Preview
@Composable
fun LoginTopBar(backbuttonCallback: () -> Unit = {}) {
    TopAppBar(
        title = {
            Text(
                text = "Fanfare"
            )
        },
        navigationIcon = {
            IconButton(onClick = backbuttonCallback) {
                Icon(
                    imageVector = Icons.Filled.Close,
                    contentDescription = "Close"
                )
            }
        },
        colors = TopAppBarColors(
            Color(0xFFB385F8),
            Color(0xFFB385F8),
            Color(0xFF19094A),
            Color(0xFF19094A),
            Color(0xFF19094A),
        )
    )
}
