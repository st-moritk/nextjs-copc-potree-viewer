// src/utils/syncHelpers.ts
import { SYNC_CONFIG } from "../config/viewerConfig";

// TypeScript型定義の警告を抑制
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Potree と Cesium のビューワー間でカメラ同期を行うループを開始する
 *
 * @param potreeViewer Potreeビューワーインスタンス
 * @param cesiumViewer Cesiumビューワーインスタンス
 * @param transformer 座標変換ユーティリティ（projectionHelpersから取得）
 * @returns requestAnimationFrameをキャンセルするための関数
 */
export function startSyncLoop(
  potreeViewer: any,
  cesiumViewer: any,
  transformer: {
    toCesium: (pos: { x: number; y: number; z: number }) => any;
  }
): () => void {
  let animationFrameId: number;

  const syncCamerasAndRender = (timestamp: number) => {
    animationFrameId = requestAnimationFrame(syncCamerasAndRender);

    potreeViewer.update(potreeViewer.clock.getDelta(), timestamp);
    potreeViewer.render();

    if (transformer) {
      const camera = potreeViewer.scene.getActiveCamera();

      const potreePosition = new window.THREE.Vector3(0, 0, 0).applyMatrix4(
        camera.matrixWorld
      );
      const potreeUp = new window.THREE.Vector3(
        0,
        SYNC_CONFIG.UP_VECTOR_OFFSET,
        0
      ).applyMatrix4(camera.matrixWorld);
      const potreeTarget = potreeViewer.scene.view.getPivot();

      const cesiumPosition = transformer.toCesium(potreePosition);
      const cesiumUpTarget = transformer.toCesium(potreeUp);
      const cesiumTarget = transformer.toCesium(potreeTarget);

      const cesiumDirection = window.Cesium.Cartesian3.subtract(
        cesiumTarget,
        cesiumPosition,
        new window.Cesium.Cartesian3()
      );
      const cesiumUp = window.Cesium.Cartesian3.subtract(
        cesiumUpTarget,
        cesiumPosition,
        new window.Cesium.Cartesian3()
      );

      window.Cesium.Cartesian3.normalize(cesiumDirection, cesiumDirection);
      window.Cesium.Cartesian3.normalize(cesiumUp, cesiumUp);

      cesiumViewer.camera.setView({
        destination: cesiumPosition,
        orientation: {
          direction: cesiumDirection,
          up: cesiumUp,
        },
      });

      const aspect = potreeViewer.scene.getActiveCamera().aspect;
      const fovy = window.Cesium.Math.toRadians(camera.fov);
      if (aspect < 1) {
        // 縦長ウィンドウの場合
        cesiumViewer.camera.frustum.fov = fovy;
      } else {
        // 横長ウィンドウの場合
        const fovx = Math.atan(Math.tan(0.5 * fovy) * aspect) * 2;
        cesiumViewer.camera.frustum.fov = fovx;
      }

      cesiumViewer.render();
    }
  };

  animationFrameId = requestAnimationFrame(syncCamerasAndRender);

  return () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  };
}
