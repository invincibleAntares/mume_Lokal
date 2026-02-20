import { create } from "zustand";
import { searchSongs } from "../api/saavn";
import { playSound, pauseSound, resumeSound } from "../audio/audioService";
import { getBestAudio } from "../utils/getAudioUrl";
import { setOnPlaybackStatusUpdate } from "../audio/audioService";

/* ---------- Types ---------- */

export interface SongImage {
  quality: string;
  url: string;
}

export interface SongAudio {
  quality: string;
  url: string;
}

export interface Song {
  id: string;
  name: string;
  primaryArtists: string;
  image: SongImage[];
  downloadUrl: SongAudio[];
  positionMillis: number;
  durationMillis: number;
}

interface SongState {
  /* Song list */
  songs: Song[];
  loading: boolean;
  fetchSongs: (query: string) => Promise<void>;

  /* Player state */
  currentSong: Song | null;
  isPlaying: boolean;
  setCurrentSong: (song: Song) => Promise<void>;
  togglePlay: () => Promise<void>;
  positionMillis: number;
  durationMillis: number;
}

/* ---------- Zustand Store ---------- */

export const useSongStore = create<SongState>((set, get) => ({
  /* ---------- List ---------- */
  songs: [],
  loading: false,

  fetchSongs: async (query: string) => {
    set({ loading: true });
    try {
      const results = await searchSongs(query);
      set({ songs: results });
    } catch (e) {
      console.error("Failed to fetch songs", e);
    } finally {
      set({ loading: false });
    }
  },

  /* ---------- Player ---------- */
  currentSong: null,
  isPlaying: false,
  positionMillis: 0,
  durationMillis: 1,

  setCurrentSong: async (song) => {
    const url = getBestAudio(song.downloadUrl);
    if (!url) return;

    setOnPlaybackStatusUpdate((status) => {
      if (!status.isLoaded) return;

      set({
        positionMillis: status.positionMillis ?? 0,
        durationMillis: status.durationMillis ?? 1,
      });
    });

    await playSound(url);

    set({
      currentSong: song,
      isPlaying: true,
    });
  },

  togglePlay: async () => {
    const { isPlaying } = get();

    if (isPlaying) {
      await pauseSound();
    } else {
      await resumeSound();
    }

    set({ isPlaying: !isPlaying });
  },
}));
