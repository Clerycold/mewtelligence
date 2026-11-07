import { getCollection } from 'astro:content';

/** 已發布文章（排除 draft），新到舊 */
export async function getPublishedArticles() {
  const all = await getCollection('articles', ({ data }) => import.meta.env.DEV || !data.draft);
  return all.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}
