import { Audio } from "expo-av";

let sound: Audio.Sound | null = null;

let statusCallback: ((status: Audio.SoundStatus) => void) | null = null;

export function setOnPlaybackStatusUpdate(
  cb: (status: Audio.SoundStatus) => void
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
