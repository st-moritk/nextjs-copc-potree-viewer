// app/potree/page.tsx
"use client";

import { useEffect, useRef } from "react";

export default function PotreePage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.Potree) {
      console.error("Potree がロードされていません");
      return;
    }

    // ビューア初期化
    const viewer = new window.Potree.Viewer(containerRef.current!);
    viewer.setEDLEnabled(true);
    viewer.setFOV(60);
    viewer.setPointBudget(2_000_000);

    // USGS 3DEP EPT タイル URL
    const eptUrl =
      "https://s3-us-west-2.amazonaws.com/usgs-lidar-public/FL_HurricaneMichael_4_2020/ept.json";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window.Potree.loadPointCloud(eptUrl, "USGS_3DEP", (e: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pc = e.pointcloud as any;
      viewer.scene.addPointCloud(pc);
      pc.material.size = 1;
      pc.material.pointSizeType = window.Potree.PointSizeType.ADAPTIVE;
      viewer.fitToScreen();
    });
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "100vw",
        height: "100vh",
      }}
    />
  );
}
