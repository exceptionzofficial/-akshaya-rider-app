import { getApp } from '@react-native-firebase/app';
import {
    getMessaging,
    requestPermission,
    AuthorizationStatus,
    getToken,
    onMessage,
    setBackgroundMessageHandler,
    onNotificationOpenedApp,
    getInitialNotification,
    onTokenRefresh,
} from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { riderAPI } from './api';

class NotificationService {
    constructor() {
        this.onNotificationCallback = null;
        this.app = getApp();
        this.messaging = getMessaging(this.app);
    }

    setOnNotificationCallback(callback) {
        this.onNotificationCallback = callback;
    }

    async requestUserPermission() {
        try {
            // Request Firebase Messaging permission (iOS + Android 13+ runtime)
            const authStatus = await requestPermission(this.messaging);
            const enabled =
                authStatus === AuthorizationStatus.AUTHORIZED ||
                authStatus === AuthorizationStatus.PROVISIONAL;

            if (enabled) {
                console.log('Authorization status:', authStatus);
                // Ensure Android 13+ notification runtime permission
                try {
                    await notifee.requestPermission();
                } catch (permErr) {
                    console.warn('Notifee permission request failed:', permErr?.message || permErr);
                }
                await this.getFCMToken();
            }
        } catch (error) {
            console.error('Permission request error:', error);
        }
    }

    async getFCMToken() {
        try {
            const fcmToken = await getToken(this.messaging);
            if (fcmToken) {
                console.log('FCM Token obtained:', fcmToken);
                await AsyncStorage.setItem('fcmToken', fcmToken);

                // If user is logged in, send token to backend
                const userJson = await AsyncStorage.getItem('riderUser');
                if (userJson) {
                    const user = JSON.parse(userJson);
                    if (user.riderId) {
                        try {
                            const response = await riderAPI.updateFCMToken(user.riderId, fcmToken);
                            console.log('FCM Token sent to backend:', response);
                        } catch (error) {
                            console.error('Error sending FCM token to backend:', error);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('FCM Token Error:', error);
        }
    }

    async displayNotification(remoteMessage) {
        try {
            const { notification, data } = remoteMessage;

            // Create a channel for Android
            const channelId = await notifee.createChannel({
                id: 'orders_channel',
                name: 'Order Notifications',
                importance: 4, // High importance
                sound: 'default',
                vibration: true,
                lights: true,
            });

            // Display the notification
            await notifee.displayNotification({
                title: notification?.title || 'New Order',
                body: notification?.body || 'You have a new order assignment',
                data: data || {},
                android: {
                    channelId,
                    smallIcon: 'ic_launcher',
                    pressAction: {
                        id: 'default',
                    },
                    sound: 'default',
                    importance: 4,
                },
                ios: {
                    sound: 'default',
                },
            });
        } catch (error) {
            console.error('Error displaying notification:', error);
        }
    }

    async listen() {
        // Prevent duplicate listener registration
        if (this.isListening) {
            console.log('Notification listeners already registered, skipping...');
            return;
        }

        try {
            this.isListening = true;

            // Foreground state messages
            this.messageListener = onMessage(this.messaging, async remoteMessage => {
                console.log('Foreground notification received:', JSON.stringify(remoteMessage));

                // Display local notification
                await this.displayNotification(remoteMessage);

                // Call the callback if set (for UI updates)
                if (this.onNotificationCallback) {
                    this.onNotificationCallback(remoteMessage);
                }
            });

            // Background & Quit state messages - ONLY set once
            if (!this.backgroundHandlerSet) {
                this.backgroundHandlerSet = true;
                setBackgroundMessageHandler(this.messaging, async remoteMessage => {
                    console.log('Background notification received:', remoteMessage);
                    // Firebase automatically handles background notifications
                });
            }

            // Handle notification open from background
            this.onOpenedListener = onNotificationOpenedApp(this.messaging, remoteMessage => {
                console.log('Notification opened from background:', remoteMessage.notification);
                if (this.onNotificationCallback) {
                    this.onNotificationCallback(remoteMessage);
                }
            });

            // Check for initial notification (app opened from quit state)
            const initialNotification = await getInitialNotification(this.messaging);
            if (initialNotification) {
                console.log('Initial notification from quit state:', initialNotification.notification);
                if (this.onNotificationCallback) {
                    this.onNotificationCallback(initialNotification);
                }
            }

            // Token refresh listener (modular API)
            this.tokenRefreshListener = onTokenRefresh(this.messaging, token => {
                console.log('New FCM Token received:', token);
                this.getFCMToken();
            });

            // Notifee foreground event listener (safe initialization)
            if (!this.notifeeForegroundSet) {
                this.notifeeForegroundSet = true;
                try {
                    notifee.onForegroundEvent(({ type, detail }) => {
                        console.log('Notifee foreground event:', type, detail);
                    });
                } catch (notifeeError) {
                    console.warn('Notifee event listener setup failed (non-critical):', notifeeError);
                }
            }

            console.log('✅ Notification listeners registered successfully');
        } catch (error) {
            console.error('Error setting up notification listeners:', error);
            this.isListening = false;
        }
    }

    unListen() {
        if (this.messageListener) {
            this.messageListener();
            this.messageListener = null;
        }
        if (this.onOpenedListener) {
            this.onOpenedListener();
            this.onOpenedListener = null;
        }
        if (this.tokenRefreshListener) {
            this.tokenRefreshListener();
            this.tokenRefreshListener = null;
        }
        // Reset flag so listen() can be called again if needed
        this.isListening = false;
        console.log('Notification listeners unregistered');
    }
}

export default new NotificationService();
