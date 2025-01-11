package com.fanfare.fanfaremobile

import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Divider
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil3.compose.AsyncImage
import com.fanfare.fanfaremobile.backendapi.BackendAPI
import com.fanfare.fanfaremobile.ui.theme.FanfareMobileTheme


class StoreActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val api = (applicationContext as FanfareApplication).backendAPI
        val storeId = intent.getStringExtra("storeId")
        setContent {
            FanfareMobileTheme {
                Scaffold(
                    modifier = Modifier.fillMaxSize(),
                    topBar = { StoreTopBar(storeId!!, api, ::finish) }
                ) { innerPadding ->
                    StoreContent(
                        api = api,
                        storeId = storeId!!,
                        modifier = Modifier.padding(innerPadding)
                    )
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun StoreTopBar(storeId: String, api: BackendAPI, closeCallback: () -> Unit = {}) {
    val showDialog = remember { mutableStateOf(false) }
    val storeLogoUrl = remember { mutableStateOf<String?>(null) }
    val context = LocalContext.current

    LaunchedEffect(null) {
        val store = api.get<StoreFullInfo>("/api/stores/$storeId/full").body()!!
        storeLogoUrl.value = store.logo_url
    }

    TopAppBar(
        title = {
            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(onClick = closeCallback) {
                    Icon(Icons.Filled.Close, contentDescription = "Close")
                }
                AsyncImage(
                    model = storeLogoUrl.value,
                    error = painterResource(id = R.drawable.no_logo),
                    contentDescription = "Store Logo",
                    modifier = Modifier.size(32.dp)
                )
            }
        },
        actions = {
            IconButton(
                onClick = {
                    val intent = Intent(context, ProductCreationActivity::class.java)
                    intent.putExtra("storeId", storeId)
                    context.startActivity(intent)
                },
                modifier = Modifier
                    .padding(4.dp)
            ) {
                Icon(
                    Icons.Filled.Add,
                    contentDescription = "Create Product",
                    tint = Color.Black
                )
            }
            IconButton(
                onClick = { context.startActivity(Intent(context, ProfileActivity::class.java)) },
                modifier = Modifier
                    .padding(4.dp)
            ) {
                Icon(
                    painter = painterResource(id = R.drawable.profile),
                    contentDescription = "Profile",
                    tint = Color.Black
                )
            }
            IconButton(
                onClick = { showDialog.value = true },
                modifier = Modifier
                    .padding(4.dp)
            ) {
                Icon(
                    painter = painterResource(id = R.drawable.user_invoice),
                    contentDescription = "Invoice",
                    tint = Color.Black
                )
            }
        },
        colors = TopAppBarDefaults.smallTopAppBarColors(containerColor = Color(0xFFB385F8))
    )

    if (showDialog.value) {
        AlertDialog(
            onDismissRequest = { showDialog.value = false },
            title = {
                Text("Telegram", fontWeight = FontWeight.Bold)
            },
            text = {
                Column {
                    Text("1 комментарий = 1 FanCoin's")
                    Text("1 буст = 1 FanCoin's")
                    Divider(modifier = Modifier.padding(vertical = 8.dp))
                    Text("Ваш счёт: 0", fontWeight = FontWeight.Bold)
                }
            },
            confirmButton = {
                TextButton(onClick = { showDialog.value = false }) {
                    Text("Закрыть")
                }
            }
        )
    }
}


@Composable
fun StoreContent(api: BackendAPI, storeId: String, modifier: Modifier = Modifier) {
    val title = remember { mutableStateOf("Название магазина") }
    val description = remember { mutableStateOf("Описание магазина") }
    val logoUrl = remember { mutableStateOf<String?>(null) }
    val products = remember { mutableStateOf(arrayOf<ProductInfo>()) }
    LaunchedEffect(null) {
        val store = api.get<StoreFullInfo>("/api/stores/$storeId/full").body()!!
        title.value = store.title
        description.value = store.description
        logoUrl.value = store.logo_url
        products.value = api.get<Array<ProductInfo>>("/api/products?store_id=$storeId").body()!!
    }

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(
                brush = Brush.radialGradient(
                    colors = listOf(
                        Color(0xFFE9B2FF),
                        Color(0xFFCC73F0)
                    )
                )
            )
            .padding(16.dp)
    ) {
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item {
                Column(
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        text = title.value,
                        fontSize = 24.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF19094A)
                    )
                    Text(
                        text = description.value,
                        fontSize = 16.sp,
                        color = Color(0xFF19094A),
                        modifier = Modifier.padding(top = 8.dp)
                    )
                }
            }
            items(products.value.toList().chunked(2)) { rowProducts ->
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    rowProducts.forEach { product ->
                        ProductCard(product = product, modifier = Modifier.weight(1f))
                    }
                }
            }
        }
    }
}

@Composable
fun ProductCard(product: ProductInfo, modifier: Modifier = Modifier) {
    val context = LocalContext.current
    Column(
        modifier = modifier
            .fillMaxWidth()
            .clickable {
                val intent = Intent(context, ProductActivity::class.java)
                intent.putExtra("productId", product.product_id)
                context.startActivity(intent)
            }
    ) {
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .aspectRatio(1f),
            shape = RoundedCornerShape(8.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White)
        ) {
            Box(modifier = Modifier.fillMaxSize()) {
                AsyncImage(
                    model = product.logo_url,
                    placeholder = painterResource(R.drawable.no_logo),
                    error = painterResource(R.drawable.no_logo),
                    contentDescription = "No Logo",
                    modifier = Modifier.fillMaxSize(),
                    contentScale = ContentScale.Crop
                )
            }
        }
        Text(
            text = product.title,
            fontSize = 16.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF19094A),
            modifier = Modifier.padding(top = 8.dp)
        )
        Text(
            text = "${product.price} ₽",
            fontSize = 16.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF19094A)
        )
    }
}

data class ProductInfo(
    val title: String,
    val price: Int,
    val product_id: String,
    val logo_url: String?
)

data class StoreFullInfo(
    val title: String,
    val description: String,
    val store_id: String,
    val logo_url: String?
)
