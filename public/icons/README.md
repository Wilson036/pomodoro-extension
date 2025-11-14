# 📦 圖標說明

## 需要的圖標

請在此目錄放置以下尺寸的圖標：

- **icon16.png** (16x16 像素) - 工具列顯示
- **icon48.png** (48x48 像素) - 擴展管理頁面
- **icon128.png** (128x128 像素) - Chrome 應用商店和安裝時顯示

## 🎨 設計建議

### 主題
- 🍅 使用番茄造型
- ⏰ 或使用時鐘圖案
- 🎯 簡潔易識別

### 配色
- 主色：紅色 (#EF4444) 或橙色 (#F97316)
- 輔助色：綠色（用於休息狀態）
- 背景：透明或白色

### 風格
- ✅ 扁平化設計
- ✅ 圓潤的邊角
- ✅ 清晰的輪廓
- ✅ 在淺色和深色背景下都清晰可見

## 🛠️ 製作工具推薦

### 線上工具
1. **Figma** - https://www.figma.com/ (推薦)
2. **Canva** - https://www.canva.com/
3. **Photopea** - https://www.photopea.com/ (免費的 Photoshop 替代品)

### 桌面軟體
1. **GIMP** - https://www.gimp.org/ (免費)
2. **Inkscape** - https://inkscape.org/ (向量圖，免費)
3. **Adobe Illustrator** (付費)

## 📐 快速製作步驟

### 方法一：使用 Emoji (最快)

1. 在任何圖片編輯器中創建新文件
2. 設定尺寸（16x16, 48x48, 128x128）
3. 插入番茄 emoji 🍅
4. 調整大小填滿畫布
5. 匯出為 PNG

### 方法二：簡單圖形

1. 在 Figma 或 Canva 創建新設計
2. 繪製一個圓形
3. 填充紅色或橙色
4. 在中間添加白色文字 "P" 或時鐘圖案
5. 匯出三個尺寸的 PNG

### 方法三：AI 生成

使用 AI 圖片生成工具，提示詞：
```
"A simple, flat design icon of a red tomato or timer, 
minimalist style, suitable for a productivity app, 
transparent background"
```

## 🧪 測試圖標

臨時測試可以使用：
1. 純色正方形圖片
2. 或任何 PNG 圖片（只要命名正確）

## ✅ 檢查清單

安裝圖標前確認：
- [ ] 三個尺寸都已準備（16, 48, 128）
- [ ] 檔案格式為 PNG
- [ ] 檔名正確（icon16.png, icon48.png, icon128.png）
- [ ] 圖片清晰無鋸齒
- [ ] 在白色和深色背景下都清晰可見

## 📋 安裝步驟

1. 將三個圖標文件放到此目錄：
   ```
   public/icons/
   ├── icon16.png
   ├── icon48.png
   └── icon128.png
   ```

2. 重新建構專案：
   ```bash
   npm run build
   ```

3. 在 Chrome 擴展頁面重新載入插件

4. 確認新圖標已顯示

## 💡 範例圖標想法

### 設計 1：番茄造型
```
🍅 簡單的紅色番茄輪廓
   配上綠色葉子
```

### 設計 2：時鐘造型
```
⏰ 圓形時鐘
   紅色外框
   白色錶盤
```

### 設計 3：字母 P
```
🔴 紅色圓形背景
   白色字母 "P"
   (代表 Pomodoro)
```

### 設計 4：番茄+時鐘
```
🍅⏰ 結合番茄輪廓
    和時鐘指針
```

## 🎨 色彩參考

```css
/* 推薦配色 */
主紅色: #EF4444
深紅色: #DC2626
橙色: #F97316
綠色: #22C55E (休息狀態)
白色: #FFFFFF
灰色: #6B7280
```

## ❓ 常見問題

**Q: 沒有圖標也能用嗎？**
A: 可以，但會顯示 Chrome 預設圖標。建議添加自訂圖標以提升專業度。

**Q: 圖標必須是正方形嗎？**
A: 是的，而且建議使用透明背景的 PNG 格式。

**Q: 可以使用 SVG 嗎？**
A: Chrome 插件的 manifest.json 目前只支援 PNG 格式的圖標。

**Q: 圖標太模糊怎麼辦？**
A: 確保原始圖片解析度足夠，使用向量圖軟體製作會更清晰。

## 📚 資源連結

- [Chrome Extension 圖標指南](https://developer.chrome.com/docs/extensions/mv3/user_interface/#icons)
- [Flaticon](https://www.flaticon.com/) - 免費圖標資源
- [Icons8](https://icons8.com/) - 圖標和設計資源

---

**祝你設計出漂亮的圖標！** 🎨✨
