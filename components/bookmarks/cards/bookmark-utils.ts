import { Bookmark } from '@/types/bookmark';

export function getFavicon(url: string): string {
  try {
    return `https://www.google.com/s2/favicons?sz=32&domain=${new URL(url).hostname}`;
  } catch {
    return '';
  }
}

export function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url;
  }
}

export function getTitle(b: Bookmark): string {
  return b.ogTitle ?? b.title;
}
