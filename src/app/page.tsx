// app/page.tsx
"use client";
import Script from "next/script";
import PotreeScene from "@/components/PotreeScene";

export default function Page() {
  return (
    <>
      {/* Potree / Cesium のスクリプトを一括読み込み */}
      <Script
        src="/potree/libs/jquery/jquery-3.1.1.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="/potree/libs/other/BinaryHeap.js"
        strategy="beforeInteractive"
      />
      <Script src="/potree/libs/proj4/proj4.js" strategy="beforeInteractive" />
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
      <Script
        src="/potree/libs/Cesium/Cesium.js"
        strategy="beforeInteractive"
      />

      <PotreeScene />
    </>
  );
}
