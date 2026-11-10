# Mewtelligence

Astro 靜態網站：貓咪用品評測＋聯盟行銷導購。

## 常用指令

```bash
npm run dev      # 本機開發 http://localhost:4321
npm run build    # 產生 dist/（含 _redirects）
npm run preview  # 預覽 build 結果
npm run deploy   # build 並部署到 Cloudflare Pages（需先 wrangler login）
```

## 專案結構

| 路徑 | 用途 |
|---|---|
| `src/data/products.json` | 商品資料庫（只放實際使用或確實查證過的商品） |
| `src/data/categories.json` | 分類與各分類的比較規格欄位 |
| `src/content/articles/*.md` | 文章（Markdown） |
| `src/components/ProductCompare.astro` | 商品比較表元件 |
| `src/components/SEO.astro` | title / description / canonical / OG / JSON-LD |
| `src/pages/go/[id].astro` | `/go/` 導購跳轉（備援用 HTML 跳轉） |
| `scripts/gen-redirects.mjs` | build 後產生 `dist/_redirects`（Cloudflare 302 伺服器端跳轉） |
| `public/_headers` | `/go/*` 加 noindex、靜態資源長快取 |
| `astro.config.mjs` | `SITE_URL`：正式網域確定後改這裡 |

## 新增商品

在 `products.json` 加一筆，`category` 要對應 `categories.json` 的 `slug`，`specs` 的 key 對應該分類的 `specLabels`：

```json
{
  "id": "litter-new-one",
  "name": "商品名稱",
  "brand": "品牌",
  "category": "litter",
  "price": 399,
  "rating": 4.3,
  "summary": "一句話介紹",
  "specs": { "material": "豆腐", "clumping": "★★★★☆", "dust": "低", "flushable": "是" },
  "pros": ["優點"],
  "cons": ["缺點"],
  "merchant": "蝦皮",
  "affiliateUrl": "https://你的聯盟連結"
}
```

可信度相關欄位：

| 欄位 | 說明 |
|---|---|
| `network` | 填 `"ichannels"` 會自動轉成通路王深層連結（K 值在 `src/data/affiliate.json`）；不填則直接連到商店。⚠️ 蝦皮經通路王會被導回首頁，目前對 momo、Yahoo購物中心啟用 |
| `reviewType` | `"hands-on"`＝自家貓實際用過；`"research"`＝依官方規格整理（必填，請誠實標示） |
| `usageNote` | 實際使用心得，例如「三隻貓輪流用了半年，老大最愛」（hands-on 才填） |
| `subtype` | 子類型，對應 categories.json 的 `subtypes`（飼料：`dry` 乾糧、`wet-main` 主食罐、`topper` 副食罐與餐包、`treat` 零食）。有商品的子類型會自動開放入口與子頁 |
| `ageGroup` | 適用年齡或族群，例如 `"成貓"`、`"全齡"` |
| `usageDuration` | 實際使用多久，例如 `"兩年多"`（hands-on 才填） |
| `weightGrams` | `price` 對應的總克數（24 罐 × 80g 填 `1920`），會自動算出每 100g 價格 |
| `priceCheckedAt` | 價格查核日期，例如 `"2026-11-07"` |
| `photo` | 自己拍的照片，放 `public/images/`，填 `"/images/檔名.jpg"` |

作者資料在 `src/data/authors.json`；頭像放 `public/images/` 後把 `avatar` 改成 `"/images/檔名.jpg"`。

站內所有購買按鈕都連到 `/go/{id}/`，不直接寫聯盟網址。之後換平台只要改 JSON 一處。

## 新增文章

在 `src/content/articles/` 新增 `.md`，檔名就是網址：

```md
---
title: 文章標題
description: 120 字內的摘要（會用在 Google 搜尋結果）
category: litter          # food / litter / toys / furniture / breeds
pubDate: 2026-11-07
products: [litter-tofu-original, litter-new-one]   # 文末比較表
author: tenyear           # 對應 authors.json，可省略（預設 tenyear）
sources:                  # 參考資料，可省略
  - title: 資料標題
    url: https://...
pinned: false             # true＝在分類頁置頂
draft: false
---
```

`products` 裡的 id 打錯，build 會直接失敗並告訴你是哪個 id。

## 部署到 Cloudflare Pages

**方法 A：用指令直接上傳**

```bash
npx wrangler login
npm run deploy
```

第一次會建立名為 `mewtelligence` 的 Pages 專案，網址為 `https://mewtelligence.pages.dev`。

**方法 B：GitHub Actions 自動部署（已設定）**

`.github/workflows/deploy.yml` 會在每次 push 時自動 build 並部署：

- push 到 `main` → 更新正式站 `https://mewtelligence.pages.dev`
- push 到其他分支 → 產生預覽網址 `https://<分支名>.mewtelligence.pages.dev`

需要在 GitHub repo 的 Settings → Secrets and variables → Actions 加一個 secret：
`CLOUDFLARE_API_TOKEN`（Cloudflare 後台 → My Profile → API Tokens → 用「Edit Cloudflare Workers」範本建立，或自訂權限 Account › Cloudflare Pages › Edit）。

## 上線前檢查清單

- [ ] `products.json` 換成真實商品與聯盟連結
- [ ] `astro.config.mjs` 的 `SITE_URL` 改成正式網域
- [ ] 準備一張 1200×630 的 PNG 當分享圖，在 `BaseLayout` 傳入 `image`
- [ ] 到 Google Search Console 提交 `/sitemap-index.xml`
