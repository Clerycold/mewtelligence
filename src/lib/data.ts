import categoriesJson from '../data/categories.json';
import productsJson from '../data/products.json';

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
}

export const categories = categoriesJson as Category[];
export const products = productsJson as Product[];

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
