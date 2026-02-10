# ProIMS - 原彩庫存管理系統 (Professional Inventory Management System)

這是一個基於 React 和 Tailwind CSS 開發的現代化庫存管理系統，專為平板與桌面環境設計。具備完整的進銷存功能、離線資料儲存 (Local Storage)、以及友善的觸控介面。

## ✨ 主要功能

### 📊 儀表板 (Dashboard)
*   即時檢視總品項數、低庫存警示。
*   快速存取近期異動紀錄。
*   視覺化數據卡片。

### 📦 庫存管理 (Inventory)
*   **完整資料欄位**：品名、規格、材質、分類、庫存量、安全庫存、單價、儲位等。
*   **圖片支援**：支援圖片上傳與預覽，整合 Capacitor 檔案系統以優化效能。
*   **快速操作**：列表直接調整庫存、搜尋與篩選功能。

### 🔄 出入庫作業 (Transactions)
*   **批次處理**：支援一次選取多項物料進行入庫或出庫。
*   **防呆機制**：支援負庫存檢查設定。x
*   **異動紀錄**：自動記錄所有庫存變動，包含操作時間、類型與對象。

### 📝 訂單與客戶管理
*   **訂單系統**：建立進貨/出貨訂單，支援暫存與執行功能。
*   **客戶資料庫**：管理客戶與供應商資訊 (統編、聯絡人、電話、地址)。

### 📈 報表與備份
*   **匯出功能**：支援匯出庫存清單與異動紀錄為 Excel (.csv)。
*   **PDF 列印**：內建 PDF 產生器，可列印盤點報表。
*   **資料備份**：完整系統資料匯出 (JSON) 與還原功能，確保資料安全。

### ⚙️ 個人化設定
*   **主題切換**：內建多款深色/淺色主題 (Dark/Light Mode)。
*   **系統規則**：可設定是否顯示縮圖、是否允許負庫存。

## 🛠️ 技術棧 (Tech Stack)

*   **Frontend Framework**: React.js (Vite)
*   **Styling**: Tailwind CSS
*   **Icons**: Lucide React
*   **Mobile/Native Integration**: Capacitor (Filesystem API for Android storage)
*   **PDF Generation**: html2pdf.js

## 🚀 安裝與執行

確保您的環境已安裝 Node.js。

1.  **安裝依賴套件**:
    ```bash
    npm install
    ```

2.  **啟動開發伺服器**:
    ```bash
    npm run dev
    ```

3.  **建置生產版本**:
    ```bash
    npm run build
    ```

## 📱 行動裝置支援

本專案針對平板觸控操作優化，並透過 Capacitor 支援 Android 原生打包。
如需在 Android 上使用檔案讀寫功能，請確保已設定相關權限。