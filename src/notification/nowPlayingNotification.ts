import { Platform } from "react-native";
import * as Notifications from "expo-notifications";

const NOTIFICATION_ID = "now_playing";
export const NOW_PLAYING_CHANNEL_ID = "now_playing";

/** Call once at app startup: set handler, create Android channel, request permission. */
export async function setupNotifications(): Promise<void> {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(NOW_PLAYING_CHANNEL_ID, {
      name: "Now Playing",
      importance: Notifications.AndroidImportance.LOW,
      sound: undefined,
    });
  }

  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") {
    await Notifications.requestPermissionsAsync();
  }
}

export async function showNowPlaying(title: string, body: string) {
  try {
    await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_ID);
    await Notifications.dismissNotificationAsync(NOTIFICATION_ID);
    await Notifications.scheduleNotificationAsync({
      identifier: NOTIFICATION_ID,
      content: {
        title: "Now playing",
        body: `${title} – ${body}`,
        ...(Platform.OS === "android" && { channelId: NOW_PLAYING_CHANNEL_ID }),
      },
      trigger: null,
    });
  } catch (e) {
    console.warn("showNowPlaying:", e);
  }
}

export async function clearNowPlaying() {
  try {
    await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_ID);
    await Notifications.dismissNotificationAsync(NOTIFICATION_ID);
  } catch (e) {
    console.warn("clearNowPlaying:", e);
  }
}
