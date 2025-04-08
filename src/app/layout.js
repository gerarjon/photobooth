import "./globals.css";
import { PhotoStateProvider } from "@/context/PhotoState";
import { Analytics } from "@vercel/analytics/react"
import { Rubik } from 'next/font/google'
 
const rubik = Rubik({
  weight: 'variable',
  subsets: ['latin'],
})

export const metadata = {
  title: "Photobooth | Free",
  description: "Free Photobooth Web Application made by Gerar @gerarjon",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${rubik.className}`}>
      <body className="true">
        <PhotoStateProvider>{children}</PhotoStateProvider>
        <Analytics />
      </body>
    </html>
  );
}
