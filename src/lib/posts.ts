import { getCollection } from 'astro:content';
export async function publishedPosts() {
  const now = new Date();
  return (await getCollection('blog', ({data}) => !data.draft && data.pubDate <= now))
    .sort((a,b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}
export function postUrl(id: string) { return '/blog/' + id.replace(/\.(md|mdx)$/, '') + '/'; }
