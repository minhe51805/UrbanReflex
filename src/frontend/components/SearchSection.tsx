'use client'

export default function SearchSection() {
  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="order-2 md:order-1 relative h-80 md:h-96 rounded-2xl overflow-hidden shadow-lg">
          {/* Map placeholder with better styling */}
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center relative">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#198cff] rounded-full"></div>
              <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-[#7867eb] rounded-full"></div>
              <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-[#198cff] rounded-full"></div>
              <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-[#7867eb] rounded-full"></div>
            </div>
            <div className="text-center z-10">
              <svg className="w-20 h-20 md:w-28 md:h-28 mx-auto mb-4 md:mb-6 text-[#198cff] opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.553-.894L9 7.382v12.618zM9 20l13-6.618V3.618L15 10M9 20v-8m6-7l5-2.5"
                />
              </svg>
              <p className="text-xl md:text-2xl font-bold mb-2 text-gray-900">Nairobi, Kenya</p>
              <p className="text-gray-600 text-sm">Interactive air quality map</p>
            </div>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-gray-900">Search for local data</h2>
          <p className="text-base md:text-lg text-gray-600 mb-8 leading-relaxed">
            Hundreds of people use OpenAQ every day. Our interactive map makes it easy to explore and understand global air quality data.
          </p>

          {/* Search input */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search for air quality data"
              className="w-full px-4 md:px-6 py-3 md:py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#198cff] shadow-sm border border-gray-200 text-base md:text-lg"
            />
          </div>

          <a
            href="https://explore.openaq.org"
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-[#198cff] text-white rounded-lg font-semibold transition-all text-base md:text-lg hover:bg-[#1577d6] shadow-md hover:shadow-lg group"
          >
            Explore the data
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
