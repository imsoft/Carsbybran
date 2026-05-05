import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const BASE_URL = "https://carsbybran.com";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  applicationName: "Carsbybran",
  title: {
    default: "Carsbybran — Expert Automotive Reviews",
    template: "%s | Carsbybran",
  },
  description:
    "Expert automotive reviews, car comparisons, and vehicle guides in English and Spanish. In-depth analysis by Brandon Garcia.",
  keywords: [
    "car reviews",
    "automotive reviews",
    "vehicle comparisons",
    "car buying guide",
    "reseñas de autos",
    "comparativas de coches",
    "carsbybran",
  ],
  authors: [{ name: "Brandon Garcia", url: BASE_URL }],
  creator: "Brandon Garcia",
  publisher: "Carsbybran",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: "Carsbybran",
    title: "Carsbybran — Expert Automotive Reviews",
    description:
      "Expert automotive reviews, car comparisons, and vehicle guides in English and Spanish.",
    url: BASE_URL,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@carsbybran",
    creator: "@carsbybran",
    title: "Carsbybran — Expert Automotive Reviews",
    description:
      "Expert automotive reviews, car comparisons, and vehicle guides.",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Carsbybran",
  url: BASE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/en-US/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Carsbybran",
  url: BASE_URL,
  logo: `${BASE_URL}/images/site/carsbybran-logo-light.svg`,
  sameAs: ["https://twitter.com/carsbybran"],
  contactPoint: {
    "@type": "ContactPoint",
    email: "editorial@carsbybran.com",
    contactType: "editorial",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{const t=localStorage.getItem('theme');if(t==='dark'||((!t||t==='system')&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
