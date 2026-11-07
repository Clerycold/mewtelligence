import categoriesJson from '../data/categories.json';
import productsJson from '../data/products.json';
import authorsJson from '../data/authors.json';

export interface Category {
  slug: string;
  name: string;
  description: string;
  specLabels: Record<string, string>;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  rating: number;
  summary: string;
  specs: Record<string, string>;
  pros: string[];
  cons: string[];
  merchant: string;
  affiliateUrl: string;
  /** hands-on = 自家貓實際用過；research = 依官方規格與公開資料整理 */
  reviewType: 'hands-on' | 'research';
  /** 實際使用心得（hands-on 才填），例如「三隻貓輪流用了半年」 */
  usageNote?: string;
  /** 價格查核日期 YYYY-MM-DD */
  priceCheckedAt?: string;
  /** 自己拍的商品照，放在 public/images/ 下，例如 /images/litter-tofu.jpg */
  photo?: string;
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

export const formatPrice = (n: number) => `NT$${n.toLocaleString('zh-TW')}`;
