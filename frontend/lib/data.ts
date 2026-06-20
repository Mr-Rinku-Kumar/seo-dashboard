// app/lib/data.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ✅ Helper function with NO CACHE
async function fetchWithNoCache(url: string) {
  const response = await fetch(url, {
    cache: 'no-store', // ✅ Disable caching completely
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });

  if (!response.ok) {
    console.warn(`Failed to fetch ${url}:`, response.status);
    return { data: null };
  }

  return response.json();
}

export async function fetchHero() {
  return fetchWithNoCache(`${API_URL}/homepage/hero/public`);
}

export async function fetchAbout() {
  return fetchWithNoCache(`${API_URL}/homepage/about/public`);
}

export async function fetchVehicles() {
  return fetchWithNoCache(`${API_URL}/homepage/vehicles/public`);
}

export async function fetchOccasions() {
  return fetchWithNoCache(`${API_URL}/homepage/occasions/public`);
}

export async function fetchTestimonials() {
  return fetchWithNoCache(`${API_URL}/homepage/testimonials/public`);
}

export async function fetchGallery() {
  return fetchWithNoCache(`${API_URL}/homepage/gallery/public`);
}

export async function fetchContact() {
  return fetchWithNoCache(`${API_URL}/homepage/contact/public`);
}

export async function fetchSchemas() {
  return fetchWithNoCache(`${API_URL}/schemas/public`);
}