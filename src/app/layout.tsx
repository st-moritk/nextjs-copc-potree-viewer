// app/layout.tsx
import "./globals.css";
import Script from "next/script";
import { ReactNode } from "react";

export const metadata = {
  title: "Potree + USGS 3DEP",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Potree CSS */}
        <link rel="stylesheet" href="/potree/potree/potree.css" />
        <link
          rel="stylesheet"
          href="/potree/libs/jquery-ui/jquery-ui.min.css"
        />

        {/* JS は beforeInteractive で先読み */}
        <Script
          src="/potree/libs/jquery/jquery-3.1.1.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="/potree/libs/other/BinaryHeap.js"
          strategy="beforeInteractive"
        />
        <Script
          src="/potree/libs/proj4/proj4.js"
          strategy="beforeInteractive"
        />
        <Script
          src="/potree/libs/three.js/build/three.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="/potree/libs/tween/tween.min.js"
          strategy="beforeInteractive"
        />
        <Script src="/potree/libs/d3/d3.js" strategy="beforeInteractive" />
        <Script src="/potree/libs/copc/index.js" strategy="beforeInteractive" />
        <Script src="/potree/potree/potree.js" strategy="beforeInteractive" />
      </head>
      <body>{children}</body>
    </html>
  );
}
