export function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('IndexedDB is only available in the browser'));
      return;
    }

    const request = indexedDB.open('orbit_video_db', 1);

    request.onupgradeneeded = (event) => {
      const db = request.result;
      if (!db.objectStoreNames.contains('videos')) {
        db.createObjectStore('videos');
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function saveVideo(id: string, file: File | Blob): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('videos', 'readwrite');
    const store = transaction.objectStore('videos');
    const request = store.put(file, id);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function getVideo(id: string): Promise<Blob | null> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('videos', 'readonly');
    const store = transaction.objectStore('videos');
    const request = store.get(id);

    request.onsuccess = () => {
      resolve(request.result || null);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function deleteVideo(id: string): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('videos', 'readwrite');
    const store = transaction.objectStore('videos');
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export function captureVideoThumbnail(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Canvas capture is only available in the browser'));
      return;
    }

    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    // Set crossOrigin in case it is loaded from an external domain
    video.crossOrigin = 'anonymous';

    const objectUrl = URL.createObjectURL(file);
    video.src = objectUrl;

    const timeoutId = setTimeout(() => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Video thumbnail capture timed out'));
    }, 10000);

    video.onloadedmetadata = () => {
      // Seek to 1 second or 10% of video duration to avoid a black start screen
      const seekTime = Math.min(1.0, video.duration / 10 || 1.0);
      video.currentTime = seekTime;
    };

    video.onseeked = () => {
      try {
        const canvas = document.createElement('canvas');
        const maxWidth = 640;
        const videoWidth = video.videoWidth || maxWidth;
        const videoHeight = video.videoHeight || 360;
        
        const width = Math.min(maxWidth, videoWidth);
        const height = (videoHeight / videoWidth) * width;

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          clearTimeout(timeoutId);
          URL.revokeObjectURL(objectUrl);
          resolve(dataUrl);
        } else {
          throw new Error('Could not get 2D canvas context');
        }
      } catch (err) {
        clearTimeout(timeoutId);
        URL.revokeObjectURL(objectUrl);
        reject(err);
      }
    };

    video.onerror = () => {
      clearTimeout(timeoutId);
      URL.revokeObjectURL(objectUrl);
      reject(video.error || new Error('Video loading error'));
    };
  });
}

