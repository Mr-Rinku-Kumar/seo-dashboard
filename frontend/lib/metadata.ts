// app/lib/metadata.ts
import { Metadata } from 'next';

export interface SEOData {
  metaTitle?: string;
  metaDescription?: string;
  focusKeywords?: string;
  canonicalURL?: string;
  robotsIndex?: 'index' | 'noindex';
  robotsFollow?: 'follow' | 'nofollow';
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function generateSEOMetadata(): Promise<Metadata> {
  // ✅ Fallback metadata
  const fallbackMetadata: Metadata = {
    title: 'SEO Dashboard',
    description: 'Manage your website SEO and content',
    robots: {
      index: true,
      follow: true,
    },
  };

  try {
    // ✅ Disable caching for metadata too
    const response = await fetch(`${API_URL}/seo/public`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });

    if (!response.ok) {
      console.warn('SEO API returned error, using fallback metadata');
      return fallbackMetadata;
    }

    const result = await response.json();
    const seo: SEOData = result.data || {};

    const metadata: Metadata = {
      title: seo.metaTitle || 'SEO Dashboard',
      description: seo.metaDescription || 'Manage your website SEO and content',
      robots: {
        index: seo.robotsIndex === 'index',
        follow: seo.robotsFollow === 'follow',
      },
    };

    if (seo.focusKeywords) {
      metadata.keywords = seo.focusKeywords.split(',').map(k => k.trim());
    }

    if (seo.canonicalURL) {
      metadata.alternates = {
        canonical: seo.canonicalURL,
      };
    }

    if (seo.ogTitle || seo.ogDescription || seo.ogImage) {
      metadata.openGraph = {
        title: seo.ogTitle || seo.metaTitle || 'SEO Dashboard',
        description: seo.ogDescription || seo.metaDescription || 'Manage your website SEO and content',
        images: seo.ogImage ? [{ url: seo.ogImage }] : [],
        type: 'website',
        url: seo.canonicalURL || '/',
      };
    }

    if (seo.twitterTitle || seo.twitterDescription || seo.twitterImage) {
      metadata.twitter = {
        card: 'summary_large_image',
        title: seo.twitterTitle || seo.metaTitle || 'SEO Dashboard',
        description: seo.twitterDescription || seo.metaDescription || 'Manage your website SEO and content',
        images: seo.twitterImage ? [seo.twitterImage] : [],
      };
    }

    return metadata;
  } catch (error) {
    console.warn('Error generating SEO metadata, using fallback:', error);
    return fallbackMetadata;
  }
}