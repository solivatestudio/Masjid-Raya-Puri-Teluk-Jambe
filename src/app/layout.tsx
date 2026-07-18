import type { Metadata, Viewport } from 'next';
import './globals.css';

const APP_URL = process.env.APP_URL || 'https://masjidrayapuritelukjambe.com';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'Masjid Raya Puri Telukjambe | Portal Resmi DKM Karawang',
    template: '%s | Masjid Raya Puri Telukjambe',
  },
  description:
    'Portal resmi DKM Masjid Raya Puri Telukjambe Karawang. Jadwal kajian rutin, dauroh Al-Quran, khatib Jumat, donasi QRIS, sewa aula serbaguna, konsultasi zakat, ambulans gratis & layanan jamaah siaga 24 jam.',
  keywords: [
    'masjid raya puri telukjambe',
    'masjid karawang',
    'kajian islam karawang',
    'dauroh quran karawang',
    'sewa aula karawang',
    'donasi qris masjid',
    'jadwal khatib jumat',
    'konsultasi zakat',
    'ambulans gratis karawang',
    'DKM masjid raya puri telukjambe',
  ],
  authors: [{ name: 'DKM Masjid Raya Puri Telukjambe' }],
  creator: 'DKM Masjid Raya Puri Telukjambe',
  publisher: 'DKM Masjid Raya Puri Telukjambe',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: APP_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: APP_URL,
    siteName: 'Masjid Raya Puri Telukjambe',
    title: 'Masjid Raya Puri Telukjambe | Portal Resmi DKM Karawang',
    description:
      'Portal resmi DKM Masjid Raya Puri Telukjambe Karawang. Jadwal kajian rutin, dauroh Al-Quran, khatib Jumat, donasi QRIS, sewa aula serbaguna & layanan jamaah.',
    images: [
      {
        url: '/images/logo.svg',
        width: 512,
        height: 512,
        alt: 'Logo Masjid Raya Puri Telukjambe',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Masjid Raya Puri Telukjambe | Portal Resmi DKM Karawang',
    description:
      'Jadwal kajian, dauroh Al-Quran, donasi QRIS, sewa aula & layanan jamaah Masjid Raya Puri Telukjambe Karawang.',
    images: ['/images/logo.svg'],
  },
  icons: {
    icon: '/images/logo.svg',
    apple: '/images/logo.svg',
  },
  manifest: '/manifest.json',
  verification: {
    google: 'yCyfuU0Gx2Lbh8vpYQk2FcvF5Y-v3SgmhMgeZqmd9KQ',
  },
};

export const viewport: Viewport = {
  themeColor: '#064e3b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

const mosqueJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Mosque',
  name: 'Masjid Raya Puri Telukjambe',
  alternateName: 'DKM Masjid Raya Puri Telukjambe',
  description:
    'Portal resmi DKM Masjid Raya Puri Telukjambe Karawang. Menyediakan kajian dakwah, dauroh Al-Quran, donasi QRIS, sewa aula serbaguna, konsultasi zakat, dan layanan jamaah siaga 24 jam.',
  url: APP_URL,
  logo: `${APP_URL}/images/logo.svg`,
  image: `${APP_URL}/images/logo.svg`,
  telephone: '+62895414283161',
  email: 'puritelukjambemasjidraya@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Jl. Telukjambe Timur No. 23',
    addressLocality: 'Karawang',
    addressRegion: 'Jawa Barat',
    postalCode: '41361',
    addressCountry: 'ID',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -6.3665,
    longitude: 107.3157,
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '04:00',
    closes: '22:00',
  },
  sameAs: [
    'https://instagram.com/masjidrayapuritelukjambe',
    'https://web.facebook.com/pages/Aula%20Masjid%20Raya%20Puri%20Teluk%20Jambe%20(PERURI)%20Karawang/732935826736923/',
    'https://www.youtube.com/@masjidrayapuritelukjambe_TV',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Layanan Masjid',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Sewa Aula Serbaguna',
          description: 'Aula serbaguna 25x25m2, kapasitas 200-300 orang, AC, genset, parkir luas',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Ambulans Gratis',
          description: 'Layanan ambulans gratis untuk jamaah dan warga sekitar',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Konsultasi Zakat & Syariah',
          description: 'Konsultasi zakat dan syariah bersama ustadz berpengalaman',
        },
      },
    ],
  },
};

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'DKM Masjid Raya Puri Telukjambe',
  url: APP_URL,
  logo: `${APP_URL}/images/logo.svg`,
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+62895414283161',
    contactType: 'customer service',
    availableLanguage: 'Indonesian',
  },
  sameAs: [
    'https://instagram.com/masjidrayapuritelukjambe',
    'https://web.facebook.com/pages/Aula%20Masjid%20Raya%20Puri%20Teluk%20Jambe%20(PERURI)%20Karawang/732935826736923/',
    'https://www.youtube.com/@masjidrayapuritelukjambe_TV',
  ],
};

const siteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Masjid Raya Puri Telukjambe',
  url: APP_URL,
  description: 'Portal resmi DKM Masjid Raya Puri Telukjambe Karawang',
  inLanguage: 'id-ID',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <meta name="geo.region" content="ID-JB" />
        <meta name="geo.placename" content="Telukjambe Timur, Karawang, Jawa Barat" />
        <meta name="geo.position" content="-6.3665;107.3157" />
        <meta name="ICBM" content="-6.3665, 107.3157" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(mosqueJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">
        <noscript>
          <h1>Masjid Raya Puri Telukjambe - Portal Resmi DKM Karawang</h1>
          <p>
            Portal resmi DKM Masjid Raya Puri Telukjambe Karawang menyediakan jadwal kajian rutin, dauroh Al-Quran,
            jadwal khatib Jumat, donasi QRIS, sewa aula serbaguna, konsultasi zakat, ambulans gratis, dan layanan
            jamaah siaga 24 jam.
          </p>
        </noscript>
        {children}
      </body>
    </html>
  );
}
