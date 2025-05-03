"use client";

import Script from "next/script";
import PotreeScene from "@/components/PotreeScene";

export default function Page() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  return (
    <>
      <Script
        src={`${basePath}/potree/libs/jquery/jquery-3.1.1.min.js`}
        strategy="beforeInteractive"
      />
      <Script
        src={`${basePath}/potree/libs/other/BinaryHeap.js`}
        strategy="beforeInteractive"
      />
      <Script
        src={`${basePath}/potree/libs/proj4/proj4.js`}
        strategy="beforeInteractive"
      />
      <Script
        src={`${basePath}/potree/libs/three.js/build/three.min.js`}
        strategy="beforeInteractive"
      />
      <Script
        src={`${basePath}/potree/libs/tween/tween.min.js`}
        strategy="beforeInteractive"
      />
      <Script
        src={`${basePath}/potree/libs/d3/d3.js`}
        strategy="beforeInteractive"
      />
      <Script
        src={`${basePath}/potree/libs/copc/index.js`}
        strategy="beforeInteractive"
      />
      <Script
        src={`${basePath}/potree/potree/potree.js`}
        strategy="beforeInteractive"
      />
      <Script
        src={`${basePath}/potree/libs/Cesium/Cesium.js`}
        strategy="beforeInteractive"
      />

      <PotreeScene />
    </>
  );
}
