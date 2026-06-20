// app/page.tsx
import { generateSEOMetadata } from '@/lib/metadata';
import JsonLd from '@/components/JsonLd';
import {
  fetchHero,
  fetchAbout,
  fetchVehicles,
  fetchOccasions,
  fetchTestimonials,
  fetchGallery,
  fetchContact,
  fetchSchemas,
} from '@/lib/data';
import Link from 'next/link';

export async function generateMetadata() {
  return generateSEOMetadata();
}

export default async function HomePage() {
  const [
    heroData,
    aboutData,
    vehiclesData,
    occasionsData,
    testimonialsData,
    galleryData,
    contactData,
    schemasData,
  ] = await Promise.all([
    fetchHero(),
    fetchAbout(),
    fetchVehicles(),
    fetchOccasions(),
    fetchTestimonials(),
    fetchGallery(),
    fetchContact(),
    fetchSchemas(),
  ]);

  const hero = heroData.data || {};
  const about = aboutData.data || {};
  const vehicles = vehiclesData.data || [];
  const occasions = occasionsData.data || [];
  const testimonials = testimonialsData.data || [];
  const gallery = galleryData.data || [];
  const contact = contactData.data || {};
  const schemas = schemasData.data || [];

  return (
    <>
      {schemas.map((schema: any, index: number) => (
        <JsonLd key={index} data={schema.data} />
      ))}

      <main className="min-h-screen bg-white">
        {/* ========== HERO SECTION ========== */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            {hero.bannerImage ? (
              <img
                src={hero.bannerImage}
                alt="Hero background"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800"></div>
            )}
            <div className="absolute inset-0 bg-black/40"></div>
          </div>

          <div className="container-custom relative z-10 text-center text-white px-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight tracking-tight">
              {hero.mainHeading || 'Welcome to Our Website'}
            </h1>
            {hero.subHeading && (
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-200/90 max-w-3xl mx-auto mb-6 md:mb-8 font-light">
                {hero.subHeading}
              </p>
            )}
            {hero.ctaText && hero.ctaURL && (
              <a
                href={hero.ctaURL}
                className="inline-block bg-white text-blue-600 px-8 md:px-10 py-3 md:py-3.5 rounded-full font-semibold text-base md:text-lg hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                {hero.ctaText}
              </a>
            )}
          </div>
        </section>

        {/* ========== ABOUT SECTION ========== */}
        {about.title && (
          <section className="py-16 md:py-20 bg-gray-50/80">
            <div className="container-custom">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10 md:mb-12">
                  <span className="text-blue-600 font-semibold text-xs uppercase tracking-widest">About Us</span>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mt-2">
                    {about.title}
                  </h2>
                  <div className="w-16 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mt-4 rounded-full"></div>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                  {about.image && (
                    <div className="md:w-1/2 w-full">
                      <div className="relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
                        <img
                          src={about.image}
                          alt={about.title}
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    </div>
                  )}
                  <div className={about.image ? 'md:w-1/2 w-full' : 'w-full'}>
                    <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                      {about.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ========== VEHICLES SECTION ========== */}
        {vehicles.length > 0 && (
          <section className="py-16 md:py-20">
            <div className="container-custom">
              <div className="text-center mb-10 md:mb-12">
                <span className="text-blue-600 font-semibold text-xs uppercase tracking-widest">Our Fleet</span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mt-2">
                  Our Vehicles
                </h2>
                <p className="text-gray-500 mt-3 max-w-2xl mx-auto text-sm md:text-base">
                  Choose from our wide range of comfortable and luxury vehicles
                </p>
                <div className="w-16 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mt-4 rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {vehicles.map((vehicle: any) => {
                  const slug = vehicle.slug || vehicle._id || vehicle.name?.toLowerCase().replace(/\s+/g, '-');
                  return (
                    <Link
                      key={vehicle._id}
                      href={`/vehicles/${slug}`}
                      className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100/80 hover:border-blue-200/60"
                    >
                      <div className="relative h-56 overflow-hidden bg-gray-100">
                        <img
                          src={vehicle.image}
                          alt={vehicle.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                          {vehicle.seatingCapacity} Seats
                        </div>
                      </div>
                      <div className="p-5 md:p-6">
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1.5 group-hover:text-blue-600 transition-colors">
                          {vehicle.name}
                        </h3>
                        {vehicle.description && (
                          <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                            {vehicle.description}
                          </p>
                        )}
                        {vehicle.features && (
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {vehicle.features.split(',').slice(0, 3).map((feature: string, idx: number) => (
                              <span key={idx} className="bg-gray-100/80 text-gray-600 text-xs px-2.5 py-1 rounded-full">
                                {feature.trim()}
                              </span>
                            ))}
                            {vehicle.features.split(',').length > 3 && (
                              <span className="bg-gray-100/80 text-gray-600 text-xs px-2.5 py-1 rounded-full">
                                +{vehicle.features.split(',').length - 3}
                              </span>
                            )}
                          </div>
                        )}
                        <span className="inline-flex items-center text-blue-600 font-semibold text-sm group-hover:text-blue-700 transition-colors">
                          View Details
                          <svg className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ========== OCCASIONS SECTION ========== */}
        {occasions.length > 0 && (
          <section className="py-16 md:py-20 bg-gray-50/80">
            <div className="container-custom">
              <div className="text-center mb-10 md:mb-12">
                <span className="text-blue-600 font-semibold text-xs uppercase tracking-widest">Services</span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mt-2">
                  Our Services
                </h2>
                <p className="text-gray-500 mt-3 max-w-2xl mx-auto text-sm md:text-base">
                  We provide transportation for all your special occasions
                </p>
                <div className="w-16 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mt-4 rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {occasions.map((occasion: any) => (
                  <div
                    key={occasion._id}
                    className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100/80 hover:-translate-y-1"
                  >
                    {occasion.image && (
                      <div className="relative h-48 overflow-hidden bg-gray-100">
                        <img
                          src={occasion.image}
                          alt={occasion.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-5 md:p-6">
                      <div className="w-11 h-11 bg-blue-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1.5">
                        {occasion.title}
                      </h3>
                      {occasion.description && (
                        <p className="text-gray-500 text-sm">{occasion.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ========== TESTIMONIALS SECTION ========== */}
        {testimonials.length > 0 && (
          <section className="py-16 md:py-20">
            <div className="container-custom">
              <div className="text-center mb-10 md:mb-12">
                <span className="text-blue-600 font-semibold text-xs uppercase tracking-widest">Testimonials</span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mt-2">
                  What Our Customers Say
                </h2>
                <p className="text-gray-500 mt-3 max-w-2xl mx-auto text-sm md:text-base">
                  Real reviews from our satisfied customers
                </p>
                <div className="w-16 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mt-4 rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {testimonials.map((testimonial: any) => (
                  <div
                    key={testimonial._id}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-5 md:p-6 border border-gray-100/80"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      {testimonial.customerImage && (
                        <img
                          src={testimonial.customerImage}
                          alt={testimonial.customerName}
                          className="w-12 h-12 rounded-full object-cover border-2 border-blue-100"
                        />
                      )}
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm md:text-base">
                          {testimonial.customerName}
                        </h4>
                        <div className="text-yellow-400 text-sm md:text-base">
                          {'⭐'.repeat(testimonial.rating)}
                          {'☆'.repeat(5 - testimonial.rating)}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm md:text-base italic leading-relaxed">
                      "{testimonial.review}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ========== GALLERY SECTION ========== */}
        {gallery.length > 0 && (
          <section className="py-16 md:py-20 bg-gray-50/80">
            <div className="container-custom">
              <div className="text-center mb-10 md:mb-12">
                <span className="text-blue-600 font-semibold text-xs uppercase tracking-widest">Gallery</span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mt-2">
                  Our Gallery
                </h2>
                <p className="text-gray-500 mt-3 max-w-2xl mx-auto text-sm md:text-base">
                  Take a look at our collection of photos
                </p>
                <div className="w-16 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mt-4 rounded-full"></div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {gallery.map((item: any) => (
                  <div
                    key={item._id}
                    className="group relative aspect-square overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
                  >
                    <img
                      src={item.image}
                      alt={item.altText || 'Gallery image'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {item.altText && (
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-3">
                        <p className="text-white text-xs font-medium text-center">{item.altText}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ========== CONTACT SECTION ========== */}
        {(contact.phone || contact.email || contact.address) && (
          <section className="py-16 md:py-20">
            <div className="container-custom">
              <div className="text-center mb-10 md:mb-12">
                <span className="text-blue-600 font-semibold text-xs uppercase tracking-widest">Contact</span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mt-2">
                  Get In Touch
                </h2>
                <p className="text-gray-500 mt-3 max-w-2xl mx-auto text-sm md:text-base">
                  Have questions? We'd love to hear from you
                </p>
                <div className="w-16 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mt-4 rounded-full"></div>
              </div>

              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                  {contact.phone && (
                    <div className="text-center p-5 md:p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100/80">
                      <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-gray-900 text-sm">Phone</h3>
                      <p className="text-gray-500 text-sm mt-1">{contact.phone}</p>
                    </div>
                  )}

                  {contact.email && (
                    <div className="text-center p-5 md:p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100/80">
                      <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-gray-900 text-sm">Email</h3>
                      <p className="text-gray-500 text-sm mt-1 break-all">{contact.email}</p>
                    </div>
                  )}

                  {contact.address && (
                    <div className="text-center p-5 md:p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100/80">
                      <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-gray-900 text-sm">Address</h3>
                      <p className="text-gray-500 text-sm mt-1 whitespace-pre-line">{contact.address}</p>
                    </div>
                  )}
                </div>

                {contact.googleMapEmbed && (
                  <div className="mt-6 md:mt-8 rounded-2xl overflow-hidden shadow-lg">
                    <div
                      dangerouslySetInnerHTML={{ __html: contact.googleMapEmbed }}
                      className="w-full h-56 md:h-80"
                    />
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ========== FOOTER ========== */}
        <footer className="bg-gray-900 text-white py-8 md:py-12">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <h3 className="text-lg md:text-xl font-bold">SEO Dashboard</h3>
                <p className="text-gray-400 text-sm mt-1">Professional Transportation Services</p>
              </div>
              <div className="flex gap-5">
                <a href="#" className="text-gray-500 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-6 pt-6 text-center text-gray-500 text-sm">
              <p>&copy; {new Date().getFullYear()} SEO Dashboard. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}