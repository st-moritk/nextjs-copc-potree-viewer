/**
 * グローバル型定義ファイル
 * アプリケーション全体で使用するグローバル型定義を集約します
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

declare global {
  interface Window {
    Potree: any;
    Cesium: any;
    THREE: any;
    proj4: any;
  }
}

export {};
