// app/vehicles/[slug]/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import JsonLd from '@/components/JsonLd';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    let response = await fetch(`${API_URL}/homepage/vehicles/slug/${slug}`, {
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      response = await fetch(`${API_URL}/homepage/vehicles/${slug}`, {
        next: { revalidate: 3600 }
      });
    }

    if (!response.ok) {
      return {
        title: 'Vehicle Not Found',
        description: 'The requested vehicle could not be found',
      };
    }

    const data = await response.json();
    const vehicle = data.data;

    if (!vehicle) {
      return {
        title: 'Vehicle Not Found',
        description: 'The requested vehicle could not be found',
      };
    }

    return {
      title: `${vehicle.name} - SEO Dashboard`,
      description: vehicle.description || `${vehicle.name} with ${vehicle.seatingCapacity} seats`,
      openGraph: {
        title: vehicle.name,
        description: vehicle.description || `${vehicle.name} with ${vehicle.seatingCapacity} seats`,
        images: vehicle.image ? [{ url: vehicle.image }] : [],
        type: 'website',
      },
    };
  } catch (error) {
    console.error('Generate metadata error:', error);
    return {
      title: 'Vehicle',
      description: 'View vehicle details',
    };
  }
}

export default async function VehicleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    let response = await fetch(`${API_URL}/homepage/vehicles/slug/${slug}`, {
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      response = await fetch(`${API_URL}/homepage/vehicles/${slug}`, {
        next: { revalidate: 3600 }
      });
    }

    if (!response.ok) {
      notFound();
    }

    const data = await response.json();
    const vehicle = data.data;

    if (!vehicle) {
      notFound();
    }

    const vehicleSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": vehicle.name,
      "description": vehicle.description || `${vehicle.name} with ${vehicle.seatingCapacity} seats`,
      "image": vehicle.image,
      "offers": {
        "@type": "Offer",
        "availability": "https://schema.org/InStock",
      },
    };

    return (
      <>
        <JsonLd data={vehicleSchema} />
        
        <div className="min-h-screen bg-gray-50">
          {/* Hero Banner - Responsive */}
          <div className="relative h-48 sm:h-56 md:h-64 lg:h-80 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700">
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            <div className="relative h-full flex items-center justify-center px-4 text-center">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg">
                  {vehicle.name}
                </h1>
                <p className="mt-1 sm:mt-2 text-blue-100 text-sm sm:text-base">View vehicle details and features</p>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 max-w-6xl">
            {/* Breadcrumb - Responsive */}
            <nav className="text-xs sm:text-sm mb-4 sm:mb-6 bg-white rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 shadow-sm border border-gray-100 overflow-x-auto">
              <ol className="flex items-center space-x-1 sm:space-x-2 whitespace-nowrap">
                <li><Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">Home</Link></li>
                <li className="text-gray-400">/</li>
                <li><Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">Vehicles</Link></li>
                <li className="text-gray-400">/</li>
                <li className="text-gray-700 font-medium truncate max-w-[120px] sm:max-w-[200px] md:max-w-none">
                  {vehicle.name}
                </li>
              </ol>
            </nav>

            {/* Vehicle Detail - Responsive */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="grid md:grid-cols-2 gap-6 sm:gap-8 p-4 sm:p-6 md:p-8">
                {/* Image - Responsive */}
                <div className="relative h-64 sm:h-80 md:h-[400px] lg:h-[450px] rounded-xl overflow-hidden bg-gray-100">
                  {vehicle.image ? (
                    <img
                      src={vehicle.image}
                      alt={vehicle.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <div className="text-center p-4">
                        <svg className="h-12 sm:h-16 w-12 sm:w-16 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm">No Image Available</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Details - Responsive */}
                <div className="space-y-4 sm:space-y-5 md:space-y-6">
                  <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                      {vehicle.name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 sm:mt-3">
                      <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                        <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {vehicle.seatingCapacity} Seats
                      </span>
                      <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                        <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Available
                      </span>
                    </div>
                  </div>

                  {vehicle.description && (
                    <div>
                      <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-1.5">Description</h2>
                      <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                        {vehicle.description}
                      </p>
                    </div>
                  )}

                  {vehicle.features && (
                    <div>
                      <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-1.5">Features</h2>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {vehicle.features.split(',').map((feature: string, index: number) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-700 px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm"
                          >
                            {feature.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Share Section - Responsive */}
                  <div className="pt-3 sm:pt-4 border-t border-gray-200">
                    <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">Share this vehicle:</p>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${vehicle.name}`)}&url=${encodeURIComponent(`https://yourdomain.com/vehicles/${vehicle.slug || vehicle._id}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm font-medium"
                      >
                        🐦 Twitter
                      </a>
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://yourdomain.com/vehicles/${vehicle.slug || vehicle._id}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#1877F2] hover:bg-[#1666d9] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm font-medium"
                      >
                        📘 Facebook
                      </a>
                      <Link
                        href="/"
                        className="ml-auto text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                      >
                        ← Back
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Vehicles (Optional) */}
            <div className="mt-6 sm:mt-8">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Browse All Vehicles
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error('❌ Vehicle detail error:', error);
    notFound();
  }
}