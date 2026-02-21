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
import { useOfflineStore } from "./offlineStore";
import { getSongDisplayName, getPrimaryArtists } from "../utils/songHelpers";
import {
  saveLastPlayedSong,
  loadLastPlayedSong,
} from "../storage/playerStorage";
import {
  showNowPlaying,
  clearNowPlaying,
} from "../notification/nowPlayingNotification";

/* ---------- Helpers ---------- */

/** Returns a random permutation of indices 0..n-1 (Fisher-Yates). */
function shuffledIndexOrder(n: number): number[] {
  const arr = Array.from({ length: n }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

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
  loadingMore: boolean;
  currentQuery: string;
  currentPage: number;
  totalSongs: number;
  fetchSongs: (query: string, page?: number) => Promise<void>;
  loadMoreSongs: () => Promise<void>;

  /* Player */
  currentSong: Song | null;
  currentIndex: number;
  isPlaying: boolean;
  positionMillis: number;
  durationMillis: number;
  recentlyPlayed: Song[];
  loadingSongId: string | null;
  shuffleEnabled: boolean;
  shuffledIndices: number[];
  setShuffleEnabled: (enabled: boolean) => void;

  /* Queue */
  queue: Song[];
  addToQueue: (song: Song) => void;
  removeFromQueue: (songId: string) => void;
  reorderQueue: (fromIndex: number, toIndex: number) => void;
  clearQueue: () => void;

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
  loadingMore: false,
  currentQuery: "",
  currentPage: 0,
  totalSongs: 0,

  /* ---------- Player ---------- */
  currentSong: null,
  currentIndex: -1,
  isPlaying: false,
  positionMillis: 0,
  durationMillis: 1,
  recentlyPlayed: [],
  loadingSongId: null,
  shuffleEnabled: false,
  shuffledIndices: [],
  setShuffleEnabled: (enabled) => {
    const { songs } = get();
    if (enabled) {
      const order =
        songs.length <= 1
          ? songs.length === 1
            ? [0]
            : []
          : shuffledIndexOrder(songs.length);
      set({ shuffleEnabled: true, shuffledIndices: order });
    } else {
      set({ shuffleEnabled: false, shuffledIndices: [] });
    }
  },

  /* ---------- Queue ---------- */
  queue: [],

  addToQueue: (song) => {
    const { queue } = get();
    set({ queue: [...queue, song] });
    AsyncStorage.setItem("queue", JSON.stringify([...queue, song]));
  },

  removeFromQueue: (songId) => {
    const { queue } = get();
    const updated = queue.filter((s) => s.id !== songId);
    set({ queue: updated });
    AsyncStorage.setItem("queue", JSON.stringify(updated));
  },

  reorderQueue: (fromIndex, toIndex) => {
    const { queue } = get();
    if (fromIndex < 0 || toIndex < 0 || fromIndex >= queue.length || toIndex >= queue.length) return;
    const reordered = [...queue];
    const [item] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, item);
    set({ queue: reordered });
    AsyncStorage.setItem("queue", JSON.stringify(reordered));
  },

  clearQueue: () => {
    set({ queue: [] });
    AsyncStorage.removeItem("queue");
  },

  fetchSongs: async (query, page = 0) => {
    const isFirstPage = page === 0;
    if (isFirstPage) set({ loading: true });
    else set({ loadingMore: true });
    try {
      const { results, total } = await searchSongs(query, page, 20);
      if (isFirstPage) {
        set({
          songs: results,
          currentQuery: query,
          currentPage: 0,
          totalSongs: total,
        });
        if (get().shuffleEnabled) {
          set({
            shuffledIndices:
              results.length <= 1
                ? results.length === 1
                  ? [0]
                  : []
                : shuffledIndexOrder(results.length),
          });
        }
      } else {
        const { songs } = get();
        const existingIds = new Set(songs.map((s) => s.id));
        const newSongs = results.filter((s) => !existingIds.has(s.id));
        const nextSongs = [...songs, ...newSongs];
        set({
          songs: nextSongs,
          currentPage: page,
          totalSongs: total,
        });
        if (get().shuffleEnabled) {
          set({
            shuffledIndices:
              nextSongs.length <= 1
                ? nextSongs.length === 1
                  ? [0]
                  : []
                : shuffledIndexOrder(nextSongs.length),
          });
        }
      }
    } finally {
      set({ loading: false, loadingMore: false });
    }
  },

  loadMoreSongs: async () => {
    const { currentQuery, currentPage, totalSongs, songs, loading, loadingMore } =
      get();
    if (
      !currentQuery ||
      loading ||
      loadingMore ||
      songs.length >= totalSongs
    )
      return;
    await get().fetchSongs(currentQuery, currentPage + 1);
  },

  setCurrentSong: async (song) => {
    set({ loadingSongId: song.id });
    try {
      let { songs } = get();
      let index = songs.findIndex((s) => s.id === song.id);
      // If song isn't in the current list (e.g. from Recently Played, Queue, or another source), add it so playback works
      if (index === -1) {
        songs = [song, ...songs.filter((s) => s.id !== song.id)];
        index = 0;
        set({ songs });
        if (get().shuffleEnabled) {
          set({
            shuffledIndices:
              songs.length <= 1
                ? songs.length === 1
                  ? [0]
                  : []
                : shuffledIndexOrder(songs.length),
          });
        }
      }

      const url =
        useOfflineStore.getState().getLocalUri(song.id) ??
        getBestAudio(song.downloadUrl);
      if (!url) return;

      setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded) return;
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

      showNowPlaying(getSongDisplayName(song), getPrimaryArtists(song));
    } finally {
      set({ loadingSongId: null });
    }
  },

  togglePlay: async () => {
    const { isPlaying, currentSong } = get();

    if (!currentSong) return;

    if (!isPlaying) {
      await get().resumeCurrentSong();
      return;
    }

    await pauseSound();
    set({ isPlaying: false });
    clearNowPlaying();
  },

  playNext: async () => {
    const { songs, currentIndex, queue, shuffleEnabled, shuffledIndices } =
      get();

    // Play from queue first if available
    if (queue.length > 0) {
      const nextSong = queue[0];
      get().removeFromQueue(nextSong.id);
      await get().setCurrentSong(nextSong);
      return;
    }

    if (shuffleEnabled && shuffledIndices.length > 0) {
      const pos = shuffledIndices.indexOf(currentIndex);
      if (pos >= 0 && pos < shuffledIndices.length - 1) {
        const nextIdx = shuffledIndices[pos + 1];
        if (songs[nextIdx]) await get().setCurrentSong(songs[nextIdx]);
      }
      return;
    }

    if (currentIndex + 1 >= songs.length) return;
    await get().setCurrentSong(songs[currentIndex + 1]);
  },

  playPrevious: async () => {
    const { songs, currentIndex, shuffleEnabled, shuffledIndices } = get();

    if (shuffleEnabled && shuffledIndices.length > 0) {
      const pos = shuffledIndices.indexOf(currentIndex);
      if (pos > 0) {
        const prevIdx = shuffledIndices[pos - 1];
        if (songs[prevIdx]) await get().setCurrentSong(songs[prevIdx]);
      }
      return;
    }

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

    const url =
      useOfflineStore.getState().getLocalUri(currentSong.id) ??
      getBestAudio(currentSong.downloadUrl);
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
    showNowPlaying(
      getSongDisplayName(currentSong),
      getPrimaryArtists(currentSong)
    );
  },
}));
