# WordPress 後台設定指南

## 📋 目錄結構

您需要在 WordPress 後台建立以下內容：

### 1. 分類設定

前往：**文章 → 分類**

建立以下分類：

| 分類名稱 | Slug | 用途 |
|---------|------|------|
| Banner | banner | 首頁輪播橫幅 |
| Products | products | 設計哲學/產品展示 |
| News | news | 最新消息 |

---

## 🎨 1. Banner 輪播設定

### 步驟：

1. **新增文章**：前往 **文章 → 新增文章**

2. **設定分類**：勾選 **Banner** 分類

3. **填寫內容**：
   - **標題**：主標題（例如：沙發必須與眾不同）
   - **特色圖片**：上傳背景圖片（建議尺寸：1920x1080px）
   - **摘要**：副標題（例如：Living Room Exceptional）

4. **自訂欄位（選用）**：
   如果您安裝了 ACF (Advanced Custom Fields) 外掛，可以新增：
   - `subtitle`：英文副標題
   - `english_title`：英文標題
   - `button_text`：按鈕文字
   - `button_link`：按鈕連結

5. **發布文章**

### 範例：

```
標題：沙發必須與眾不同
分類：Banner
特色圖片：[上傳客廳沙發圖片]
摘要：Living Room Exceptional
```

---

## 🛋️ 2. 產品/設計哲學設定

### 步驟：

1. **新增文章**：前往 **文章 → 新增文章**

2. **設定分類**：勾選 **Products** 分類

3. **填寫內容**：
   - **標題**：產品名稱（例如：義式家居設計哲學）
   - **內容**：產品描述
   - **特色圖片**：主要產品圖片

4. **自訂欄位（使用 ACF）**：
   - `country`：國家（例如：germany, italy, spain, usa, canada）
   - `year`：年份（例如：SINCE 1999）
   - `feature_text`：特色描述
   - `main_image`：主圖片 URL（或使用特色圖片）
   - `feature_image`：特寫圖片 URL

5. **發布文章**

### 範例產品 1：德國

```
標題：義式家居設計哲學
分類：Products
內容：21年家具生產製造設計經驗積澱，摸索推出義式輕奢品牌——德客·皮沙發，專為3億新中產量身打造。
特色圖片：[上傳沙發圖片]

自訂欄位：
- country: germany
- year: SINCE 1999
- feature_text: 聚焦牛皮純手工製成，保留細節紋理，高品質、高質感，呈現出與眾不同的輕奢格調，聞名于海內外。
```

### 範例產品 2：意大利

```
標題：羅馬藝術經典傳承
分類：Products
內容：汲取羅馬建築的黃金比例靈感，將古典美學注入現代家居。每一處縫線都訴說著文藝復興的優雅故事。
特色圖片：[上傳沙發圖片]

自訂欄位：
- country: italy
- year: SINCE 1985
- feature_text: 選用托斯卡納頂級植鞣革，隨時間推移更顯溫潤光澤，為您的客廳帶來如陳年紅酒般的醇厚韻味。
```

---

## 🔧 安裝 ACF 外掛（選用但建議）

### 為什麼需要 ACF？

ACF (Advanced Custom Fields) 讓您可以為文章新增自訂欄位，更靈活地管理內容。

### 安裝步驟：

1. 前往：**外掛 → 安裝外掛**
2. 搜尋：**Advanced Custom Fields**
3. 安裝並啟用

### 建立欄位群組：

#### Banner 欄位群組

1. 前往：**自訂欄位 → 新增欄位群組**
2. 標題：**Banner 欄位**
3. 新增欄位：
   - `subtitle` (文字)
   - `english_title` (文字)
   - `button_text` (文字)
   - `button_link` (URL)
4. 位置規則：**分類 = Banner**
5. 發布

#### Product 欄位群組

1. 前往：**自訂欄位 → 新增欄位群組**
2. 標題：**Product 欄位**
3. 新增欄位：
   - `country` (文字) - 國家代碼
   - `year` (文字) - 年份
   - `feature_text` (文字區域) - 特色描述
   - `main_image` (圖片) - 主圖片
   - `feature_image` (圖片) - 特寫圖片
4. 位置規則：**分類 = Products**
5. 發布

---

## 📝 快速建立範例內容

### Banner 範例（建立 3 個）

1. **Banner 1**
   - 標題：沙發必須與眾不同
   - 分類：Banner
   - 特色圖片：客廳沙發場景

2. **Banner 2**
   - 標題：義式輕奢生活
   - 分類：Banner
   - 特色圖片：現代客廳

3. **Banner 3**
   - 標題：品味生活從此開始
   - 分類：Banner
   - 特色圖片：優雅沙發

### Product 範例（建立 5 個）

依照上面的範例，建立 5 個產品文章，分別對應：
- 德國 (germany)
- 意大利 (italy)
- 西班牙 (spain)
- 美國 (usa)
- 加拿大 (canada)

---

## ✅ 檢查清單

- [ ] 建立 Banner 分類
- [ ] 建立 Products 分類
- [ ] 建立 News 分類
- [ ] 安裝 ACF 外掛（選用）
- [ ] 建立 Banner 欄位群組（選用）
- [ ] 建立 Product 欄位群組（選用）
- [ ] 新增至少 1 個 Banner 文章
- [ ] 新增至少 1 個 Product 文章
- [ ] 為所有文章設定特色圖片

---

## 🔍 測試

完成設定後：

1. 前往：`http://localhost/headless/wp-json/wp/v2/posts?categories=1`
   - 應該看到 Banner 文章的 JSON 資料

2. 前往：`http://localhost/headless/wp-json/wp/v2/posts?categories=2`
   - 應該看到 Product 文章的 JSON 資料

3. 重新整理前端：`http://localhost:3000`
   - Banner 和 Product 應該會顯示 WordPress 的內容

---

## 💡 提示

- **圖片尺寸建議**：
  - Banner 背景：1920x1080px
  - 產品主圖：1000x600px
  - 產品特寫：600x600px

- **分類 ID 查詢**：
  前往 **文章 → 分類**，點擊分類名稱，網址列會顯示 `tag_ID=X`，X 就是分類 ID

- **如果分類 ID 不是 1 和 2**：
  修改 `lib/wordpress.ts` 中的 `categories=1` 和 `categories=2` 為實際的分類 ID
