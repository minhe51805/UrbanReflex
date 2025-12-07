/**
 * ============================================================================
 * UrbanReflex — Smart City Intelligence Platform
 * Copyright (C) 2025  WAG
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * For more information, visit: https://github.com/minhe51805/UrbanReflex
 * ============================================================================
 */


/**
 * Image Processing Utilities
 * 
 * @module lib/utils/imageProcessor
 * @description Compress, hash, and upload images to server
 * @updated 2025-12-07 - Added server upload functionality
 */

/**
 * Compress image to target max size
 * 
 * @param file - Original image file
 * @param maxSizeKB - Maximum size in KB (default: 500KB)
 * @param maxWidth - Maximum width in pixels (default: 1920)
 * @param maxHeight - Maximum height in pixels (default: 1080)
 * @returns Compressed image as data URL
 */
export async function compressImage(
  file: File,
  maxSizeKB: number = 500,
  maxWidth: number = 1920,
  maxHeight: number = 1080
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('Failed to read file'));

    reader.onload = (e) => {
      const img = new Image();

      img.onerror = () => reject(new Error('Failed to load image'));

      img.onload = () => {
        // Calculate new dimensions maintaining aspect ratio
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.floor(width * ratio);
          height = Math.floor(height * ratio);
        }

        // Create canvas and draw resized image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Try different quality levels until size is acceptable
        let quality = 0.9;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);

        // Reduce quality until under max size
        while (dataUrl.length > maxSizeKB * 1024 * 1.37 && quality > 0.1) {
          quality -= 0.1;
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        console.log(`📸 Image compressed: ${Math.round(dataUrl.length / 1024)}KB (quality: ${Math.round(quality * 100)}%)`);
        resolve(dataUrl);
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Generate hash from image data URL
 * 
 * @param dataUrl - Image data URL
 * @returns SHA-256 hash as hex string
 */
export async function hashImage(dataUrl: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(dataUrl);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Convert data URL to Blob
 * 
 * @param dataUrl - Image data URL
 * @returns Blob object
 */
function dataURLToBlob(dataUrl: string): Blob {
  const arr = dataUrl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * Upload image to server
 * 
 * @param dataUrl - Compressed image data URL
 * @param filename - Original filename
 * @returns SHA-256 hash from server
 */
async function uploadToServer(dataUrl: string, filename: string): Promise<string> {
  try {
    // Convert data URL to Blob
    const blob = dataURLToBlob(dataUrl);

    // Create FormData
    const formData = new FormData();
    formData.append('file', blob, filename || 'image.jpg');

    console.log(`📤 Uploading image to server: ${filename} (${Math.round(blob.size / 1024)}KB)`);

    // Upload to API
    const response = await fetch('/api/images', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Upload failed:', response.status, errorData);
      throw new Error(errorData.error || `Upload failed: ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ Image uploaded successfully: ${data.hash}`);
    return data.hash;

  } catch (error) {
    console.error('❌ Failed to upload image:', error);
    throw error;
  }
}

/**
 * Store image in browser storage with hash as key (for caching)
 * 
 * @param dataUrl - Image data URL
 * @param hash - Hash to use as key (optional, will generate if not provided)
 * @returns Hash key for retrieval
 */
export async function storeImageLocally(dataUrl: string, hash?: string): Promise<string> {
  const imageHash = hash || await hashImage(dataUrl);

  try {
    // Try localStorage first (up to 5-10MB)
    localStorage.setItem(`img_${imageHash}`, dataUrl);
    console.log(`💾 Image cached in localStorage: ${imageHash}`);
    return imageHash;
  } catch {
    // If quota exceeded, use IndexedDB
    console.warn('⚠️ localStorage full, using IndexedDB');
    await storeInIndexedDB(imageHash, dataUrl);
    return imageHash;
  }
}

/**
 * Retrieve image from browser storage by hash
 * 
 * @param hash - Image hash key
 * @returns Image data URL or null
 */
export async function retrieveImageLocally(hash: string): Promise<string | null> {
  // Try localStorage first
  const stored = localStorage.getItem(`img_${hash}`);
  if (stored) {
    return stored;
  }

  // Fallback to IndexedDB
  return await retrieveFromIndexedDB(hash);
}

/**
 * Store image in IndexedDB
 */
async function storeInIndexedDB(hash: string, dataUrl: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('UrbanReflexImages', 1);

    request.onerror = () => reject(new Error('Failed to open IndexedDB'));

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('images')) {
        db.createObjectStore('images', { keyPath: 'hash' });
      }
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction(['images'], 'readwrite');
      const store = transaction.objectStore('images');

      store.put({ hash, dataUrl, timestamp: Date.now() });

      transaction.oncomplete = () => {
        console.log(`💾 Image cached in IndexedDB: ${hash}`);
        resolve();
      };

      transaction.onerror = () => reject(new Error('Failed to store in IndexedDB'));
    };
  });
}

/**
 * Retrieve image from IndexedDB
 */
async function retrieveFromIndexedDB(hash: string): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('UrbanReflexImages', 1);

    request.onerror = () => reject(new Error('Failed to open IndexedDB'));

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains('images')) {
        resolve(null);
        return;
      }

      const transaction = db.transaction(['images'], 'readonly');
      const store = transaction.objectStore('images');
      const getRequest = store.get(hash);

      getRequest.onsuccess = () => {
        const result = getRequest.result;
        resolve(result ? result.dataUrl : null);
      };

      getRequest.onerror = () => resolve(null);
    };
  });
}

/**
 * Process multiple images: compress, upload to server, and cache locally
 * 
 * @param files - Array of image files
 * @returns Array of image hashes from server
 */
export async function processImages(files: File[]): Promise<string[]> {
  const hashes: string[] = [];

  for (const file of files) {
    try {
      // Step 1: Compress image
      console.log(`📸 Processing image: ${file.name}`);
      const compressed = await compressImage(file);

      // Step 2: Upload to server and get hash
      const hash = await uploadToServer(compressed, file.name);

      // Step 3: Cache locally for faster retrieval
      try {
        await storeImageLocally(compressed, hash);
      } catch (cacheError) {
        // Caching failure is not critical, just log warning
        console.warn('⚠️ Failed to cache image locally:', cacheError);
      }

      hashes.push(hash);

    } catch (error) {
      console.error('❌ Failed to process image:', error);
      throw error;
    }
  }

  console.log(`✅ Processed ${hashes.length} images: ${hashes.join(', ')}`);
  return hashes;
}

/**
 * Convert Blob to data URL
 */
function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Retrieve multiple images by hashes
 * First tries local cache, then falls back to server API
 * 
 * @param hashes - Array of image hashes
 * @returns Array of data URLs (null for missing images)
 */
export async function retrieveImages(hashes: string[]): Promise<(string | null)[]> {
  const images: (string | null)[] = [];

  for (const hash of hashes) {
    try {
      // Try local cache first
      let dataUrl = await retrieveImageLocally(hash);

      if (dataUrl) {
        console.log(`✅ Image from cache: ${hash}`);
        images.push(dataUrl);
        continue;
      }

      // Fallback to server API
      console.log(`📡 Fetching image from server: ${hash}`);
      const response = await fetch(`/api/images/${hash}`);

      if (response.ok) {
        const blob = await response.blob();
        dataUrl = await blobToDataURL(blob);

        // Cache for future use
        try {
          await storeImageLocally(dataUrl, hash);
        } catch {
          // Ignore caching errors
        }

        images.push(dataUrl);
      } else {
        console.warn(`⚠️ Image not found: ${hash}`);
        images.push(null);
      }

    } catch (error) {
      console.error(`❌ Failed to retrieve image ${hash}:`, error);
      images.push(null);
    }
  }

  return images;
}
