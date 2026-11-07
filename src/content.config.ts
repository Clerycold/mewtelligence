import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['food', 'litter', 'toys', 'furniture']),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    // 文章底部比較表要放哪些商品（對應 products.json 的 id）
    products: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { articles };
