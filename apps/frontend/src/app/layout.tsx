import { Geist_Mono, Inter } from "next/font/google";

import { JsonLd } from "@/components/seo/json-ld";
import { AppProviders } from "@/components/shared/providers";
import { siteMetadata, siteViewport } from "@/config/seo";
import { cn } from "@/lib/utils";

import "./globals.css";

export const metadata = siteMetadata;
export const viewport = siteViewport;

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full antialiased font-sans",
        inter.variable,
        geistMono.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <JsonLd />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
