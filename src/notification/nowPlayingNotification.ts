import * as Notifications from "expo-notifications";

const NOTIFICATION_ID = "now_playing";

export async function showNowPlaying(title: string, body: string) {
  try {
    await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_ID);
    await Notifications.scheduleNotificationAsync({
      identifier: NOTIFICATION_ID,
      content: {
        title: "Now playing",
        body: `${title} – ${body}`,
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
  } catch (e) {
    console.warn("clearNowPlaying:", e);
  }
}
