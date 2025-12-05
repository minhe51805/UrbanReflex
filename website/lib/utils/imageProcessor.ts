/**
 * Image Processing Utilities
 * 
 * @module lib/utils/imageProcessor
 * @description Compress and hash images to reduce payload size
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
 * Store image in browser storage with hash as key
 * 
 * @param dataUrl - Image data URL
 * @returns Hash key for retrieval
 */
export async function storeImageLocally(dataUrl: string): Promise<string> {
  const hash = await hashImage(dataUrl);
  
  try {
    // Try localStorage first (up to 5-10MB)
    localStorage.setItem(`img_${hash}`, dataUrl);
    console.log(`💾 Image stored in localStorage: ${hash}`);
    return hash;
  } catch {
    // If quota exceeded, use IndexedDB
    console.warn('⚠️ localStorage full, using IndexedDB');
    await storeInIndexedDB(hash, dataUrl);
    return hash;
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
        console.log(`💾 Image stored in IndexedDB: ${hash}`);
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
 * Process multiple images: compress and store locally
 * 
 * @param files - Array of image files
 * @returns Array of image hashes
 */
export async function processImages(files: File[]): Promise<string[]> {
  const hashes: string[] = [];
  
  for (const file of files) {
    try {
      // Compress image
      const compressed = await compressImage(file);
      
      // Store locally and get hash
      const hash = await storeImageLocally(compressed);
      hashes.push(hash);
      
    } catch (error) {
      console.error('Failed to process image:', error);
      throw error;
    }
  }
  
  return hashes;
}

/**
 * Retrieve multiple images by hashes
 * 
 * @param hashes - Array of image hashes
 * @returns Array of data URLs (null for missing images)
 */
export async function retrieveImages(hashes: string[]): Promise<(string | null)[]> {
  const images: (string | null)[] = [];
  
  for (const hash of hashes) {
    try {
      const dataUrl = await retrieveImageLocally(hash);
      images.push(dataUrl);
    } catch (error) {
      console.error(`Failed to retrieve image ${hash}:`, error);
      images.push(null);
    }
  }
  
  return images;
}
