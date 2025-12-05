/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 25-11-2025
 * Update at: 03-12-2025
 * Description: Documentation content component with sidebar navigation
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Book, Code, FileText, Rocket, Search, ChevronRight, Menu, X,
  Key, Clock, Calendar, Filter, Database, Globe, Zap, Layers,
  MapPin, AlertTriangle, Cloud, Wind, Droplets, Gauge, Eye,
  CheckCircle, XCircle, AlertCircle, Info, Sparkles, TrendingUp
} from 'lucide-react';
import Link from 'next/link';

const docSections = [
  {
    title: 'Getting Started',
    icon: Rocket,
    items: [
      { title: 'Introduction', href: '#introduction' },
      { title: 'Quick Start', href: '#quick-start' },
      { title: 'Installation', href: '#installation' },
    ],
  },
  {
    title: 'API Reference',
    icon: Code,
    items: [
      { title: 'Authentication', href: '#authentication' },
      { title: 'Endpoints', href: '#endpoints' },
      { title: 'Rate Limits', href: '#rate-limits' },
      { title: 'Error Codes', href: '#error-codes' },
    ],
  },
  {
    title: 'Guides',
    icon: Book,
    items: [
      { title: 'Road Data', href: '#road-data' },
      { title: 'Community Reports', href: '#reports' },
      { title: 'Real-time Updates', href: '#real-time' },
    ],
  },
  {
    title: 'Resources',
    icon: FileText,
    items: [
      { title: 'Platform Overview', href: '#platform-overview' },
      { title: 'Examples', href: '#examples' },
      { title: 'SDKs', href: '#sdks' },
    ],
  },
];

export default function DocsContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('introduction');
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Setup Intersection Observer for scroll spy
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          if (id) {
            setActiveSection(id);
            // Scroll sidebar to active item
            const sidebarItem = document.querySelector(`button[data-section="${id}"]`);
            if (sidebarItem) {
              sidebarItem.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
            }
          }
        }
      });
    }, observerOptions);

    // Observe all sections
    sectionRefs.current.forEach((element) => {
      if (element && observerRef.current) {
        observerRef.current.observe(element);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Register section elements
  const registerSection = (id: string, element: HTMLElement | null) => {
    if (element) {
      sectionRefs.current.set(id, element);
      if (observerRef.current) {
        observerRef.current.observe(element);
      }
    }
  };

  const handleNavClick = (href: string) => {
    const id = href.substring(1);
    setActiveSection(id);
    setSidebarOpen(false);

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-20 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      <div className="flex">
        {/* Sidebar - Fixed */}
        <aside
          className={`fixed top-16 left-0 bottom-0 w-72 bg-white border-r border-gray-200 overflow-y-auto z-[100] transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            }`}
        >
          <div className="p-6">
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search docs..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Navigation */}
            <nav className="space-y-6">
              {docSections.map((section) => (
                <div key={section.title}>
                  <div className="flex items-center gap-2 mb-3">
                    <section.icon className="h-4 w-4 text-gray-500" />
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                      {section.title}
                    </h3>
                  </div>
                  <ul className="space-y-1">
                    {section.items.map((item) => {
                      const sectionId = item.href.substring(1);
                      return (
                        <li key={item.href}>
                          <button
                            data-section={sectionId}
                            onClick={() => handleNavClick(item.href)}
                            className={`w-full text-left block px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                              activeSection === sectionId
                                ? 'bg-primary-500 text-white font-semibold shadow-md'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                          >
                            {item.title}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content - With left margin for sidebar */}
        <main className="flex-1 lg:ml-72 px-6 py-8 lg:px-12 lg:py-12">
          <div className="max-w-4xl">
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                UrbanReflex Documentation
              </h1>
              <p className="text-xl text-gray-600">
                Everything you need to build with UrbanReflex platform
              </p>
            </div>

            {/* Content Sections */}
            <div className="prose prose-lg max-w-none">
              {/* Introduction */}
              <section 
                id="introduction" 
                className="mb-16 scroll-mt-20"
                ref={(el) => registerSection('introduction', el)}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Introduction</h2>
                <p className="text-gray-600 mb-6">
                  Welcome to UrbanReflex documentation. This guide will help you integrate our platform
                  into your applications and make the most of our road network and community reporting features.
                </p>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Our API is currently in beta. Features and endpoints may change.
                  </p>
                </div>
              </section>

              {/* Quick Start */}
              <section 
                id="quick-start" 
                className="mb-16 scroll-mt-20"
                ref={(el) => registerSection('quick-start', el)}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Start</h2>
                <p className="text-gray-600 mb-6">
                  Get started with UrbanReflex in just a few minutes.
                </p>
                <div className="bg-gray-900 rounded-lg p-6 mb-6">
                  <code className="text-green-400 text-sm">
                    npm install @urbanreflex/sdk
                  </code>
                </div>
                <div className="bg-gray-900 rounded-lg p-6">
                  <pre className="text-green-400 text-sm overflow-x-auto">
                    {`import { UrbanReflex } from '@urbanreflex/sdk';

const client = new UrbanReflex({
  apiKey: 'your-api-key'
});

// Fetch road segments
const roads = await client.roads.list();`}
                  </pre>
                </div>
              </section>

              {/* Installation */}
              <section 
                id="installation" 
                className="mb-16 scroll-mt-20"
                ref={(el) => registerSection('installation', el)}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Installation</h2>
                <p className="text-gray-600 mb-6">
                  Multiple ways to integrate UrbanReflex into your project.
                </p>

                <div className="space-y-6">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">NPM</h3>
                    <div className="bg-gray-900 rounded-lg p-4">
                      <code className="text-green-400 text-sm">npm install @urbanreflex/sdk</code>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Yarn</h3>
                    <div className="bg-gray-900 rounded-lg p-4">
                      <code className="text-green-400 text-sm">yarn add @urbanreflex/sdk</code>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Direct API Access</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      You can also access our API directly without SDK:
                    </p>
                    <div className="bg-gray-900 rounded-lg p-4">
                      <code className="text-green-400 text-sm">
                        curl https://api.urbanreflex.com/api/ngsi-ld?type=RoadSegment&limit=10
                      </code>
                    </div>
                  </div>
                </div>
              </section>

              {/* Authentication */}
              <section 
                id="authentication" 
                className="mb-16 scroll-mt-20"
                ref={(el) => registerSection('authentication', el)}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Authentication</h2>
                <p className="text-gray-600 mb-6">
                  All API requests require authentication using an API key.
                </p>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Getting your API Key</h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-600">
                    <li>Sign in to your UrbanReflex account</li>
                    <li>Navigate to Settings → API Keys</li>
                    <li>Click "Generate New Key"</li>
                    <li>Copy and securely store your key</li>
                  </ol>
                </div>
              </section>

              {/* Endpoints */}
              <section 
                id="endpoints" 
                className="mb-16 scroll-mt-20"
                ref={(el) => registerSection('endpoints', el)}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-4">API Endpoints</h2>
                
                {/* API v1 - Main Public API */}
                <div className="mb-8">
                  <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-l-4 border-blue-600 shadow-sm p-6 rounded-lg mb-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                        <Zap className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">API v1 - Public API</h3>
                          <span className="px-2.5 py-1 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center gap-1">
                            <Sparkles className="h-3 w-3" />
                            Latest
                          </span>
                        </div>
                        <p className="text-gray-700 mb-4">
                          API chính để truy cập dữ liệu NGSI-LD với nhiều tính năng mạnh mẽ: timeframe filtering, entity selection, và date range queries.
                        </p>
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1.5 bg-green-500 text-white text-xs font-bold rounded-md shadow-sm flex items-center gap-1.5">
                            <Globe className="h-3.5 w-3.5" />
                            GET
                          </span>
                          <code className="text-sm font-mono bg-white px-4 py-1.5 rounded-md border border-gray-200 shadow-sm">/api/v1/{'{apiKey}'}</code>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Authentication */}
                  <div className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 mb-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-amber-500 rounded-lg">
                        <Key className="h-5 w-5 text-white" />
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg">Authentication</h4>
                    </div>
                    <p className="text-sm text-gray-700 mb-4">
                      API key được đặt trực tiếp trong URL path. Format: <code className="bg-white px-2.5 py-1 rounded-md border border-amber-200 font-mono text-amber-800">ur_xxxxxxxxxxxxx</code>
                    </p>
                    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 shadow-inner">
                      <pre className="text-green-400 text-sm overflow-x-auto font-mono">
                        {`GET /api/v1/ur_YOUR_API_KEY_HERE`}
                      </pre>
                    </div>
                    <div className="mt-4 flex items-start gap-2 p-3 bg-white rounded-lg border border-amber-200">
                      <Info className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-gray-700">
                        <strong className="text-amber-800">Lưu ý:</strong> API key phải bắt đầu với <code className="bg-amber-100 px-1.5 py-0.5 rounded text-amber-900">ur_</code>. Bạn có thể tạo API key mới trong trang Profile → API Keys.
                      </p>
                    </div>
                  </div>

                  {/* Query Parameters */}
                  <div className="border-2 border-gray-200 rounded-xl p-6 mb-6 bg-white shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-indigo-500 rounded-lg">
                        <Filter className="h-5 w-5 text-white" />
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg">Query Parameters</h4>
                    </div>
                    
                    <div className="space-y-5">
                      {/* Timeframe */}
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-blue-500 rounded-lg">
                            <Clock className="h-5 w-5 text-white" />
                          </div>
                          <h5 className="font-bold text-gray-900">Timeframe</h5>
                          <code className="bg-white px-2.5 py-1 rounded-md border border-blue-200 text-xs font-mono text-blue-800">timeframe</code>
                        </div>
                        <p className="text-sm text-gray-700 mb-4">Chọn cách lấy dữ liệu theo thời gian:</p>
                        <div className="space-y-3">
                          <div className="bg-white rounded-lg p-4 border border-blue-200">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <code className="bg-blue-100 px-2.5 py-1 rounded-md text-xs font-mono text-blue-800 font-semibold">latest</code>
                              <span className="text-sm font-semibold text-gray-900">- Lấy dữ liệu mới nhất</span>
                            </div>
                            <p className="text-xs text-gray-600 ml-6">WeatherObserved: 1 record mới nhất | AirQualityObserved: 1 record mới nhất cho mỗi station (10 stations)</p>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-blue-200">
                            <div className="flex items-center gap-2 mb-2">
                              <Database className="h-4 w-4 text-blue-500" />
                              <code className="bg-blue-100 px-2.5 py-1 rounded-md text-xs font-mono text-blue-800 font-semibold">alltime</code>
                              <span className="text-sm font-semibold text-gray-900">- Lấy tất cả dữ liệu (mặc định)</span>
                            </div>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-blue-200">
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="h-4 w-4 text-purple-500" />
                              <code className="bg-blue-100 px-2.5 py-1 rounded-md text-xs font-mono text-blue-800 font-semibold">custom</code>
                              <span className="text-sm font-semibold text-gray-900">- Lọc theo khoảng thời gian</span>
                            </div>
                            <p className="text-xs text-gray-600 ml-6">Yêu cầu: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-800">startDate</code> và/hoặc <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-800">endDate</code> (ISO 8601 format)</p>
                          </div>
                        </div>
                      </div>

                      {/* Entity Selection */}
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-purple-500 rounded-lg">
                            <Layers className="h-5 w-5 text-white" />
                          </div>
                          <h5 className="font-bold text-gray-900">Entity Selection</h5>
                          <code className="bg-white px-2.5 py-1 rounded-md border border-purple-200 text-xs font-mono text-purple-800">entities</code>
                        </div>
                        <p className="text-sm text-gray-700 mb-4">Chọn entity types cụ thể để lấy (comma-separated):</p>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-white rounded-lg p-4 border border-purple-200">
                            <div className="flex items-center gap-2 mb-3">
                              <Database className="h-4 w-4 text-gray-500" />
                              <p className="font-bold text-gray-900">Static Data</p>
                              <span className="ml-auto px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">Dữ liệu tĩnh</span>
                            </div>
                            <ul className="space-y-2 text-sm">
                              <li className="flex items-center gap-2">
                                <MapPin className="h-3.5 w-3.5 text-blue-500" />
                                <code className="bg-purple-50 px-2 py-1 rounded text-xs font-mono text-purple-800">RoadSegment</code>
                                <span className="text-gray-600 text-xs">(~5,000)</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <Eye className="h-3.5 w-3.5 text-yellow-500" />
                                <code className="bg-purple-50 px-2 py-1 rounded text-xs font-mono text-purple-800">Streetlight</code>
                                <span className="text-gray-600 text-xs">(~17,500)</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <MapPin className="h-3.5 w-3.5 text-green-500" />
                                <code className="bg-purple-50 px-2 py-1 rounded text-xs font-mono text-purple-800">PointOfInterest</code>
                              </li>
                            </ul>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-purple-200">
                            <div className="flex items-center gap-2 mb-3">
                              <Zap className="h-4 w-4 text-yellow-500" />
                              <p className="font-bold text-gray-900">Dynamic Data</p>
                              <span className="ml-auto px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">Dữ liệu động</span>
                            </div>
                            <ul className="space-y-2 text-sm">
                              <li className="flex items-center gap-2">
                                <Cloud className="h-3.5 w-3.5 text-blue-500" />
                                <code className="bg-purple-50 px-2 py-1 rounded text-xs font-mono text-purple-800">WeatherObserved</code>
                                <span className="text-gray-600 text-xs">(1 OWM)</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <Wind className="h-3.5 w-3.5 text-green-500" />
                                <code className="bg-purple-50 px-2 py-1 rounded text-xs font-mono text-purple-800">AirQualityObserved</code>
                                <span className="text-gray-600 text-xs">(10 OpenAQ)</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                                <code className="bg-purple-50 px-2 py-1 rounded text-xs font-mono text-purple-800">CitizenReport</code>
                              </li>
                              <li className="flex items-center gap-2">
                                <AlertTriangle className="h-3.5 w-3.5 text-orange-500" />
                                <code className="bg-purple-50 px-2 py-1 rounded text-xs font-mono text-purple-800">RoadReport</code>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Other Parameters */}
                      <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-5 border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-gray-600 rounded-lg">
                            <Code className="h-5 w-5 text-white" />
                          </div>
                          <h5 className="font-bold text-gray-900">Other Parameters</h5>
                        </div>
                        <div className="grid md:grid-cols-2 gap-3">
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono text-gray-800">type</code>
                            <p className="text-xs text-gray-600 mt-1">Single entity type (legacy, dùng <code className="bg-gray-100 px-1 rounded">entities</code> thay thế)</p>
                          </div>
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono text-gray-800">limit</code>
                            <p className="text-xs text-gray-600 mt-1">Số lượng items mỗi page (max: 1000, default: 1000)</p>
                          </div>
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono text-gray-800">offset</code>
                            <p className="text-xs text-gray-600 mt-1">Offset cho pagination</p>
                          </div>
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono text-gray-800">options</code>
                            <p className="text-xs text-gray-600 mt-1">Format options (keyValues, etc.)</p>
                          </div>
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono text-gray-800">startDate</code>
                            <p className="text-xs text-gray-600 mt-1">Ngày bắt đầu (ISO 8601, cho custom timeframe)</p>
                          </div>
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono text-gray-800">endDate</code>
                            <p className="text-xs text-gray-600 mt-1">Ngày kết thúc (ISO 8601, cho custom timeframe)</p>
                          </div>
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono text-gray-800">unwrapped</code>
                            <p className="text-xs text-gray-600 mt-1">Trả về array trực tiếp (backward compatibility)</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Examples */}
                  <div className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 mb-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-indigo-500 rounded-lg">
                        <Sparkles className="h-5 w-5 text-white" />
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg">Examples</h4>
                    </div>
                    
                    <div className="space-y-5">
                      {/* Example 1 */}
                      <div className="bg-white rounded-lg p-5 border border-indigo-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                          <p className="text-sm font-bold text-gray-900">Lấy dữ liệu mới nhất của tất cả types</p>
                        </div>
                        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                          <pre className="text-green-400 text-sm overflow-x-auto font-mono">
                            {`GET /api/v1/ur_YOUR_API_KEY?timeframe=latest`}
                          </pre>
                        </div>
                      </div>

                      {/* Example 2 */}
                      <div className="bg-white rounded-lg p-5 border border-indigo-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                          <p className="text-sm font-bold text-gray-900">Chỉ lấy WeatherObserved mới nhất</p>
                        </div>
                        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                          <pre className="text-green-400 text-sm overflow-x-auto font-mono">
                            {`GET /api/v1/ur_YOUR_API_KEY?entities=WeatherObserved&timeframe=latest`}
                          </pre>
                        </div>
                      </div>

                      {/* Example 3 */}
                      <div className="bg-white rounded-lg p-5 border border-indigo-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                          <p className="text-sm font-bold text-gray-900">Chỉ lấy CitizenReport (tất cả)</p>
                        </div>
                        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                          <pre className="text-green-400 text-sm overflow-x-auto font-mono">
                            {`GET /api/v1/ur_YOUR_API_KEY?entities=CitizenReport&timeframe=alltime`}
                          </pre>
                        </div>
                      </div>

                      {/* Example 4 */}
                      <div className="bg-white rounded-lg p-5 border border-indigo-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                          <p className="text-sm font-bold text-gray-900">Lấy OpenAQ và OWM mới nhất</p>
                        </div>
                        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                          <pre className="text-green-400 text-sm overflow-x-auto font-mono">
                            {`GET /api/v1/ur_YOUR_API_KEY?entities=WeatherObserved,AirQualityObserved&timeframe=latest`}
                          </pre>
                        </div>
                      </div>

                      {/* Example 5 */}
                      <div className="bg-white rounded-lg p-5 border border-indigo-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xs font-bold">5</div>
                          <p className="text-sm font-bold text-gray-900">Lấy CitizenReport trong tháng 11/2025</p>
                        </div>
                        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                          <pre className="text-green-400 text-sm overflow-x-auto font-mono">
                            {`GET /api/v1/ur_YOUR_API_KEY?entities=CitizenReport&timeframe=custom&startDate=2025-11-01T00:00:00Z&endDate=2025-11-30T23:59:59Z`}
                          </pre>
                        </div>
                      </div>

                      {/* Example 6 */}
                      <div className="bg-white rounded-lg p-5 border border-indigo-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xs font-bold">6</div>
                          <p className="text-sm font-bold text-gray-900">Lấy tất cả RoadSegment và Streetlight</p>
                        </div>
                        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                          <pre className="text-green-400 text-sm overflow-x-auto font-mono">
                            {`GET /api/v1/ur_YOUR_API_KEY?entities=RoadSegment,Streetlight&timeframe=alltime`}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Response Format */}
                  <div className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 mb-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-emerald-500 rounded-lg">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg">Response Format</h4>
                    </div>
                    
                    <div className="space-y-5">
                      <div className="bg-white rounded-lg p-5 border border-emerald-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          <p className="text-sm font-bold text-gray-900">Wrapped Format</p>
                          <span className="ml-auto px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-semibold">Mặc định</span>
                        </div>
                        <p className="text-xs text-gray-600 mb-3">Sử dụng khi có timeframe hoặc entities parameter</p>
                        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                          <pre className="text-green-400 text-sm overflow-x-auto font-mono">
                            {`{
  "success": true,
  "data": [
    // Array of entities
  ],
  "meta": {
    "total": 100,
    "types": ["WeatherObserved", "AirQualityObserved"],
    "timeframe": "latest",
    "startDate": null,
    "endDate": null,
    "timestamp": "2025-12-03T10:00:00.000Z"
  }
}`}
                          </pre>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-5 border border-emerald-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                          <Database className="h-4 w-4 text-blue-500" />
                          <p className="text-sm font-bold text-gray-900">Unwrapped Format</p>
                          <span className="ml-auto px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold">Backward Compatible</span>
                        </div>
                        <p className="text-xs text-gray-600 mb-3">Trả về array trực tiếp, tương thích với code cũ</p>
                        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                          <pre className="text-green-400 text-sm overflow-x-auto font-mono">
                            {`[
  // Array of entities directly
]`}
                          </pre>
                        </div>
                        <div className="mt-3 flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-gray-700">
                            Thêm <code className="bg-white px-2 py-1 rounded border border-blue-200 text-blue-800 font-mono">?unwrapped=true</code> để dùng format này
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Other Endpoints */}
                <div className="space-y-6">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded">POST</span>
                      <code className="text-sm font-mono">/api/reports</code>
                    </div>
                    <p className="text-gray-600 mb-4">Submit community reports</p>
                    <h4 className="font-semibold text-gray-900 mb-2">Request Body</h4>
                    <div className="bg-gray-900 rounded-lg p-4">
                      <pre className="text-green-400 text-xs overflow-x-auto">
                        {`{
  "location": {
    "type": "Point",
    "coordinates": [106.629664, 10.823099]
  },
  "description": "Pothole on main road",
  "category": "road_damage",
  "images": ["url1", "url2"]
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </section>

              {/* Rate Limits */}
              <section 
                id="rate-limits" 
                className="mb-16 scroll-mt-20"
                ref={(el) => registerSection('rate-limits', el)}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Rate Limits</h2>
                <p className="text-gray-600 mb-6">
                  API rate limits to ensure fair usage for all users.
                </p>

                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Current Limits</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">Free Tier</div>
                      <div className="text-2xl font-bold text-gray-900">1,000</div>
                      <div className="text-sm text-gray-600">requests/day</div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">With API Key</div>
                      <div className="text-2xl font-bold text-primary-600">10,000</div>
                      <div className="text-sm text-gray-600">requests/day</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Rate Limit Headers</h3>
                  <p className="text-sm text-gray-600 mb-3">Every API response includes rate limit information:</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li><code className="bg-gray-100 px-2 py-1 rounded">X-RateLimit-Limit</code> - Maximum requests allowed</li>
                    <li><code className="bg-gray-100 px-2 py-1 rounded">X-RateLimit-Remaining</code> - Requests remaining</li>
                    <li><code className="bg-gray-100 px-2 py-1 rounded">X-RateLimit-Reset</code> - Time when limit resets</li>
                  </ul>
                </div>
              </section>

              {/* Error Codes */}
              <section 
                id="error-codes" 
                className="mb-16 scroll-mt-20"
                ref={(el) => registerSection('error-codes', el)}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Error Codes</h2>
                <p className="text-gray-600 mb-6">
                  Understanding API error responses.
                </p>

                <div className="space-y-4">
                  <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <code className="font-semibold text-red-800">400 Bad Request</code>
                    </div>
                    <p className="text-sm text-red-700">Invalid request parameters or malformed JSON</p>
                  </div>

                  <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <code className="font-semibold text-yellow-800">401 Unauthorized</code>
                    </div>
                    <p className="text-sm text-yellow-700">Missing or invalid API key</p>
                  </div>

                  <div className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <code className="font-semibold text-orange-800">429 Too Many Requests</code>
                    </div>
                    <p className="text-sm text-orange-700">Rate limit exceeded. Wait before making more requests</p>
                  </div>

                  <div className="border-l-4 border-purple-500 bg-purple-50 p-4 rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <code className="font-semibold text-purple-800">500 Internal Server Error</code>
                    </div>
                    <p className="text-sm text-purple-700">Server error. Please try again later or contact support</p>
                  </div>
                </div>

                <div className="bg-gray-900 rounded-lg p-6 mt-6">
                  <p className="text-xs text-gray-400 mb-2">Example Error Response:</p>
                  <pre className="text-green-400 text-xs overflow-x-auto">
                    {`{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Try again in 3600 seconds.",
    "statusCode": 429
  }
}`}
                  </pre>
                </div>
              </section>

              {/* Road Data */}
              <section 
                id="road-data" 
                className="mb-16 scroll-mt-20"
                ref={(el) => registerSection('road-data', el)}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Road Data</h2>
                <p className="text-gray-600 mb-6">
                  Access detailed road network information including segments, properties, and metadata.
                </p>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Road Segment Properties</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li><strong>name:</strong> Road name or identifier</li>
                    <li><strong>roadType:</strong> Classification (primary, secondary, tertiary, residential)</li>
                    <li><strong>length:</strong> Segment length in meters</li>
                    <li><strong>laneCount:</strong> Number of lanes</li>
                    <li><strong>surface:</strong> Road surface type (asphalt, concrete, etc.)</li>
                    <li><strong>location:</strong> GeoJSON LineString coordinates</li>
                  </ul>
                </div>

                <div className="bg-gray-900 rounded-lg p-6">
                  <p className="text-xs text-gray-400 mb-2">Example: Fetch roads by type</p>
                  <pre className="text-green-400 text-xs overflow-x-auto">
                    {`// Fetch primary roads
const response = await fetch(
  'https://api.urbanreflex.com/api/ngsi-ld?type=RoadSegment&roadType=primary&limit=20'
);
const roads = await response.json();

// Filter by location (within bounds)
roads.filter(road => {
  const coords = road.location.coordinates;
  return isWithinBounds(coords, myBounds);
});`}
                  </pre>
                </div>
              </section>

              {/* Community Reports */}
              <section 
                id="reports" 
                className="mb-16 scroll-mt-20"
                ref={(el) => registerSection('reports', el)}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Community Reports</h2>
                <p className="text-gray-600 mb-6">
                  Enable users to submit and view road issue reports.
                </p>

                <div className="space-y-6">
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
                    <h3 className="font-semibold text-blue-900 mb-3">Report Categories</h3>
                    <div className="grid md:grid-cols-2 gap-3 text-sm text-blue-800">
                      <div>• road_damage (potholes, cracks)</div>
                      <div>• traffic_issue (congestion, accidents)</div>
                      <div>• safety_concern (missing signs, lighting)</div>
                      <div>• maintenance_needed (debris, flooding)</div>
                    </div>
                  </div>

                  <div className="bg-gray-900 rounded-lg p-6">
                    <p className="text-xs text-gray-400 mb-2">Example: Submit a report</p>
                    <pre className="text-green-400 text-xs overflow-x-auto">
                      {`const report = {
  location: {
    type: "Point",
    coordinates: [106.629664, 10.823099]
  },
  description: "Large pothole causing vehicle damage",
  category: "road_damage",
  severity: "high",
  images: [imageFile1, imageFile2]
};

const response = await fetch('https://api.urbanreflex.com/api/reports', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify(report)
});`}
                    </pre>
                  </div>
                </div>
              </section>

              {/* Real-time Updates */}
              <section 
                id="real-time" 
                className="mb-16 scroll-mt-20"
                ref={(el) => registerSection('real-time', el)}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Real-time Updates</h2>
                <p className="text-gray-600 mb-6">
                  Subscribe to real-time data updates using WebSocket connections.
                </p>

                <div className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">⚡ WebSocket API</h3>
                  <p className="text-sm text-gray-700 mb-2">
                    Connect to: <code className="bg-white px-2 py-1 rounded text-xs">wss://api.urbanreflex.com/ws</code>
                  </p>
                  <p className="text-xs text-gray-600">
                    Receive instant notifications when new reports are submitted or road data is updated.
                  </p>
                </div>

                <div className="bg-gray-900 rounded-lg p-6">
                  <p className="text-xs text-gray-400 mb-2">Example: WebSocket connection</p>
                  <pre className="text-green-400 text-xs overflow-x-auto">
                    {`const ws = new WebSocket('wss://api.urbanreflex.com/ws');

ws.onopen = () => {
  // Subscribe to updates in a specific area
  ws.send(JSON.stringify({
    action: 'subscribe',
    channel: 'reports',
    filter: {
      bounds: {
        north: 10.9,
        south: 10.7,
        east: 106.8,
        west: 106.6
      }
    }
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('New report:', data);
  // Update your UI with new report
};`}
                  </pre>
                </div>
              </section>

              {/* Platform Overview */}
              <section 
                id="platform-overview" 
                className="mb-16 scroll-mt-20"
                ref={(el) => registerSection('platform-overview', el)}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Platform Overview</h2>
                <p className="text-gray-600 mb-6">
                  UrbanReflex is a comprehensive platform for urban road network data and community reporting.
                </p>
                <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-lg p-8 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Key Features</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-3">
                      <span className="text-primary-600 mt-1">✓</span>
                      <span><strong>Road Network Visualization:</strong> Interactive map with detailed road segments</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary-600 mt-1">✓</span>
                      <span><strong>Community Reporting:</strong> Real-time issue reporting and tracking</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary-600 mt-1">✓</span>
                      <span><strong>Open Data:</strong> Free access to road infrastructure data</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary-600 mt-1">✓</span>
                      <span><strong>RESTful API:</strong> Easy integration with your applications</span>
                    </li>
                  </ul>
                </div>
              </section>

              {/* Examples */}
              <section 
                id="examples" 
                className="mb-16 scroll-mt-20"
                ref={(el) => registerSection('examples', el)}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Examples</h2>
                <p className="text-gray-600 mb-6">
                  Common use cases and code examples.
                </p>
                <div className="grid gap-6">
                  <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <h3 className="font-semibold text-gray-900 mb-2">Fetch Road Data</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Retrieve road segments within a specific area
                    </p>
                    <Link href="#road-data" className="text-primary-600 hover:text-primary-700 text-sm font-semibold flex items-center gap-1">
                      View Example <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <h3 className="font-semibold text-gray-900 mb-2">Submit Reports</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Allow users to report road issues
                    </p>
                    <Link href="#reports" className="text-primary-600 hover:text-primary-700 text-sm font-semibold flex items-center gap-1">
                      View Example <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </section>

              {/* SDKs */}
              <section 
                id="sdks" 
                className="mb-16 scroll-mt-20"
                ref={(el) => registerSection('sdks', el)}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-4">SDKs & Libraries</h2>
                <p className="text-gray-600 mb-6">
                  Official and community-maintained SDKs for different programming languages.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">📦</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">JavaScript/TypeScript</h3>
                        <p className="text-xs text-gray-500">Official SDK</p>
                      </div>
                    </div>
                    <div className="bg-gray-900 rounded p-3 mb-3">
                      <code className="text-green-400 text-xs">npm install @urbanreflex/sdk</code>
                    </div>
                    <a href="https://github.com/urbanreflex/js-sdk" className="text-primary-600 hover:text-primary-700 text-sm font-semibold">
                      View on GitHub →
                    </a>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">🐍</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Python</h3>
                        <p className="text-xs text-gray-500">Coming Q1 2025</p>
                      </div>
                    </div>
                    <div className="bg-gray-900 rounded p-3 mb-3">
                      <code className="text-green-400 text-xs">pip install urbanreflex</code>
                    </div>
                    <span className="text-gray-400 text-sm">In development</span>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">💎</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Ruby</h3>
                        <p className="text-xs text-gray-500">Community SDK</p>
                      </div>
                    </div>
                    <div className="bg-gray-900 rounded p-3 mb-3">
                      <code className="text-green-400 text-xs">gem install urbanreflex</code>
                    </div>
                    <a href="https://github.com/urbanreflex/ruby-sdk" className="text-primary-600 hover:text-primary-700 text-sm font-semibold">
                      View on GitHub →
                    </a>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">🎯</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Go</h3>
                        <p className="text-xs text-gray-500">Community SDK</p>
                      </div>
                    </div>
                    <div className="bg-gray-900 rounded p-3 mb-3">
                      <code className="text-green-400 text-xs">go get github.com/urbanreflex/go-sdk</code>
                    </div>
                    <a href="https://github.com/urbanreflex/go-sdk" className="text-primary-600 hover:text-primary-700 text-sm font-semibold">
                      View on GitHub →
                    </a>
                  </div>
                </div>

                <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
                  <h3 className="font-semibold text-blue-900 mb-2">Want to contribute?</h3>
                  <p className="text-sm text-blue-800">
                    We welcome community contributions! If you'd like to create an SDK for another language,
                    check out our <a href="https://github.com/urbanreflex/sdk-guidelines" className="underline font-semibold">SDK guidelines</a> on GitHub.
                  </p>
                </div>
              </section>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

