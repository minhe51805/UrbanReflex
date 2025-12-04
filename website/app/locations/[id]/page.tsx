/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 13-11-2025
 * Update at: 01-12-2025
 * Description: Dynamic location detail page component displaying air quality measurements and charts for specific locations
 */

import { notFound } from 'next/navigation';
import LocationDetailClient from '@/components/locations/LocationDetailClient';
import { orionClient } from '@/lib/api/orion-client';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function LocationDetailPage({ params }: PageProps) {
  const { id } = await params;
  const locationId = parseInt(id);

  if (isNaN(locationId)) {
    notFound();
  }

  try {
    // Use Orion client to fetch from NGSI-LD
    const location = await orionClient.getLocation(locationId);

    if (!location) {
      notFound();
    }

    return <LocationDetailClient location={location} useOrion={true} />;
  } catch (error) {
    console.error('Error loading location:', error);
    notFound();
  }
}

