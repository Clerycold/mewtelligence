// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// 正式網域確定後，改這裡（canonical、sitemap、OG 都會跟著變）
export const SITE_URL = 'https://mewtelligence.pages.dev';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      // 導購跳轉頁不該被收錄
      filter: (page) => !page.includes('/go/'),
    }),
  ],
});
