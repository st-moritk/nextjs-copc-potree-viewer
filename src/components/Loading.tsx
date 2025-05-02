import React from "react";

interface LoadingProps {
  message?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  message = "データを読み込み中です...",
}) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          className="loader"
          style={{
            border: "5px solid #f3f3f3",
            borderRadius: "50%",
            borderTop: "5px solid #3498db",
            width: "50px",
            height: "50px",
            animation: "spin 2s linear infinite",
          }}
        ></div>
        <style jsx>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
        <p style={{ marginTop: "15px", fontSize: "16px" }}>{message}</p>
      </div>
    </div>
  );
};

export default Loading;
