const BASE_URL = "https://saavn.sumit.co/api";

const DEFAULT_PAGE_SIZE = 20;

export interface SearchSongsResponse {
  results: any[];
  total: number;
}

export async function searchSongs(
  query: string,
  page: number = 0,
  limit: number = DEFAULT_PAGE_SIZE
): Promise<SearchSongsResponse> {
  const res = await fetch(
    `${BASE_URL}/search/songs?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
  );

  const json = await res.json();
  const results = json?.data?.results ?? [];
  const total = typeof json?.data?.total === "number" ? json.data.total : results.length;
  return { results, total };
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
