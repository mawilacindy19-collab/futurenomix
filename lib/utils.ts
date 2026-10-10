import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function safeJsonParse<T = any>(str: string | null | undefined, fallback: T): T {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch (e) {
    return fallback;
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCurrentUserFirstName(): string {
  if (typeof window === 'undefined') return 'User';
  const profileStr = localStorage.getItem('orbit_user_profile');
  if (!profileStr) return 'User';
  try {
    const profile = JSON.parse(profileStr);
    return profile.name ? profile.name.split(' ')[0] : 'User';
  } catch (e) {
    return 'User';
  }
}

export function getCurrentUserFullName(): string {
  if (typeof window === 'undefined') return 'User';
  const profileStr = localStorage.getItem('orbit_user_profile');
  if (!profileStr) return 'User';
  try {
    const profile = JSON.parse(profileStr);
    return profile.name || 'User';
  } catch (e) {
    return 'User';
  }
}

export function compressImage(dataUrl: string, maxWidth: number, maxHeight: number, quality: number = 0.7): Promise<string> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(dataUrl);
      return;
    }
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        try {
          resolve(canvas.toDataURL('image/jpeg', quality));
        } catch (e) {
          resolve(dataUrl);
        }
      } else {
        resolve(dataUrl);
      }
    };
    img.onerror = () => {
      resolve(dataUrl);
    };
    img.src = dataUrl;
  });
}
