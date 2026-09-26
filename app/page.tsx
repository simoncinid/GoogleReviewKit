import type { Metadata } from "next";
import GoogleReviewsKit from "./reviewkit";
import { SITE_NAME, SITE_URL, SEO } from "../lib/seo";

export const metadata: Metadata = {
  title: SEO.title,
  description: SEO.description,
  keywords: SEO.keywords,
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: SEO.ogTitle,
    description: SEO.ogDescription,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SEO.ogTitle,
    description: SEO.ogDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: SEO.description,
        inLanguage: "en-US",
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/icons/icon-logo.png`,
        areaServed: {
          "@type": "Country",
          name: "United States",
        },
      },
      {
        "@type": "SoftwareApplication",
        name: SITE_NAME,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: SITE_URL,
        description: SEO.description,
        inLanguage: "en-US",
        audience: {
          "@type": "Audience",
          geographicArea: {
            "@type": "Country",
            name: "United States",
          },
        },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/PreOrder",
          description: "Early access waitlist — 20% off at launch",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Public entry: waitlist / pre-release only. */
export default function Page() {
  return (
    <>
      <JsonLd />
      <GoogleReviewsKit variant="pre-release" />
    </>
  );
}
