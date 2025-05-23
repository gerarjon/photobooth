import "./globals.css";
import "./globalicons.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { PhotoStateProvider } from "@/context/PhotoState";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Rubik } from 'next/font/google';
import { Montserrat } from "next/font/google";
 
const rubik = Rubik({
  weight: 'variable',
  subsets: ['latin'],
  preload: true,
})

const montserrat = Montserrat({
  weight: 'variable',
  subsets: ['latin'],
  preload: true,
})

export const metadata = {
  title: "PicturanCo | Free Online Photobooth",
  description: "Your personal online photo booth! You can use this on your desktop, tablet, and phone. Create fun and cute photo strips with frames and stickers - totally free!",
  keywords: ["photo booth", "online photo strip", "create photo booth", "digital photobooth", "fun photo strips", "kawaii stickers", "photobooth creator", "Japanese photo booth", "Purikura", "Korean photo booth", "Life4Cuts", "selfie strip"]
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${montserrat.className}`}>
      <body className="container">
        <Navbar />
        <PhotoStateProvider>{children}</PhotoStateProvider>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
