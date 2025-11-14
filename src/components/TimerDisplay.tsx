import React from "react";
import StatusBadge from "./StatusBadge";
import CircularProgress from "./CircularProgress";
import ControlButtons from "./ControlButtons";

interface TimerDisplayProps {
  isWorking: boolean;
  currentCycle: number;
  totalCycles: number;
  timeLeft: number;
  progress: number;
  isRunning: boolean;
  formatTime: (seconds: number) => string;
  onToggleTimer: () => void;
  onReset: () => void;
  onShowSettings: () => void;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({
  isWorking,
  currentCycle,
  totalCycles,
  timeLeft,
  progress,
  isRunning,
  formatTime,
  onToggleTimer,
  onReset,
  onShowSettings,
}) => {
  return (
    <>
      {/* 狀態指示 */}
      <StatusBadge
        isWorking={isWorking}
        currentCycle={currentCycle}
        totalCycles={totalCycles}
      />

      {/* 圓形進度條 */}
      <CircularProgress
        progress={progress}
        timeLeft={timeLeft}
        isWorking={isWorking}
        formatTime={formatTime}
      />

      {/* 控制按鈕 */}
      <ControlButtons
        isRunning={isRunning}
        onToggleTimer={onToggleTimer}
        onReset={onReset}
        onShowSettings={onShowSettings}
      />
    </>
  );
};

export default TimerDisplay;
