/**
 * Mediverse Client-Side Offline Storage & Spatial Cache Manager
 * 
 * Leverages browser IndexedDB to persist heavy 3D anatomical meshes,
 * offline simulation states, and queued spaced-repetition flashcard reviews.
 */

const DB_NAME = 'MediverseOfflineDB';
const DB_VERSION = 1;
const STORE_3D_ASSETS = 'spatial_assets_3d';
const STORE_REVIEWS_QUEUE = 'offline_reviews_queue';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported in current environment'));
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_3D_ASSETS)) {
        db.createObjectStore(STORE_3D_ASSETS, { keyPath: 'modelId' });
      }
      if (!db.objectStoreNames.contains(STORE_REVIEWS_QUEUE)) {
        db.createObjectStore(STORE_REVIEWS_QUEUE, { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export const offlineCacheManager = {
  /**
   * Cache a 3D GLTF / JSON spatial model payload locally
   */
  async cache3DModel(modelId: string, modelData: any): Promise<void> {
    try {
      const db = await openDatabase();
      const tx = db.transaction(STORE_3D_ASSETS, 'readwrite');
      const store = tx.objectStore(STORE_3D_ASSETS);
      store.put({ modelId, data: modelData, cachedAt: Date.now() });
    } catch (e) {
      console.warn('Failed to cache 3D model offline:', e);
    }
  },

  /**
   * Retrieve cached 3D model if offline
   */
  async get3DModel(modelId: string): Promise<any | null> {
    try {
      const db = await openDatabase();
      const tx = db.transaction(STORE_3D_ASSETS, 'readonly');
      const store = tx.objectStore(STORE_3D_ASSETS);
      return new Promise((resolve) => {
        const request = store.get(modelId);
        request.onsuccess = () => resolve(request.result?.data || null);
        request.onerror = () => resolve(null);
      });
    } catch (e) {
      return null;
    }
  },

  /**
   * Queue a flashcard review when offline to sync later
   */
  async queueOfflineReview(reviewData: { flashcardId: string; quality: number; timestamp: number }): Promise<void> {
    try {
      const db = await openDatabase();
      const tx = db.transaction(STORE_REVIEWS_QUEUE, 'readwrite');
      const store = tx.objectStore(STORE_REVIEWS_QUEUE);
      store.add(reviewData);
    } catch (e) {
      console.warn('Failed to queue offline review:', e);
    }
  },

  /**
   * Flush all queued offline reviews to the backend API when reconnected
   */
  async flushQueuedReviews(): Promise<number> {
    try {
      const db = await openDatabase();
      const tx = db.transaction(STORE_REVIEWS_QUEUE, 'readwrite');
      const store = tx.objectStore(STORE_REVIEWS_QUEUE);
      return new Promise((resolve) => {
        const getAllReq = store.getAll();
        getAllReq.onsuccess = async () => {
          const items = getAllReq.result || [];
          if (items.length === 0) return resolve(0);

          for (const item of items) {
            try {
              await fetch('/api/v1/flashcards/review', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item),
              });
            } catch (err) {
              console.warn('Sync failed for item:', item, err);
            }
          }
          store.clear();
          resolve(items.length);
        };
        getAllReq.onerror = () => resolve(0);
      });
    } catch (e) {
      return 0;
    }
  },
};
