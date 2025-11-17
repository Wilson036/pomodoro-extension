// 本地倒數計時器
let localTimeLeft = 0;
let timerInterval = null;
let startTime = null;

// 更新顯示
function updateDisplay() {
  const timerElement = document.getElementById("timer");

  if (localTimeLeft > 0) {
    const minutes = Math.floor(localTimeLeft / 60);
    const seconds = localTimeLeft % 60;
    timerElement.textContent = `${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
}

// 開始本地倒數
function startLocalCountdown(initialTime) {
  // 清除舊的計時器
  if (timerInterval) {
    clearInterval(timerInterval);
  }

  localTimeLeft = initialTime;
  startTime = Date.now();

  // 立即更新一次
  updateDisplay();

  // 每秒更新
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    localTimeLeft = Math.max(0, initialTime - elapsed);

    updateDisplay();

    if (localTimeLeft === 0) {
      clearInterval(timerInterval);
    }
  }, 1000);
}

// 從 storage 載入並開始計時
function initTimer() {
  chrome.storage.local.get(
    ["timeLeft", "isRunning", "isWorking", "startTime"],
    (result) => {
      const timerSection = document.getElementById("timer-section");

      if (result.isRunning && result.isWorking && result.timeLeft) {
        timerSection.style.display = "block";

        // 計算實際剩餘時間
        let actualTimeLeft = result.timeLeft;
        if (result.startTime) {
          const elapsed = Math.floor((Date.now() - result.startTime) / 1000);
          actualTimeLeft = Math.max(0, result.timeLeft - elapsed);
        }

        startLocalCountdown(actualTimeLeft);
      } else {
        timerSection.style.display = "none";
        if (timerInterval) {
          clearInterval(timerInterval);
        }
      }
    }
  );
}

// 初始化
initTimer();

// 監聽 storage 變化（只在狀態改變時重新初始化）
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "local") {
    // 只在關鍵狀態改變時重新初始化
    if (changes.isRunning || changes.isWorking) {
      initTimer();
    }
  }
});
