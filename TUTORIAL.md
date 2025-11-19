# 番茄鐘插件教學 - 一步步實作

這個教學會帶你從零開始實作一個功能完整的番茄鐘 Chrome 插件，包含網站封鎖功能。

## 📚 目錄

1. [第一階段：基礎計時器](#第一階段基礎計時器)
2. [第二階段：狀態持久化](#第二階段狀態持久化)
3. [第三階段：背景運行](#第三階段背景運行)
4. [第四階段：網站封鎖](#第四階段網站封鎖)
5. [第五階段：優化與完善](#第五階段優化與完善)

---

## 第一階段：基礎計時器

### 目標
實作一個基本的倒數計時器，可以開始、暫停、重置。

### 需要實作的功能

#### 📝 任務 1.1：計時器邏輯
**位置**：`src/Pomodoro.tsx` 第 186-202 行

**提示**：
- 使用 `useEffect` 監聽 `isRunning` 和 `timeLeft`
- 當計時器運行時，每秒減少 `timeLeft`
- 當 `timeLeft` 為 0 時，觸發完成邏輯

**關鍵問題**：
1. 如何使用 `setInterval` 實現倒數？
2. 如何清理 interval 避免記憶體洩漏？
3. 什麼時候應該呼叫 `playAlarm()`？

#### 📝 任務 1.2：時間格式化
**位置**：`src/Pomodoro.tsx` 第 231-238 行

**提示**：
- 將秒數轉換為 `MM:SS` 格式
- 使用 `Math.floor()` 計算分鐘數
- 使用 `%` 運算子取得剩餘秒數
- 使用 `padStart(2, '0')` 補零

**範例**：125 秒 → "02:05"

---

## 第二階段：狀態持久化

### 目標
讓計時器狀態保存到 Chrome Storage，關閉 popup 後仍能保持。

#### 📝 任務 2.1：載入狀態
**位置**：`src/Pomodoro.tsx` 第 22-64 行

**提示**：
- 使用 `chrome.storage.local.get()` 讀取保存的狀態
- 需要載入：設定值、計時器狀態、剩餘時間
- 如果計時器在運行，需要計算實際經過的時間

**關鍵問題**：
1. 如何計算實際經過的時間？（提示：`Date.now() - startTime`）
2. 為什麼要 `Math.max(0, ...)`？
3. 什麼時候應該設定 `isRunning = false`？

#### 📝 任務 2.2：保存狀態
**位置**：`src/Pomodoro.tsx` 第 66-100 行

**提示**：
- 使用 `chrome.storage.local.set()` 保存狀態
- 分兩個 effect：一個保存設定和狀態，一個只保存 `timeLeft`
- 保存 `startTime` 用於計算實際經過時間

**關鍵問題**：
1. 為什麼要分兩個 `useEffect`？
2. `startTime` 應該在什麼時候更新？
3. 為什麼 `timeLeft` 要單獨保存？

---

## 第三階段：背景運行

### 目標
即使關閉 popup，計時器也能在背景繼續運行並發送通知。

#### 📝 任務 3.1：背景計時器
**位置**：`src/background.ts` 第 91-129 行

**提示**：
- 在 service worker 中運行計時器
- 監聽 `chrome.storage.local` 的變化
- 計時結束時發送通知

**實作步驟**：
1. 創建 `setInterval` 持續檢查時間
2. 從 storage 讀取當前狀態
3. 計算實際剩餘時間
4. 時間到時使用 `chrome.notifications.create()`

#### 📝 任務 3.2：生命週期管理
**位置**：`src/background.ts` 第 194-225 行

**提示**：
- 監聽插件安裝和啟動事件
- 檢查是否有正在運行的計時器
- 恢復計時器狀態

**關鍵問題**：
1. 為什麼需要 `onInstalled` 和 `onStartup` 兩個監聽器？
2. 什麼情況下需要恢復網站封鎖？

---

## 第四階段：網站封鎖

### 目標
在工作時段自動封鎖指定網站，提高專注力。

#### 📝 任務 4.1：創建封鎖規則
**位置**：`src/background.ts` 第 18-88 行

**這是最核心的功能！**

**提示**：
- 使用 `chrome.declarativeNetRequest` API
- 為每個網站創建兩條規則（帶 www 和不帶 www）
- 使用 `REDIRECT` 動作重定向到封鎖頁面

**實作步驟**：

**步驟 1：清除舊規則**
```typescript
// 如果不需要封鎖，應該做什麼？
// 提示：使用 getDynamicRules() 和 updateDynamicRules()
```

**步驟 2：計算規則 ID**
```typescript
// 為什麼使用 index * 2 + 1 和 index * 2 + 2？
// 如果有 3 個網站，會產生哪些 ID？
```

**步驟 3：創建規則對象**
```typescript
{
  id: ?,  // 規則的唯一 ID
  priority: ?,  // 優先級
  action: {
    type: ?,  // 使用 REDIRECT
    redirect: {
      url: ?  // 重定向到哪個頁面？
    }
  },
  condition: {
    urlFilter: ?,  // 要匹配的 URL 模式
    resourceTypes: [?]  // 只攔截什麼類型的請求？
  }
}
```

**關鍵問題**：
1. `urlFilter` 的格式是什麼？
   - `*://*.youtube.com/*` 匹配什麼？
   - `*://youtube.com/*` 匹配什麼？
2. 為什麼只用 `MAIN_FRAME`？
3. 如何取得 `blocked-react.html` 的完整 URL？

#### 📝 任務 4.2：同步封鎖狀態
**位置**：`src/background.ts` 第 228-258 行

**提示**：
- 監聽 `chrome.storage.onChanged`
- 只在工作時段且計時器運行時封鎖
- 狀態改變時自動更新規則

**實作邏輯**：
```typescript
// 什麼時候應該封鎖網站？
const shouldBlock = ? && ?;

// 提示：需要同時滿足兩個條件
// 1. 是工作時段 (isWorking)
// 2. 計時器在運行 (isRunning)
```

**關鍵問題**：
1. 為什麼不在 `timeLeft` 變化時更新規則？
2. 休息時段應該封鎖網站嗎？
3. 暫停計時器時應該封鎖網站嗎？

---

## 第五階段：優化與完善

### 任務 5.1：處理邊界情況

**思考以下情況**：
1. 用戶在工作時段中途修改封鎖列表
2. 用戶關閉瀏覽器後重新打開
3. 計時器運行時修改工作時長
4. 所有循環完成後的狀態

### 任務 5.2：改進用戶體驗

**可以改進的地方**：
1. 添加音效開關
2. 顯示今日完成的番茄鐘數量
3. 自定義封鎖頁面的訊息
4. 添加快捷鍵支持

---

## 🎯 挑戰題

### 挑戰 1：白名單模式
實作一個白名單模式，只允許訪問特定網站。

**提示**：
- 使用 `declarativeNetRequest` 的優先級
- 創建一條低優先級的規則封鎖所有網站
- 創建高優先級的規則允許白名單網站

### 挑戰 2：統計功能
記錄每天完成的番茄鐘數量和專注時間。

**提示**：
- 使用 `chrome.storage.local` 保存統計數據
- 按日期分組
- 在 popup 中顯示圖表

### 挑戰 3：進階封鎖
封鎖特定關鍵字的搜索結果。

**提示**：
- 監聽 URL 變化
- 使用 `urlFilter` 匹配查詢參數
- 注入 content script 過濾內容

---

## 📖 參考資料

### Chrome Extension APIs
- [chrome.declarativeNetRequest](https://developer.chrome.com/docs/extensions/reference/declarativeNetRequest/)
- [chrome.storage](https://developer.chrome.com/docs/extensions/reference/storage/)
- [chrome.notifications](https://developer.chrome.com/docs/extensions/reference/notifications/)
- [Service Workers](https://developer.chrome.com/docs/extensions/mv3/service_workers/)

### React Hooks
- [useEffect](https://react.dev/reference/react/useEffect)
- [useState](https://react.dev/reference/react/useState)
- [useRef](https://react.dev/reference/react/useRef)

---

## 🐛 常見問題

### Q1: 為什麼計時器不準確？
**A**: 使用 `setInterval` 會有誤差，應該保存 `startTime` 並計算實際經過時間。

### Q2: 為什麼封鎖規則沒生效？
**A**: 檢查：
1. Manifest 中是否有 `declarativeNetRequest` 權限
2. `resourceTypes` 是否正確
3. URL filter 格式是否正確

### Q3: 關閉 popup 後計時器停止了？
**A**: 需要在 background service worker 中運行計時器邏輯。

### Q4: 修改設定後計時器狀態錯亂？
**A**: 確保 `useEffect` 的依賴陣列正確，避免不必要的觸發。

---

## ✅ 完成檢查清單

- [ ] 基礎計時器可以開始、暫停、重置
- [ ] 時間格式正確顯示（MM:SS）
- [ ] 關閉 popup 後狀態保持
- [ ] 重新打開瀏覽器後狀態恢復
- [ ] 背景計時器正常運行
- [ ] 時間到時發送通知
- [ ] 工作時段自動封鎖網站
- [ ] 休息時段自動解除封鎖
- [ ] 修改封鎖列表即時生效
- [ ] 所有循環完成後正確重置

---

## 💡 學習建議

1. **先理解再實作**：每個功能先看懂邏輯，再動手寫代碼
2. **使用 console.log**：在關鍵位置打印日誌幫助除錯
3. **一步步測試**：完成一個階段就測試，不要一次寫完
4. **閱讀官方文檔**：遇到 API 不清楚就查文檔
5. **理解生命週期**：掌握 React 組件和 Chrome Extension 的生命週期

祝你學習愉快！🎉
