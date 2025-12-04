/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 18-11-2025
 * Description: API Documentation page with examples and guides
 */

'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Book, Code, Key, Terminal, Copy, CheckCircle } from 'lucide-react';
import DotsBackground from '@/components/ui/DotsBackground';
import Link from 'next/link';

export default function APIDocsPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const codeExamples = {
    curl: `curl -X GET "https://your-domain.com/api/aqi?limit=10"`,

    javascript: `// Fetch AQI stations
const response = await fetch('/api/aqi?limit=10');
const data = await response.json();
console.log(data.stations);

// Fetch road segments
const roads = await fetch('/api/roads?limit=100');
const roadData = await roads.json();
console.log(roadData.roads);`,

    python: `import requests

# Get AQI data
url = "https://your-domain.com/api/aqi"
params = {"limit": 10}
response = requests.get(url, params=params)
data = response.json()
print(data["stations"])

# Get road segments
roads_url = "https://your-domain.com/api/roads"
roads = requests.get(roads_url, params={"limit": 100})
print(roads.json()["roads"])`,

    node: `const axios = require('axios');

// Get AQI stations
axios.get('https://your-domain.com/api/aqi', {
  params: { limit: 10 }
})
  .then(response => console.log(response.data.stations))
  .catch(error => console.error(error));

// Get road segments
axios.get('https://your-domain.com/api/roads', {
  params: { limit: 100 }
})
  .then(response => console.log(response.data.roads))
  .catch(error => console.error(error));`,
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-white py-20 overflow-hidden min-h-[450px]">
        <div className="absolute inset-0">
          <DotsBackground />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Book className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-6 text-[#1e64ab]" />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#30363c] mb-6">
              API Documentation
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Complete guide to accessing UrbanReflex NGSI-LD data - Roads, AQI, Weather, and more
            </p>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#1e64ab] text-white font-semibold hover:bg-[#1a5690] transition-all duration-300 shadow-soft hover:shadow-medium"
            >
              <Terminal className="h-5 w-5" />
              Explore Live Data
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-[#30363c] mb-8">Quick Start</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-xl p-6 shadow-soft border border-gray-100">
                <div className="inline-flex p-3 rounded-xl bg-blue-50 text-[#1e64ab] mb-4">
                  <Terminal className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-[#30363c] mb-3">1. Choose Endpoint</h3>
                <p className="text-gray-600">
                  Select the data you need: Roads, AQI, Weather, Streetlights, or Reports.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-soft border border-gray-100">
                <div className="inline-flex p-3 rounded-xl bg-green-50 text-green-600 mb-4">
                  <Code className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-[#30363c] mb-3">2. Make Request</h3>
                <p className="text-gray-600">
                  Use fetch or axios to call the API endpoint with optional query parameters.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-soft border border-gray-100">
                <div className="inline-flex p-3 rounded-xl bg-purple-50 text-purple-600 mb-4">
                  <Book className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-[#30363c] mb-3">3. Get NGSI-LD Data</h3>
                <p className="text-gray-600">
                  Receive standardized NGSI-LD data in JSON format from our Context Broker.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Base URL */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#30363c] mb-6">Base URL</h2>
          <div className="bg-white rounded-xl p-6 shadow-soft border border-gray-100">
            <code className="text-lg text-[#1e64ab] font-mono">
              {typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com'}/api
            </code>
            <p className="text-sm text-gray-600 mt-4">
              All endpoints are relative to this base URL. No authentication required for public data.
            </p>
          </div>
        </div>
      </section>

      {/* NGSI-LD Info */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#30363c] mb-6">NGSI-LD Context Broker</h2>
          <div className="bg-white rounded-xl p-8 shadow-soft border border-gray-100">
            <p className="text-gray-600 mb-6">
              UrbanReflex uses NGSI-LD standard for smart city data. All data is stored in an Orion Context Broker
              and exposed through our API endpoints with proper context handling.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>ℹ️ No API Key Required:</strong> All endpoints are publicly accessible for reading data.
                Authentication is only needed for submitting reports or administrative actions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Endpoints */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#30363c] mb-8">API Endpoints</h2>

          {/* Roads Endpoint */}
          <div className="bg-white rounded-xl p-8 shadow-soft border border-gray-100 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-lg bg-green-100 text-green-700 font-mono text-sm font-bold">
                GET
              </span>
              <code className="text-lg font-mono text-[#30363c]">/api/roads</code>
            </div>
            <p className="text-gray-600 mb-6">
              Get road segments with location data.
            </p>

            <h4 className="font-bold text-[#30363c] mb-3">Query Parameters:</h4>
            <div className="space-y-2 mb-6">
              <div className="flex gap-4 text-sm">
                <code className="font-mono text-[#1e64ab] min-w-[120px]">limit</code>
                <span className="text-gray-600">Number of results (default: 5000)</span>
              </div>
              <div className="flex gap-4 text-sm">
                <code className="font-mono text-[#1e64ab] min-w-[120px]">offset</code>
                <span className="text-gray-600">Offset for pagination (default: 0)</span>
              </div>
            </div>

            <h4 className="font-bold text-[#30363c] mb-3">Example Response:</h4>
            <div className="relative">
              <pre className="bg-gray-50 rounded-lg p-4 overflow-x-auto text-sm">
                <code>{`{
  "roads": [
    {
      "id": "urn:ngsi-ld:RoadSegment:HCMC-32576911",
      "name": "Nguyễn Huệ",
      "location": {
        "type": "LineString",
        "coordinates": [[106.7, 10.78], [106.71, 10.79]]
      },
      "roadClass": "primary"
    }
  ],
  "count": 4936,
  "limit": 5000,
  "offset": 0
}`}</code>
              </pre>
            </div>
          </div>

          {/* AQI Endpoint */}
          <div className="bg-white rounded-xl p-8 shadow-soft border border-gray-100 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-lg bg-green-100 text-green-700 font-mono text-sm font-bold">
                GET
              </span>
              <code className="text-lg font-mono text-[#30363c]">/api/aqi</code>
            </div>
            <p className="text-gray-600 mb-6">
              Get air quality monitoring stations with latest measurements.
            </p>

            <h4 className="font-bold text-[#30363c] mb-3">Query Parameters:</h4>
            <div className="space-y-2 mb-6">
              <div className="flex gap-4 text-sm">
                <code className="font-mono text-[#1e64ab] min-w-[120px]">limit</code>
                <span className="text-gray-600">Number of results (default: 100)</span>
              </div>
              <div className="flex gap-4 text-sm">
                <code className="font-mono text-[#1e64ab] min-w-[120px]">lat</code>
                <span className="text-gray-600">Latitude for spatial query</span>
              </div>
              <div className="flex gap-4 text-sm">
                <code className="font-mono text-[#1e64ab] min-w-[120px]">lon</code>
                <span className="text-gray-600">Longitude for spatial query</span>
              </div>
              <div className="flex gap-4 text-sm">
                <code className="font-mono text-[#1e64ab] min-w-[120px]">maxDistance</code>
                <span className="text-gray-600">Search radius in meters (default: 5000)</span>
              </div>
            </div>

            <h4 className="font-bold text-[#30363c] mb-3">Example Response:</h4>
            <div className="relative">
              <pre className="bg-gray-50 rounded-lg p-4 overflow-x-auto text-sm">
                <code>{`{
  "stations": [
    {
      "id": "urn:ngsi-ld:AirQualityObserved:HCMC-us-diplomatic-post",
      "name": "US Diplomatic Post: Ho Chi Minh City",
      "stationId": "us-diplomatic-post",
      "location": {
        "type": "Point",
        "coordinates": [106.700035, 10.782773]
      },
      "pm25": 44.6,
      "pm10": 86,
      "o3": 45.2,
      "no2": 25.3,
      "so2": 8.1,
      "co": 0.5,
      "aqi": 123,
      "dateObserved": "2025-11-27T15:30:00Z"
    }
  ],
  "count": 19
}`}</code>
              </pre>
            </div>
          </div>

          {/* Weather Endpoint */}
          <div className="bg-white rounded-xl p-8 shadow-soft border border-gray-100 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-lg bg-green-100 text-green-700 font-mono text-sm font-bold">
                GET
              </span>
              <code className="text-lg font-mono text-[#30363c]">/api/weather</code>
            </div>
            <p className="text-gray-600 mb-6">
              Get latest weather data for the city.
            </p>

            <h4 className="font-bold text-[#30363c] mb-3">Example Response:</h4>
            <div className="relative">
              <pre className="bg-gray-50 rounded-lg p-4 overflow-x-auto text-sm">
                <code>{`{
  "id": "urn:ngsi-ld:WeatherObserved:HCMC-20251127T153000Z",
  "temperature": 28.5,
  "relativeHumidity": 0.75,
  "atmosphericPressure": 1013,
  "windSpeed": 3.5,
  "windDirection": 180,
  "visibility": 10000,
  "precipitation": 0,
  "dewPoint": 23.8,
  "dateObserved": "2025-11-27T15:30:00Z"
}`}</code>
              </pre>
            </div>
          </div>

          {/* Streetlights Endpoint */}
          <div className="bg-white rounded-xl p-8 shadow-soft border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-lg bg-green-100 text-green-700 font-mono text-sm font-bold">
                GET
              </span>
              <code className="text-lg font-mono text-[#30363c]">/api/streetlights</code>
            </div>
            <p className="text-gray-600 mb-6">
              Get streetlight data with optional road segment filtering.
            </p>

            <h4 className="font-bold text-[#30363c] mb-3">Query Parameters:</h4>
            <div className="space-y-2 mb-6">
              <div className="flex gap-4 text-sm">
                <code className="font-mono text-[#1e64ab] min-w-[120px]">roadId</code>
                <span className="text-gray-600">Filter by road segment ID</span>
              </div>
              <div className="flex gap-4 text-sm">
                <code className="font-mono text-[#1e64ab] min-w-[120px]">limit</code>
                <span className="text-gray-600">Number of results (default: 1000)</span>
              </div>
            </div>

            <h4 className="font-bold text-[#30363c] mb-3">Example Response:</h4>
            <div className="relative">
              <pre className="bg-gray-50 rounded-lg p-4 overflow-x-auto text-sm">
                <code>{`{
  "streetlights": [...],
  "count": 45,
  "statistics": {
    "total": 45,
    "on": 40,
    "off": 5
  }
}`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Code Examples */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#30363c] mb-8">Code Examples</h2>

          <div className="space-y-6">
            {/* cURL */}
            <div className="bg-white rounded-xl p-6 shadow-soft border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-[#30363c]">cURL</h3>
                <button
                  onClick={() => copyCode(codeExamples.curl, 'curl')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {copiedCode === 'curl' ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Copy className="h-5 w-5 text-gray-600" />
                  )}
                </button>
              </div>
              <pre className="bg-gray-50 rounded-lg p-4 overflow-x-auto text-sm">
                <code>{codeExamples.curl}</code>
              </pre>
            </div>

            {/* JavaScript */}
            <div className="bg-white rounded-xl p-6 shadow-soft border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-[#30363c]">JavaScript (Fetch)</h3>
                <button
                  onClick={() => copyCode(codeExamples.javascript, 'js')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {copiedCode === 'js' ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Copy className="h-5 w-5 text-gray-600" />
                  )}
                </button>
              </div>
              <pre className="bg-gray-50 rounded-lg p-4 overflow-x-auto text-sm">
                <code>{codeExamples.javascript}</code>
              </pre>
            </div>

            {/* Python */}
            <div className="bg-white rounded-xl p-6 shadow-soft border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-[#30363c]">Python</h3>
                <button
                  onClick={() => copyCode(codeExamples.python, 'python')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {copiedCode === 'python' ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Copy className="h-5 w-5 text-gray-600" />
                  )}
                </button>
              </div>
              <pre className="bg-gray-50 rounded-lg p-4 overflow-x-auto text-sm">
                <code>{codeExamples.python}</code>
              </pre>
            </div>

            {/* Node.js */}
            <div className="bg-white rounded-xl p-6 shadow-soft border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-[#30363c]">Node.js (Axios)</h3>
                <button
                  onClick={() => copyCode(codeExamples.node, 'node')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {copiedCode === 'node' ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Copy className="h-5 w-5 text-gray-600" />
                  )}
                </button>
              </div>
              <pre className="bg-gray-50 rounded-lg p-4 overflow-x-auto text-sm">
                <code>{codeExamples.node}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#30363c] mb-6">Additional Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-soft border border-gray-100">
              <h3 className="text-xl font-bold text-[#30363c] mb-3">📊 Live Data</h3>
              <p className="text-gray-600 mb-4">
                Explore real-time data on our interactive map with roads, AQI stations, and weather.
              </p>
              <Link
                href="/explore"
                className="text-[#1e64ab] font-semibold hover:underline"
              >
                View Map →
              </Link>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-soft border border-gray-100">
              <h3 className="text-xl font-bold text-[#30363c] mb-3">🌐 NGSI-LD</h3>
              <p className="text-gray-600 mb-4">
                Learn about NGSI-LD standard and how we use it for smart city data.
              </p>
              <a
                href="https://www.etsi.org/deliver/etsi_gs/CIM/001_099/009/01.08.01_60/gs_CIM009v010801p.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1e64ab] font-semibold hover:underline"
              >
                Learn More →
              </a>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-soft border border-gray-100">
              <h3 className="text-xl font-bold text-[#30363c] mb-3">📖 Documentation</h3>
              <p className="text-gray-600 mb-4">
                Complete technical documentation for developers and integrators.
              </p>
              <Link
                href="/docs"
                className="text-[#1e64ab] font-semibold hover:underline"
              >
                Read Docs →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Support */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-12 text-center">
            <h2 className="text-3xl font-bold text-[#30363c] mb-4">Need Help?</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Check out our support resources or contact our team for assistance
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/help"
                className="px-8 py-4 rounded-xl bg-white text-[#1e64ab] font-semibold hover:bg-gray-50 transition-all duration-300 shadow-soft"
              >
                Help Center
              </Link>
              <Link
                href="mailto:api@urbanreflex.org"
                className="px-8 py-4 rounded-xl bg-[#1e64ab] text-white font-semibold hover:bg-[#1a5690] transition-all duration-300 shadow-soft hover:shadow-medium"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

