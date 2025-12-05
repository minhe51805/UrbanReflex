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


import { Metadata } from 'next';
import WhyOpenDataContent from './WhyOpenDataContent';

export const metadata: Metadata = {
  title: 'Why Open Data | UrbanReflex',
  description: 'UrbanReflex was founded on the principle that people have a right to know what they are breathing. Learn about the benefits of open air quality data and how it drives innovation, equity, and transparency.',
};

export default function WhyOpenDataPage() {
  return <WhyOpenDataContent />;
}
