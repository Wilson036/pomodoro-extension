import React from "react";

interface StatusBadgeProps {
  isWorking: boolean;
  currentCycle: number;
  totalCycles: number;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  isWorking,
  currentCycle,
  totalCycles,
}) => {
  return (
    <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
      <div
        style={{
          display: "inline-block",
          padding: "0.5rem 1.5rem",
          borderRadius: "9999px",
          background: "linear-gradient(to right, #ef4444, #f97316)",
          color: "white",
          fontWeight: "600",
        }}
      >
        {isWorking ? "🎯 專心時間" : "☕ 休息時間"}
      </div>
      <p style={{ marginTop: "0.75rem", color: "#4b5563" }}>
        循環 {currentCycle} / {totalCycles}
      </p>
    </div>
  );
};

export default StatusBadge;
