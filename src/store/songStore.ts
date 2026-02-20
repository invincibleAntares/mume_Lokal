import { create } from "zustand";
import { searchSongs } from "../api/saavn";

interface SongImage {
  quality: string;
  url: string;
}

interface Song {
  id: string;
  name: string;
  primaryArtists: string;
  image: SongImage[];
}

interface SongState {
  songs: Song[];
  loading: boolean;
  fetchSongs: (query: string) => Promise<void>;
}

export const useSongStore = create<SongState>((set) => ({
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
}));
