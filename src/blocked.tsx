import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

const BlockedPage: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    // 從 storage 載入計時器狀態
    const initTimer = () => {
      if (chrome?.storage) {
        chrome.storage.local.get(
          ["timeLeft", "isRunning", "isWorking", "startTime"],
          (result) => {
            if (result.isRunning && result.isWorking && result.timeLeft) {
              setIsVisible(true);

              // 計算實際剩餘時間
              let actualTimeLeft = result.timeLeft;
              if (result.startTime) {
                const elapsed = Math.floor(
                  (Date.now() - result.startTime) / 1000
                );
                actualTimeLeft = Math.max(0, result.timeLeft - elapsed);
              }

              setTimeLeft(actualTimeLeft);
            } else {
              setIsVisible(false);
            }
          }
        );
      }
    };

    initTimer();

    // 監聽 storage 變化（只在關鍵狀態改變時重新初始化）
    const handleStorageChange = (
      changes: { [key: string]: chrome.storage.StorageChange },
      namespace: string
    ) => {
      if (namespace === "local") {
        if (changes.isRunning || changes.isWorking) {
          initTimer();
        }
      }
    };

    if (chrome?.storage) {
      chrome.storage.onChanged.addListener(handleStorageChange);
    }

    return () => {
      if (chrome?.storage) {
        chrome.storage.onChanged.removeListener(handleStorageChange);
      }
    };
  }, []);

  // 本地倒數計時（避免閃爍）
  useEffect(() => {
    if (timeLeft <= 0) return;

    const startTime = Date.now();
    const initialTime = timeLeft;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const newTimeLeft = Math.max(0, initialTime - elapsed);

      setTimeLeft(newTimeLeft);

      if (newTimeLeft === 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft > 0 ? timeLeft : null]); // 只在 timeLeft 從 0 變為非 0 時重新啟動

  // 格式化時間顯示
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const motivationalTips = [
    "🎯 專注當下，成就未來",
    "💪 每一次專注都是進步",
    "🌟 你正在變得更好",
    "⚡ 保持專注，效率加倍",
    "🔥 現在是專心的黃金時間",
    "🚀 專注力是最強的武器",
    "✨ 堅持就是勝利",
  ];

  const randomTip =
    motivationalTips[Math.floor(Math.random() * motivationalTips.length)];

  if (!isVisible) {
    return null;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        padding: "2rem",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "2rem",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          padding: "3rem",
          maxWidth: "600px",
          width: "100%",
          textAlign: "center",
        }}
      >
        {/* 番茄圖標 */}
        <div style={{ fontSize: "5rem", marginBottom: "1.5rem" }}>🍅</div>

        {/* 標題 */}
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            color: "#1f2937",
            marginBottom: "1rem",
          }}
        >
          專注時間
        </h1>

        {/* 提示文字 */}
        <p
          style={{
            fontSize: "1.125rem",
            color: "#6b7280",
            marginBottom: "2rem",
          }}
        >
          這個網站目前被封鎖，請專注於你的工作！
        </p>

        {/* 倒數計時器 */}
        {timeLeft > 0 && (
          <div
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "1rem",
              padding: "2rem",
              marginBottom: "2rem",
            }}
          >
            <div
              style={{
                fontSize: "0.875rem",
                color: "rgba(255, 255, 255, 0.8)",
                marginBottom: "0.5rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              剩餘時間
            </div>
            <div
              id="timer"
              style={{
                fontSize: "4rem",
                fontWeight: "bold",
                color: "white",
                fontVariantNumeric: "tabular-nums",
                fontFamily: "monospace",
              }}
            >
              {formatTime(timeLeft)}
            </div>
          </div>
        )}

        {/* 勵志標語 */}
        <div
          style={{
            background: "#f9fafb",
            borderRadius: "1rem",
            padding: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          <p
            style={{
              fontSize: "1.25rem",
              color: "#4b5563",
              fontWeight: "500",
              margin: 0,
            }}
          >
            {randomTip}
          </p>
        </div>

        {/* 使用建議 */}
        <div
          style={{
            textAlign: "left",
            background: "#fef3c7",
            borderRadius: "1rem",
            padding: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: "600",
              color: "#92400e",
              marginBottom: "0.75rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            💡 專注小技巧
          </h3>
          <ul
            style={{
              margin: 0,
              paddingLeft: "1.5rem",
              color: "#78350f",
              fontSize: "0.875rem",
              lineHeight: "1.75",
            }}
          >
            <li>關閉其他分心的應用程式</li>
            <li>準備一杯水保持水分</li>
            <li>設定清晰的小目標</li>
            <li>休息時間記得起來活動一下</li>
          </ul>
        </div>

        {/* 提示 */}
        <p
          style={{
            fontSize: "0.875rem",
            color: "#9ca3af",
            margin: 0,
          }}
        >
          工作時間結束後，這個網站將自動解除封鎖 ⏰
        </p>
      </div>
    </div>
  );
};

// 初始化 React 應用
const root = document.getElementById("root");
if (root) {
  ReactDOM.createRoot(root).render(<BlockedPage />);
}

export default BlockedPage;
