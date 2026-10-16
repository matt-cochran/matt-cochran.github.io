import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    heroImage: z.string().regex(/^\/assets\/blog\/[a-z0-9-]+\.(png|jpe?g|webp|svg)$/).optional(),
    heroDecorative: z.boolean().default(false),
    heroAlt: z.string().optional(),
    heroWidth: z.number().int().positive().optional(),
    heroHeight: z.number().int().positive().optional(),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
  }).refine(data => !data.heroImage || Boolean(data.heroWidth && data.heroHeight && (data.heroDecorative ? data.heroAlt === "" : data.heroAlt?.trim())), { message: "Header images require dimensions and alt text, or empty alt with heroDecorative: true" }),
});

export const collections = { blog };
