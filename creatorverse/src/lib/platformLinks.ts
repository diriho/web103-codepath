import type { Platform, PlatformInput, PlatformLink } from '../types';

const PLATFORM_BASES: Record<Platform, string> = {
  YouTube: 'https://www.youtube.com/@',
  Instagram: 'https://www.instagram.com/',
  X: 'https://x.com/',
  Threads: 'https://www.threads.net/@',
  Bluesky: 'https://bsky.app/profile/',
};

export function isValidUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

export function normalizeUsername(value: string): string {
  return value.trim().replace(/^@/, '').replace(/\/+$/, '');
}

export function buildPlatformUrl(platform: Platform, rawUsername: string): string {
  const trimmed = rawUsername.trim();
  if (!trimmed) return '';
  if (isValidUrl(trimmed)) return trimmed;
  const cleaned = normalizeUsername(trimmed);
  return `${PLATFORM_BASES[platform]}${encodeURIComponent(cleaned)}`;
}

export function extractUsernameFromUrl(
  platform: Platform,
  url: string,
): string | null {
  if (!isValidUrl(url)) return null;
  const base = PLATFORM_BASES[platform];
  if (!url.startsWith(base)) return null;
  const remainder = url.slice(base.length);
  return remainder.replace(/^@/, '').replace(/\/+$/, '');
}

export function buildPlatformLinks(inputs: PlatformInput[]): PlatformLink[] {
  return inputs
    .filter((entry) => entry.platform && entry.username.trim())
    .map((entry) => {
      const platform = entry.platform as Platform;
      const raw = entry.username.trim();
      const url = buildPlatformUrl(platform, raw);
      const username = isValidUrl(raw)
        ? extractUsernameFromUrl(platform, raw) ?? raw
        : normalizeUsername(raw);

      return {
        platform,
        username,
        url,
      };
    });
}
