import AsyncStorage from "@react-native-async-storage/async-storage";
import { Song } from "../store/songStore";

const LAST_SONG_KEY = "LAST_PLAYED_SONG";
const LAST_INDEX_KEY = "LAST_PLAYED_INDEX";

export async function saveLastPlayedSong(song: Song, index: number) {
  await AsyncStorage.multiSet([
    [LAST_SONG_KEY, JSON.stringify(song)],
    [LAST_INDEX_KEY, index.toString()],
  ]);
}

export async function loadLastPlayedSong(): Promise<{
  song: Song | null;
  index: number;
}> {
  try {
    const [[, song], [, index]] = await AsyncStorage.multiGet([
      LAST_SONG_KEY,
      LAST_INDEX_KEY,
    ]);

    if (!song || index === null) {
      return { song: null, index: -1 };
    }

    return {
      song: JSON.parse(song),
      index: Number(index),
    };
  } catch {
    return { song: null, index: -1 };
  }
}
