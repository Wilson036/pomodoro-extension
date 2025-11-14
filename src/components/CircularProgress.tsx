import React from "react";

interface CircularProgressProps {
  progress: number;
  timeLeft: number;
  isWorking: boolean;
  formatTime: (seconds: number) => string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  progress,
  timeLeft,
  isWorking,
  formatTime,
}) => {
  return (
    <div
      style={{
        position: "relative",
        width: "16rem",
        height: "16rem",
        margin: "0 auto 2rem",
      }}
    >
      <svg
        style={{
          transform: "rotate(-90deg)",
          width: "16rem",
          height: "16rem",
        }}
      >
        {/* 背景圓 */}
        <circle
          cx="128"
          cy="128"
          r="120"
          stroke="#f3f4f6"
          strokeWidth="16"
          fill="none"
        />
        {/* 進度圓 */}
        <circle
          cx="128"
          cy="128"
          r="120"
          stroke={isWorking ? "#ef4444" : "#22c55e"}
          strokeWidth="16"
          fill="none"
          strokeDasharray={`${2 * Math.PI * 120}`}
          strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
          strokeLinecap="round"
          style={{ transition: "all 1s" }}
        />
      </svg>

      {/* 時間顯示 */}
      <div
        style={{
          position: "absolute",
          inset: "0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "3rem",
              fontWeight: "bold",
              color: "#1f2937",
            }}
          >
            {formatTime(timeLeft)}
          </div>
          <div
            style={{
              fontSize: "0.875rem",
              color: "#6b7280",
              marginTop: "0.5rem",
            }}
          >
            {Math.floor(progress)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircularProgress;
