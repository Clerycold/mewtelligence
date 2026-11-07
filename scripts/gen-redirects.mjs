// build 後執行：依 products.json 產生 Cloudflare Pages 的 dist/_redirects
// 讓 /go/{id}/ 在伺服器端直接 302 到聯盟連結（比 HTML 跳轉快，也不會被當成一般頁面）
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { outboundUrl } from '../src/lib/outbound.mjs';

const readJson = (rel) => JSON.parse(readFileSync(new URL(rel, import.meta.url), 'utf8'));
const products = readJson('../src/data/products.json');
const affiliateConfig = readJson('../src/data/affiliate.json');

if (!existsSync(new URL('../dist/', import.meta.url))) {
  console.error('找不到 dist/，請先執行 astro build');
  process.exit(1);
}

const seen = new Set();
const lines = ['# 由 scripts/gen-redirects.mjs 自動產生，請勿手動修改'];
for (const p of products) {
  if (seen.has(p.id)) throw new Error(`products.json 有重複的 id：${p.id}`);
  if (!/^https?:\/\//.test(p.affiliateUrl)) throw new Error(`${p.id} 的 affiliateUrl 不是 http(s) 網址`);
  if (/\s/.test(p.affiliateUrl)) throw new Error(`${p.id} 的 affiliateUrl 含空白`);
  seen.add(p.id);
  const dest = outboundUrl(p, affiliateConfig);
  // 302（暫時）而非 301：商品連結之後換平台時，瀏覽器不會被快取卡住
  lines.push(`/go/${p.id} ${dest} 302`);
  lines.push(`/go/${p.id}/ ${dest} 302`);
}

writeFileSync(new URL('../dist/_redirects', import.meta.url), lines.join('\n') + '\n');
console.log(`已產生 dist/_redirects（${products.length} 個商品）`);
