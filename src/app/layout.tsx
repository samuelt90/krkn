
import type { Metadata } from "next";
import { Barlow_Condensed, Manrope } from "next/font/google";
import "./globals.css";
import KrknFooter from "@/components/layout/KrknFooter";

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-krkn-display",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-krkn-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KRKN | Streetwear",
  description: "Explora el universo KRKN. Descubre tu próximo fit.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${barlow.variable} ${manrope.variable} antialiased`}
      >
        {children}
        <KrknFooter />
      </body>
    </html>
  );
}
