import type { Metadata } from "next";
import { Outfit, Rubik } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/features/auth";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const rubik = Rubik({
  subsets: ["arabic", "latin"],
  variable: "--font-arabic",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ProStore | متجر الأجهزة والإلكترونيات الاحترافي",
  description: "المتجر الرائد لقطع الكمبيوتر، الأجهزة الذكية، التجميعات الاحترافية والإكسسوارات مع أفضل العروض وضمان معتمد.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${outfit.variable} ${rubik.variable}`}>
      <body className="antialiased min-h-screen flex flex-col bg-[#F8FAFC] text-[#1A1D2A]">
        <AuthProvider>{children}</AuthProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
