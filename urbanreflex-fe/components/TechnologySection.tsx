'use client'

export default function TechnologySection() {
  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
        <div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-gray-900">One-stop data source</h2>
          <p className="text-base md:text-lg text-gray-600 mb-8 leading-relaxed">
            OpenAQ aggregates data from hundreds of sources worldwide, harmonizing and sharing them on our centralized, trusted, open-source data platform.
          </p>
          <a
            href="/developers/platform-overview"
            className="inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-[#198cff] text-white rounded-lg font-semibold transition-all text-base md:text-lg hover:bg-[#1577d6] shadow-md hover:shadow-lg group"
          >
            Learn how OpenAQ works
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>

        <div className="relative h-96 bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm">
          {/* Data pipeline diagram */}
          <div className="flex flex-col justify-between h-full">
            <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl md:text-2xl bg-[#198cff]">
                📊
              </div>
              <div>
                <p className="font-semibold text-base md:text-lg text-gray-900">Data Sources</p>
                <p className="text-xs md:text-sm text-gray-500">Hundreds worldwide</p>
              </div>
            </div>

            <div className="flex justify-center my-3">
              <svg className="w-8 h-8 md:w-10 md:h-10 text-[#198cff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl md:text-2xl bg-[#7867eb]">
                ⚙️
              </div>
              <div>
                <p className="font-semibold text-base md:text-lg text-gray-900">Processing</p>
                <p className="text-xs md:text-sm text-gray-500">Harmonization & aggregation</p>
              </div>
            </div>

            <div className="flex justify-center my-3">
              <svg className="w-8 h-8 md:w-10 md:h-10 text-[#7867eb]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl md:text-2xl bg-green-500">
                📈
              </div>
              <div>
                <p className="font-semibold text-base md:text-lg text-gray-900">API & Platform</p>
                <p className="text-xs md:text-sm text-gray-500">Open access to all</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
