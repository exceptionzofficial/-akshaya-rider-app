/**
 * @format
 */

import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import './src/rnfbModularSilence';
import App from './App';
import { name as appName } from './app.json';

// Ensure a notification channel exists for background notifications (Android)
const ensureOrdersChannel = async () => {
  try {
    await notifee.createChannel({
      id: 'orders_channel',
      name: 'Order Notifications',
      importance: 4,
      sound: 'default',
    });
  } catch (err) {
    console.warn('Channel creation failed (non-critical):', err?.message || err);
  }
};

// Background handler for FCM data/notification messages
messaging().setBackgroundMessageHandler(async remoteMessage => {
  try {
    await ensureOrdersChannel();

    const title =
      remoteMessage?.notification?.title ||
      remoteMessage?.data?.title ||
      'New Order';
    const body =
      remoteMessage?.notification?.body ||
      remoteMessage?.data?.body ||
      'You have a new assignment';

    await notifee.displayNotification({
      title,
      body,
      data: remoteMessage?.data || {},
      android: {
        channelId: 'orders_channel',
        smallIcon: 'ic_launcher',
        pressAction: { id: 'default' },
        sound: 'default',
        importance: 4,
      },
      ios: {
        sound: 'default',
      },
    });
  } catch (err) {
    console.warn('BG notification failed (non-critical):', err?.message || err);
  }
});

AppRegistry.registerComponent(appName, () => App);
