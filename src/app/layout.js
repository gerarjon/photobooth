import "./globals.css";
import { PhotoStateProvider } from "@/context/PhotoState";
import { Rubik } from 'next/font/google'
 
const rubik = Rubik({
  weight: 'variable',
  subsets: ['latin'],
})

export const metadata = {
  title: "Photobooth | Free",
  description: "Photobooth Web Application made by Gerar",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${rubik.className}`}>
      <body className="true">
        <PhotoStateProvider>{children}</PhotoStateProvider>
      </body>
    </html>
  );
}
