import Script from "next/script";
import getConfig from "next/config";
import PotreeScene from "@/components/PotreeScene";

export default function Page() {
  const { publicRuntimeConfig } = getConfig() || {};
  const basePath = publicRuntimeConfig?.basePath || "";

  return (
    <>
      {/* Potree / Cesium のスクリプトを一括読み込み */}
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
