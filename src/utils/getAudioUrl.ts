// API can return either .url (songs by id) or .link (search results)
interface SongAudio {
  quality: string;
  url?: string;
  link?: string;
}

function getAudioUrl(item: SongAudio): string | undefined {
  return item.url ?? item.link;
}

export function getBestAudio(audioUrls: SongAudio[] = []) {
  if (!audioUrls || audioUrls.length === 0) return null;

  const preferredOrder = ["320kbps", "160kbps", "96kbps", "48kbps", "12kbps"];

  for (const quality of preferredOrder) {
    const match = audioUrls.find((a) => a.quality === quality);
    if (match) return getAudioUrl(match) ?? null;
  }

  const first = audioUrls[0];
  return first ? getAudioUrl(first) ?? null : null;
}
