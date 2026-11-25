"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { usePathname } from "@/i18n/navigation";

export default function SiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");
  const isPaymentPage = pathname.startsWith("/paiement");

  const hideChrome = isDashboard || isPaymentPage;

  return (
    <>
      {!hideChrome && <Header />}

      <div className="min-h-screen flex flex-col justify-between">
        <div className="flex-grow">{children}</div>
      </div>

      {!hideChrome && <Footer />}
    </>
  );
}
