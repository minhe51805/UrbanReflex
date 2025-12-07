/**
 * Hashed Image Component
 * 
 * @module components/ui/HashedImage
 * @description Displays images stored as hashes in localStorage/IndexedDB
 */

'use client';

import { useState, useEffect } from 'react';
import { retrieveImageLocally } from '@/lib/utils/imageProcessor';
import Image from 'next/image';

interface HashedImageProps {
  hash: string;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
}

export default function HashedImage({
  hash,
  alt = 'Image',
  className = '',
  width,
  height
}: HashedImageProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadImage() {
      try {
        setLoading(true);
        setError(false);

        const dataUrl = await retrieveImageLocally(hash);

        if (!mounted) return;

        if (dataUrl) {
          setImageSrc(dataUrl);
        } else {
          console.warn(`Image not found for hash: ${hash}`);
          setError(true);
        }
      } catch (err) {
        console.error(`Failed to load image ${hash}:`, err);
        if (mounted) setError(true);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadImage();

    return () => {
      mounted = false;
    };
  }, [hash]);

  if (loading) {
    return (
      <div className={`bg-gray-200 animate-pulse ${className}`} style={{ width, height }}>
        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
          Loading...
        </div>
      </div>
    );
  }

  if (error || !imageSrc) {
    return (
      <div className={`bg-gray-100 ${className}`} style={{ width, height }}>
        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
          <span>❌ Image unavailable</span>
        </div>
      </div>
    );
  }

  if (width && height) {
    return (
      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
      />
    );
  }

  // For dynamic sizes without width/height, use Image with fill
  return (
    <div className={`relative ${className}`}>
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className="object-cover"
      />
    </div>
  );
}
