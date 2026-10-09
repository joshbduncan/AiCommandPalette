# Ai Command Palette 繁體中文版

這個分支為 Ai Command Palette 加入繁體中文介面、Illustrator 繁中搜尋名稱，以及內建的 Astute Graphics 中文別名。

目前內容包括：

- Ai Command Palette 介面字串的繁體中文翻譯。
- 未提供 `zh_TW` 名稱時自動沿用英文，不會因缺少字串而讓指令清單消失。
- 搜尋會同時比對繁中、英文、其他既有語系名稱與 Command Action。
- 756 筆 Illustrator 指令繁中搜尋名稱（由既有中文資料轉寫，並套用常用繁中 Illustrator 術語）。
- 與上游對應的 134 筆 Astute Graphics 中文別名，已直接編入指令資料並保留原始 Command Action 與 Command Type。
- Illustrator 語系檢查指令碼，可用來確認 `$.locale` 的實際值。

> Illustrator 的選單名稱會因版本、平台或 Adobe 用詞調整而不同；若個別繁中名稱尚未對應，仍可用英文名稱或 Command Action 搜尋。

## Astute Graphics 中文自訂指令

`data/custom_commands_zh_TW.csv` 收錄與上游 Astute Graphics 資料相對應的 134 筆中文名稱。建置時會與英文資料配對並直接寫入 `AiCommandPalette.jsx`；中文只用於顯示與搜尋，實際呼叫 Illustrator／Astute Graphics 的 Command Action 與 Command Type 均維持原值。

為避免名稱過長，僅在需要區分濾鏡、即時效果或同名工具時加上「（濾鏡）」或「（即時效果）」標註。

不需要再手動複製或貼入 CSV。開啟這個分支產生的 `AiCommandPalette.jsx` 後，可直接用英文或中文名稱搜尋。

例如：

```csv
ColliderScribe｜碰撞吸附,Snap To Collisions Tool,tool
Texturino｜材質筆刷,TextureBrushTool,tool
Stipplism｜向量點描,Live ASTGStipple,menu
```

## 語系確認

在 Illustrator 中選擇「檔案 → 指令碼 → 其他指令碼…」，執行 `tests/check_illustrator_locale.jsx`，即可查看目前 Illustrator 回傳的語系值。

繁體中文語系目前使用 Adobe ExtendScript 慣用的 `zh_TW` 代碼。實機測試仍以 Illustrator 顯示的結果為準。

## 來源與授權

本專案以 Josh Duncan 的 [Ai Command Palette](https://github.com/joshbduncan/AiCommandPalette) 為基礎修改，原專案與本修改版本均依 [MIT License](LICENSE) 授權。原作者的授權與版權聲明完整保留。

本版本增加繁體中文在地化與 Astute Graphics 中文自訂指令資料。

Astute Graphics 是 Astute Graphics Limited 的產品與商標。本專案與 Astute Graphics Limited 沒有隸屬、合作或背書關係。
