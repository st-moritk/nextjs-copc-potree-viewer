// TypeScript型定義の警告を抑制
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * 投影変換用ヘルパーを作成します
 * @param srcProjection ポイントクラウドの投影定義文字列
 * @param destDefName 変換先投影定義名 (デフォルト: 'WGS84')
 * @returns 座標変換ユーティリティオブジェクト
 */
export function createProjTransformer(
  srcProjection: string,
  destDefName: string = "EPSG:4326"
) {
  const destProj = window.proj4.defs(destDefName);
  const toMap = window.proj4(srcProjection, destProj);

  /**
   * Potreeの座標（THREE.Vector3）をCesiumの座標（Cartesian3）に変換
   * @param pos THREE.Vector3位置
   * @returns Cesium.Cartesian3位置
   */
  const toCesium = (pos: { x: number; y: number; z: number }) => {
    const xy: [number, number] = [pos.x, pos.y];
    const height = pos.z;

    const deg = toMap.forward(xy);
    return window.Cesium.Cartesian3.fromDegrees(deg[0], deg[1], height);
  };

  return {
    toCesium,
  };
}
