import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import generateJsonLd from "./jsonld";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Aurascend - İçsel Enerjini Keşfet",
  description: "Aurascend ile duygularını, düşüncelerini ve içsel dünyandaki gizli potansiyeli çözümle. Ruhunun rengini keşfet.",
  keywords: "aura, enerji, kişisel gelişim, içsel keşif, yapay zeka, duygusal analiz",
  authors: [{ name: "Aurascend Team" }],
  creator: "Aurascend",
  publisher: "Aurascend",
  robots: "index, follow",
  applicationName: "Aurascend",
  metadataBase: new URL("https://aurascend.vercel.app"),
  openGraph: {
    title: "Aurascend - İçsel Enerjini Keşfet",
    description: "Aurascend ile duygularını, düşüncelerini ve içsel dünyandaki gizli potansiyeli çözümle.",
    url: "https://aurascend.vercel.app",
    siteName: "Aurascend",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Aurascend - İçsel Enerjini Keşfet",
      },
    ],
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aurascend - İçsel Enerjini Keşfet",
    description: "Aurascend ile içsel dünyanı keşfet ve ruhunun rengini bul.",
    images: ["/twitter-image.png"],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: { url: '/apple-icon.png', sizes: '180x180' },
    shortcut: '/favicon.ico',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({ children }) {
  const jsonLd = generateJsonLd();

  return (
    <html lang="tr">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#6b46c1" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
