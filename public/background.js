// 背景腳本 - 處理通知和持續計時
let timerInterval = null;
let isBlockingEnabled = false;

// 更新網站封鎖規則
async function updateBlockingRules(blockedSites, shouldBlock) {
  console.log("updateBlockingRules 被調用:", { blockedSites, shouldBlock });

  if (!blockedSites || blockedSites.length === 0 || !shouldBlock) {
    // 移除所有規則
    const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
    const ruleIds = existingRules.map((rule) => rule.id);
    if (ruleIds.length > 0) {
      console.log("移除封鎖規則:", ruleIds);
      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: ruleIds,
      });
    }
    isBlockingEnabled = false;
    console.log("網站封鎖已停用");
    return;
  }

  // 創建封鎖規則
  const rules = [];
  blockedSites.forEach((site, index) => {
    // 為每個網站創建兩條規則：一條匹配 www，一條匹配無 www
    rules.push(
      {
        id: index * 2 + 1,
        priority: 1,
        action: {
          type: "redirect",
          redirect: {
            url: chrome.runtime.getURL("blocked.html"),
          },
        },
        condition: {
          urlFilter: `*://*.${site}/*`,
          resourceTypes: ["main_frame"],
        },
      },
      {
        id: index * 2 + 2,
        priority: 1,
        action: {
          type: "redirect",
          redirect: {
            url: chrome.runtime.getURL("blocked.html"),
          },
        },
        condition: {
          urlFilter: `*://${site}/*`,
          resourceTypes: ["main_frame"],
        },
      }
    );
  });

  console.log("創建的封鎖規則:", rules);

  // 移除舊規則並添加新規則
  const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
  const ruleIds = existingRules.map((rule) => rule.id);

  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: ruleIds,
    addRules: rules,
  });

  isBlockingEnabled = true;
  console.log("網站封鎖已啟用，封鎖網站:", blockedSites);
}

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

// 當插件安裝或更新時
chrome.runtime.onInstalled.addListener(() => {
  console.log("番茄鐘插件已安裝");
  // 檢查是否有正在運行的計時器
  chrome.storage.local.get(["isRunning", "isWorking", "blockedSites"], (result) => {
    if (result.isRunning) {
      startBackgroundTimer();
      // 如果是專心時間，啟用網站封鎖
      if (result.isWorking && result.blockedSites) {
        updateBlockingRules(result.blockedSites, true);
      }
    }
  });
});

// 當 service worker 啟動時，檢查是否有正在運行的計時器
chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.get(["isRunning", "isWorking", "blockedSites"], (result) => {
    if (result.isRunning) {
      startBackgroundTimer();
      // 如果是專心時間，啟用網站封鎖
      if (result.isWorking && result.blockedSites) {
        updateBlockingRules(result.blockedSites, true);
      }
    }
  });
});

// 監聽 storage 變化，同步計時器狀態和網站封鎖
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "local") {
    // 同步計時器狀態
    if (changes.isRunning) {
      if (changes.isRunning.newValue) {
        startBackgroundTimer();
      } else {
        stopBackgroundTimer();
      }
    }

    // 同步網站封鎖狀態（只在關鍵狀態改變時，不包含 timeLeft）
    if (changes.isWorking || changes.blockedSites || changes.isRunning) {
      chrome.storage.local.get(["isWorking", "blockedSites", "isRunning"], (result) => {
        // 只在專心時間且計時器運行時封鎖
        const shouldBlock = result.isWorking && result.isRunning;
        console.log("storage 變化觸發更新封鎖規則:", {
          changes: Object.keys(changes),
          isWorking: result.isWorking,
          isRunning: result.isRunning,
          shouldBlock: shouldBlock,
          blockedSites: result.blockedSites,
        });
        updateBlockingRules(result.blockedSites || [], shouldBlock);
      });
    }
  }
});
