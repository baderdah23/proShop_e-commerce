import type { Metadata } from "next";
import { Toaster } from "@/shared/components/Toast";
import "./globals.css";
import { AuthProvider } from "@/features/auth";

export const metadata: Metadata = {
  title: "ProStore | متجر الأجهزة والإلكترونيات الاحترافي",
  description:
    "المتجر الرائد لقطع الكمبيوتر، الأجهزة الذكية، التجميعات الاحترافية والإكسسوارات مع أفضل العروض وضمان معتمد.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Rubik:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-[#F8FAFC] text-[#1A1D2A]">
        <AuthProvider>{children}</AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
