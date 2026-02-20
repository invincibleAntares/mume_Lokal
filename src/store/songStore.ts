import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { searchSongs } from "../api/saavn";
import {
  playSound,
  pauseSound,
  resumeSound,
  seekTo,
  setOnPlaybackStatusUpdate,
} from "../audio/audioService";
import { getBestAudio } from "../utils/getAudioUrl";
import {
  saveLastPlayedSong,
  loadLastPlayedSong,
} from "../storage/playerStorage";

/* ---------- Types ---------- */

export interface SongImage {
  quality: string;
  url: string;
}

export interface SongAudio {
  quality: string;
  url: string;
}

export interface Artist {
  id: string;
  name: string;
  image?: SongImage[];
}

export interface Album {
  id: string;
  name: string;
  url?: string;
}

export interface Song {
  id: string;
  name: string;
  duration?: number;
  language?: string;
  album?: Album;
  artists?: {
    primary: Artist[];
    featured?: Artist[];
    all?: Artist[];
  };
  primaryArtists?: string; // Legacy support for old format
  image?: SongImage[];
  downloadUrl: SongAudio[];
}

interface SongState {
  /* Song list */
  songs: Song[];
  loading: boolean;
  fetchSongs: (query: string) => Promise<void>;

  /* Player */
  currentSong: Song | null;
  currentIndex: number;
  isPlaying: boolean;
  positionMillis: number;
  durationMillis: number;
  recentlyPlayed: Song[];

  /* Queue */
  queue: Song[];
  addToQueue: (song: Song) => void;
  removeFromQueue: (songId: string) => void;
  reorderQueue: (fromIndex: number, toIndex: number) => void;
  clearQueue: () => void;
  playFromQueue: (index: number) => Promise<void>;

  setCurrentSong: (song: Song) => Promise<void>;
  togglePlay: () => Promise<void>;
  playNext: () => Promise<void>;
  playPrevious: () => Promise<void>;
  seek: (ratio: number) => Promise<void>;

  hydratePlayer: () => Promise<void>;
  hydrateRecentlyPlayed: () => Promise<void>;
  hydrateQueue: () => Promise<void>;
  resumeCurrentSong: () => Promise<void>;
}

/* ---------- Store ---------- */

export const useSongStore = create<SongState>((set, get) => ({
  /* ---------- List ---------- */
  songs: [],
  loading: false,

  /* ---------- Player ---------- */
  currentSong: null,
  currentIndex: -1,
  isPlaying: false,
  positionMillis: 0,
  durationMillis: 1,
  recentlyPlayed: [],

  /* ---------- Queue ---------- */
  queue: [],

  addToQueue: (song) => {
    const { queue } = get();
    const updatedQueue = [...queue, song];
    set({ queue: updatedQueue });
    AsyncStorage.setItem("queue", JSON.stringify(updatedQueue));
  },

  removeFromQueue: (songId) => {
    const { queue } = get();
    const updatedQueue = queue.filter((s) => s.id !== songId);
    set({ queue: updatedQueue });
    AsyncStorage.setItem("queue", JSON.stringify(updatedQueue));
  },

  reorderQueue: (fromIndex, toIndex) => {
    const { queue } = get();
    const updatedQueue = [...queue];
    const [removed] = updatedQueue.splice(fromIndex, 1);
    updatedQueue.splice(toIndex, 0, removed);
    set({ queue: updatedQueue });
    AsyncStorage.setItem("queue", JSON.stringify(updatedQueue));
  },

  clearQueue: () => {
    set({ queue: [] });
    AsyncStorage.removeItem("queue");
  },

  playFromQueue: async (index) => {
    const { queue } = get();
    if (index < 0 || index >= queue.length) return;

    const song = queue[index];
    // Remove from queue after playing
    const updatedQueue = queue.filter((_, i) => i !== index);
    set({ queue: updatedQueue });
    AsyncStorage.setItem("queue", JSON.stringify(updatedQueue));

    // Play the song
    await get().setCurrentSong(song);
  },

  fetchSongs: async (query) => {
    set({ loading: true });
    try {
      const results = await searchSongs(query);
      set({ songs: results });
    } finally {
      set({ loading: false });
    }
  },

  setCurrentSong: async (song) => {
    const { songs } = get();
    const index = songs.findIndex((s) => s.id === song.id);
    if (index === -1) return;

    const url = getBestAudio(song.downloadUrl);
    if (!url) return;

    // Attach playback listener ONCE per song
    setOnPlaybackStatusUpdate((status) => {
      if (!status.isLoaded) return;

      // ⏭️ Auto-play next when song finishes
      if (status.didJustFinish) {
        get().playNext();
        return;
      }

      set({
        positionMillis: status.positionMillis ?? 0,
        durationMillis: status.durationMillis ?? 1,
      });
    });

    await playSound(url);
    await saveLastPlayedSong(song, index);

    const { recentlyPlayed } = get();
    const updatedRecent = [
      song,
      ...recentlyPlayed.filter((s: Song) => s.id !== song.id),
    ].slice(0, 10);

    set({
      currentSong: song,
      currentIndex: index,
      isPlaying: true,
      positionMillis: 0,
      durationMillis: 1,
      recentlyPlayed: updatedRecent,
    });
    AsyncStorage.setItem("recentlyPlayed", JSON.stringify(updatedRecent));
  },

  togglePlay: async () => {
    const { isPlaying, currentSong } = get();

    if (!currentSong) return;

    if (!isPlaying) {
      // If audio was never loaded (app restart)
      await get().resumeCurrentSong();
      return;
    }

    await pauseSound();
    set({ isPlaying: !isPlaying });
  },

  playNext: async () => {
    const { songs, currentIndex, queue } = get();
    
    // If there's a queue, play from queue first
    if (queue.length > 0) {
      await get().playFromQueue(0);
      return;
    }

    // Otherwise play next from songs list
    if (currentIndex + 1 >= songs.length) return;
    await get().setCurrentSong(songs[currentIndex + 1]);
  },

  playPrevious: async () => {
    const { songs, currentIndex } = get();
    if (currentIndex - 1 < 0) return;

    await get().setCurrentSong(songs[currentIndex - 1]);
  },

  hydratePlayer: async () => {
    const { song, index } = await loadLastPlayedSong();
    if (!song || index === -1) return;

    set({
      currentSong: song,
      currentIndex: index,
      isPlaying: false, // ❌ don’t auto play
      positionMillis: 0,
      durationMillis: 1,
    });

    if (get().songs.length === 0) {
      // Support both old and new API format
      const artistName =
        song.artists?.primary?.[0]?.name ||
        song.primaryArtists?.split(",")[0] ||
        "arijit";
      await get().fetchSongs(artistName);
    }
  },
  hydrateRecentlyPlayed: async () => {
    const raw = await AsyncStorage.getItem("recentlyPlayed");
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      set({ recentlyPlayed: parsed });
    } catch {}
  },

  hydrateQueue: async () => {
    const raw = await AsyncStorage.getItem("queue");
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      set({ queue: parsed });
    } catch {}
  },

  seek: async (ratio: number) => {
    const { durationMillis } = get();
    if (!durationMillis) return;

    const position = durationMillis * ratio;
    await seekTo(position);

    set({ positionMillis: position });
  },

  resumeCurrentSong: async () => {
    const { currentSong, isPlaying } = get();
    if (!currentSong || isPlaying) return;

    const url = getBestAudio(currentSong.downloadUrl);
    if (!url) return;

    setOnPlaybackStatusUpdate((status) => {
      if (!status.isLoaded) return;

      set({
        positionMillis: status.positionMillis ?? 0,
        durationMillis: status.durationMillis ?? 1,
      });
    });

    await playSound(url);

    set({ isPlaying: true });
  },
}));
