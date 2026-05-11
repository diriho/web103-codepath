import type { Platform } from '../types';

import blueskyLogo from '../assets/bluesky.png';
import instagramLogo from '../assets/instagram.png';
import threadsLogo from '../assets/thread.png';
import xLogo from '../assets/twitter.png';
import youtubeLogo from '../assets/yt.png';

export const PLATFORM_ASSETS: Record<Platform, { src: string; label: string }> =
  {
    YouTube: { src: youtubeLogo, label: 'YouTube' },
    Instagram: { src: instagramLogo, label: 'Instagram' },
    X: { src: xLogo, label: 'X' },
    Threads: { src: threadsLogo, label: 'Threads' },
    Bluesky: { src: blueskyLogo, label: 'Bluesky' },
  };