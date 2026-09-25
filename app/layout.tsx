import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });
export const metadata: Metadata = {
 title: 'ReviewKit — Your Google reviews. Working for you.',
 description: 'Turn your hard-earned Google reviews into beautiful website widgets. Five formats, simple installation, and 12 months of syncing. Founding price: $99.',
 icons: { icon: '/favicon.png' },
 openGraph: {title:'ReviewKit — Put your reviews to work',description:'Beautiful review widgets for small businesses. $99 once. A year of syncing included.',type:'website',locale:'en_US'},
 twitter: {card:'summary',title:'ReviewKit — Put your reviews to work'},
};
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {return <html lang="en"><body className={geist.variable}>{children}</body></html>;}
