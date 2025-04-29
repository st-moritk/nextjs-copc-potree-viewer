"use client";
import { useEffect, useRef } from "react";

export default function PotreeScene() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.Potree || !container.current) return;

    const viewer = new window.Potree.Viewer(container.current);
    viewer.setEDLEnabled(true);
    viewer.setPointBudget(1_000_000);

    window.Potree.loadPointCloud(
      "https://s3-us-west-2.amazonaws.com/usgs-lidar-public/CA_SanFrancisco_1_B23/ept.json",
      "SF Point Cloud",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (e: any) => {
        viewer.scene.addPointCloud(e.pointcloud);
        viewer.fitToScreen();
        try {
          if (e.pointcloud.material._activeAttributeName !== undefined) {
            e.pointcloud.material._activeAttributeName = "elevation";
          }
        } catch (error) {
          console.error("マテリアル設定中にエラーが発生:", error);
        }
      }
    );
  }, []);

  return <div ref={container} style={{ width: "100%", height: "100vh" }} />;
}
