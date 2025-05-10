// src/utils/potreeHelpers.ts
import { POTREE_CONFIG } from "../config/viewerConfig";

// TypeScript型定義の警告を抑制
/* eslint-disable @typescript-eslint/no-explicit-any */

// Potree ビューア初期化ヘルパー
export function initPotreeViewer(container: HTMLDivElement) {
  // Potree の Viewer インスタンス生成
  const viewer = new window.Potree.Viewer(container, {
    useDefaultRenderLoop: false,
  });

  // ビューア設定
  viewer.setEDLEnabled(true);
  viewer.setFOV(POTREE_CONFIG.FOV);
  viewer.setPointBudget(POTREE_CONFIG.POINT_BUDGET);
  viewer.setMinNodeSize(POTREE_CONFIG.MIN_NODE_SIZE);
  viewer.setBackground(null);

  return viewer;
}

/**
 * 点群データの読み込みとマテリアル設定を行う
 * @param viewer Potreeビューワインスタンス
 * @param url 点群データのURL（省略時はデフォルト値使用）
 * @param name 点群データの表示名（省略時はデフォルト値使用）
 * @param heightOffset 高さオフセット（任意、デフォルト: 0）
 * @returns Promise<{ projection: string }> ロード完了後のデータとプロジェクション
 */
export function loadAndConfigurePointCloud(
  viewer: any,
  url: string = POTREE_CONFIG.DEFAULT_POINT_CLOUD_URL,
  name: string = POTREE_CONFIG.DEFAULT_POINT_CLOUD_NAME,
  heightOffset: number = 0
): Promise<{ projection: string }> {
  return new Promise((resolve, reject) => {
    window.Potree.loadPointCloud(url, name, (e: any) => {
      try {
        viewer.scene.addPointCloud(e.pointcloud);

        e.pointcloud.material.size = POTREE_CONFIG.MATERIAL_SIZE;
        e.pointcloud.material.pointSizeType =
          window.Potree.PointSizeType.ADAPTIVE;

        if (e.pointcloud.material._activeAttributeName !== undefined) {
          e.pointcloud.material._activeAttributeName = "elevation";
        }

        viewer.fitToScreen();

        e.pointcloud.position.z = heightOffset;

        resolve({
          projection: e.pointcloud.projection,
        });
      } catch (error) {
        console.error("点群データの処理中にエラーが発生:", error);
        reject(error);
      }
    });
  });
}
