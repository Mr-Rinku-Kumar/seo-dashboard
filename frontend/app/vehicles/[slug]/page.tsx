// app/vehicles/[slug]/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import JsonLd from '@/components/JsonLd';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    let response = await fetch(
      `${API_URL}/homepage/vehicles/slug/${slug}`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      response = await fetch(
        `${API_URL}/homepage/vehicles/${slug}`,
        { next: { revalidate: 3600 } }
      );
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
    let response = await fetch(
      `${API_URL}/homepage/vehicles/slug/${slug}`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      response = await fetch(
        `${API_URL}/homepage/vehicles/${slug}`,
        { next: { revalidate: 3600 } }
      );
    }

    if (!response.ok) {
      notFound();
    }

    const data = await response.json();
    const vehicle = data.data;

    if (!vehicle) {
      notFound();
    }

    // JSON-LD Schema for SEO
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
          {/* Hero Banner */}
          <div className="relative h-64 md:h-80 bg-gradient-to-r from-blue-600 to-indigo-700">
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="relative h-full flex items-center justify-center px-4">
              <div className="text-center text-white">
                <h1 className="text-3xl md:text-5xl font-bold">{vehicle.name}</h1>
                <p className="mt-2 text-blue-100">View vehicle details and features</p>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* Breadcrumb */}
            <nav className="text-sm mb-6 bg-white rounded-xl px-4 py-3 shadow-sm">
              <ol className="flex items-center space-x-2 flex-wrap">
                <li><Link href="/" className="text-blue-600 hover:text-blue-700">Home</Link></li>
                <li className="text-gray-400">/</li>
                <li><Link href="/" className="text-blue-600 hover:text-blue-700">Vehicles</Link></li>
                <li className="text-gray-400">/</li>
                <li className="text-gray-700 font-medium truncate">{vehicle.name}</li>
              </ol>
            </nav>

            {/* Vehicle Detail */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="grid md:grid-cols-2 gap-8 p-6 md:p-8">
                {/* Image */}
                <div className="relative h-80 md:h-full min-h-[400px] rounded-xl overflow-hidden bg-gray-100">
                  {vehicle.image ? (
                    <img
                      src={vehicle.image}
                      alt={vehicle.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <svg className="h-16 w-16 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p>No Image Available</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{vehicle.name}</h1>
                    <div className="flex items-center gap-3 mt-3 flex-wrap">
                      <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {vehicle.seatingCapacity} Seats
                      </span>
                      <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Available
                      </span>
                    </div>
                  </div>

                  {vehicle.description && (
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                      <p className="text-gray-600 leading-relaxed">{vehicle.description}</p>
                    </div>
                  )}

                  {vehicle.features && (
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-2">Features</h2>
                      <div className="flex flex-wrap gap-2">
                        {vehicle.features.split(',').map((feature: string, index: number) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                          >
                            {feature.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Share Section */}
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-3">Share this vehicle:</p>
                    <div className="flex gap-3 flex-wrap">
                      <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${vehicle.name}`)}&url=${encodeURIComponent(`https://yourdomain.com/vehicles/${vehicle.slug || vehicle._id}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                      >
                        🐦 Twitter
                      </a>
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://yourdomain.com/vehicles/${vehicle.slug || vehicle._id}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#1877F2] hover:bg-[#1666d9] text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                      >
                        📘 Facebook
                      </a>
                      <Link
                        href="/"
                        className="ml-auto text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                      >
                        ← Back
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
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