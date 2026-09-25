import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist } from "next/font/google";
import "./globals.css";
const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const baseMetadata: Metadata = {
  title: "ReviewKit — Your Google reviews. Working for you.",
  description:
    "Turn your hard-earned Google reviews into beautiful website widgets. Five formats, simple installation, and 12 months of syncing. Founding price: $99.",
  icons: { icon: "/favicon.png" },
  openGraph: {
    title: "ReviewKit — Put your reviews to work",
    description:
      "Beautiful review widgets for small businesses. $99 once. A year of syncing included.",
    type: "website",
    locale: "en_US",
  },
  twitter: { card: "summary", title: "ReviewKit — Put your reviews to work" },
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
    alt: "ReviewKit — Your reviews. Your style. Fully customizable Google review widgets.",
  };
  return {
    ...baseMetadata,
    metadataBase: new URL(origin),
    openGraph: { ...baseMetadata.openGraph, images: [socialImage] },
    twitter: {
      card: "summary_large_image",
      title: "ReviewKit — Your reviews. Your style.",
      images: [socialImage.url],
    },
  };
}
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={geist.variable}>{children}</body>
    </html>
  );
}
