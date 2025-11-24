/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 16-11-2025
 * Update at: 16-11-2025
 * Description: Partners page showcasing UrbanReflex collaborators, sponsors, and funders
 */

import { Metadata } from 'next';
import PartnersContent from './PartnersContent';

export const metadata: Metadata = {
  title: 'Partners | UrbanReflex',
  description: 'Meet our partners, sponsors, and funders who make UrbanReflex possible. Together we are building the future of open air quality data.',
};

export default function PartnersPage() {
  return <PartnersContent />;
}
