import React from "react";
import { Settings } from "lucide-react";
import BlockedSitesSettings from "./BlockedSitesSettings";

interface SettingsPanelProps {
  totalCycles: number;
  workDuration: number;
  breakDuration: number;
  isRunning: boolean;
  isWorking: boolean;
  blockedSites: string[];
  onTotalCyclesChange: (value: number) => void;
  onWorkDurationChange: (value: number) => void;
  onBreakDurationChange: (value: number) => void;
  onBlockedSitesChange: (sites: string[]) => void;
  onStart: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  totalCycles,
  workDuration,
  breakDuration,
  blockedSites,
  onTotalCyclesChange,
  onWorkDurationChange,
  onBreakDurationChange,
  onBlockedSitesChange,
  onStart,
}) => {
  return (
    <div
      style={{
        marginBottom: "2rem",
        background: "#f9fafb",
        borderRadius: "1rem",
        padding: "1.5rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.5rem",
        }}
      >
        <h2
          style={{
            fontSize: "1.125rem",
            fontWeight: "600",
            color: "#374151",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <Settings style={{ width: "1.25rem", height: "1.25rem" }} />
          設定
        </h2>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label
            style={{
              display: "block",
              fontSize: "0.875rem",
              fontWeight: "500",
              color: "#374151",
              marginBottom: "0.5rem",
            }}
          >
            循環次數
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={totalCycles}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onTotalCyclesChange(parseInt(e.target.value) || 1)
            }
            style={{
              width: "100%",
              padding: "0.5rem 1rem",
              border: "1px solid #d1d5db",
              borderRadius: "0.5rem",
              fontSize: "1rem",
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontSize: "0.875rem",
              fontWeight: "500",
              color: "#374151",
              marginBottom: "0.5rem",
            }}
          >
            專心時間（分鐘）
          </label>
          <input
            type="number"
            min="1"
            max="60"
            value={workDuration}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const value = parseInt(e.target.value) || 1;
              onWorkDurationChange(value);
            }}
            style={{
              width: "100%",
              padding: "0.5rem 1rem",
              border: "1px solid #d1d5db",
              borderRadius: "0.5rem",
              fontSize: "1rem",
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontSize: "0.875rem",
              fontWeight: "500",
              color: "#374151",
              marginBottom: "0.5rem",
            }}
          >
            休息時間（分鐘）
          </label>
          <input
            type="number"
            min="1"
            max="30"
            value={breakDuration}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const value = parseInt(e.target.value) || 1;
              onBreakDurationChange(value);
            }}
            style={{
              width: "100%",
              padding: "0.5rem 1rem",
              border: "1px solid #d1d5db",
              borderRadius: "0.5rem",
              fontSize: "1rem",
            }}
          />
        </div>
      </div>

      {/* 網站封鎖設定 */}
      <BlockedSitesSettings
        blockedSites={blockedSites}
        onBlockedSitesChange={onBlockedSitesChange}
      />

      <button
        onClick={onStart}
        style={{
          width: "100%",
          background: "#ef4444",
          color: "white",
          fontWeight: "600",
          padding: "0.75rem",
          borderRadius: "0.5rem",
          border: "none",
          cursor: "pointer",
          marginTop: "1.5rem",
          transition: "background 0.2s",
        }}
        onMouseOver={(e) => (e.currentTarget.style.background = "#dc2626")}
        onMouseOut={(e) => (e.currentTarget.style.background = "#ef4444")}
      >
        開始番茄鐘
      </button>
    </div>
  );
};

export default SettingsPanel;
