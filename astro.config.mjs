// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import remarkDirective from 'remark-directive';
import { remarkFencedDivsPlugin } from './scripts/remark/fenced-divs.js';

// https://astro.build/config
export default defineConfig({
  markdown: {
    processor: unified({
      remarkPlugins: [remarkDirective, remarkFencedDivsPlugin],
    }),
  },
  integrations: [react(), mdx()],
});
