package com.fanfare.fanfaremobile

import android.app.ComponentCaller
import android.content.Intent
import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ExitToApp
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LocalTextStyle
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Alignment.Companion.CenterHorizontally
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.TextFieldValue
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.fanfare.fanfaremobile.ProfileActivity.UserMeResponse
import com.fanfare.fanfaremobile.backendapi.BackendAPI
import com.fanfare.fanfaremobile.ui.theme.FanfareMobileTheme
import kotlinx.coroutines.launch

data class StoreShortInfo(
    val title: String,
    val store_id: String,
    val logo_url: String?
)

class ProfileActivity : ComponentActivity() {

    class UserMeResponse(
        val birthday: String,
        val created_at: String,
        val email: String,
        val first_name: String,
        val is_seller: Boolean,
        val last_name: String,
        val seller_request_status: String,
        val tg_id: Any,
        val updated_at: String?,
        val vk_id: Any
    )

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        val api = (applicationContext as FanfareApplication).backendAPI
        // Call method if authorization is needed
        api.ensureLoggedIn(this)
    }

    override fun onActivityResult(
        requestCode: Int,
        resultCode: Int,
        data: Intent?,
        caller: ComponentCaller
    ) {
        super.onActivityResult(requestCode, resultCode, data, caller)
        if (requestCode == 0) {
            if (resultCode == LoginActivity.ResultCodes.Success.value) {

                val api = (applicationContext as FanfareApplication).backendAPI

                setContent {
                    FanfareMobileTheme {
                        Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
                            Profile(
                                api = api,
                                logoutCallback = ::logout,
                                finishCallback = ::finish,
                                sendSellerRequestCallback = ::sendRequestSellerStatus,
                                modifier = Modifier.padding(innerPadding)
                            )
                        }
                    }
                }
            } else {
                finish()
            }
        }
    }

    private suspend fun logout() {
        val context = applicationContext as FanfareApplication
        context.backendAPI.logout()
        finish()
    }

    private suspend fun sendRequestSellerStatus() {
        val context = applicationContext as FanfareApplication
        context.backendAPI.sendRequestSellerStatus()
        finish()
        startActivity(Intent(context, ProfileActivity::class.java));
    }
}

//Copied from MainActivity
@OptIn(ExperimentalMaterial3Api::class)
@Preview(showBackground = true)
@Composable
fun ProfileTopBar(homeButtonCallback: () -> Unit = {}) {
    val context = LocalContext.current
    var searchValue = remember { TextFieldValue("") }

    TopAppBar(
        title = {
            Surface(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(17.dp),
                border = BorderStroke(2.dp, Color(0xFF19094A)),
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 8.dp)
                        .height(30.dp)
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        TextField(
                            value = searchValue,
                            onValueChange = { searchValue = it },
                            placeholder = {
                                Text(
                                    "Поиск магазина",
                                    color = Color(0xFF8E8E93),
                                    fontSize = 12.sp
                                )
                            },
                            modifier = Modifier
                                .weight(1f)
                                .height(30.dp)
                                .padding(end = 8.dp),
                            colors = TextFieldDefaults.textFieldColors(
                                containerColor = Color.White,
                                unfocusedIndicatorColor = Color.Transparent,
                                focusedIndicatorColor = Color.Transparent
                            ),
                            textStyle = LocalTextStyle.current.copy(color = Color.White)
                        )
                        IconButton(
                            onClick = { /* Search Action */ },
                            modifier = Modifier
                                .size(34.dp)
                                .background(Color(0xFF19094A), shape = CircleShape)
                        ) {
                            Icon(
                                painter = painterResource(id = R.drawable.search),
                                contentDescription = "Search",
                                tint = Color.White,
                            )
                        }
                    }
                }
            }
        },
        actions = {
            IconButton(onClick = homeButtonCallback) {
                Icon(
                    painter = painterResource(id = R.drawable.ic_home_page),
                    contentDescription = "Home",
                    tint = Color(0xFF1C1B1F)
                )
            }
        },
        colors = TopAppBarDefaults.smallTopAppBarColors(containerColor = Color(0xFFB385F8))
    )
}

@Preview(showBackground = true)
@Composable
fun Profile(
    api: BackendAPI? = null, logoutCallback: suspend () -> Unit = {},
    finishCallback: () -> Unit = {},
    sendSellerRequestCallback: suspend () -> Unit = {},
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current

    val coroutineScope = rememberCoroutineScope()

    val firstName = remember { mutableStateOf<String>("First name") }
    val lastName = remember { mutableStateOf<String>("Last name") }
    val sellerRequestStatus = remember { mutableStateOf<String>("no_data") }
    val isSellerStatus = remember { mutableStateOf<Boolean>(false) }
    val tgId = remember { mutableIntStateOf(0) }

    val myStoresList = remember { mutableStateOf<Array<StoreShortInfo>?>(null) }

    @Composable
    fun updateUserData() {
        if (api != null) {
            LaunchedEffect(null) {
                val userData = api.get<UserMeResponse>("/api/users/me").body()!!
                firstName.value = userData.first_name
                lastName.value = userData.last_name
                sellerRequestStatus.value = userData.seller_request_status
                isSellerStatus.value = userData.is_seller
                tgId.intValue = if (userData.tg_id == null) 0 else userData.tg_id as Int
                Log.i("TAG", tgId.intValue.toString());
            }
        }
    }

    @Composable
    fun updateStoreListData() {
        if (api != null) {
            LaunchedEffect(null) {

                val myStoresData = api.get<Array<StoreShortInfo>>("/api/stores/my")
                myStoresList.value = myStoresData.body()
            }
        }
    }

    fun getStoreIdOfMyStore(storeData: String): String {
        val storeId = storeData.substringAfter("store_id=").substringBefore(',')

        return storeId
    }

    updateUserData()
    updateStoreListData()

    Scaffold(
        topBar = {
            ProfileTopBar(finishCallback)
        }
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
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(158.dp)
                    .background(color = Color(0xffdd9ef6))
            ) {
                Row(
                    modifier = Modifier
                        .padding(16.dp)
                        .fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(64.dp)
                            .background(color = Color(0xffc9b9fc), CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "${firstName.value.first()}",
                            fontSize = 40.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }

                    Spacer(modifier = Modifier.width(16.dp))
                    Column {
                        Text(
                            text = firstName.value,
                            fontWeight = FontWeight.Bold,
                            fontSize = 24.sp,
                            color = Color.Black
                        )
                        Text(
                            text = lastName.value,
                            fontWeight = FontWeight.Bold,
                            fontSize = 24.sp,
                            color = Color.Black
                        )
                    }
                }

                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(start = 16.dp, end = 16.dp, bottom = 16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("Выйти из аккаунта", fontSize = 18.sp, color = Color.Gray)
                    Spacer(modifier = Modifier.width(10.dp))
                    IconButton(onClick = { coroutineScope.launch { logoutCallback() } }) {
                        Icon(
                            imageVector = Icons.Filled.ExitToApp,
                            contentDescription = "Edit",
                            tint = Color.Gray
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(107.dp)
                    .background(color = Color(0xffdd9ef6))
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceEvenly
                ) {
                    // Telegram
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(
                            text = "TELEGRAM",
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF191A30)
                        )
                        Text(text = "ID: 12345", fontSize = 16.sp, color = Color(0xFF191A30))
                        Button(
                            onClick = { },
                            modifier = Modifier.width(100.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFE2C0F1)),
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Text("Выйти", color = Color.DarkGray)
                        }
                    }

                    // VK
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(
                            text = "ВКОНТАКТЕ",
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF191A30)
                        )
                        OutlinedTextField(
                            value = "",
                            onValueChange = {},
                            enabled = false,
                            modifier = Modifier
                                .width(162.dp)
                                .height(25.dp),
                            colors = OutlinedTextFieldDefaults.colors(
                                disabledTextColor = Color.Gray,
                                disabledBorderColor = Color.Gray,
                                disabledContainerColor = Color(0xFFE2C0F1)
                            ),
                            shape = RoundedCornerShape(10.dp)
                        )
                        Button(
                            onClick = { },
                            modifier = Modifier.width(135.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFE2C0F1)),
                            shape = RoundedCornerShape(10.dp),
                        ) {
                            Text("Подтвердить", color = Color.DarkGray)
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(19.dp))

            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(color = Color(0xffdd9ef6))
            ) {
                if (!isSellerStatus.value && (sellerRequestStatus.value == "no_data" || sellerRequestStatus.value == "rejected")) {
                    Button(
                        onClick = { coroutineScope.launch { sendSellerRequestCallback() } },
                        modifier = Modifier.padding(end = 8.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFE2C0F1)),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = "ЗАПРОСИТЬ СТАТУС ПРОДАВАЦА",
                                fontSize = 16.sp,
                                color = Color(0xFF191A30)
                            )
                        }
                    }
                } else if (!isSellerStatus.value && sellerRequestStatus.value == "requested") {
                    Text(
                        text = "Вы запросили статус продавца. Ваша заявка будет рассмотрена в ближайшее время.",
                        modifier = modifier
                    )
                }

                updateStoreListData()
                Log.i("TAG_Store_List", myStoresList.value.toString())

                var storeId = getStoreIdOfMyStore(myStoresList.value.toString())
                Log.i("TAG_Store_Id", storeId)
                if (isSellerStatus.value && myStoresList.value == null) {
                    Text(
                        text = "Статус продавца одобрен. Необходимо перезайти в аккаунт.",
                        modifier = modifier
                    )
                } else if (isSellerStatus.value && myStoresList.value.isNullOrEmpty()) {
                    // Creation Shop Button. Here need to be placed transition to StoreCreationActivity
                    Button(
                        onClick = {
                            context.startActivity(
                                Intent(
                                    context,
                                    StoreCreationActivity::class.java
                                )
                            )
                        },
                        modifier = Modifier.padding(end = 8.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFE2C0F1)),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = "СОЗДАТЬ МАГАЗИН",
                                fontSize = 16.sp,
                                color = Color(0xFF191A30)
                            )
                            Icon(
                                painter = painterResource(id = R.drawable.ic_store),
                                contentDescription = "Shop Icon",
                                tint = Color(0xFF191A30),
                                modifier = Modifier.padding(start = 4.dp)
                            )
                        }
                    }

                    // My Shop Button. Here need to be placed transition to StoreActivity
                    Button(
                        onClick = {
                            context.startActivity(Intent(context, StoreActivity::class.java))
                        },
                        modifier = Modifier.padding(end = 8.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFE2C0F1)),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = "ПРОСМОТР ПРИМЕРА МАГАЗИНА",
                                fontSize = 16.sp,
                                color = Color(0xFF191A30)
                            )
                            Icon(
                                painter = painterResource(id = R.drawable.ic_store),
                                contentDescription = "Shop Icon",
                                tint = Color(0xFF191A30),
                                modifier = Modifier.padding(start = 4.dp)
                            )
                        }
                    }
                } else if (isSellerStatus.value && !myStoresList.value.isNullOrEmpty()) {
                    // My Shop Button. Here need to be placed transition to StoreActivity
                    for (store in myStoresList.value!!) {
                        Button(
                            onClick = {
                                val intent = Intent(context, StoreActivity::class.java)
                                intent.putExtra("storeId", store.store_id)
                                context.startActivity(intent)
                            },
                            modifier = Modifier.padding(end = 8.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFE2C0F1)),
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(
                                    text = store.title,
                                    fontSize = 16.sp,
                                    color = Color(0xFF191A30)
                                )
                                Icon(
                                    painter = painterResource(id = R.drawable.ic_store),
                                    contentDescription = "Shop Icon",
                                    tint = Color(0xFF191A30),
                                    modifier = Modifier.padding(start = 4.dp)
                                )
                            }
                        }
                    }

                    Button(
                        onClick = { },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFE2C0F1)),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = "ЗАКАЗЫ ПОКУПАТЕЛЕЙ",
                                fontSize = 16.sp,
                                color = Color(0xFF191A30)
                            )
                            Icon(
                                painter = painterResource(id = R.drawable.ic_store_orders_list),
                                contentDescription = "Checklist Icon",
                                tint = Color(0xFF191A30),
                                modifier = Modifier.padding(start = 4.dp)
                            )
                        }
                    }

                    Button(
                        onClick = {
                            context.startActivity(
                                Intent(
                                    context,
                                    StoreCreationActivity::class.java
                                )
                            )
                        },
                        modifier = Modifier.padding(end = 8.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFE2C0F1)),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = "СОЗДАТЬ МАГАЗИН",
                                fontSize = 16.sp,
                                color = Color(0xFF191A30)
                            )
                            Icon(
                                painter = painterResource(id = R.drawable.ic_store),
                                contentDescription = "Shop Icon",
                                tint = Color(0xFF191A30),
                                modifier = Modifier.padding(start = 4.dp)
                            )
                        }
                    }
                }
            }

            Spacer(Modifier.height(20.dp))

            // Orders
            Text(
                text = "МОИ ЗАКАЗЫ",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(16.dp),
                textAlign = TextAlign.Start
            )

            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                colors = CardDefaults.cardColors(
                    containerColor = Color(0xFFE2C0F1)
                ),
                shape = RoundedCornerShape(8.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "ЗАКАЗ 672997-78F888-3054BF-B28B7D",
                        fontSize = 14.sp,
                        color = Color(0xFF191A30)
                    )
                    Text(
                        text = "ОТ 1 ЯНВАРЯ 2000",
                        fontSize = 14.sp,
                        color = Color.DarkGray
                    )
                    Text(
                        text = "СТАТУС: В ПУТИ",
                        fontSize = 16.sp,
                        fontWeight = androidx.compose.ui.text.font.FontWeight.Bold,
                        modifier = Modifier.padding(top = 8.dp),
                        color = Color(0xFF191A30)
                    )
                    Row(modifier = Modifier.padding(top = 8.dp)) {
                        repeat(3) {
                            Button(
                                onClick = { },
                                modifier = Modifier.padding(end = 8.dp),
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = Color(
                                        0xFF191A30
                                    )
                                )
                            ) {
                                Text(
                                    "ФОТО\nТОВАРА",
                                    textAlign = TextAlign.Center,
                                    color = Color.White
                                )
                            }
                        }
                    }
                    Text(
                        text = "100 000 Р",
                        fontSize = 16.sp,
                        modifier = Modifier.padding(top = 8.dp),
                        color = Color(0xFF191A30)
                    )
                }
            }
        }
    }
}
