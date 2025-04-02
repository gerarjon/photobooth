import "./globals.css";
import { PhotoStateProvider } from "@/context/PhotoState";

export const metadata = {
  title: "Photobooth | Free",
  description: "Photobooth Web Application made by Gerar",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="true">
        <PhotoStateProvider>{children}</PhotoStateProvider>
      </body>
    </html>
  );
}
