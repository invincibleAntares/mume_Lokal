// API can return either .url (songs by id) or .link (search results)
type ImageItem = { quality: string; url?: string; link?: string };

function getImageUrl(img: ImageItem): string | undefined {
  return img?.url ?? img?.link;
}

export function getBestImage(images: ImageItem[] = []) {
  const preferred = images.find((img) => img.quality === "150x150");
  if (preferred) return getImageUrl(preferred);
  return images[0] ? getImageUrl(images[0]) : undefined;
}
