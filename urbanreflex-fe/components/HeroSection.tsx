'use client'

export default function HeroSection() {
  return (
    <section className="pt-24 md:pt-32 pb-16 md:pb-24 px-4 md:px-6 lg:px-12 bg-white">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid md:grid-cols-[1fr_1.2fr] gap-8 lg:gap-16 items-start">
          <div className="hero-title pt-8 md:pt-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 leading-tight text-gray-900">
              Fighting air inequality through
              <br />
              <span className="text-[#7867eb]">open data.</span>
            </h1>
            <p className="text-sm md:text-base lg:text-lg text-gray-600 mb-8 leading-relaxed">
              OpenAQ is a nonprofit organization providing universal access to air quality data to empower a global community of changemakers to solve air inequality—the unequal access to clean air.
            </p>
            <a
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#198cff] text-white rounded-lg font-semibold transition-all text-sm md:text-base hover:bg-[#1577d6] shadow-md hover:shadow-lg"
            >
              Learn More
            </a>
          </div>

          <div className="hero-image-container relative">
            {/* Decorative bubbles */}
            <div className="bubble-lg"></div>
            <div className="bubble-md"></div>
            <div className="bubble-sm"></div>

            {/* Main hero image placeholder */}
            <div className="hero-main-image">
              <div className="text-center p-8">
                <div className="text-7xl font-bold mb-2" style={{ color: '#7867eb' }}>58</div>
                <div className="text-sm text-gray-600 font-semibold">McMillan Reservoir</div>
                <div className="text-xs text-gray-500 mt-1">Washington DC, US</div>
              </div>
            </div>

            {/* Active marker */}
            <div className="active-marker">
              <span>58</span>
            </div>

            {/* Detail card */}
            <div className="detail-card">
          <header className="detail-card__header">
            <h2 className="detail-card__title">McMillan Reservoir</h2>
          </header>

          <section className="detail-card-section">
            <div>
              <span className="text-sm font-semibold">Washington DC, </span>
              <span className="text-xs text-gray-500">US</span>
            </div>
          </section>

          <section className="detail-card-section detail-card-section-grid">
            <span className="type-subtitle-3 text-gray-600">Type</span>
            <span className="text-sm">Monitor</span>
            <span className="type-subtitle-3 text-gray-600">Measures</span>
            <span className="text-xs">PM2.5 (µg/m³), PM10 (µg/m³), SO₂ (ppb), O₃ (ppb), CO (ppb), BC (µg/m³), NO₂ (ppb)</span>
          </section>

          <section className="detail-card-section detail-card-section-grid">
            <span className="type-subtitle-3 text-gray-600">Provider:</span>
            <span className="text-sm">US EPA AirNow</span>
            <span className="type-subtitle-3 text-gray-600">Reporting:</span>
            <span className="text-sm">Updated 3 hours ago</span>
            <span></span>
            <span className="text-xs text-gray-400">Since 26/04/2016</span>
          </section>

          <section className="detail-card-section">
            <div className="mb-3">
              <span className="type-subtitle-3 text-gray-600">Latest readings</span>
              <span className="text-xs text-gray-400 ml-2">13:22 (local time)</span>
            </div>
            <div className="latest-readings-grid">
              <span className="type-subtitle-3 text-gray-600">PM2.5</span>
              <div>
                <span className="text-lg font-bold" style={{ color: '#7867eb' }}>7</span>
                <span className="text-sm"> µg/m³</span>
              </div>
              <div className="reading-chart">
                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="20" viewBox="0 0 21.2 5.3">
                  <path fill="none" stroke="#7867eb" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.8" d="m1 1 1 1 1 1 1-1 1-1 2 1h1l1 2 1-2 2 1 1-1 1 1 2 1h2l1-1h1" />
                </svg>
              </div>

              <span className="type-subtitle-3 text-gray-600">PM10</span>
              <div>
                <span className="text-lg font-bold" style={{ color: '#7867eb' }}>24</span>
                <span className="text-sm"> µg/m³</span>
              </div>
              <div className="reading-chart">
                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="20" viewBox="0 0 21.2 5.3">
                  <path fill="none" stroke="#7867eb" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".8" d="M1 2h3l1-1 2 1h1l1 1 1-1 2 1h2l2 1 1-1 1 1 1-1 1-1" />
                </svg>
              </div>

              <span className="type-subtitle-3 text-gray-600">O₃</span>
              <div>
                <span className="text-lg font-bold" style={{ color: '#7867eb' }}>22</span>
                <span className="text-sm"> ppb</span>
              </div>
              <div className="reading-chart">
                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="20" viewBox="0 0 21.2 5.3">
                  <path fill="none" stroke="#7867eb" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".8" d="m1 1 1 1 1 1 1-1 1-1 2 1h1l1 2 1-2 2 1 1-1 1 1 2 1h2l1-1h1" />
                </svg>
              </div>
            </div>
          </section>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero-image-container {
          position: relative;
          width: 100%;
          min-height: 550px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 2rem;
        }

        .bubble-lg {
          position: absolute;
          width: 350px;
          height: 350px;
          background: linear-gradient(135deg, rgba(120, 103, 235, 0.12), rgba(25, 140, 255, 0.08));
          border-radius: 50%;
          filter: blur(50px);
          top: 0;
          right: -50px;
          animation: float 8s ease-in-out infinite;
        }

        .bubble-md {
          position: absolute;
          width: 220px;
          height: 220px;
          background: linear-gradient(135deg, rgba(25, 140, 255, 0.12), rgba(120, 103, 235, 0.08));
          border-radius: 50%;
          filter: blur(35px);
          bottom: 80px;
          right: 100px;
          animation: float 6s ease-in-out infinite 1s;
        }

        .bubble-sm {
          position: absolute;
          width: 160px;
          height: 160px;
          background: rgba(120, 103, 235, 0.1);
          border-radius: 50%;
          filter: blur(25px);
          bottom: 120px;
          left: 0;
          animation: float 7s ease-in-out infinite 2s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .hero-main-image {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 420px;
          height: 380px;
          background: linear-gradient(135deg, #e8eeff 0%, #f5f0ff 100%);
          border-radius: 16px;
          box-shadow: 0 15px 50px rgba(0, 0, 0, 0.06);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .active-marker {
          position: absolute;
          top: 15%;
          right: 25%;
          z-index: 15;
          background: #7867eb;
          color: white;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
          font-weight: bold;
          box-shadow: 0 4px 16px rgba(120, 103, 235, 0.35);
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 4px 20px rgba(120, 103, 235, 0.4);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 6px 30px rgba(120, 103, 235, 0.6);
          }
        }

        .detail-card {
          position: absolute;
          bottom: -30px;
          left: -60px;
          z-index: 20;
          background: white;
          border-radius: 10px;
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1);
          padding: 1.2rem;
          max-width: 360px;
          animation: slideIn 0.8s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .detail-card__header {
          margin-bottom: 0.875rem;
          padding-bottom: 0.625rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .detail-card__title {
          font-size: 1.05rem;
          font-weight: 700;
          color: #1f2937;
        }

        .detail-card-section {
          padding: 0.625rem 0;
          border-bottom: 1px solid #f3f4f6;
        }

        .detail-card-section:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .detail-card-section-grid {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 0.5rem 1rem;
          align-items: start;
        }

        .latest-readings-grid {
          display: grid;
          grid-template-columns: auto auto 1fr;
          gap: 0.75rem;
          align-items: center;
        }

        .reading-chart {
          display: flex;
          align-items: center;
        }

        @media (max-width: 768px) {
          .hero-image-container {
            min-height: 450px;
            justify-content: center;
            padding-top: 1rem;
          }

          .hero-main-image {
            max-width: 320px;
            height: 320px;
          }

          .detail-card {
            left: 5%;
            bottom: 10px;
            max-width: 90%;
            padding: 1rem;
          }

          .active-marker {
            width: 48px;
            height: 48px;
            font-size: 1.2rem;
          }

          .bubble-lg,
          .bubble-md,
          .bubble-sm {
            opacity: 0.6;
          }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
          .hero-image-container {
            min-height: 500px;
          }

          .hero-main-image {
            max-width: 360px;
            height: 360px;
          }

          .detail-card {
            left: -40px;
            max-width: 320px;
          }
        }
      `}</style>
    </section>
  )
}
 
