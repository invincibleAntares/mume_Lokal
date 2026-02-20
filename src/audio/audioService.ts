import { Audio, AVPlaybackStatus } from "expo-av";

let sound: Audio.Sound | null = null;

let statusCallback: ((status: AVPlaybackStatus) => void) | null = null;

Audio.setAudioModeAsync({
  allowsRecordingIOS: false,
  staysActiveInBackground: true, // ✅ background playback
  playsInSilentModeIOS: true,
  shouldDuckAndroid: true,
});

export function setOnPlaybackStatusUpdate(
  cb: (status: AVPlaybackStatus) => void
) {
  statusCallback = cb;
}

export async function playSound(url: string) {
  if (sound) {
    await sound.unloadAsync();
    sound = null;
  }

  const { sound: newSound } = await Audio.Sound.createAsync(
    { uri: url },
    { shouldPlay: true },
    (status) => {
      statusCallback?.(status);
    }
  );

  sound = newSound;
}

export async function pauseSound() {
  if (!sound) return;
  await sound.pauseAsync();
}

export async function resumeSound() {
  if (!sound) return;
  await sound.playAsync();
}

export async function seekTo(positionMillis: number) {
  if (!sound) return;
  await sound.setPositionAsync(positionMillis);
}
