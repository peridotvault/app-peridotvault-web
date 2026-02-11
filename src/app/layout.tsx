import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "@/shared/styles/globals.css";
import { UIEffects } from "./_effects/UIEffects";
import { METADATA } from "./_seo/metadata";
import { EmbedLayout } from "@/features/security/embed/embed.component";
import { GoogleAnalytics } from "@next/third-parties/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = METADATA;
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0b0f14",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col`}
      >
        <UIEffects />
        <Suspense fallback={null}>
          <EmbedLayout>{children}</EmbedLayout>
        </Suspense>
        <GoogleAnalytics gaId="G-6J0BXZJNG5" />
      </body>
    </html>
  );
}
