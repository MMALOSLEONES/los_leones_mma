import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SiteChrome from "@/components/layout/SiteChrome";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-black text-white">
      <SiteChrome>{children}</SiteChrome>
      
      </body>
    </html>
  );
}