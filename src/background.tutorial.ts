// 背景腳本 - 處理通知和持續計時
let timerInterval: number | null = null;

// 定義類型
interface StorageData {
  isRunning?: boolean;
  timeLeft?: number;
  startTime?: number;
  isWorking?: boolean;
  blockedSites?: string[];
  totalCycles?: number;
  workDuration?: number;
  breakDuration?: number;
  currentCycle?: number;
  showSettings?: boolean;
}

// ============================================
// 📚 任務 4.1：更新網站封鎖規則（最核心的功能！）
// ============================================
async function updateBlockingRules(
  blockedSites: string[],
  shouldBlock: boolean
): Promise<void> {
  console.log("updateBlockingRules 被調用:", { blockedSites, shouldBlock });

  // TODO: 步驟 1 - 如果不需要封鎖或沒有網站，移除所有規則
  // 提示：
  // 1. 檢查 !blockedSites || blockedSites.length === 0 || !shouldBlock
  // 2. 使用 chrome.declarativeNetRequest.getDynamicRules() 取得現有規則
  // 3. 使用 .map(rule => rule.id) 取得所有規則 ID
  // 4. 使用 chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: [...] })
  // 5. 記得 return，不繼續執行

  // 你的代碼：

  // TODO: 步驟 2 - 創建封鎖規則陣列
  const rules: chrome.declarativeNetRequest.Rule[] = [];

  // TODO: 步驟 3 - 為每個網站創建兩條規則
  // 提示：使用 forEach 遍歷 blockedSites
  blockedSites.forEach((site, index) => {
    // TODO: 為每個網站創建兩條規則：一條匹配 www，一條匹配無 www
    // 提示：
    // 規則 1：匹配 *://*.網站名/*
    // 規則 2：匹配 *://網站名/*

    // 規則 1 的結構：
    // rules.push({
    //   id: ?,  // 使用 index * 2 + 1 計算 ID
    //   priority: 1,
    //   action: {
    //     type: ?,  // chrome.declarativeNetRequest.RuleActionType.REDIRECT
    //     redirect: {
    //       url: ?  // chrome.runtime.getURL("blocked-react.html")
    //     }
    //   },
    //   condition: {
    //     urlFilter: ?,  // `*://*.${site}/*`
    //     resourceTypes: [?]  // chrome.declarativeNetRequest.ResourceType.MAIN_FRAME
    //   }
    // });

    // 規則 2 的結構：
    // rules.push({
    //   id: ?,  // 使用 index * 2 + 2 計算 ID
    //   ...（類似規則 1，但 urlFilter 不同）
    // });

    // 你的代碼：
  });

  console.log("創建的封鎖規則:", rules);

  // TODO: 步驟 4 - 移除舊規則並添加新規則
  // 提示：
  // 1. 先取得現有規則
  // 2. 使用 updateDynamicRules 同時移除舊規則和添加新規則
  // const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
  // const ruleIds = existingRules.map((rule) => rule.id);
  // chrome.declarativeNetRequest.updateDynamicRules({
  //   removeRuleIds: ruleIds,
  //   addRules: rules,
  // });

  // 你的代碼：

  console.log("網站封鎖已啟用，封鎖網站:", blockedSites);
}

// ============================================
// 📚 任務 3.1：開始背景計時
// ============================================
function startBackgroundTimer(): void {
  // TODO: 如果已有計時器，先清除
  // 提示：
  // if (timerInterval) {
  //   clearInterval(timerInterval);
  // }

  // 你的代碼：

  // TODO: 創建新的計時器，每秒檢查一次
  // 提示：
  // 1. 使用 setInterval 每 1000ms 執行一次
  // 2. 從 chrome.storage.local 讀取狀態
  // 3. 計算經過時間和剩餘時間
  // 4. 如果時間到了，發送通知並停止計時器

  timerInterval = setInterval(() => {
    // TODO: 從 storage 讀取當前狀態
    chrome.storage.local.get(
      ["isRunning", "timeLeft", "startTime"],
      (result: StorageData) => {
        // TODO: 檢查計時器是否在運行
        // 提示：if (result.isRunning && result.startTime)

        // TODO: 計算經過時間
        // 提示：const elapsed = Math.floor((Date.now() - result.startTime) / 1000);

        // TODO: 計算新的剩餘時間
        // 提示：const newTimeLeft = Math.max(0, (result.timeLeft || 0) - elapsed);

        // TODO: 如果時間到了（newTimeLeft === 0）
        // 提示：
        // 1. 讀取 isWorking 狀態
        // 2. 根據 isWorking 決定通知訊息
        // 3. 使用 chrome.notifications.create() 發送通知
        // 4. 停止計時器：chrome.storage.local.set({ isRunning: false })

        // 你的代碼：
      }
    );
  }, 1000);
}

// ============================================
// 📚 提示：停止背景計時
// ============================================
function stopBackgroundTimer(): void {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

// 監聽來自 popup 的消息
chrome.runtime.onMessage.addListener(
  (
    request: { action: string; message?: string; delayInMinutes?: number },
    _sender,
    sendResponse
  ) => {
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
  }
);

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

// ============================================
// 📚 任務 3.2：當插件安裝或更新時
// ============================================
chrome.runtime.onInstalled.addListener(() => {
  console.log("番茄鐘插件已安裝");

  // TODO: 檢查是否有正在運行的計時器
  // 提示：
  // 1. 使用 chrome.storage.local.get() 讀取狀態
  // 2. 如果 isRunning 為 true，調用 startBackgroundTimer()
  // 3. 如果是工作時間且有封鎖列表，調用 updateBlockingRules()

  // 你的代碼：
});

// ============================================
// 📚 任務 3.2：當 service worker 啟動時
// ============================================
chrome.runtime.onStartup.addListener(() => {
  // TODO: 類似 onInstalled，檢查並恢復計時器狀態

  // 你的代碼：
});

// ============================================
// 📚 任務 4.2：監聽 storage 變化，同步網站封鎖
// ============================================
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

    // TODO: 同步網站封鎖狀態
    // 提示：
    // 1. 檢查是否有 isWorking、blockedSites 或 isRunning 的變化
    // 2. 從 storage 讀取最新的狀態
    // 3. 計算 shouldBlock = isWorking && isRunning
    // 4. 調用 updateBlockingRules(blockedSites, shouldBlock)

    // 關鍵問題：
    // Q1: 為什麼不在 timeLeft 變化時更新封鎖規則？
    // A1: timeLeft 每秒都變化，會導致頻繁更新規則，影響性能

    // Q2: 什麼時候應該封鎖網站？
    // A2: 同時滿足兩個條件：
    //     - isWorking = true（工作時段）
    //     - isRunning = true（計時器運行中）

    // Q3: 休息時段或暫停時應該封鎖嗎？
    // A3: 不應該，用戶需要放鬆或可能需要查看被封鎖的網站

    // 你的代碼：
  }
});

// 防止未使用的導出錯誤
export {};
