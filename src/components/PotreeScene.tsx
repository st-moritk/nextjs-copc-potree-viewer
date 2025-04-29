"use client";
import { useEffect, useRef } from "react";

export default function PotreeScene() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.Potree || !container.current) return;

    // 安全にPotreeの定数にアクセスするためのヘルパー関数
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getPotreeConstant = (
      obj: any,
      path: string,
      defaultValue: any = null
    ) => {
      try {
        const parts = path.split(".");
        let current = obj;
        for (const part of parts) {
          if (current === undefined || current === null) return defaultValue;
          current = current[part];
        }
        return current !== undefined ? current : defaultValue;
      } catch (e) {
        console.warn(`Error accessing Potree constant: ${path}`, e);
        return defaultValue;
      }
    };

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

        // デバッグログを追加: 点群情報
        console.log("読み込まれた点群データ:", e.pointcloud);
        console.log("点群のマテリアル:", e.pointcloud.material);

        // 直接マテリアルのプロパティを検査
        console.log(
          "マテリアルのプロパティ一覧:",
          Object.keys(e.pointcloud.material)
        );

        // 直接点群マテリアルに高度ベースの色設定を適用
        try {
          // Potree固有のマテリアルプロパティを使用

          // ポイントカラータイプを設定 - 内部実装では通常2が高度(HEIGHT)に対応
          if (e.pointcloud.material._pointColorType !== undefined) {
            e.pointcloud.material._pointColorType = 2; // HEIGHT相当
            console.log("内部プロパティ _pointColorType を設定: 2");
          } else if (e.pointcloud.material.pointColorType !== undefined) {
            e.pointcloud.material.pointColorType = 2; // HEIGHT相当
            console.log("プロパティ pointColorType を設定: 2");
          }

          // 高度範囲を設定
          // 点群の実際の高度範囲を考慮して適切な値を設定
          let elevationRange = { min: 0, max: 100 };

          // 高度の範囲を設定（プロパティ名が異なる可能性に対応）
          if (e.pointcloud.material.elevationRange) {
            e.pointcloud.material.elevationRange = elevationRange;
            console.log("elevationRange を設定:", elevationRange);
          }

          if (
            e.pointcloud.material.heightMin !== undefined &&
            e.pointcloud.material.heightMax !== undefined
          ) {
            e.pointcloud.material.heightMin = elevationRange.min;
            e.pointcloud.material.heightMax = elevationRange.max;
            console.log(
              "heightMin/Max を設定:",
              elevationRange.min,
              elevationRange.max
            );
          }

          // _defaultElevationRangeChanged フラグがあれば設定
          if (
            e.pointcloud.material._defaultElevationRangeChanged !== undefined
          ) {
            e.pointcloud.material._defaultElevationRangeChanged = true;
            console.log("_defaultElevationRangeChanged を true に設定");
          }

          // グラデーション設定
          if (e.pointcloud.material._gradient !== undefined) {
            console.log(
              "現在のグラデーション設定:",
              e.pointcloud.material._gradient
            );
            // ここでグラデーションを設定できます（必要に応じて）
          }

          // マテリアルの更新フラグがあれば設定
          if (e.pointcloud.material.uniformsNeedUpdate !== undefined) {
            e.pointcloud.material.uniformsNeedUpdate = true;
            console.log("uniformsNeedUpdate を true に設定");
          }

          // アクティブな属性名を高度に設定（一部のバージョンで必要）
          if (e.pointcloud.material._activeAttributeName !== undefined) {
            e.pointcloud.material._activeAttributeName = "elevation";
            console.log("_activeAttributeName を 'elevation' に設定");
          }

          // 点群全体を更新
          if (e.pointcloud.material.needsUpdate !== undefined) {
            e.pointcloud.material.needsUpdate = true;
            console.log("material.needsUpdate を true に設定");
          }

          // 通常のThree.jsマテリアル更新も試す
          e.pointcloud.material.needsUpdate = true;

          // セットしたプロパティを確認
          console.log("設定後のマテリアル状態:", e.pointcloud.material);
        } catch (error) {
          console.error("マテリアル設定中にエラーが発生:", error);
        }

        // 元のコードはコメントアウト
        /*
        const PointColorType = getPotreeConstant(
          window.Potree,
          "PointColorType",
          {}
        );
        console.log("取得したPointColorType:", PointColorType);
        
        if (PointColorType) {
          // 高度に応じた色分けを優先
          if (PointColorType.HEIGHT) {
            console.log("HEIGHTカラータイプを適用します");
            e.pointcloud.material.pointColorType = PointColorType.HEIGHT;
            console.log("設定後のpointColorType:", e.pointcloud.material.pointColorType);
            
            // 高度に応じた色のグラデーションを設定
            console.log("heightMinの初期値:", e.pointcloud.material.heightMin);
            console.log("heightMaxの初期値:", e.pointcloud.material.heightMax);
            
            // 高度の最小値と最大値を自動設定
            e.pointcloud.material.heightMin = 0;  // 最低高度（メートル）
            e.pointcloud.material.heightMax = 100;  // 最高高度（メートル）
            console.log("設定後のheightMin:", e.pointcloud.material.heightMin);
            console.log("設定後のheightMax:", e.pointcloud.material.heightMax);
            
            // 高度に応じた色のグラデーションを設定
            if (viewer.setMaterial) {
              console.log("setMaterialメソッドを実行します");
              viewer.setMaterial("HEIGHT_GRADIENT");
              console.log("マテリアル設定後の状態:", e.pointcloud.material);
            } else {
              console.warn("setMaterialメソッドが見つかりません");
            }
          } else if (PointColorType.RGB) {
            console.log("RGBカラータイプを適用します");
            e.pointcloud.material.pointColorType = PointColorType.RGB;
          } else {
            console.log("利用可能なPointColorType:", PointColorType);
          }
        } else {
          console.warn("PointColorTypeが取得できませんでした");
        }
        */
      }
    );
  }, []);

  return <div ref={container} style={{ width: "100%", height: "100vh" }} />;
}
