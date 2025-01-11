package com.fanfare.fanfaremobile

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonColors
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment.Companion.CenterHorizontally
import androidx.compose.ui.Alignment.Companion.CenterVertically
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.fanfare.fanfaremobile.ui.theme.FanfareMobileTheme

const val MIN_TITLE_LENGTH = 2;
const val MAX_TITLE_LENGTH = 32;
const val MAX_DESCRIPTION_LENGTH = 600;

class StoreCreationActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val activity = this
        enableEdgeToEdge()
        setContent {
            FanfareMobileTheme {
                StoreCreationScreen(activity)
            }
        }
    }
}

@Composable
fun StoreCreationScreen(activity: StoreCreationActivity) {
    var title by remember { mutableStateOf("") }
    var description by remember { mutableStateOf("") }
    var logo by remember { mutableStateOf("") }

    var titleError by remember { mutableStateOf("") }
    var descriptionError by remember { mutableStateOf("") }
    var logoError by remember { mutableStateOf("") }

    Scaffold(
        modifier = Modifier.fillMaxSize(),
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .padding(innerPadding)
                .fillMaxSize()
                .background(
                    brush = Brush.radialGradient(
                        colors = listOf(
                            Color(0xFFE9B2FF),
                            Color(0xFFCC73F0)
                        )
                    )
                )
                .verticalScroll(rememberScrollState()),
            horizontalAlignment = CenterHorizontally
        ) {
            Spacer(
                Modifier.height(20.dp)
            )
            Text(
                text = "FANFARE",
                fontSize = 64.sp
            )
            Spacer(
                Modifier.height(5.dp)
            )
            Text(
                text = "Создание магазина",
                fontSize = 40.sp,
                color = Color(0xFF19094A),
            )
            Spacer(
                Modifier.height(10.dp)
            )
            Text(
                text = titleError.ifEmpty { "" },
                color = Color.Red,
                fontSize = 20.sp,
                modifier = Modifier.width(380.dp)
            )
            TextField(
                value = title,
                onValueChange = { input ->
                    title = input
                    titleError =
                        if (input.isEmpty()) {
                            "*Заполните поле"
                        } else if (input.length < MIN_TITLE_LENGTH) {
                            "*Слишком короткое название"
                        } else if (input.length > MAX_TITLE_LENGTH) {
                            "*Слишком длинное название"
                        } else if (!input.matches("^[A-Za-zА-Яа-яёЁ !\"#\$%&'()*+,-./:;<=>?@\\n]+\$".toRegex())) {
                            "*Используйте только латиницу, кириллицу, пробел, перенос строки или !\"#\$%&'()*+,-./:;<=>?@"
                        } else {
                            ""
                        }
                },
                placeholder = {
                    Text(
                        text = "Название",
                        fontSize = 24.sp,
                        color = Color.Gray
                    )
                },
                colors = TextFieldDefaults.colors(
                    focusedContainerColor = Color.White,
                    unfocusedContainerColor = Color.White,
                    focusedIndicatorColor = Color.Transparent,
                    unfocusedIndicatorColor = Color.Transparent,
                    disabledIndicatorColor = Color.Transparent
                ),
                maxLines = 1,
                modifier = Modifier.width(380.dp),
                shape = RoundedCornerShape(15.dp),
                textStyle = TextStyle(
                    fontSize = 24.sp
                )
            )
            Spacer(
                Modifier.height(20.dp)
            )
            Text(
                text = descriptionError.ifEmpty { "" },
                color = Color.Red,
                fontSize = 20.sp,
                modifier = Modifier.width(380.dp)
            )
            TextField(
                value = description,
                onValueChange = { input ->
                    description = input
                    descriptionError =
                        if (input.length > MAX_DESCRIPTION_LENGTH) {
                            "*Слишком длинное описание"
                        } else {
                            ""
                        }
                },
                placeholder = {
                    Text(
                        text = "Описание",
                        fontSize = 24.sp,
                        color = Color.Gray
                    )
                },
                colors = TextFieldDefaults.colors(
                    focusedContainerColor = Color.White,
                    unfocusedContainerColor = Color.White,
                    focusedIndicatorColor = Color.Transparent,
                    unfocusedIndicatorColor = Color.Transparent,
                    disabledIndicatorColor = Color.Transparent
                ),
                minLines = 7,
                maxLines = 7,
                modifier = Modifier.width(380.dp),
                shape = RoundedCornerShape(15.dp),
                textStyle = TextStyle(
                    fontSize = 24.sp
                )
            )
            Spacer(
                Modifier.height(20.dp)
            )
            Text(
                modifier = Modifier.width(350.dp),
                text = "Логотип",
                fontSize = 40.sp,
                color = Color(0xFF19094A)
            )
            Spacer(
                Modifier.height(5.dp)
            )
            Row(
                verticalAlignment = CenterVertically,
                modifier = Modifier.width(350.dp),
            ) {
                IconButton(onClick = {

                },
                    content = {
                        Icon(
                            painterResource(id = R.drawable.upload),
                            contentDescription = "Upload"
                        )
                    }
                )
                Spacer(
                    Modifier.width(5.dp)
                )
                if (logoError.isNotEmpty()) {
                    Text(
                        text = logoError,
                        color = Color.Red,
                        fontSize = 20.sp,
                    )
                } else if (logo.isNotEmpty()) {
                    Text(
                        text = logoError,
                        fontSize = 20.sp,
                    )
                } else {
                    Text(
                        text = "Выберите файл",
                        fontSize = 20.sp,
                    )
                }
            }
            Spacer(
                Modifier.height(5.dp)
            )
            Text(
                modifier = Modifier.width(380.dp),
                text = "Допустимые форматы: JPG, PNG, WEBP, SVG не более 10Мб",
                fontSize = 20.sp,
                color = Color(0xFF19094A),
            )
            Spacer(
                Modifier.height(20.dp)
            )
            Button(
                onClick = {

                },
                modifier = Modifier.shadow(
                    elevation = 10.dp,
                    shape = ButtonDefaults.shape
                ),
                colors = ButtonColors(
                    contentColor = Color(0xFF19094A),
                    containerColor = Color(0xFFD8EAF6),
                    disabledContentColor = Color(0xFF000000),
                    disabledContainerColor = Color(0xFFDFE0E1)
                ),
                content = {
                    Text(
                        text = "Создать магазин",
                        fontSize = 24.sp
                    )
                }
            )
            Spacer(
                Modifier.height(20.dp)
            )
            Cancel(activity = activity)
        }

    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun StoreCreationTopBar(activity: StoreCreationActivity) {
    TopAppBar(
        title = {
            Text(
                text = "Fanfare"
            )
        },
        navigationIcon = {
            IconButton(onClick = {
                activity.finish()
            },
                content = {
                    Icon(
                        imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                        contentDescription = "Back"
                    )
                }
            )
        }
    )
}

@Composable
fun Cancel(activity: StoreCreationActivity) {
    Button(
        onClick = {
            activity.finish()
        },
        modifier = Modifier.shadow(
            elevation = 10.dp,
            shape = ButtonDefaults.shape
        ),
        colors = ButtonColors(
            contentColor = Color(0xFF000000),
            containerColor = Color(0xFFF2E1F8),
            disabledContentColor = Color(0xFF000000),
            disabledContainerColor = Color(0xFFDFE0E1)
        ),
        content = {
            Text(
                text = "Отмена",
                fontSize = 24.sp
            )
        }
    )
}
