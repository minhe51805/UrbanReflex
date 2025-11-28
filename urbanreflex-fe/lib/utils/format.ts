/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 13-11-2025
 * Update at: 21-11-2025
 * Description: Utility functions for formatting dates, numbers, AQI values, and CSS class names
 */

import { format, formatDistanceToNow } from 'date-fns';

export function formatDate(date: string | Date, formatStr: string = 'PPP'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, formatStr);
}

export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

export function formatNumber(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}

export function formatParameterValue(value: number, unit: string): string {
  const formatted = formatNumber(value);
  return `${formatted} ${unit}`;
}

export function getParameterDisplayName(parameterName: string): string {
  const displayNames: Record<string, string> = {
    'pm25': 'PM₂.₅',
    'pm10': 'PM₁₀',
    'o3': 'O₃',
    'no2': 'NO₂',
    'so2': 'SO₂',
    'co': 'CO',
    'bc': 'BC',
  };

  return displayNames[parameterName.toLowerCase()] || parameterName.toUpperCase();
}

export function getAQILevel(parameter: string, value: number): {
  level: number;
  label: string;
  color: string;
  description: string;
} {
  // Simplified AQI calculation for PM2.5 (US EPA standard)
  if (parameter.toLowerCase() === 'pm25') {
    if (value <= 12) {
      return { level: 1, label: 'Good', color: '#00e400', description: 'Air quality is satisfactory' };
    } else if (value <= 35.4) {
      return { level: 2, label: 'Moderate', color: '#ffff00', description: 'Air quality is acceptable' };
    } else if (value <= 55.4) {
      return { level: 3, label: 'Unhealthy for Sensitive Groups', color: '#ff7e00', description: 'Sensitive groups may experience health effects' };
    } else if (value <= 150.4) {
      return { level: 4, label: 'Unhealthy', color: '#ff0000', description: 'Everyone may begin to experience health effects' };
    } else if (value <= 250.4) {
      return { level: 5, label: 'Very Unhealthy', color: '#8f3f97', description: 'Health alert: everyone may experience more serious health effects' };
    } else {
      return { level: 6, label: 'Hazardous', color: '#7e0023', description: 'Health warnings of emergency conditions' };
    }
  }

  // Default for other parameters
  return { level: 0, label: 'Unknown', color: '#999999', description: 'AQI not available for this parameter' };
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Parse DateTime from NGSI-LD format
 * Handles both nested format { "@type": "DateTime", "@value": "..." } and flat string
 */
export function parseDateTime(dateObserved: any): Date {
  if (!dateObserved) return new Date(0);

  // Handle nested format
  if (typeof dateObserved === 'object' && dateObserved['@value']) {
    return new Date(dateObserved['@value']);
  }

  // Handle flat string
  if (typeof dateObserved === 'string') {
    return new Date(dateObserved);
  }

  return new Date(0);
}

/**
 * Get value from NGSI-LD Property object
 * Handles both { "value": ... } and direct values
 */
export function getValue(prop: any): any {
  if (prop === null || prop === undefined) return null;

  // Handle Property object with value
  if (typeof prop === 'object' && 'value' in prop) {
    return prop.value;
  }

  // Return direct value
  return prop;
}

