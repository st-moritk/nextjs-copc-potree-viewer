// src/utils/cesiumHelpers.ts
import { CESIUM_CONFIG } from "../config/viewerConfig";

// TypeScript型定義の警告を抑制
/* eslint-disable @typescript-eslint/no-explicit-any */

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/**
 * Cesiumビューワーを初期化して返す
 */
export function initCesiumViewer(container: HTMLDivElement) {
  window.Cesium.buildModuleUrl.setBaseUrl(basePath + "/potree/libs/Cesium/");

  return new window.Cesium.Viewer(container, {
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
    imageryProvider: window.Cesium.createOpenStreetMapImageryProvider({
      url: "https://a.tile.openstreetmap.org/",
    }),
    terrainShadows: window.Cesium.ShadowMode.DISABLED,
  });
}

/**
 * Cesiumカメラを初期位置に設定する
 * @param viewer Cesiumビューワーインスタンス
 */
export function setCesiumInitialView(viewer: any) {
  const position = CESIUM_CONFIG.INITIAL_CAMERA_POSITION;
  const orientation = CESIUM_CONFIG.INITIAL_CAMERA_ORIENTATION;

  const cesiumPosition = new window.Cesium.Cartesian3(
    position.x,
    position.y,
    position.z
  );

  viewer.camera.setView({
    destination: cesiumPosition,
    orientation: {
      heading: orientation.heading,
      pitch: orientation.pitch,
      roll: orientation.roll,
    },
  });
}
