'use client'

export default function AQIHubSection() {
  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-white">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="order-2 md:order-1">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-gray-900">Air Quality Index Hub</h2>
          <p className="text-base md:text-lg text-gray-600 mb-8 leading-relaxed">
            Visit the OpenAQ AQI Hub to learn about the methodologies different countries use to build their most important air quality communications tool.
          </p>
          <a
            href="https://aqihub.info"
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-[#198cff] text-white rounded-lg font-semibold transition-all text-base md:text-lg hover:bg-[#1577d6] shadow-md hover:shadow-lg group"
          >
            Visit the AQI Hub
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>

        <div className="order-1 md:order-2 relative h-80 md:h-96 rounded-2xl overflow-hidden flex items-center justify-center shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
          {/* Globe visualization */}
          <div className="relative z-10 text-center">
            <div className="text-7xl md:text-8xl mb-4 md:mb-6 animate-pulse">🌍</div>
            <p className="text-xl md:text-2xl font-bold mb-2 text-gray-900">AQI Hub</p>
            <p className="text-gray-600 text-sm">Global air quality standards</p>
          </div>

          {/* Decorative circles */}
          <div className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-[#7867eb] opacity-40"></div>
          <div className="absolute bottom-1/4 right-1/4 w-4 h-4 rounded-full bg-[#198cff] opacity-40"></div>
          <div className="absolute top-1/3 right-1/3 w-3 h-3 rounded-full bg-green-400 opacity-40"></div>
        </div>
      </div>
    </section>
  )
}
