'use client'

export default function APISection() {
  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="relative h-80 md:h-96 bg-gray-900 rounded-2xl overflow-hidden p-6 md:p-8 shadow-lg">
          {/* Code snippet */}
          <div className="font-mono text-xs md:text-sm space-y-2 md:space-y-3">
            <p className="text-green-400"># Example: OpenAQ R package</p>
            <p className="text-blue-300">library<span className="text-gray-400">(openaq)</span></p>
            <p className="mt-3 md:mt-4 text-green-300">
              aq <span className="text-white">&lt;-</span> aq_measurements<span className="text-gray-400">(</span>
            </p>
            <p className="text-gray-300 ml-4">
              country <span className="text-white">=</span> <span className="text-yellow-300">&quot;US&quot;</span>,
            </p>
            <p className="text-gray-300 ml-4">
              parameter <span className="text-white">=</span> <span className="text-yellow-300">&quot;pm25&quot;</span>
            </p>
            <p className="text-gray-400">)</p>
            <p className="mt-3 md:mt-4 text-blue-300">head<span className="text-gray-400">(aq)</span></p>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="absolute top-4 right-10 w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="absolute top-4 right-16 w-3 h-3 bg-green-500 rounded-full"></div>
        </div>

        <div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-gray-900">Direct API access</h2>
          <p className="text-base md:text-lg text-gray-600 mb-8 leading-relaxed">
            Our open API allows applications to connect directly to OpenAQ data. One air quality API provides access to hundreds of sources.
          </p>
          <a
            href="https://docs.openaq.org"
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-[#198cff] text-white rounded-lg font-semibold transition-all text-base md:text-lg hover:bg-[#1577d6] shadow-md hover:shadow-lg group"
          >
            Learn about OpenAQ API
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
