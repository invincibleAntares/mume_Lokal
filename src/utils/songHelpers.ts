import { Song } from "../store/songStore";
import { decodeHtmlEntities } from "./decodeHtmlEntities";

/** Strip "(From Movie Name)" or "(From \"Movie Name\")" suffix from song name */
function stripFromMovieSuffix(name: string): string {
  return name
    .replace(/\s*\(From\s+[^)]*\)\s*$/i, "")
    .trim();
}

/**
 * Get song display name: decoded, and without "(From movie name)" suffix.
 */
export function getSongDisplayName(song: Song): string {
  const decoded = decodeHtmlEntities(song.name);
  return stripFromMovieSuffix(decoded);
}

/**
 * Get primary artists as a comma-separated string (decoded).
 * Supports both old and new API formats
 */
export function getPrimaryArtists(song: Song): string {
  // New format
  if (song.artists?.primary) {
    return song.artists.primary
      .map((a) => decodeHtmlEntities(a.name))
      .join(", ");
  }

  // Legacy format
  return decodeHtmlEntities(song.primaryArtists) || "Unknown Artist";
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
 * Get album name from song (decoded)
 */
export function getAlbumName(song: Song): string {
  return decodeHtmlEntities(song.album?.name) || "Unknown Album";
}
