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
      </head>
      <body>{children}</body>
    </html>
  );
}
