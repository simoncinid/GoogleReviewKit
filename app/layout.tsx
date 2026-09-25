import type { Metadata } from "next";
import { headers } from "next/headers";
import { Caveat, Inter } from "next/font/google";
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

const baseMetadata: Metadata = {
  title: "GoogleReviewsKit — Your Google reviews. Working for you.",
  description:
    "Turn your hard-earned Google reviews into beautiful website widgets. Five formats, simple installation, and flexible pricing from free.",
  icons: { icon: "/favicon.png" },
  openGraph: {
    title: "GoogleReviewsKit — Put your reviews to work",
    description:
      "Beautiful review widgets for small businesses. Start free or pay once.",
    type: "website",
    locale: "en_US",
  },
  twitter: { card: "summary", title: "GoogleReviewsKit — Put your reviews to work" },
};
export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const incoming =
    requestHeaders.get("x-forwarded-host") ||
    requestHeaders.get("host") ||
    "reviewkit.diegosimoncini.chatgpt.site";
  const host = /^[a-zA-Z0-9.:-]+$/.test(incoming)
    ? incoming
    : "reviewkit.diegosimoncini.chatgpt.site";
  const origin = `${host.startsWith("localhost") ? "http" : "https"}://${host}`;
  const socialImage = {
    url: `${origin}/og.png`,
    width: 1536,
    height: 1024,
    alt: "GoogleReviewsKit — Your reviews. Your style. Fully customizable Google review widgets.",
  };
  return {
    ...baseMetadata,
    metadataBase: new URL(origin),
    openGraph: { ...baseMetadata.openGraph, images: [socialImage] },
    twitter: {
      card: "summary_large_image",
      title: "GoogleReviewsKit — Your reviews. Your style.",
      images: [socialImage.url],
    },
  };
}
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${caveat.variable}`}>{children}</body>
    </html>
  );
}
