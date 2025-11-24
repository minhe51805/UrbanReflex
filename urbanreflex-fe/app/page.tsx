/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 13-11-2025
 * Update at: 19-11-2025
 * Description: Homepage component that displays the main landing page with hero section, featured locations, use cases, and interactive map
 */

import HeroSection from '@/components/home/HeroSection';

import FeatureSection from '@/components/home/FeatureSection';
import AQIHubIllustration from '@/components/home/AQIHubIllustration';
import DataSourceIllustration from '@/components/home/DataSourceIllustration';
import CodeExample from '@/components/home/CodeExample';
import MapSection from '@/components/home/MapSection';

export default function Home() {
  return (
    <main>
      {/* 1. Hero Section with Compact Location Card */}
      <HeroSection />



      {/* 3. One-stop data source */}
      <FeatureSection
        title="One-stop data source"
        description="UrbanReflex aggregates data from hundreds of sources worldwide, harmonizing and sharing them on our centralized, trusted, open-source data platform."
        buttonText="Learn how UrbanReflex works"
        buttonHref="/about"
        imageSide="right"
        bgColor="bg-gradient-to-br from-primary-50 to-primary-100"
        illustration={<DataSourceIllustration />}
      />

      {/* 4. Search for local data - with real map (3/4 width map, 1/4 width text) */}
      <FeatureSection
        title="Search for local data"
        description="Hundreds of people use UrbanReflex every day. Our interactive map makes it easy to explore and understand global air quality data."
        buttonText="Explore the data"
        buttonHref="/explore"
        imageSide="left"
        bgColor="bg-gradient-to-br from-accent-50 to-accent-100"
        illustration={<MapSection />}
        customLayout="map-large"
      />

      {/* 5. AQI Hub Section */}
      <FeatureSection
        title="Air Quality Index Hub"
        description="Visit the UrbanReflex AQI Hub to learn about the methodologies different countries use to build their most important air quality communications tool."
        buttonText="Visit the AQI Hub"
        buttonHref="/aqi-hub"
        imageSide="right"
        bgColor="bg-gradient-to-br from-neutral-soft-100 to-neutral-soft-200"
        illustration={<AQIHubIllustration />}
      />

      {/* 6. Direct API access */}
      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <CodeExample />

            <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-8 lg:p-12 text-white shadow-large">
              <h2 className="text-3xl font-bold mb-4">Direct API access</h2>
              <p className="text-lg mb-6 opacity-90">
                Our open API allows applications to connect directly to UrbanReflex data. One air quality API provides access to hundred of sources.
              </p>
              <a
                href="/developers"
                className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-white text-primary-600 font-semibold hover:bg-neutral-soft-50 transition-all duration-200 shadow-medium hover:shadow-large transform hover:scale-105"
              >
                Learn about UrbanReflex API
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
