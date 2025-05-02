/**
 * ビューワー設定の定数定義
 * マジックナンバーを一元管理するための設定ファイル
 */

// Cesium関連の設定
export const CESIUM_CONFIG = {
  INITIAL_CAMERA_POSITION: {
    x: 4303414.154026048,
    y: 552161.235598733,
    z: 4660771.704035539,
  },
  INITIAL_CAMERA_ORIENTATION: {
    heading: 10,
    pitch: -Math.PI / 4, // Math.PI_OVER_TWO * 0.5を簡略化
    roll: 0.0,
  },
};

// Potree関連の設定
export const POTREE_CONFIG = {
  FOV: 60, // 視野角（度）
  POINT_BUDGET: 1_000_000,
  MIN_NODE_SIZE: 0,
  DEFAULT_HEIGHT_OFFSET: 0, // デフォルトの高さオフセット

  MATERIAL_SIZE: 1,

  DEFAULT_POINT_CLOUD_URL:
    "https://s3-us-west-2.amazonaws.com/usgs-lidar-public/CA_SanFrancisco_1_B23/ept.json",
  DEFAULT_POINT_CLOUD_NAME: "SF Point Cloud",
};

// 同期関連の設定
export const SYNC_CONFIG = {
  UP_VECTOR_OFFSET: 600,

  DEBUG_MODE: false,
};
