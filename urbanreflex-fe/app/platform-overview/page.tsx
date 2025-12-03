/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 17-11-2025
 * Update at: 01-12-2025
 * Description: Platform overview page showcasing OpenAQ's open-source platform and data access methods
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Database, Github, MessageCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Platform Overview - OpenAQ',
  description: 'Learn about OpenAQ\'s open-source platform for ground-level ambient air quality data',
};

export default function PlatformOverviewPage() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200/30 to-transparent rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-cyan-200/30 to-transparent rounded-full blur-3xl -z-10"></div>

      {/* Header Section */}
      <div className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-6 sm:px-8 lg:px-12 py-16 sm:py-20">
          <h1 className="text-5xl sm:text-6xl font-bold text-[#1e64ab] mb-6 tracking-tight">
            Platform overview
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-6 sm:px-8 lg:px-12 py-12 sm:py-16">

        {/* Introduction */}
        <div className="mb-16">
          <p className="text-2xl text-[#30363c] leading-relaxed mb-6 font-medium">
            OpenAQ is the world's largest open-source, open-access platform for ground-level ambient air quality data.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            OpenAQ aggregates data by searching and scraping hundreds of data sources to extract and store data.
            We store the physical measurements and not the calculated values (e.g., AQI, AQHI). This also means
            that we store the raw measurements from these data sources and do not aggregate them in any way.
          </p>
        </div>

        {/* Platform Diagram */}
        <div className="mb-16">
          <div className="relative bg-gradient-to-br from-[#e6f8f8] to-white rounded-[22px] p-8 sm:p-12 shadow-lg border border-[#d4d8dd]/30">
            <div className="text-center">
              <div className="flex justify-center mb-8">
                <div className="bg-white rounded-full p-8 shadow-xl border-4 border-[#33a3a1]/20">
                  <Database className="h-20 w-20 text-[#33a3a1]" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-[#1e64ab] mb-6">OpenAQ Platform Architecture</h3>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed mb-8">
                Data flows from hundreds of sources → Aggregation & Storage → API & Explorer → Users worldwide
              </p>
              <div className="flex justify-center gap-6 sm:gap-12 flex-wrap">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 bg-[#1e64ab] rounded-full mb-2"></div>
                  <span className="text-sm font-medium text-gray-600">Data Sources</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 bg-[#33a3a1] rounded-full mb-2"></div>
                  <span className="text-sm font-medium text-gray-600">Processing</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 bg-purple-400 rounded-full mb-2"></div>
                  <span className="text-sm font-medium text-gray-600">Access Points</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t-2 border-dashed border-[#d4d8dd] my-16"></div>

        {/* Open Source Section */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-[#1e64ab] mb-6">Open source</h2>
          <p className="text-lg text-[#30363c] leading-relaxed mb-6 font-medium">
            OpenAQ is proudly open-source and built on open-source technology. All of our code is available
            on GitHub and we welcome contributions from the community.
          </p>
          <a
            href="https://github.com/openaq"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#e6f8f8] text-[#30363c] px-6 py-3 rounded-full font-bold text-base hover:bg-[#b0e8e6] transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Github className="h-5 w-5" />
            View our code on GitHub
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Divider */}
        <div className="border-t-2 border-dashed border-[#d4d8dd] my-16"></div>

        {/* Accessing Data Section */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-[#1e64ab] mb-10">Accessing data</h2>

          <div className="space-y-12">
            {/* API */}
            <div className="bg-white rounded-[22px] border border-[#d4d8dd] p-8 sm:p-10 shadow-md hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-3xl font-bold text-[#1e64ab] mb-4">API</h3>
              <p className="text-lg text-[#30363c] leading-relaxed mb-6">
                The API is the best way to access data on the OpenAQ platform for programmatic users.
                Our REST API allows users to query our database programmatically. You can create an account
                and learn more about how to use the API at{' '}
                <a
                  href="https://docs.openaq.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#33a3a1] hover:text-[#1e64ab] font-bold underline decoration-2 underline-offset-2"
                >
                  docs.openaq.org
                </a>
                .
              </p>
              <a
                href="https://docs.openaq.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#33a3a1] text-white px-6 py-3 rounded-full font-bold text-base hover:bg-[#1e64ab] transition-all duration-200 shadow-md hover:shadow-lg"
              >
                View API Documentation
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>

            {/* OpenAQ Explorer */}
            <div className="bg-white rounded-[22px] border border-[#d4d8dd] p-8 sm:p-10 shadow-md hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-3xl font-bold text-[#1e64ab] mb-4">OpenAQ Explorer</h3>
              <p className="text-lg text-[#30363c] leading-relaxed mb-6">
                OpenAQ Explorer is an interactive web application that allows users to explore the OpenAQ
                database without writing any code. You can access the Explorer at{' '}
                <a
                  href="https://explore.openaq.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#33a3a1] hover:text-[#1e64ab] font-bold underline decoration-2 underline-offset-2"
                >
                  explore.openaq.org
                </a>
                .
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/explore"
                  className="inline-flex items-center gap-2 bg-[#33a3a1] text-white px-6 py-3 rounded-full font-bold text-base hover:bg-[#1e64ab] transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Launch Explorer
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <a
                  href="https://explore.openaq.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#e6f8f8] text-[#30363c] px-6 py-3 rounded-full font-bold text-base hover:bg-[#b0e8e6] transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Official Explorer
                  <ArrowRight className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t-2 border-dashed border-[#d4d8dd] my-16"></div>

        {/* Community Section */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-[#1e64ab] mb-6">Get involved</h2>
          <p className="text-lg text-[#30363c] leading-relaxed mb-8">
            OpenAQ is built by a global community of developers, researchers, and air quality advocates.
            Join us in making air quality data more accessible to everyone.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://github.com/openaq"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full font-bold text-base hover:bg-gray-800 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Github className="h-5 w-5" />
              GitHub
              <ArrowRight className="h-5 w-5" />
            </a>
            <a
              href="https://join.slack.com/t/openaq/shared_invite/zt-yzqlgsva-v6McumTjy2BZT~7~_~XApQ"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#e6f8f8] text-[#30363c] px-6 py-3 rounded-full font-bold text-base hover:bg-[#b0e8e6] transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <MessageCircle className="h-5 w-5" />
              Join our Slack
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
