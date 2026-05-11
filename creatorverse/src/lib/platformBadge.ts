import type { Platform } from '../types';

export function platformBadgeClass(platform?: Platform | null): string {
  if (!platform) return 'badge badge-other';
  return `badge badge-${platform.toLowerCase()}`;
}
