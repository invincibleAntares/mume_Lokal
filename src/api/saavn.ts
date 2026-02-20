const BASE_URL = "https://saavn.sumit.co/api";

export async function searchSongs(query: string) {
  const res = await fetch(
    `${BASE_URL}/search/songs?query=${encodeURIComponent(query)}`
  );

  const json = await res.json();
  return json?.data?.results ?? [];
}
