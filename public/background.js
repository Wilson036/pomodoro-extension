// 背景腳本 - 處理通知和持續計時
let timerInterval = null;

// 開始背景計時
function startBackgroundTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
  }

  timerInterval = setInterval(() => {
    chrome.storage.local.get(
      ["isRunning", "timeLeft", "startTime"],
      (result) => {
        if (result.isRunning && result.startTime) {
          const elapsed = Math.floor((Date.now() - result.startTime) / 1000);
          const newTimeLeft = Math.max(0, result.timeLeft - elapsed);

          if (newTimeLeft === 0) {
            // 時間到了，發送通知
            chrome.storage.local.get(["isWorking"], (data) => {
              const message = data.isWorking
                ? "工作時間結束，該休息了！"
                : "休息結束，繼續加油！";

              chrome.notifications.create({
                type: "basic",
                iconUrl: "icons/icon128.png",
                title: "番茄鐘提醒",
                message: message,
                priority: 2,
              });
            });

            // 停止計時器
            chrome.storage.local.set({
              isRunning: false,
            });
          }
        }
      }
    );
  }, 1000);
}

// 停止背景計時
function stopBackgroundTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "playAlarm") {
    // 顯示通知
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon128.png",
      title: "番茄鐘提醒",
      message: request.message || "時間到了！",
      priority: 2,
    });

    sendResponse({ success: true });
  }

  if (request.action === "startTimer") {
    startBackgroundTimer();
    sendResponse({ success: true });
  }

  if (request.action === "stopTimer") {
    stopBackgroundTimer();
    sendResponse({ success: true });
  }

  if (request.action === "createAlarm") {
    chrome.alarms.create("pomodoroAlarm", {
      delayInMinutes: request.delayInMinutes,
    });
    sendResponse({ success: true });
  }

  return true;
});

// 監聽鬧鐘
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "pomodoroAlarm") {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon128.png",
      title: "番茄鐘提醒",
      message: "時間到了！",
      priority: 2,
    });
  }
});

// 保持 service worker 活躍並啟動計時器
chrome.runtime.onInstalled.addListener(() => {
  console.log("番茄鐘插件已安裝");
});

// 當 service worker 啟動時，檢查是否有正在運行的計時器
chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.get(["isRunning"], (result) => {
    if (result.isRunning) {
      startBackgroundTimer();
    }
  });
});

// 監聽 storage 變化，同步計時器狀態
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "local" && changes.isRunning) {
    if (changes.isRunning.newValue) {
      startBackgroundTimer();
    } else {
      stopBackgroundTimer();
    }
  }
});
