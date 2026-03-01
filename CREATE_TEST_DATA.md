# WordPress 測試資料建立腳本

這個文件包含了快速建立測試資料的 SQL 指令。

## 📌 使用方式

1. 登入 phpMyAdmin：`http://localhost/phpmyadmin`
2. 選擇資料庫：`headless_db`
3. 點擊「SQL」標籤
4. 複製下面的 SQL 指令並執行

---

## 🎨 建立 Banner 分類（ID=1）

```sql
-- 檢查是否已存在 Banner 分類
SELECT * FROM wp_terms WHERE name = 'Banner';

-- 如果不存在，執行以下指令建立
INSERT INTO wp_terms (name, slug, term_group) VALUES ('Banner', 'banner', 0);
SET @banner_term_id = LAST_INSERT_ID();

INSERT INTO wp_term_taxonomy (term_id, taxonomy, description, parent, count) 
VALUES (@banner_term_id, 'category', 'Banner 輪播分類', 0, 0);
```

---

## 🛋️ 建立 Products 分類（ID=2）

```sql
-- 檢查是否已存在 Products 分類
SELECT * FROM wp_terms WHERE name = 'Products';

-- 如果不存在，執行以下指令建立
INSERT INTO wp_terms (name, slug, term_group) VALUES ('Products', 'products', 0);
SET @products_term_id = LAST_INSERT_ID();

INSERT INTO wp_term_taxonomy (term_id, taxonomy, description, parent, count) 
VALUES (@products_term_id, 'category', '產品展示分類', 0, 0);
```

---

## 📝 建立測試 Banner 文章

```sql
-- Banner 1
INSERT INTO wp_posts (post_author, post_date, post_date_gmt, post_content, post_title, post_excerpt, post_status, comment_status, ping_status, post_name, post_modified, post_modified_gmt, post_type) 
VALUES (
  1, 
  NOW(), 
  NOW(), 
  '義式輕奢生活，從一張沙發開始', 
  '沙發必須與眾不同', 
  'Living Room Exceptional',
  'publish', 
  'open', 
  'open', 
  'banner-sofa-1', 
  NOW(), 
  NOW(), 
  'post'
);

-- 將文章關聯到 Banner 分類
SET @post_id = LAST_INSERT_ID();
INSERT INTO wp_term_relationships (object_id, term_taxonomy_id, term_order) 
SELECT @post_id, term_taxonomy_id, 0 FROM wp_term_taxonomy WHERE term_id = (SELECT term_id FROM wp_terms WHERE slug = 'banner');

-- Banner 2
INSERT INTO wp_posts (post_author, post_date, post_date_gmt, post_content, post_title, post_excerpt, post_status, comment_status, ping_status, post_name, post_modified, post_modified_gmt, post_type) 
VALUES (
  1, 
  NOW(), 
  NOW(), 
  '匠心工藝，傳承百年', 
  '義式輕奢生活', 
  'Italian Luxury Living',
  'publish', 
  'open', 
  'open', 
  'banner-luxury-2', 
  NOW(), 
  NOW(), 
  'post'
);

SET @post_id = LAST_INSERT_ID();
INSERT INTO wp_term_relationships (object_id, term_taxonomy_id, term_order) 
SELECT @post_id, term_taxonomy_id, 0 FROM wp_term_taxonomy WHERE term_id = (SELECT term_id FROM wp_terms WHERE slug = 'banner');

-- Banner 3
INSERT INTO wp_posts (post_author, post_date, post_date_gmt, post_content, post_title, post_excerpt, post_status, comment_status, ping_status, post_name, post_modified, post_modified_gmt, post_type) 
VALUES (
  1, 
  NOW(), 
  NOW(), 
  '品味生活，從此開始', 
  '品味生活從此開始', 
  'Quality Life Starts Here',
  'publish', 
  'open', 
  'open', 
  'banner-quality-3', 
  NOW(), 
  NOW(), 
  'post'
);

SET @post_id = LAST_INSERT_ID();
INSERT INTO wp_term_relationships (object_id, term_taxonomy_id, term_order) 
SELECT @post_id, term_taxonomy_id, 0 FROM wp_term_taxonomy WHERE term_id = (SELECT term_id FROM wp_terms WHERE slug = 'banner');
```

---

## 🌍 建立測試 Product 文章

```sql
-- Product 1: 德國
INSERT INTO wp_posts (post_author, post_date, post_date_gmt, post_content, post_title, post_excerpt, post_status, comment_status, ping_status, post_name, post_modified, post_modified_gmt, post_type) 
VALUES (
  1, 
  NOW(), 
  NOW(), 
  '21年家具生產製造設計經驗積澱，摸索推出義式輕奢品牌——德客·皮沙發，專為3億新中產量身打造。', 
  '義式家居設計哲學', 
  '',
  'publish', 
  'open', 
  'open', 
  'product-germany', 
  NOW(), 
  NOW(), 
  'post'
);

SET @post_id = LAST_INSERT_ID();
INSERT INTO wp_term_relationships (object_id, term_taxonomy_id, term_order) 
SELECT @post_id, term_taxonomy_id, 0 FROM wp_term_taxonomy WHERE term_id = (SELECT term_id FROM wp_terms WHERE slug = 'products');

-- Product 2: 意大利
INSERT INTO wp_posts (post_author, post_date, post_date_gmt, post_content, post_title, post_excerpt, post_status, comment_status, ping_status, post_name, post_modified, post_modified_gmt, post_type) 
VALUES (
  1, 
  NOW(), 
  NOW(), 
  '汲取羅馬建築的黃金比例靈感，將古典美學注入現代家居。每一處縫線都訴說著文藝復興的優雅故事。', 
  '羅馬藝術經典傳承', 
  '',
  'publish', 
  'open', 
  'open', 
  'product-italy', 
  NOW(), 
  NOW(), 
  'post'
);

SET @post_id = LAST_INSERT_ID();
INSERT INTO wp_term_relationships (object_id, term_taxonomy_id, term_order) 
SELECT @post_id, term_taxonomy_id, 0 FROM wp_term_taxonomy WHERE term_id = (SELECT term_id FROM wp_terms WHERE slug = 'products');

-- Product 3: 西班牙
INSERT INTO wp_posts (post_author, post_date, post_date_gmt, post_content, post_title, post_excerpt, post_status, comment_status, ping_status, post_name, post_modified, post_modified_gmt, post_type) 
VALUES (
  1, 
  NOW(), 
  NOW(), 
  '融合巴塞隆納的熱情與馬德里的優雅，打造出獨具地中海風情的家居藝術品。', 
  '地中海熱情風尚', 
  '',
  'publish', 
  'open', 
  'open', 
  'product-spain', 
  NOW(), 
  NOW(), 
  'post'
);

SET @post_id = LAST_INSERT_ID();
INSERT INTO wp_term_relationships (object_id, term_taxonomy_id, term_order) 
SELECT @post_id, term_taxonomy_id, 0 FROM wp_term_taxonomy WHERE term_id = (SELECT term_id FROM wp_terms WHERE slug = 'products');

-- Product 4: 美國
INSERT INTO wp_posts (post_author, post_date, post_date_gmt, post_content, post_title, post_excerpt, post_status, comment_status, ping_status, post_name, post_modified, post_modified_gmt, post_type) 
VALUES (
  1, 
  NOW(), 
  NOW(), 
  '結合紐約的現代感與洛杉磯的舒適風格，創造出完美平衡的當代家居體驗。', 
  '美式現代舒適主義', 
  '',
  'publish', 
  'open', 
  'open', 
  'product-usa', 
  NOW(), 
  NOW(), 
  'post'
);

SET @post_id = LAST_INSERT_ID();
INSERT INTO wp_term_relationships (object_id, term_taxonomy_id, term_order) 
SELECT @post_id, term_taxonomy_id, 0 FROM wp_term_taxonomy WHERE term_id = (SELECT term_id FROM wp_terms WHERE slug = 'products');

-- Product 5: 加拿大
INSERT INTO wp_posts (post_author, post_date, post_date_gmt, post_content, post_title, post_excerpt, post_status, comment_status, ping_status, post_name, post_modified, post_modified_gmt, post_type) 
VALUES (
  1, 
  NOW(), 
  NOW(), 
  '北美自然風光的靈感來源，將楓葉國的純淨與溫暖融入每一件家具設計之中。', 
  '北美自然純淨美學', 
  '',
  'publish', 
  'open', 
  'open', 
  'product-canada', 
  NOW(), 
  NOW(), 
  'post'
);

SET @post_id = LAST_INSERT_ID();
INSERT INTO wp_term_relationships (object_id, term_taxonomy_id, term_order) 
SELECT @post_id, term_taxonomy_id, 0 FROM wp_term_taxonomy WHERE term_id = (SELECT term_id FROM wp_terms WHERE slug = 'products');
```

---

## 🔄 更新分類計數

```sql
-- 更新 Banner 分類的文章計數
UPDATE wp_term_taxonomy 
SET count = (SELECT COUNT(*) FROM wp_term_relationships WHERE term_taxonomy_id = (SELECT term_taxonomy_id FROM wp_term_taxonomy WHERE term_id = (SELECT term_id FROM wp_terms WHERE slug = 'banner')))
WHERE term_id = (SELECT term_id FROM wp_terms WHERE slug = 'banner');

-- 更新 Products 分類的文章計數
UPDATE wp_term_taxonomy 
SET count = (SELECT COUNT(*) FROM wp_term_relationships WHERE term_taxonomy_id = (SELECT term_taxonomy_id FROM wp_term_taxonomy WHERE term_id = (SELECT term_id FROM wp_terms WHERE slug = 'products')))
WHERE term_id = (SELECT term_id FROM wp_terms WHERE slug = 'products');
```

---

## ✅ 驗證資料

```sql
-- 查看所有分類
SELECT t.term_id, t.name, t.slug, tt.count 
FROM wp_terms t 
JOIN wp_term_taxonomy tt ON t.term_id = tt.term_id 
WHERE tt.taxonomy = 'category';

-- 查看 Banner 文章
SELECT p.ID, p.post_title, p.post_status 
FROM wp_posts p
JOIN wp_term_relationships tr ON p.ID = tr.object_id
JOIN wp_term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id
JOIN wp_terms t ON tt.term_id = t.term_id
WHERE t.slug = 'banner' AND p.post_status = 'publish';

-- 查看 Products 文章
SELECT p.ID, p.post_title, p.post_status 
FROM wp_posts p
JOIN wp_term_relationships tr ON p.ID = tr.object_id
JOIN wp_term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id
JOIN wp_terms t ON tt.term_id = t.term_id
WHERE t.slug = 'products' AND p.post_status = 'publish';
```

---

## 📌 注意事項

1. **執行順序**：請按照文件中的順序執行 SQL 指令
2. **檢查表前綴**：確認您的 WordPress 表前綴是 `wp_`，如果不是請修改所有 SQL 中的表名
3. **備份資料庫**：執行前建議先備份資料庫
4. **圖片上傳**：SQL 只能建立文章，圖片需要在 WordPress 後台手動上傳並設定為「特色圖片」

---

## 🖼️ 設定特色圖片

執行完 SQL 後，請在 WordPress 後台：

1. 前往：**文章 → 所有文章**
2. 編輯每一篇 Banner 和 Product 文章
3. 在右側欄位點擊「設定特色圖片」
4. 上傳對應的圖片
5. 點擊「更新」

---

## 🔍 查看分類 ID

如果您的分類 ID 不是 1 和 2，請執行：

```sql
SELECT t.term_id, t.name, t.slug 
FROM wp_terms t 
JOIN wp_term_taxonomy tt ON t.term_id = tt.term_id 
WHERE t.slug IN ('banner', 'products');
```

然後修改 `lib/wordpress.ts` 中的分類 ID。
