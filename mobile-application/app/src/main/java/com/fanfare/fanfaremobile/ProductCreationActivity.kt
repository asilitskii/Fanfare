package com.fanfare.fanfaremobile

import android.app.ComponentCaller
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.KeyboardOptions
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
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.TextFieldValue
import androidx.compose.ui.text.style.BaselineShift
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil3.compose.AsyncImage
import com.fanfare.fanfaremobile.backendapi.BackendAPI
import com.fanfare.fanfaremobile.ui.theme.FanfareMobileTheme
import kotlinx.coroutines.launch
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody.Companion.toRequestBody

data class ProductCharacteristic(
    val name: String,
    val value: String
)

data class ProductCreationRequest(
    val title: String,
    val description: String,
    val price: Int,
    val characteristics: Array<ProductCharacteristic>
)

data class ProductCreationResponse(
    val product_id: String
)

data class ProductCreationError(
    val detail: String
)

data class ProductLogoUploadResponse(
    val logo_url: String
)

class ProductCreationActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        val api = (applicationContext as FanfareApplication).backendAPI
        val storeId: String? = intent.getStringExtra("storeId")
        api.ensureLoggedIn(this)
        setContent {
            FanfareMobileTheme {
                Scaffold(
                    modifier = Modifier.fillMaxSize(),
                    topBar = { ProductCreationTopBar(::finish) },
                    containerColor = Color(0xFFCC73F0)
                ) { innerPadding ->
                    ProductCreation(
                        modifier = Modifier.padding(innerPadding),
                        api = api,
                        storeId = storeId,
                        finishCallback = ::finish
                    )
                }
            }
        }
    }

    override fun onActivityResult(
        requestCode: Int,
        resultCode: Int,
        data: Intent?,
        caller: ComponentCaller
    ) {
        super.onActivityResult(requestCode, resultCode, data, caller)
        if (requestCode == 0 && resultCode == LoginActivity.ResultCodes.Cancelled.value) {
            finish()
        }
    }
}

@Preview
@Composable
fun ProductCreation(
    modifier: Modifier = Modifier,
    finishCallback: () -> Unit = {},
    api: BackendAPI? = null,
    storeId: String? = null
) {
    var title by remember { mutableStateOf(TextFieldValue("")) }
    var titleErrorMessage by remember { mutableStateOf<String?>(null) }
    var price by remember { mutableStateOf(TextFieldValue("")) }
    var priceErrorMessage by remember { mutableStateOf<String?>(null) }
    var description by remember { mutableStateOf(TextFieldValue("")) }
    var descriptionErrorMessage by remember { mutableStateOf<String?>(null) }
    var photo by remember { mutableStateOf<Uri?>(null) }
    var photoErrorMessage by remember { mutableStateOf<String?>(null) }
    val scope = rememberCoroutineScope()
    var createdProductId by remember { mutableStateOf<String?>(null) }
    val context = LocalContext.current

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

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        // Fanfare logo
        Text(
            text = "FANFARE",
            style = fanfareTextStyle,
            modifier = Modifier.padding(bottom = 16.dp)
        )
        // Screen name
        Text(
            "Создание товара",
            style = TextStyle(color = Color(0xFF19094A), fontSize = 24.sp),
            modifier = Modifier.padding(bottom = 16.dp)
        )
        Spacer(modifier = Modifier.height(16.dp))
        // title error message
        if (titleErrorMessage != null) {
            Row {
                Text(
                    text = "*",
                    style = scriptStyleSuper
                )
                Text(
                    text = titleErrorMessage!!,
                    color = MaterialTheme.colorScheme.error
                )
            }
        }
        // title
        TextField(
            value = title,
            onValueChange = { title = it },
            label = { Text("Название товара") },
            shape = MaterialTheme.shapes.extraLarge
        )
        Spacer(modifier = Modifier.height(16.dp))
        // price error message
        if (priceErrorMessage != null) {
            Row {
                Text(
                    text = "*",
                    style = scriptStyleSuper
                )
                Text(
                    text = priceErrorMessage!!,
                    color = MaterialTheme.colorScheme.error
                )
            }
        }
        // price
        TextField(
            value = price,
            onValueChange =
            { newValue ->
                if (newValue.text.toIntOrNull() == null) {
                    return@TextField
                }
                price = newValue
            },
            label = { Text("Цена") },
            keyboardOptions = KeyboardOptions.Default.copy(keyboardType = KeyboardType.Number),
            shape = MaterialTheme.shapes.extraLarge
        )
        Spacer(modifier = Modifier.height(16.dp))
        // description error message
        if (descriptionErrorMessage != null) {
            Row {
                Text(
                    text = "*",
                    style = scriptStyleSuper
                )
                Text(
                    text = descriptionErrorMessage!!,
                    color = MaterialTheme.colorScheme.error
                )
            }
        }
        // description
        TextField(
            value = description,
            onValueChange = { description = it },
            label = { Text("Описание товара") },
            shape = MaterialTheme.shapes.extraLarge,
            minLines = 10,
            maxLines = 30,
            singleLine = false
        )
        Spacer(modifier = Modifier.height(16.dp))
        // product photo
        Text(
            "Фото товара",
            style = TextStyle(color = Color(0xFF19094A), fontSize = 24.sp),
        )
        ImageInput(
            { photo = it },
            errorMessage = photoErrorMessage
        )
        Spacer(modifier = Modifier.height(16.dp))
        Button(
            onClick = {
                scope.launch {
                    if (api == null || storeId == null) {
                        finishCallback()
                        return@launch
                    }
                    if (createdProductId == null) {
                        if (title.text.isEmpty()) {
                            titleErrorMessage = "Field can't be empty"
                        } else {
                            titleErrorMessage = null
                        }
                        if (price.text.isEmpty()) {
                            priceErrorMessage = "Field can't be empty"
                        } else {
                            priceErrorMessage = null
                        }
                        if (description.text.isEmpty()) {
                            descriptionErrorMessage = "Field can't be empty"
                        } else {
                            descriptionErrorMessage = null
                        }
                        if (titleErrorMessage != null || priceErrorMessage != null || descriptionErrorMessage != null) {
                            return@launch
                        }
                        val product = ProductCreationRequest(
                            title = title.text,
                            price = price.text.toInt(),
                            description = description.text,
                            characteristics = arrayOf()
                        )
                        val response = api.post<ProductCreationRequest, ProductCreationResponse>(
                            "/api/products?store_id=$storeId",
                            product
                        )
                        if (response.isSuccessful) {
                            createdProductId = response.body()?.product_id
                        } else {
                            val code = response.code()
                            val errorMsg = api.gson.fromJson(
                                response.errorBody()?.string(),
                                ProductCreationError::class.java
                            )
                            titleErrorMessage = "${code}: ${errorMsg.detail}"
                        }
                    }
                    photoErrorMessage = createdProductId?.let { productId ->
                        photo?.let { photoUri ->
                            context.contentResolver.openInputStream(photoUri)?.use { inputStream ->
                                val fileBytes = inputStream.readBytes()
                                val requestFile =
                                    fileBytes.toRequestBody("image/png".toMediaTypeOrNull())
                                val imagePart = MultipartBody.Part.createFormData(
                                    "logo",
                                    "image",
                                    requestFile
                                )
                                val response = api.put<ProductLogoUploadResponse>(
                                    "/api/products/${createdProductId}/logo",
                                    imagePart,
                                )
                                if (response.isSuccessful) {
                                    finishCallback()
                                    return@use null
                                } else {
                                    val code = response.code()
                                    val errorMsg = response.errorBody()?.string()
//                                    val errorMsg = api.gson.fromJson(
//                                        response.errorBody()?.string(),
//                                        ProductCreationError::class.java
//                                    )
                                    return@use "$code: $errorMsg"
                                }
                            } ?: "Error while opening image"
                        } ?: "Product photo was not selected"
                    } ?: "Product was not created"
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
                "Создать товар",
                style = TextStyle(fontSize = 24.sp)
            )
        }
    }
}

@Preview
@Composable
fun ImageInput(
    onImageSelected: (Uri) -> Unit = {},
    errorMessage: String? = null,
    modifier: Modifier = Modifier
) {
    val scriptStyleSuper = TextStyle(
        baselineShift = BaselineShift.Superscript,
        color = MaterialTheme.colorScheme.error
    )
    var imageUri by remember { mutableStateOf<Uri?>(null) }
    val launcher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.GetContent(),
        onResult = { result ->
            imageUri = result
            result?.let { onImageSelected(it) }
        }
    )

    Column(
        modifier = modifier
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically
        ) {
            if (imageUri != null) {
                AsyncImage(
                    model = imageUri,
                    contentDescription = "Selected Image",
                    modifier = Modifier,
                    contentScale = ContentScale.Crop
                )
            }
            IconButton(
                onClick = {
                    launcher.launch("image/png")
                },
                modifier = Modifier.padding(top = 16.dp)
            ) {
                Icon(
                    painter = painterResource(id = R.drawable.upload),
                    "Фото товара",
                )
            }
            if (errorMessage != null) {
                Text(
                    text = "*",
                    style = scriptStyleSuper
                )
                Text(
                    text = errorMessage,
                    color = MaterialTheme.colorScheme.error
                )
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Preview
@Composable
fun ProductCreationTopBar(backbuttonCallback: () -> Unit = {}) {
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
