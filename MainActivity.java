package com.kidlearn.app;

import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.appcompat.app.AppCompatActivity;
import android.widget.Toast;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.content.Context;
import android.app.AlertDialog;

public class MainActivity extends AppCompatActivity {

    WebView webView;
    boolean isOnline = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        webView = findViewById(R.id.webView);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);  // 🔵 Offline support
        
        // 🔵 Hubi internet-ka
        checkInternetConnection();

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                // 🔵 Muuji in app-ka uu shaqeynayo
                Toast.makeText(MainActivity.this, "✅ KidLearn Pro Loaded!", Toast.LENGTH_SHORT).show();
            }
            
            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                // 🔵 Haddii internet uu jiro
                if (!isOnline) {
                    showOfflineDialog();
                }
            }
        });

        webView.loadUrl("https://ayuubgaafaa.github.io/KidLearnPro/");
    }

    // 🔵 Hubi internet-ka
    private void checkInternetConnection() {
        ConnectivityManager cm = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo activeNetwork = cm.getActiveNetworkInfo();
        isOnline = activeNetwork != null && activeNetwork.isConnectedOrConnecting();
    }

    // 🔵 Muuji fariin offline
    private void showOfflineDialog() {
        new AlertDialog.Builder(this)
            .setTitle("📡 No Internet Connection")
            .setMessage("KidLearn Pro needs internet to load content. Please check your connection.")
            .setPositiveButton("Retry", (dialog, which) -> {
                webView.reload();
            })
            .setNegativeButton("Exit", (dialog, which) -> {
                finish();
            })
            .show();
    }
}
