// app/layout.tsx
import "./globals.css";
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
        <link
          rel="stylesheet"
          href={`${
            process.env.NEXT_PUBLIC_BASE_PATH || ""
          }/potree/potree/potree.css`}
        />
        <link
          rel="stylesheet"
          href={`${
            process.env.NEXT_PUBLIC_BASE_PATH || ""
          }/potree/libs/jquery-ui/jquery-ui.min.css`}
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
          html, body, #__next {
            margin: 0 !important;
            padding: 0 !important;
            height: 100% !important;
          }
          .cesium-viewer-cesiumWidgetContainer, .cesium-viewer-cesiumWidgetContainer canvas {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
          }
        `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
