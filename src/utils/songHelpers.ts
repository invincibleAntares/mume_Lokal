import { Song } from "../store/songStore";

/**
 * Get primary artists as a comma-separated string
 * Supports both old and new API formats
 */
export function getPrimaryArtists(song: Song): string {
  // New format
  if (song.artists?.primary) {
    return song.artists.primary.map((a) => a.name).join(", ");
  }

  // Legacy format
  return song.primaryArtists || "Unknown Artist";
}

/**
 * Get artist IDs from a song
 */
export function getArtistIds(song: Song): string[] {
  if (song.artists?.primary) {
    return song.artists.primary.map((a) => a.id);
  }
  return [];
}

/**
 * Get album name from song
 */
export function getAlbumName(song: Song): string {
  return song.album?.name || "Unknown Album";
}
