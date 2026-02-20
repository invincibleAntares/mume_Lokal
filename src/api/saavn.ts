const BASE_URL = "https://saavn.sumit.co/api";

export async function searchSongs(query: string) {
  const res = await fetch(
    `${BASE_URL}/search/songs?query=${encodeURIComponent(query)}`
  );

  const json = await res.json();
  return json?.data?.results ?? [];
}

export async function searchArtists(query: string) {
  const res = await fetch(
    `${BASE_URL}/search/artists?query=${encodeURIComponent(query)}`
  );

  const json = await res.json();
  return json?.data?.results ?? [];
}

export async function getSongById(id: string) {
  const res = await fetch(`${BASE_URL}/songs/${id}`);
  const json = await res.json();
  return json?.data?.[0] ?? null;
}

export async function getSongSuggestions(id: string) {
  const res = await fetch(`${BASE_URL}/songs/${id}/suggestions`);
  const json = await res.json();
  return json?.data ?? [];
}

export async function getArtistById(id: string) {
  const res = await fetch(`${BASE_URL}/artists/${id}`);
  const json = await res.json();
  return json?.data ?? null;
}

export async function getArtistSongs(id: string) {
  const res = await fetch(`${BASE_URL}/artists/${id}/songs`);
  const json = await res.json();
  return json?.data?.songs ?? [];
}

export async function getArtistAlbums(id: string) {
  const res = await fetch(`${BASE_URL}/artists/${id}/albums`);
  const json = await res.json();
  return json?.data?.albums ?? [];
}
