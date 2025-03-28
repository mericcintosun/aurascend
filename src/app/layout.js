import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AuraScend - İçsel Enerjini Keşfet",
  description: "AuraScend ile içsel dünyanı keşfet, enerjini analiz et ve kendini daha iyi tanı.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
