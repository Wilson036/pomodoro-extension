import React, { useState, useEffect, useRef } from "react";
import SettingsPanel from "./components/SettingsPanel";
import TimerDisplay from "./components/TimerDisplay";

const PomodoroTimer: React.FC = () => {
  // 設定狀態
  const [totalCycles, setTotalCycles] = useState<number>(4);
  const [workDuration, setWorkDuration] = useState<number>(25);
  const [breakDuration, setBreakDuration] = useState<number>(5);
  const [blockedSites, setBlockedSites] = useState<string[]>([]);

  // 計時器狀態
  const [currentCycle, setCurrentCycle] = useState<number>(1);
  const [isWorking, setIsWorking] = useState<boolean>(true);
  const [timeLeft, setTimeLeft] = useState<number>(workDuration * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(true);

  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<number | null>(null);

  // 從 Chrome storage 載入設定和狀態
  useEffect(() => {
    if (chrome?.storage) {
      chrome.storage.local.get(
        [
          "totalCycles",
          "workDuration",
          "breakDuration",
          "blockedSites",
          "currentCycle",
          "isWorking",
          "timeLeft",
          "isRunning",
          "showSettings",
          "startTime",
        ],
        (result) => {
          // 載入設定
          if (result.totalCycles) setTotalCycles(result.totalCycles);
          if (result.workDuration) setWorkDuration(result.workDuration);
          if (result.breakDuration) setBreakDuration(result.breakDuration);
          if (result.blockedSites) setBlockedSites(result.blockedSites);

          // 載入計時器狀態
          if (result.currentCycle) setCurrentCycle(result.currentCycle);
          if (result.isWorking !== undefined) setIsWorking(result.isWorking);
          if (result.showSettings !== undefined)
            setShowSettings(result.showSettings);

          // 如果計時器在運行，計算實際剩餘時間
          if (result.isRunning && result.startTime && result.timeLeft) {
            const elapsed = Math.floor((Date.now() - result.startTime) / 1000);
            const newTimeLeft = Math.max(0, result.timeLeft - elapsed);
            setTimeLeft(newTimeLeft);
            setIsRunning(newTimeLeft > 0);
          } else if (result.timeLeft !== undefined) {
            setTimeLeft(result.timeLeft);
            setIsRunning(false);
          }
        }
      );
    }
  }, []);

  // 保存設定和計時器狀態到 Chrome storage（不包含 timeLeft）
  useEffect(() => {
    if (chrome?.storage) {
      chrome.storage.local.get(["startTime"], (result) => {
        const updates = {
          totalCycles,
          workDuration,
          breakDuration,
          blockedSites,
          currentCycle,
          isWorking,
          isRunning,
          showSettings,
          startTime: isRunning ? (result.startTime || Date.now()) : null,
        };
        chrome.storage.local.set(updates);
      });
    }
  }, [
    totalCycles,
    workDuration,
    breakDuration,
    blockedSites,
    currentCycle,
    isWorking,
    isRunning,
    showSettings,
  ]);

  // 單獨保存 timeLeft，避免頻繁觸發其他邏輯
  useEffect(() => {
    if (chrome?.storage && isRunning) {
      chrome.storage.local.set({ timeLeft });
    }
  }, [timeLeft, isRunning]);

  // 保存設定到 Chrome storage
  const saveSettings = () => {
    if (chrome?.storage) {
      chrome.storage.local.set({
        totalCycles,
        workDuration,
        breakDuration,
      });
    }
  };

  // 播放鬧鈴聲音
  const playAlarm = (): void => {
    // 使用 Chrome 通知
    if (chrome?.runtime) {
      const message = isWorking
        ? "工作時間結束，該休息了！"
        : "休息結束，繼續加油！";
      chrome.runtime.sendMessage({
        action: "playAlarm",
        message: message,
      });
    }

    // 同時播放音效
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    }

    const context = audioContextRef.current;
    const duration = 0.3;
    const frequency = 800;

    // 播放三次嗶嗶聲
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(context.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = "sine";

        gainNode.gain.setValueAtTime(0.3, context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          context.currentTime + duration
        );

        oscillator.start(context.currentTime);
        oscillator.stop(context.currentTime + duration);
      }, i * 400);
    }
  };

  // 處理計時器完成
  const handleTimerComplete = (): void => {
    if (isWorking) {
      // 工作時間結束，切換到休息時間
      if (currentCycle < totalCycles) {
        setIsWorking(false);
        setTimeLeft(breakDuration * 60);
      } else {
        // 所有循環完成
        setIsRunning(false);
        if (chrome?.runtime) {
          chrome.runtime.sendMessage({
            action: "playAlarm",
            message: "🎉 恭喜！所有番茄鐘循環已完成！",
          });
        }
        resetTimer();
      }
    } else {
      // 休息時間結束，開始下一個循環
      setCurrentCycle((prev) => prev + 1);
      setIsWorking(true);
      setTimeLeft(workDuration * 60);
    }
  };

  // 計時器邏輯
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      playAlarm();
      handleTimerComplete();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  // 開始/暫停
  const toggleTimer = (): void => {
    setIsRunning(!isRunning);
    if (showSettings) {
      setShowSettings(false);
    }
  };

  // 重置計時器
  const resetTimer = (): void => {
    setIsRunning(false);
    setCurrentCycle(1);
    setIsWorking(true);
    setTimeLeft(workDuration * 60);
    setShowSettings(true);
  };

  // 開始新的計時器（應用設定）
  const startNewTimer = (): void => {
    saveSettings();
    setCurrentCycle(1);
    setIsWorking(true);
    setTimeLeft(workDuration * 60);
    setShowSettings(false);
    setIsRunning(true);
  };

  // 格式化時間顯示
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // 處理設定變更
  const handleWorkDurationChange = (value: number) => {
    setWorkDuration(value);
    if (!isRunning && isWorking) {
      setTimeLeft(value * 60);
    }
  };

  const handleBreakDurationChange = (value: number) => {
    setBreakDuration(value);
    if (!isRunning && !isWorking) {
      setTimeLeft(value * 60);
    }
  };

  const handleShowSettings = () => {
    setShowSettings(true);
    setIsRunning(false);
  };

  // 計算進度百分比
  const progress: number = isWorking
    ? ((workDuration * 60 - timeLeft) / (workDuration * 60)) * 100
    : ((breakDuration * 60 - timeLeft) / (breakDuration * 60)) * 100;

  return (
    <div
      style={{
        minHeight: "500px",
        background: "linear-gradient(to bottom right, #fef2f2, #ffedd5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "1.5rem",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          padding: "2rem",
          width: "100%",
          maxWidth: "28rem",
        }}
      >
        {/* 標題 */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1
            style={{
              fontSize: "1.875rem",
              fontWeight: "bold",
              color: "#1f2937",
              marginBottom: "0.5rem",
            }}
          >
            🍅 番茄鐘
          </h1>
          <p style={{ color: "#6b7280" }}>專注工作，高效休息</p>
        </div>

        {/* 設定面板 */}
        {showSettings && (
          <SettingsPanel
            totalCycles={totalCycles}
            workDuration={workDuration}
            breakDuration={breakDuration}
            blockedSites={blockedSites}
            isRunning={isRunning}
            isWorking={isWorking}
            onTotalCyclesChange={setTotalCycles}
            onWorkDurationChange={handleWorkDurationChange}
            onBreakDurationChange={handleBreakDurationChange}
            onBlockedSitesChange={setBlockedSites}
            onStart={startNewTimer}
          />
        )}

        {/* 計時器顯示 */}
        {!showSettings && (
          <TimerDisplay
            isWorking={isWorking}
            currentCycle={currentCycle}
            totalCycles={totalCycles}
            timeLeft={timeLeft}
            progress={progress}
            isRunning={isRunning}
            formatTime={formatTime}
            onToggleTimer={toggleTimer}
            onReset={resetTimer}
            onShowSettings={handleShowSettings}
          />
        )}

        {/* 說明 */}
        <div
          style={{
            marginTop: "2rem",
            textAlign: "center",
            fontSize: "0.875rem",
            color: "#6b7280",
          }}
        >
          <p>番茄工作法：專注工作，定時休息</p>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
