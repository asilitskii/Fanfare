package com.fanfare.fanfaremobile


import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
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


class ProductActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val api = (applicationContext as FanfareApplication).backendAPI
        val productId = intent.getStringExtra("productId")
        setContent {
            FanfareMobileTheme {
                Scaffold(
                    modifier = Modifier.fillMaxSize(),
                    topBar = { ProductTopBar(::finish) }
                ) { innerPadding ->
                    ProductContent(api, productId!!, modifier = Modifier.padding(innerPadding))
                }
            }
        }
    }
}


@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProductTopBar(onCloseCallback: () -> Unit) {
    val context = LocalContext.current
    TopAppBar(
        title = {
            Row(
                verticalAlignment = Alignment.CenterVertically,
            ) {
                IconButton(onCloseCallback) {
                    Icon(Icons.Filled.Close, contentDescription = "Close")
                }
                Image(
                    painter = painterResource(id = R.drawable.no_logo),
                    contentDescription = "Store Logo",
                    modifier = Modifier.size(32.dp)
                )
            }
        },
        actions = {
            IconButton(
                onClick = { context.startActivity(Intent(context, MainActivity::class.java)) },
                modifier = Modifier.padding(4.dp)
            ) {
                Icon(
                    painter = painterResource(id = R.drawable.home),
                    contentDescription = "Home",
                    tint = Color.Black
                )
            }
            IconButton(
                onClick = { context.startActivity(Intent(context, ProfileActivity::class.java)) },
                modifier = Modifier.padding(4.dp)
            ) {
                Icon(
                    painter = painterResource(id = R.drawable.profile),
                    contentDescription = "Profile",
                    tint = Color.Black
                )
            }
        },
        colors = TopAppBarDefaults.smallTopAppBarColors(containerColor = Color(0xFFB385F8))
    )
}


@Composable
fun ProductContent(api: BackendAPI, productId: String, modifier: Modifier = Modifier) {
    val name = remember { mutableStateOf("Название товара") }
    val price = remember { mutableStateOf(9999) }
    val description = remember { mutableStateOf("Это описание товара.") }
    val logo = remember { mutableStateOf<String?>(null) }

    LaunchedEffect(null) {
        val product = api.get<ProductFullData>("/api/products/$productId/full").body()!!
        name.value = product.title
        price.value = product.price
        description.value = product.description
        logo.value = product.logo_url
    }

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(Color.White)
            .padding(16.dp)
    ) {
        Column(
            modifier = Modifier.fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Text(
                text = name.value,
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                color = Color.Black
            )
            AsyncImage(
                model = logo.value,
                error = painterResource(id = R.drawable.no_logo),
                contentDescription = "Product Image",
                modifier = Modifier
                    .size(200.dp)
                    .background(Color.LightGray, shape = RoundedCornerShape(8.dp)),
                contentScale = ContentScale.Crop
            )
            Text(
                text = "${price.value} ₽",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = Color.Black
            )
            Text(
                text = description.value,
                fontSize = 16.sp,
                color = Color.Gray,
                modifier = Modifier.padding(horizontal = 16.dp)
            )
            Button(
                onClick = { /* Buy action */ },
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFB385F8))
            ) {
                Text(text = "Купить сейчас", color = Color.White, fontSize = 16.sp)
            }
        }
    }
}


data class ProductFullData(
    val title: String,
    val price: Int,
    val description: String,
    val logo_url: String,
    val store_id: String,
)



