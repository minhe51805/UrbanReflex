'use client'

import Image from 'next/image'

export default function UseCasesSection() {
  const useCases = [
    {
      title: 'Air Pollution Research',
      description:
        'Access to key open data sets (emission sources, air pollution levels, meteorological/atmospheric conditions, etc.) are fundamental to air pollution research. OpenAQ serves as one of these important data sets, used by many scientific researchers to, for example, evaluate and verify air pollution...',
      imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80',
      imageAlt: 'Researcher analyzing air quality data',
      icon: '🔬',
      tags: ['API'],
    },
    {
      title: 'Data for Communities',
      description:
        'Through OpenAQ\'s data platform, Clean Air One Atmosphere is able to provide data access to community members in Ghana and Malawi, helping them learn what they are breathing first-hand and become more environmentally aware. The Problem: Air pollution in Africa is a major yet often overlooked public...',
      imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
      imageAlt: 'Community members checking air quality',
      icon: '🌍',
      tags: ['Community'],
    },
    {
      title: 'Validating Satellite Data',
      description:
        'Satellites orbiting Earth are able to fill air quality data gaps in regions with little or no ground-level monitoring by applying mathematical models to the atmospheric data that they collect. However, satellite-based observations have limitations and challenges. Ground measurements are needed to...',
      imageUrl: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&q=80',
      imageAlt: 'Satellite monitoring Earth',
      icon: '🛰️',
      tags: ['API'],
    },
  ]

  return (
    <section className="py-16 md:py-20 px-4 md:px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100"
            >
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
                <Image
                  src={useCase.imageUrl}
                  alt={useCase.imageAlt}
                  fill
                  className="object-cover opacity-90"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-purple-900/30"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl drop-shadow-lg">{useCase.icon}</div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg md:text-xl font-bold mb-3 text-gray-900">{useCase.title}</h3>
                <p className="text-gray-600 text-sm mb-5 leading-relaxed line-clamp-4">{useCase.description}</p>
                <a href="#" className="inline-flex items-center font-semibold text-sm group text-[#7867eb] hover:text-[#6554d4] transition-colors">
                  Read more about {useCase.title}
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 48 48">
                    <path d="m18.75 36-2.15-2.15 9.9-9.9-9.9-9.9 2.15-2.15L30.8 23.95Z" />
                  </svg>
                </a>
                <div className="mt-5 flex gap-2 flex-wrap">
                  {useCase.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-xs rounded-full font-semibold bg-gray-100 text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  )
}
