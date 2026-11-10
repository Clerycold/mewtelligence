import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['food', 'litter', 'toys', 'furniture', 'breeds']),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    // 文章底部比較表要放哪些商品（對應 products.json 的 id）
    products: z.array(z.string()).default([]),
    // 作者 id（對應 authors.json）
    author: z.string().default('tenyear'),
    // 參考資料：引用的獸醫、學術、官方資料
    sources: z.array(z.object({ title: z.string(), url: z.string().url() })).default([]),
    // 置頂：在分類頁排第一（例如該分類的總整理文章）
    pinned: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { articles };
