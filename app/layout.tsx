import type { Metadata } from "next";
import { Caveat, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import MetaPixel from "./components/meta-pixel";
import { SITE_NAME, SITE_URL, SEO } from "../lib/seo";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SEO.title,
    template: SEO.titleTemplate,
  },
  description: SEO.description,
  keywords: SEO.keywords,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "business",
  icons: { icon: "/favicon.png" },
  alternates: {
    canonical: SITE_URL,
    languages: { "en-US": SITE_URL },
  },
  openGraph: {
    title: SEO.ogTitle,
    description: SEO.ogDescription,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1536,
        height: 1024,
        alt: "GoogleReviewsKit — Customizable Google review widgets for your website",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SEO.ogTitle,
    description: SEO.ogDescription,
    images: ["/og.png"],
  },
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
  other: {
    "geo.region": "US",
    "geo.placename": "United States",
    language: "en-US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-US">
      <head>
        <MetaPixel />
      </head>
      <body className={`${inter.variable} ${caveat.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
