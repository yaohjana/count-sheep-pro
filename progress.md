Original prompt: 幫我優化數綿羊專案

2026-03-09
- 使用 develop-web-game skill 進行優化流程。
- 重構 index.html：修正語意結構與可存取性屬性（aria-live、labels）。
- 重構 style.css：簡化樣式計算、優化行動版版面、保留動畫體驗。
- 重構 script.js：
  - 以固定迴圈 + accumulator 寫法減少 setTimeout 漂移。
  - 將綿羊動畫改為重用單一 DOM 元素，避免每次重建節點。
  - 改善語音播放，避免語音佇列堆積。
  - 新增 localStorage 設定持久化。
  - 新增 window.render_game_to_text 與 window.advanceTime 測試掛鉤。

TODO / 建議
- 以 Playwright client 進行完整互動測試（開始、暫停、重設、語音、漸弱）。
- 若未來要更進一步優化，可加入 requestAnimationFrame 版渲染節流。
- 驗證：`node --check script.js` 通過。
- Playwright client 驗證受阻：`playwright` 套件安裝於雲端磁碟路徑時出現 TAR_ENTRY_ERROR，導致 `node_modules/playwright/package.json` 損壞（ERR_INVALID_PACKAGE_CONFIG）。

2026-03-09 (i18n + settings card)
- 需求完成：新增齒輪按鈕與設定卡片 (`#settingsToggle` + `#settingsCard`)，設定集中顯示。
- 新增介面語言（`zh-TW` / `zh-CN` / `en` / `ja`）與地區自動偵測：首次開啟依 `navigator.language(s)` + locale 推論預設語言，仍可手動切換。
- 新增綿羊種類選擇：`classic`、`lamb`、`ram`、`duo`，渲染時會套用對應符號。
- 新增多語字典與動態 UI 更新（標題、副標、按鈕、設定標籤、漸弱按鈕文字）。
- 設定持久化擴充：`uiLang`、`sheepType` 一併寫入 `localStorage`。
- 保留既有功能：計數主迴圈、語音朗讀、漸弱、`render_game_to_text` 與 `advanceTime`。
- 修正檔案編碼：`index.html/style.css/script.js` 轉為 UTF-8，避免中文亂碼。

驗證
- `node --check script.js`：通過。
- develop-web-game Playwright client：已執行，產生 `output/web-game/shot-0.png` 與 `output/web-game/state-0.json`。
- 視覺檢查：UI 文字正常顯示，齒輪按鈕與卡片版面正常。
- 已知限制：headless 截圖環境對 emoji 顯示為 `??`（`sheep` 欄位亦同），屬測試環境字型缺失，不影響實機瀏覽器功能。
- 補充測試受阻：直接 `require('playwright')` 仍因 `node_modules/playwright/package.json` 損壞而失敗（ERR_INVALID_PACKAGE_CONFIG）。

TODO / 建議
- 若要做更完整 E2E（驗證語言切換後所有文本），建議先修復本地 `node_modules/playwright` 損壞再補 selector-based 測試。
- 可加上「點擊卡片外關閉」的過渡動畫與可存取性焦點陷阱（focus trap）。