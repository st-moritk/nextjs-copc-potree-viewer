"use client";
import { useEffect, useRef, useState } from "react";
import { initCesiumViewer, setCesiumInitialView } from "../utils/cesiumHelpers";
import {
  initPotreeViewer,
  loadAndConfigurePointCloud,
} from "../utils/potreeHelpers";
import { createProjTransformer } from "../utils/projectionHelpers";
import { startSyncLoop } from "../utils/syncHelpers";
import { POTREE_CONFIG } from "../config/viewerConfig";
import Loading from "./Loading";

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function PotreeScene() {
  const potreeContainer = useRef<HTMLDivElement>(null);
  const cesiumContainer = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!potreeContainer.current || !cesiumContainer.current) return;

    const cesiumViewer = initCesiumViewer(cesiumContainer.current);
    setCesiumInitialView(cesiumViewer);
    const potreeViewer = initPotreeViewer(potreeContainer.current);

    loadAndConfigurePointCloud(
      potreeViewer,
      POTREE_CONFIG.DEFAULT_POINT_CLOUD_URL,
      POTREE_CONFIG.DEFAULT_POINT_CLOUD_NAME,
      POTREE_CONFIG.DEFAULT_HEIGHT_OFFSET
    )
      .then(({ projection }) => {
        const transformer = createProjTransformer(projection);
        const stopSync = startSyncLoop(potreeViewer, cesiumViewer, transformer);
        setIsLoading(false);

        return () => {
          stopSync();
        };
      })
      .catch((error) => {
        console.error("点群データの読み込み中にエラーが発生:", error);
        setIsLoading(false);
      });

    return () => {
      if (cesiumViewer && !cesiumViewer.isDestroyed()) {
        cesiumViewer.destroy();
      }
    };
  }, []);

  return (
    <div
      ref={potreeContainer}
      style={{ position: "absolute", width: "100%", height: "100%" }}
    >
      <div
        ref={cesiumContainer}
        style={{ position: "absolute", width: "100%", height: "100%" }}
      />
      {isLoading && <Loading />}
    </div>
  );
}
