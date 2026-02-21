import { Audio, AVPlaybackStatus } from "expo-av";

let sound: Audio.Sound | null = null;
let currentUri: string | null = null;
let statusCallback: ((status: AVPlaybackStatus) => void) | null = null;

Audio.setAudioModeAsync({
  allowsRecordingIOS: false,
  staysActiveInBackground: true,
  playsInSilentModeIOS: true,
  shouldDuckAndroid: true,
});

export function setOnPlaybackStatusUpdate(
  cb: (status: AVPlaybackStatus) => void
) {
  statusCallback = cb;
}

/** Resume already-loaded sound if it's for this URL (keeps position). Returns true if resumed. */
export async function resumeSoundIfCurrent(url: string): Promise<boolean> {
  if (sound && currentUri === url) {
    await sound.playAsync();
    return true;
  }
  return false;
}

export async function playSound(url: string) {
  if (sound) {
    await sound.unloadAsync();
    sound = null;
    currentUri = null;
  }

  const { sound: newSound } = await Audio.Sound.createAsync(
    { uri: url },
    { shouldPlay: true },
    (status) => {
      statusCallback?.(status);
    }
  );

  sound = newSound;
  currentUri = url;
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
