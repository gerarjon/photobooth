import "./globals.css";
import { PhotoStateProvider } from "@/context/PhotoState";
import { Analytics } from "@vercel/analytics/react";
import Footer from "@/components/Footer";
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
  title: "Photobooth | Free",
  description: "Free Photobooth Web Application made by Gerar @gerarjon",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${montserrat.className}`}>
      <body className="container">
        <PhotoStateProvider>{children}</PhotoStateProvider>
        <Analytics />
        <Footer />
      </body>
    </html>
  );
}
