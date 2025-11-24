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
    curl: `curl -X GET "https://your-domain.com/api/v1/locations?city=Hanoi" \\
  -H "X-API-Key: urx_your_api_key_here"`,
    
    javascript: `// Using fetch
const response = await fetch('https://your-domain.com/api/v1/locations?city=Hanoi', {
  headers: {
    'X-API-Key': 'urx_your_api_key_here'
  }
});
const data = await response.json();
console.log(data);`,

    python: `import requests

url = "https://your-domain.com/api/v1/locations"
headers = {
    "X-API-Key": "urx_your_api_key_here"
}
params = {
    "city": "Hanoi"
}

response = requests.get(url, headers=headers, params=params)
data = response.json()
print(data)`,

    node: `const axios = require('axios');

const config = {
  headers: {
    'X-API-Key': 'urx_your_api_key_here'
  },
  params: {
    city: 'Hanoi'
  }
};

axios.get('https://your-domain.com/api/v1/locations', config)
  .then(response => console.log(response.data))
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
              Complete guide to accessing UrbanReflex air quality data programmatically
            </p>
            <Link
              href="/api-keys"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#1e64ab] text-white font-semibold hover:bg-[#1a5690] transition-all duration-300 shadow-soft hover:shadow-medium"
            >
              <Key className="h-5 w-5" />
              Get Your API Key
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
                  <Key className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-[#30363c] mb-3">1. Get API Key</h3>
                <p className="text-gray-600">
                  Create a free account and generate your API key from the dashboard.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-soft border border-gray-100">
                <div className="inline-flex p-3 rounded-xl bg-blue-50 text-[#1e64ab] mb-4">
                  <Code className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-[#30363c] mb-3">2. Make Request</h3>
                <p className="text-gray-600">
                  Include your API key in the X-API-Key header with each request.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-soft border border-gray-100">
                <div className="inline-flex p-3 rounded-xl bg-blue-50 text-[#1e64ab] mb-4">
                  <Terminal className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-[#30363c] mb-3">3. Get Data</h3>
                <p className="text-gray-600">
                  Receive real-time air quality data in JSON format.
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
              {typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com'}/api/v1
            </code>
          </div>
        </div>
      </section>

      {/* Authentication */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#30363c] mb-6">Authentication</h2>
          <div className="bg-white rounded-xl p-8 shadow-soft border border-gray-100">
            <p className="text-gray-600 mb-6">
              All API requests require authentication using an API key. Include your API key in the request header:
            </p>
            <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm mb-4">
              <code className="text-[#30363c]">X-API-Key: urx_your_api_key_here</code>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>⚠️ Keep your API key secure!</strong> Never expose it in client-side code or public repositories.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Endpoints */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#30363c] mb-8">API Endpoints</h2>

          {/* Locations Endpoint */}
          <div className="bg-white rounded-xl p-8 shadow-soft border border-gray-100 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-lg bg-green-100 text-green-700 font-mono text-sm font-bold">
                GET
              </span>
              <code className="text-lg font-mono text-[#30363c]">/api/v1/locations</code>
            </div>
            <p className="text-gray-600 mb-6">
              Get a list of air quality monitoring locations.
            </p>

            <h4 className="font-bold text-[#30363c] mb-3">Query Parameters:</h4>
            <div className="space-y-2 mb-6">
              <div className="flex gap-4 text-sm">
                <code className="font-mono text-[#1e64ab] min-w-[120px]">city</code>
                <span className="text-gray-600">Filter by city name</span>
              </div>
              <div className="flex gap-4 text-sm">
                <code className="font-mono text-[#1e64ab] min-w-[120px]">country</code>
                <span className="text-gray-600">Filter by country name</span>
              </div>
              <div className="flex gap-4 text-sm">
                <code className="font-mono text-[#1e64ab] min-w-[120px]">limit</code>
                <span className="text-gray-600">Number of results (default: 100)</span>
              </div>
              <div className="flex gap-4 text-sm">
                <code className="font-mono text-[#1e64ab] min-w-[120px]">page</code>
                <span className="text-gray-600">Page number (default: 1)</span>
              </div>
            </div>

            <h4 className="font-bold text-[#30363c] mb-3">Example Response:</h4>
            <div className="relative">
              <pre className="bg-gray-50 rounded-lg p-4 overflow-x-auto text-sm">
                <code>{`{
  "meta": {
    "name": "openaq-api",
    "page": 1,
    "limit": 100,
    "found": 5
  },
  "results": [
    {
      "id": 1,
      "name": "Hanoi Central Station",
      "city": "Hanoi",
      "country": "Vietnam",
      "coordinates": { "lat": 21.0285, "lon": 105.8542 },
      "parameters": ["pm25", "pm10", "o3", "no2"],
      "lastUpdated": "2025-11-18T11:39:03.345Z"
    }
  ]
}`}</code>
              </pre>
            </div>
          </div>

          {/* Measurements Endpoint */}
          <div className="bg-white rounded-xl p-8 shadow-soft border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-lg bg-green-100 text-green-700 font-mono text-sm font-bold">
                GET
              </span>
              <code className="text-lg font-mono text-[#30363c]">/api/v1/measurements</code>
            </div>
            <p className="text-gray-600 mb-6">
              Get air quality measurements from monitoring locations.
            </p>

            <h4 className="font-bold text-[#30363c] mb-3">Query Parameters:</h4>
            <div className="space-y-2 mb-6">
              <div className="flex gap-4 text-sm">
                <code className="font-mono text-[#1e64ab] min-w-[120px]">city</code>
                <span className="text-gray-600">Filter by city name</span>
              </div>
              <div className="flex gap-4 text-sm">
                <code className="font-mono text-[#1e64ab] min-w-[120px]">country</code>
                <span className="text-gray-600">Filter by country name</span>
              </div>
              <div className="flex gap-4 text-sm">
                <code className="font-mono text-[#1e64ab] min-w-[120px]">parameter</code>
                <span className="text-gray-600">Filter by parameter (pm25, pm10, o3, etc.)</span>
              </div>
              <div className="flex gap-4 text-sm">
                <code className="font-mono text-[#1e64ab] min-w-[120px]">location_id</code>
                <span className="text-gray-600">Filter by location ID</span>
              </div>
              <div className="flex gap-4 text-sm">
                <code className="font-mono text-[#1e64ab] min-w-[120px]">date_from</code>
                <span className="text-gray-600">Start date (ISO 8601 format)</span>
              </div>
              <div className="flex gap-4 text-sm">
                <code className="font-mono text-[#1e64ab] min-w-[120px]">date_to</code>
                <span className="text-gray-600">End date (ISO 8601 format)</span>
              </div>
            </div>

            <h4 className="font-bold text-[#30363c] mb-3">Example Response:</h4>
            <div className="relative">
              <pre className="bg-gray-50 rounded-lg p-4 overflow-x-auto text-sm">
                <code>{`{
  "meta": {
    "name": "openaq-api",
    "page": 1,
    "limit": 100,
    "found": 150
  },
  "results": [
    {
      "locationId": 1,
      "location": "Hanoi Central Station",
      "city": "Hanoi",
      "country": "Vietnam",
      "parameter": "pm25",
      "value": 35.5,
      "unit": "µg/m³",
      "timestamp": "2025-11-18T11:39:03.345Z"
    }
  ]
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

      {/* Rate Limits */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#30363c] mb-6">Rate Limits</h2>
          <div className="bg-white rounded-xl p-8 shadow-soft border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-[#1e64ab] mb-2">1,000</div>
                <div className="text-gray-600">Requests per hour</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#1e64ab] mb-2">10,000</div>
                <div className="text-gray-600">Requests per day</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#1e64ab] mb-2">Unlimited</div>
                <div className="text-gray-600">For enterprise plans</div>
              </div>
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

