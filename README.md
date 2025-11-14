# 🍅 番茄鐘 Chrome 插件

一個功能完整的番茄鐘計時器 Chrome 擴展插件，使用 React + TypeScript 開發，幫助你提高工作效率。

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ 功能特點

- ⏰ **自訂循環次數**：設定你需要的番茄鐘循環數量
- 🎯 **靈活時間設定**：自由調整專心時間和休息時間
- 🔔 **聲音提醒**：時間到了會播放鬧鈴音效（三聲嗶嗶）
- 📢 **桌面通知**：使用 Chrome 通知系統提醒你
- 💾 **記憶設定**：自動保存你的個人偏好設定
- 🎨 **美觀界面**：簡潔直觀的用戶界面，漸層色彩設計
- 📊 **進度顯示**：圓形進度條實時顯示進度百分比
- 🔄 **自動切換**：工作和休息時間自動切換

## 🚀 快速開始

### 前置需求

- Node.js (v16 或更高版本)
- npm 或 yarn
- Chrome 瀏覽器

### 安裝步驟

1. **安裝依賴**

```bash
npm install
```

2. **建構插件**

```bash
npm run build
```

編譯後的文件會輸出到 `dist/` 目錄。

3. **載入到 Chrome**

- 打開 Chrome 瀏覽器
- 在網址列輸入 `chrome://extensions/`
- 開啟右上角的「開發人員模式」
- 點擊「載入未封裝項目」
- 選擇專案中的 `dist/` 資料夾
- 插件圖標會出現在瀏覽器工具列

## 🎮 使用方法

1. 點擊瀏覽器工具列的番茄鐘圖標
2. 在設定面板中調整：
   - 循環次數（預設 4 次）
   - 專心時間（預設 25 分鐘）
   - 休息時間（預設 5 分鐘）
3. 點擊「開始番茄鐘」按鈕
4. 專注工作，計時器會自動切換工作和休息時段
5. 時間到了會收到通知和聲音提醒
6. 完成所有循環後會顯示完成通知

## 🛠️ 開發

### 開發模式

```bash
npm run dev
```

此命令會監聽文件變化並自動重新編譯。修改代碼後，在 Chrome 擴展頁面點擊「重新載入」即可看到變更。

### 清理建構

```bash
npm run clean
```

清理 `dist/` 目錄。

## 📦 技術棧

| 技術 | 版本 | 用途 |
|------|------|------|
| React | 18.x | UI 框架 |
| TypeScript | 5.x | 類型安全 |
| Webpack | 5.x | 模組打包 |
| Lucide React | 0.263.x | 圖標庫 |
| Chrome Extension API | Manifest V3 | 瀏覽器擴展功能 |

## 📁 專案結構

```
pomodoro-extension/
├── src/
│   ├── Pomodoro.tsx      # 主要番茄鐘組件
│   └── popup.tsx         # React 入口文件
├── public/
│   ├── manifest.json     # Chrome 插件配置
│   ├── popup.html        # 彈窗 HTML
│   ├── background.js     # 背景腳本
│   └── icons/           # 插件圖標（需自行添加）
├── dist/                 # 編譯輸出目錄（自動生成）
├── package.json          # npm 依賴和腳本
├── tsconfig.json         # TypeScript 配置
├── webpack.config.js     # Webpack 打包配置
├── .gitignore           # Git 忽略文件
└── README.md            # 說明文檔
```

## 🎨 自訂圖標

為了更好的視覺效果，建議添加自訂圖標：

1. 準備三個尺寸的 PNG 圖標：
   - `icon16.png` (16x16 像素)
   - `icon48.png` (48x48 像素)
   - `icon128.png` (128x128 像素)

2. 將這些圖標放到 `public/icons/` 目錄

3. 重新建構：`npm run build`

4. 在 Chrome 擴展頁面點擊「重新載入」按鈕

**圖標設計建議**：
- 使用番茄或時鐘相關的圖案
- 保持簡潔，易於識別
- 使用紅色或橙色為主色調
- 確保在淺色和深色背景下都清晰可見

## 🔧 Chrome 權限說明

插件需要以下 Chrome 權限：

- **alarms** - 用於創建計時器鬧鈴
- **notifications** - 用於顯示桌面通知
- **storage** - 用於保存用戶設定

這些權限都是番茄鐘功能所必需的。

## 🐛 故障排除

### 建構失敗

如果 `npm run build` 失敗：

1. 刪除 `node_modules` 和 `package-lock.json`
2. 重新安裝：
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```
3. 確認 Node.js 版本符合要求

### 插件無法載入

- 確保已執行 `npm run build`
- 檢查 `dist/` 目錄是否包含所有必要文件
- 確認已開啟「開發人員模式」
- 查看 Chrome 擴展頁面的錯誤訊息

### 通知不顯示

- 檢查 Chrome 通知權限（設定 > 隱私權和安全性 > 網站設定 > 通知）
- 確認系統通知設定已啟用
- 檢查系統的「請勿打擾」模式

### 音效無法播放

- 檢查系統音量
- 確認瀏覽器音訊權限
- 嘗試與網頁互動後再測試（瀏覽器自動播放政策）

## 💡 功能路線圖

未來可能添加的功能：

- [ ] 長休息時間設定（每 N 個循環後）
- [ ] 統計數據和歷史記錄
- [ ] 自訂音效選擇
- [ ] 深色模式支援
- [ ] 多語言支援
- [ ] 快捷鍵支援
- [ ] 背景持續運行（使用 Service Worker）

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

如果你想為專案做出貢獻：

1. Fork 此專案
2. 創建你的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的變更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 📄 授權

MIT License - 可自由使用、修改和分發

## 📚 參考資料

- [Chrome Extension 官方文檔](https://developer.chrome.com/docs/extensions/)
- [React 文檔](https://react.dev/)
- [TypeScript 文檔](https://www.typescriptlang.org/)
- [番茄工作法介紹](https://zh.wikipedia.org/wiki/%E7%95%AA%E8%8C%84%E5%B7%A5%E4%BD%9C%E6%B3%95)

## 👨‍💻 作者

Your Name

## 📧 聯絡方式

如有問題或建議，歡迎聯繫：your.email@example.com

---

**享受高效的番茄工作法！** 🍅✨

用番茄鐘提升工作專注力，保持高效的工作節奏！
