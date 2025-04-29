"use client";
import { useEffect, useRef } from "react";

export default function PotreeScene() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.Potree || !container.current) return;

    const viewer = new window.Potree.Viewer(container.current);
    viewer.setEDLEnabled(true);
    viewer.setPointBudget(1_000_000);

    // ← ここを修正
    window.Potree.loadPointCloud(
      // EPTデータソースを使用（LAZファイル直接ではなくept.jsonを指定）
      "https://s3-us-west-2.amazonaws.com/usgs-lidar-public/CA_SanFrancisco_1_B23/ept.json",
      // ② 任意の表示名
      "SF Point Cloud",
      // ③ 読み込み完了時のコールバック
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (e: any) => {
        viewer.scene.addPointCloud(e.pointcloud);
        viewer.fitToScreen();
      }
    );
  }, []);

  return <div ref={container} style={{ width: "100%", height: "100vh" }} />;
}
