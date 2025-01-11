package com.fanfare.fanfaremobile

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LocalTextStyle
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.material3.TextFieldDefaults
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
import androidx.compose.ui.text.input.TextFieldValue
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil3.compose.AsyncImage
import com.fanfare.fanfaremobile.backendapi.StoreShortInfo
import com.fanfare.fanfaremobile.ui.theme.FanfareMobileTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            FanfareMobileTheme {
                Scaffold(
                    modifier = Modifier.fillMaxSize(),
                    topBar = { MainTopBar() },
                ) { innerPadding ->
                    StoreList(
                        activity = this,
                        onGetStores = ::onGetStores,
                        modifier = Modifier.padding(innerPadding)
                    )
                };
            }
        }
    }

    private suspend fun onGetStores(search: String?): Array<StoreShortInfo> {
        val backendAPI = (applicationContext as FanfareApplication).backendAPI
        val stores = backendAPI.getStoreList(search)
        return stores
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Preview(showBackground = true)
@Composable
fun MainTopBar() {
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
            IconButton(onClick = {
//                context.startActivity(Intent(context, MainActivity::class.java))
            }) {
                Icon(
                    painter = painterResource(id = R.drawable.home),
                    contentDescription = "Home",
                    tint = Color(0xFF1C1B1F)
                )
            }
            IconButton(onClick = {
                context.startActivity(Intent(context, ProfileActivity::class.java))
            }) {
                Icon(
                    painter = painterResource(id = R.drawable.profile),
                    contentDescription = "Profile",
                    tint = Color(0xFF1C1B1F)
                )
            }
        },
        colors = TopAppBarDefaults.smallTopAppBarColors(containerColor = Color(0xFFB385F8))
    )
}

@Preview(showBackground = true)
@Composable
fun StoreList(
    activity: Activity? = null,
    onGetStores: suspend (String?) -> Array<StoreShortInfo> = { emptyArray() },
    modifier: Modifier = Modifier
) {
    val (stores, setStores) = remember { mutableStateOf<Array<StoreShortInfo>?>(null) }
    val (isLoading, setLoading) = remember { mutableStateOf(true) }
    val (errorMessage, setErrorMessage) = remember { mutableStateOf<String?>(null) }

    LaunchedEffect(Unit) {
        try {
            setLoading(true)
            setStores(onGetStores(null))
        } catch (e: Exception) {
            setErrorMessage("Ошибка сети: ${e.localizedMessage}")
        } finally {
            setLoading(false)
        }
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
        when {
            isLoading -> {
                CircularProgressIndicator(
                    modifier = Modifier.align(Alignment.Center),
                    color = Color(0xFF19094A)
                )
            }

            errorMessage != null -> {
                Text(
                    text = errorMessage ?: "Неизвестная ошибка",
                    color = Color.Red,
                    modifier = Modifier.align(Alignment.Center)
                )
            }

            stores != null -> {
                LazyColumn(
                    modifier = Modifier.fillMaxSize()
                ) {
                    items(stores.asList().chunked(2)) { rowStores ->
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(16.dp)
                        ) {
                            rowStores.forEach { store ->
                                StoreCard(
                                    store = Store(
                                        store.id,
                                        store.name,
                                        R.drawable.profile,
                                        store.logoUrl
                                    ),
                                    modifier = Modifier.weight(1f),
                                    activity = activity
                                )
                            }
                        }
                        Spacer(modifier = Modifier.height(16.dp))
                    }
                }
            }
        }
    }
}

@Composable
fun StoreCard(store: Store, activity: Activity? = null, modifier: Modifier = Modifier) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .clickable {
                activity?.let {
                    val intent = Intent(activity, StoreActivity::class.java)
                    intent.putExtra("storeId", store.id)
                    activity.startActivity(intent)
                }
            },
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .aspectRatio(1f),
            shape = RoundedCornerShape(8.dp),
            colors = CardDefaults.cardColors(containerColor = Color(0xFFFFFFFF))
        ) {
            AsyncImage(
                model = store.url,
                contentDescription = store.name,
                placeholder = painterResource(id = store.image),
                error = painterResource(id = store.image),
                modifier = Modifier
                    .fillMaxSize(),
                contentScale = ContentScale.Crop
            )
        }
        Text(
            text = store.name,
            fontSize = 16.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF19094A),
            modifier = Modifier.padding(top = 8.dp)
        )
    }
}


data class Store(val id: String, val name: String, val image: Int, val url: String?)