import categoriesJson from '../data/categories.json';
import productsJson from '../data/products.json';
import authorsJson from '../data/authors.json';

export interface Subtype {
  slug: string;
  name: string;
  /** 入口卡片上的一句說明 */
  blurb: string;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  specLabels: Record<string, string>;
  /** 分類頁主視覺標題／副標；不填則用 name、description */
  heroTitle?: string;
  heroSubtitle?: string;
  /** 子類型（例如飼料分成乾糧、主食罐…）；商品用 subtype 欄位對應 */
  subtypes?: Subtype[];
  /** 商品卡片上顯示的重點規格 key（依序） */
  cardSpecs?: string[];
  /** "guide"＝純知識分類（例如貓咪品種），分類頁不顯示商品區 */
  kind?: 'guide';
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  /** 參考價格（新台幣）；不填則顯示「見商店」 */
  price?: number;
  /** 1～5 分；不填則不顯示評分，也不參與「編輯推薦」 */
  rating?: number;
  summary: string;
  specs: Record<string, string>;
  pros: string[];
  cons: string[];
  merchant: string;
  /** 一般商店網址（要導去的頁面） */
  affiliateUrl: string;
  /** 經過哪個聯盟平台轉址；不填則直接連到商店（見 src/lib/outbound.mjs） */
  network?: 'ichannels';
  /** hands-on = 自家貓實際用過；research = 依官方規格與公開資料整理 */
  reviewType: 'hands-on' | 'research';
  /** 實際使用心得（hands-on 才填），例如「三隻貓輪流用了半年」 */
  usageNote?: string;
  /** 價格查核日期 YYYY-MM-DD */
  priceCheckedAt?: string;
  /** 自己拍的商品照，放在 public/images/ 下，例如 /images/litter-tofu.jpg */
  photo?: string;
  /** 子類型 slug，對應 categories.json 的 subtypes */
  subtype?: string;
  /** 適用年齡或族群，例如「成貓」「全齡」 */
  ageGroup?: string;
  /** 實際使用多久，例如「兩年多」 */
  usageDuration?: string;
  /** price 對應的總克數（例如 24 罐 × 80g = 1920），用來算每 100g 價格 */
  weightGrams?: number;
}

export interface Author {
  id: string;
  name: string;
  role: string;
  /** 頭像路徑；空字串則用品牌橘貓圖示 */
  avatar: string;
  facts: string[];
  bio: string;
}

export const categories = categoriesJson as Category[];
export const products = productsJson as Product[];
export const authors = authorsJson as Author[];

export const REVIEW_TYPE_LABEL: Record<Product['reviewType'], string> = {
  'hands-on': '實際使用',
  research: '資料整理',
};

export function getAuthor(id: string): Author {
  const a = authors.find((x) => x.id === id);
  if (!a) throw new Error(`authors.json 找不到作者 id：「${id}」`);
  return a;
}

export const authorAvatar = (a: Author) => a.avatar || '/favicon.svg';

export function formatDate(iso: string | Date): string {
  const d = typeof iso === 'string' ? new Date(iso) : iso;
  return d.toLocaleDateString('zh-TW', { year: 'numeric', month: 'numeric', day: 'numeric' });
}

const productById = new Map(products.map((p) => [p.id, p]));

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getSubtype(category: Category, slug?: string): Subtype | undefined {
  return slug ? category.subtypes?.find((s) => s.slug === slug) : undefined;
}

/** 每 100g 價格；缺價格或克數時回傳 undefined */
export function pricePer100g(p: Product): number | undefined {
  if (p.price == null || !p.weightGrams) return undefined;
  return Math.round((p.price / p.weightGrams) * 1000) / 10;
}

export function productUrl(p: Product): string {
  return `/products/${p.id}/`;
}

export function getProductsByCategory(slug: string): Product[] {
  return products.filter((p) => p.category === slug);
}

/** 依 id 清單取商品；找不到的 id 直接在 build 時報錯，避免文章引用打錯字卻沒發現 */
export function getProductsByIds(ids: string[]): Product[] {
  return ids.map((id) => {
    const p = productById.get(id);
    if (!p) throw new Error(`products.json 找不到商品 id：「${id}」`);
    return p;
  });
}

export function goUrl(product: Product): string {
  return `/go/${product.id}/`;
}

export const formatPrice = (n?: number) => (n == null ? '見商店' : `NT$${n.toLocaleString('zh-TW')}`);
