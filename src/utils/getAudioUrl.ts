interface SongAudio {
  quality: string;
  url: string;
}

export function getBestAudio(audioUrls: SongAudio[] = []) {
  if (!audioUrls || audioUrls.length === 0) return null;

  // Prefer higher quality first
  const preferredOrder = ["320kbps", "160kbps", "96kbps", "48kbps", "12kbps"];

  for (const quality of preferredOrder) {
    const match = audioUrls.find((a) => a.quality === quality);
    if (match) return match.url;
  }

  // fallback
  return audioUrls[0].url;
}
