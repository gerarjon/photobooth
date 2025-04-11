import "./globals.css";
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
})

const montserrat = Montserrat({
  weight: 'variable',
  subsets: ['latin'],
})

export const metadata = {
  title: "PicturanKo | Free Online Photobooth",
  description: "Free Photobooth Web Application made by Gerar @gerarjon",
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
