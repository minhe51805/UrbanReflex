/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 13-11-2025
 * Update at: 01-12-2025
 * Description: Roadmap page component displaying the 2025 technology development roadmap and project milestones
 */

import { Metadata } from 'next';
import RoadmapContent from '@/components/roadmap/RoadmapContent';

export const metadata: Metadata = {
  title: '2025 Tech Roadmap | UrbanReflex',
  description: 'UrbanReflex 2025 technical roadmap - our plans for tools, data coverage, and outreach.',
};

export default function RoadmapPage() {
  return <RoadmapContent />;
}

