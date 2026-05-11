export type Platform =
  | 'YouTube'
  | 'Instagram'
  | 'X'
  | 'Threads'
  | 'Bluesky';

export const PLATFORMS: readonly Platform[] = [
  'YouTube',
  'Instagram',
  'X',
  'Threads',
  'Bluesky',
] as const;

export interface PlatformLink {
  platform: Platform;
  username: string;
  url: string;
}

export interface PlatformInput {
  platform: Platform | '';
  username: string;
}

export interface Creator {
  id: number;
  user_id: string;
  name: string;
  url?: string | null;
  description: string;
  image_url?: string | null;
  platform?: Platform | null;
  platforms?: PlatformLink[] | null;
  created_at: string;
}

export interface CreatorFormData {
  name: string;
  description: string;
  image_url?: string;
  platforms: PlatformInput[];
}
