/**
 * IndexedDB storage adapter for caching curriculum taxonomy trees,
 * flashcards, and lesson content for offline PWA learning.
 */

const DB_NAME = 'mediverse_offline_cache';
const DB_VERSION = 1;

export interface CachedSubjectTree {
  subjectId: string;
  code: string;
  title: string;
  domain: string;
  treeData: any;
  cachedAt: number;
}

export interface CachedLesson {
  lessonId: string;
  title: string;
  blocks: any[];
  cachedAt: number;
}

export function openOfflineDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains('subjects')) {
        db.createObjectStore('subjects', { keyPath: 'code' });
      }

      if (!db.objectStoreNames.contains('lessons')) {
        db.createObjectStore('lessons', { keyPath: 'lessonId' });
      }

      if (!db.objectStoreNames.contains('flashcards')) {
        db.createObjectStore('flashcards', { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveSubjectToOffline(subject: CachedSubjectTree): Promise<void> {
  try {
    const db = await openOfflineDb();
    const tx = db.transaction('subjects', 'readwrite');
    tx.objectStore('subjects').put({ ...subject, cachedAt: Date.now() });
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (e) {
    console.warn('Failed to cache subject offline', e);
  }
}

export async function getOfflineSubject(code: string): Promise<CachedSubjectTree | null> {
  try {
    const db = await openOfflineDb();
    const tx = db.transaction('subjects', 'readonly');
    const request = tx.objectStore('subjects').get(code);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.warn('Failed to read offline subject', e);
    return null;
  }
}

export async function saveLessonToOffline(lesson: CachedLesson): Promise<void> {
  try {
    const db = await openOfflineDb();
    const tx = db.transaction('lessons', 'readwrite');
    tx.objectStore('lessons').put({ ...lesson, cachedAt: Date.now() });
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (e) {
    console.warn('Failed to cache lesson offline', e);
  }
}

export async function getOfflineLesson(lessonId: string): Promise<CachedLesson | null> {
  try {
    const db = await openOfflineDb();
    const tx = db.transaction('lessons', 'readonly');
    const request = tx.objectStore('lessons').get(lessonId);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.warn('Failed to read offline lesson', e);
    return null;
  }
}
