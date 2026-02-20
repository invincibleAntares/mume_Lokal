export function getBestImage(images: { quality: string; url: string }[] = []) {
  const preferred = images.find((img) => img.quality === "150x150");

  return preferred?.url || images[0]?.url || undefined;
}
