import React from "react";
import { Play, Pause, RotateCcw, Settings } from "lucide-react";

interface ControlButtonsProps {
  isRunning: boolean;
  onToggleTimer: () => void;
  onReset: () => void;
  onShowSettings: () => void;
}

const ControlButtons: React.FC<ControlButtonsProps> = ({
  isRunning,
  onToggleTimer,
  onReset,
  onShowSettings,
}) => {
  return (
    <>
      {/* 主要控制按鈕 */}
      <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
        <button
          onClick={onToggleTimer}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.75rem 2rem",
            borderRadius: "0.5rem",
            fontWeight: "600",
            border: "none",
            cursor: "pointer",
            background: isRunning ? "#eab308" : "#22c55e",
            color: "white",
            transition: "background 0.2s",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.background = isRunning
              ? "#ca8a04"
              : "#16a34a")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.background = isRunning
              ? "#eab308"
              : "#22c55e")
          }
        >
          {isRunning ? (
            <>
              <Pause style={{ width: "1.25rem", height: "1.25rem" }} />
              暫停
            </>
          ) : (
            <>
              <Play style={{ width: "1.25rem", height: "1.25rem" }} />
              開始
            </>
          )}
        </button>

        <button
          onClick={onReset}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.75rem 2rem",
            borderRadius: "0.5rem",
            fontWeight: "600",
            background: "#6b7280",
            color: "white",
            border: "none",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "#4b5563")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#6b7280")}
        >
          <RotateCcw style={{ width: "1.25rem", height: "1.25rem" }} />
          重置
        </button>
      </div>

      {/* 設定按鈕 */}
      <button
        onClick={onShowSettings}
        style={{
          width: "100%",
          marginTop: "1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          padding: "0.5rem 1rem",
          color: "#4b5563",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          transition: "color 0.2s",
        }}
        onMouseOver={(e) => (e.currentTarget.style.color = "#1f2937")}
        onMouseOut={(e) => (e.currentTarget.style.color = "#4b5563")}
      >
        <Settings style={{ width: "1rem", height: "1rem" }} />
        調整設定
      </button>
    </>
  );
};

export default ControlButtons;
