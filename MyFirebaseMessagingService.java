package com.kidlearn.app;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.os.Build;
import androidx.core.app.NotificationCompat;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

public class MyFirebaseMessagingService extends FirebaseMessagingService {

    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        // 🔵 Soo dir notification
        showNotification(remoteMessage.getNotification().getTitle(),
                         remoteMessage.getNotification().getBody());
    }

    private void showNotification(String title, String message) {
        NotificationManager manager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);

        // 🔵 Samee channel (Android 8+)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                "kidlearn_channel",
                "KidLearn Pro",
                NotificationManager.IMPORTANCE_DEFAULT
            );
            manager.createNotificationChannel(channel);
        }

        // 🔵 Dhise notification
        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, "kidlearn_channel")
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentTitle(title)
            .setContentText(message)
            .setAutoCancel(true);

        manager.notify(1, builder.build());
    }
}
