"use client";
import { useEffect, useRef } from "react";
// Cesiumはscriptタグで読み込み、ウィンドウオブジェクトから参照する
// Three.jsもscriptタグで読み込み
import proj4 from "proj4";

// TypeScriptの型定義問題を解決するためにanyを許可
/* eslint-disable @typescript-eslint/no-explicit-any */

// 型定義のためのインターフェース
declare global {
  interface Window {
    Potree: any;
    Cesium: any;
    THREE: any;
  }
}

export default function PotreeScene() {
  const container = useRef<HTMLDivElement>(null);
  const cesiumContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // スクリプトを動的に読み込む
    const loadScripts = async () => {
      // 必要なスクリプトを読み込む
      await loadScript("/potree/libs/Cesium/Cesium.js");
      // potree.jsは自動で読み込まれていると仮定
    };

    // スクリプト読み込み関数
    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => resolve();
        document.head.appendChild(script);
      });
    };

    // スクリプトを読み込んでから初期化する
    loadScripts().then(() => {
      if (
        !window.Potree ||
        !window.Cesium ||
        !container.current ||
        !cesiumContainer.current
      )
        return;

      // Cesiumの静的アセットのベースURLを設定
      window.Cesium.buildModuleUrl.setBaseUrl("/potree/libs/Cesium/");

      // CesiumビューアをOpenStreetMapと共に初期化
      const cesiumViewer = new window.Cesium.Viewer(cesiumContainer.current, {
        useDefaultRenderLoop: false,
        animation: false,
        baseLayerPicker: false,
        fullscreenButton: false,
        geocoder: false,
        homeButton: false,
        infoBox: false,
        sceneModePicker: false,
        selectionIndicator: false,
        timeline: false,
        navigationHelpButton: false,
        // OpenStreetMapをイメージプロバイダーとして使用
        imageryProvider: window.Cesium.createOpenStreetMapImageryProvider({
          url: "https://a.tile.openstreetmap.org/",
        }),
        terrainShadows: window.Cesium.ShadowMode.DISABLED,
      });

      // 初期ビュー位置を設定
      const cp = new window.Cesium.Cartesian3(
        4303414.154026048,
        552161.235598733,
        4660771.704035539
      );
      cesiumViewer.camera.setView({
        destination: cp,
        orientation: {
          heading: 10,
          pitch: -window.Cesium.Math.PI_OVER_TWO * 0.5,
          roll: 0.0,
        },
      });

      // Potreeビューア初期化
      const potreeViewer = new window.Potree.Viewer(container.current, {
        useDefaultRenderLoop: false,
      });

      potreeViewer.setEDLEnabled(true);
      potreeViewer.setFOV(60);
      potreeViewer.setPointBudget(1_000_000);
      potreeViewer.setMinNodeSize(0);
      potreeViewer.setBackground(null);

      // 点群データ読み込み
      window.Potree.loadPointCloud(
        "https://s3-us-west-2.amazonaws.com/usgs-lidar-public/CA_SanFrancisco_1_B23/ept.json",
        "SF Point Cloud",
        (e: any) => {
          potreeViewer.scene.addPointCloud(e.pointcloud);

          // 点群データのマテリアル設定
          e.pointcloud.material.size = 1;
          e.pointcloud.material.pointSizeType =
            window.Potree.PointSizeType.ADAPTIVE;

          try {
            if (e.pointcloud.material._activeAttributeName !== undefined) {
              e.pointcloud.material._activeAttributeName = "elevation";
            }
          } catch (error) {
            console.error("マテリアル設定中にエラーが発生:", error);
          }

          // 点群にフォーカス - 自動的に全体が見えるように調整
          potreeViewer.fitToScreen();

          // 高さオフセットを調整（負の値で下げる、正の値で上げる）
          e.pointcloud.position.z = -0; // 高さオフセットを調整（単位はメートル）

          // 投影変換の設定
          const pointcloudProjection = e.pointcloud.projection;
          const mapProjection = proj4.defs("WGS84");

          // 文字列として扱う必要がある場合の型キャスト
          const toMap = proj4(
            pointcloudProjection as any,
            mapProjection as any
          );
          // 未使用変数だが、このままコメントで残しておく
          // const _toScene = proj4(
          //   mapProjection as any,
          //   pointcloudProjection as any
          // );

          // レンダリングループ
          const loop = (timestamp: number) => {
            requestAnimationFrame(loop);

            potreeViewer.update(potreeViewer.clock.getDelta(), timestamp);
            potreeViewer.render();

            if (toMap) {
              const camera = potreeViewer.scene.getActiveCamera();

              const pPos = new window.THREE.Vector3(0, 0, 0).applyMatrix4(
                camera.matrixWorld
              );
              const pUp = new window.THREE.Vector3(0, 600, 0).applyMatrix4(
                camera.matrixWorld
              );
              const pTarget = potreeViewer.scene.view.getPivot();

              const toCes = (pos: any) => {
                const xy = [pos.x, pos.y];
                const height = pos.z;
                const deg = toMap.forward(xy);
                const cPos = window.Cesium.Cartesian3.fromDegrees(
                  deg[0],
                  deg[1],
                  height
                );

                return cPos;
              };

              const cPos = toCes(pPos);
              const cUpTarget = toCes(pUp);
              const cTarget = toCes(pTarget);

              const cDir = window.Cesium.Cartesian3.subtract(
                cTarget,
                cPos,
                new window.Cesium.Cartesian3()
              );
              const cUp = window.Cesium.Cartesian3.subtract(
                cUpTarget,
                cPos,
                new window.Cesium.Cartesian3()
              );

              window.Cesium.Cartesian3.normalize(cDir, cDir);
              window.Cesium.Cartesian3.normalize(cUp, cUp);

              cesiumViewer.camera.setView({
                destination: cPos,
                orientation: {
                  direction: cDir,
                  up: cUp,
                },
              });

              const aspect = potreeViewer.scene.getActiveCamera().aspect;
              if (aspect < 1) {
                const fovy =
                  Math.PI * (potreeViewer.scene.getActiveCamera().fov / 180);
                cesiumViewer.camera.frustum.fov = fovy;
              } else {
                const fovy =
                  Math.PI * (potreeViewer.scene.getActiveCamera().fov / 180);
                const fovx = Math.atan(Math.tan(0.5 * fovy) * aspect) * 2;
                cesiumViewer.camera.frustum.fov = fovx;
              }

              cesiumViewer.render();
            }
          };

          requestAnimationFrame(loop);
        }
      );

      // クリーンアップ
      return () => {
        if (cesiumViewer && !cesiumViewer.isDestroyed()) {
          cesiumViewer.destroy();
        }
        if (potreeViewer && typeof potreeViewer.destroy === "function") {
          potreeViewer.destroy();
        }
      };
    });
  }, []);

  return (
    <div
      ref={container}
      style={{ position: "absolute", width: "100%", height: "100%" }}
    >
      <div
        ref={cesiumContainer}
        style={{ position: "absolute", width: "100%", height: "100%" }}
      />
    </div>
  );
}
