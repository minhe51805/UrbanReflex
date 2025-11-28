/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 16-11-2025
 * Update at: 25-11-2025
 * Description: Documentation page with professional layout
 */

import { Metadata } from 'next';
import DocsContent from './DocsContent';

export const metadata: Metadata = {
  title: 'Documentation | UrbanReflex',
  description: 'Complete documentation for UrbanReflex platform - API reference, guides, and tutorials.',
};

export default function DocsPage() {
  return <DocsContent />;
}
