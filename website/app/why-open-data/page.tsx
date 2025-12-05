/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 16-11-2025
 * Update at: 01-12-2025
 * Description: Why Open Data page explaining the importance of open data and its benefits for air quality monitoring
 */

import { Metadata } from 'next';
import WhyOpenDataContent from './WhyOpenDataContent';

export const metadata: Metadata = {
  title: 'Why Open Data | UrbanReflex',
  description: 'UrbanReflex was founded on the principle that people have a right to know what they are breathing. Learn about the benefits of open air quality data and how it drives innovation, equity, and transparency.',
};

export default function WhyOpenDataPage() {
  return <WhyOpenDataContent />;
}
