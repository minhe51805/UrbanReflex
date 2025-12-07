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

