import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";
import { create } from "zustand";
import type { Song } from "./songStore";
import { getBestAudio } from "../utils/getAudioUrl";

const OFFLINE_KEY = "offlineDownloads";

function getDownloadsDir(): string | null {
  const dir = FileSystem.documentDirectory;
  return dir ? `${dir}downloads/` : null;
}

function getLocalPath(songId: string): string {
  const dir = getDownloadsDir();
  return dir ? `${dir}${songId}.mp3` : "";
}

export interface OfflineEntry {
  song: Song;
  localUri: string;
}

interface OfflineState {
  downloads: OfflineEntry[];
  downloadingIds: string[];
  errorById: Record<string, string>;
  downloadSong: (song: Song) => Promise<void>;
  removeDownload: (songId: string) => Promise<void>;
  isDownloaded: (songId: string) => boolean;
  getLocalUri: (songId: string) => string | null;
  hydrateOffline: () => Promise<void>;
  clearError: (songId: string) => void;
}

export const useOfflineStore = create<OfflineState>((set, get) => ({
  downloads: [],
  downloadingIds: [],
  errorById: {},

  getLocalUri: (songId: string) => {
    const entry = get().downloads.find((d) => d.song.id === songId);
    return entry ? entry.localUri : null;
  },

  isDownloaded: (songId: string) => {
    return get().downloads.some((d) => d.song.id === songId);
  },

  downloadSong: async (song: Song) => {
    const { isDownloaded, downloads } = get();
    if (isDownloaded(song.id)) return;

    set((s) => ({
      downloadingIds: [...s.downloadingIds, song.id],
      errorById: { ...s.errorById, [song.id]: "" },
    }));

    const url = getBestAudio(song.downloadUrl);
    if (!url) {
      set((s) => ({
        downloadingIds: s.downloadingIds.filter((id) => id !== song.id),
        errorById: { ...s.errorById, [song.id]: "No audio URL" },
      }));
      return;
    }

    try {
      const downloadsDir = getDownloadsDir();
      if (!downloadsDir) {
        set((s) => ({
          downloadingIds: s.downloadingIds.filter((id) => id !== song.id),
          errorById: { ...s.errorById, [song.id]: "Storage unavailable" },
        }));
        return;
      }
      const dirInfo = await FileSystem.getInfoAsync(downloadsDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(downloadsDir, {
          intermediates: true,
        });
      }

      const localUri = getLocalPath(song.id);
      await FileSystem.downloadAsync(url, localUri);

      const entry: OfflineEntry = { song, localUri };
      const nextDownloads = [...downloads.filter((d) => d.song.id !== song.id), entry];

      set({
        downloads: nextDownloads,
        downloadingIds: get().downloadingIds.filter((id) => id !== song.id),
        errorById: { ...get().errorById, [song.id]: "" },
      });
      await AsyncStorage.setItem(OFFLINE_KEY, JSON.stringify(nextDownloads));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Download failed";
      set((s) => ({
        downloadingIds: s.downloadingIds.filter((id) => id !== song.id),
        errorById: { ...s.errorById, [song.id]: message },
      }));
    }
  },

  removeDownload: async (songId: string) => {
    const { downloads } = get();
    const entry = downloads.find((d) => d.song.id === songId);
    if (!entry) return;

    try {
      const info = await FileSystem.getInfoAsync(entry.localUri);
      if (info.exists) await FileSystem.deleteAsync(entry.localUri);
    } catch {}

    const nextDownloads = downloads.filter((d) => d.song.id !== songId);
    set({
      downloads: nextDownloads,
      errorById: { ...get().errorById, [songId]: "" },
    });
    await AsyncStorage.setItem(OFFLINE_KEY, JSON.stringify(nextDownloads));
  },

  clearError: (songId: string) => {
    set((s) => {
      const next = { ...s.errorById };
      delete next[songId];
      return { errorById: next };
    });
  },

  hydrateOffline: async () => {
    try {
      const raw = await AsyncStorage.getItem(OFFLINE_KEY);
      if (!raw) return;

      const parsed: OfflineEntry[] = JSON.parse(raw);
      const valid: OfflineEntry[] = [];

      for (const entry of parsed) {
        try {
          const info = await FileSystem.getInfoAsync(entry.localUri);
          if (info.exists) valid.push(entry);
        } catch {
          // skip missing file
        }
      }

      set({ downloads: valid });
      if (valid.length !== parsed.length) {
        await AsyncStorage.setItem(OFFLINE_KEY, JSON.stringify(valid));
      }
    } catch {}
  },
}));
