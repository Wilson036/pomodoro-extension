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

  // ============================================
  // 📚 任務 2.1：從 Chrome storage 載入設定和狀態
  // ============================================
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
          // TODO: 載入設定值
          // 提示：使用 if (result.xxx) setXxx(result.xxx)
          // if (result.totalCycles) setTotalCycles(result.totalCycles);
          // ...

          // TODO: 載入計時器狀態
          // if (result.currentCycle) setCurrentCycle(result.currentCycle);
          // ...

          // TODO: 如果計時器在運行，計算實際剩餘時間
          // 提示：
          // 1. 檢查 result.isRunning && result.startTime && result.timeLeft
          // 2. 計算經過時間：elapsed = (Date.now() - result.startTime) / 1000
          // 3. 計算新的剩餘時間：newTimeLeft = Math.max(0, result.timeLeft - elapsed)
          // 4. 更新 timeLeft 和 isRunning 狀態

          // 你的代碼：
        }
      );
    }
  }, []);

  // ============================================
  // 📚 任務 2.2：保存設定和計時器狀態到 Chrome storage
  // ============================================
  useEffect(() => {
    if (chrome?.storage) {
      chrome.storage.local.get(["startTime"], (result) => {
        // TODO: 創建要保存的資料對象
        // 提示：
        // 1. 包含所有設定值和狀態
        // 2. startTime 應該在 isRunning 為 true 時保存，否則為 null
        // 3. 使用 result.startTime || Date.now() 避免重複記錄開始時間

        const updates = {
          // 你的代碼：填入要保存的欄位
        };

        // TODO: 保存到 storage
        // chrome.storage.local.set(updates);
      });
    }
  }, [
    // TODO: 填入依賴陣列
    // 提示：需要包含所有會影響保存資料的狀態
  ]);

  // ============================================
  // 📚 提示：單獨保存 timeLeft
  // 為什麼要單獨保存？避免 timeLeft 每秒變化時觸發上面的 effect
  // ============================================
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

  // ============================================
  // 📚 任務 1.1：計時器邏輯
  // ============================================
  useEffect(() => {
    // TODO: 當計時器運行且時間大於 0 時，每秒減少 1
    // 提示：
    // 1. 檢查 isRunning && timeLeft > 0
    // 2. 使用 setInterval 每 1000ms 執行一次
    // 3. 使用 setTimeLeft(prev => prev - 1) 更新時間
    // 4. 將 interval ID 存到 intervalRef.current

    // TODO: 當時間為 0 且計時器運行時
    // 提示：
    // 1. 呼叫 playAlarm() 播放鬧鈴
    // 2. 呼叫 handleTimerComplete() 處理完成邏輯

    // 你的代碼：

    // TODO: 清理 interval（避免記憶體洩漏）
    // 提示：在 return 函數中清理
    return () => {
      // 你的代碼：
    };
  }, [isRunning, timeLeft]); // 依賴陣列

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

  // ============================================
  // 📚 任務 1.2：格式化時間顯示
  // ============================================
  const formatTime = (seconds: number): string => {
    // TODO: 將秒數轉換為 MM:SS 格式
    // 提示：
    // 1. 計算分鐘數：Math.floor(seconds / 60)
    // 2. 計算剩餘秒數：seconds % 60
    // 3. 使用 padStart(2, '0') 補零
    // 4. 返回格式：`${mins}:${secs}`

    // 你的代碼：
    return "00:00"; // 替換這行
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
