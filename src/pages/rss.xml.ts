import rss from '@astrojs/rss';
import { publishedPosts, postUrl } from '../lib/posts';
export async function GET(context) { return rss({title:'Matthew Cochran writing',description:'Practical notes on developer tools, AI-assisted engineering, and software operations.',site:context.site,items:(await publishedPosts()).map(post=>({title:post.data.title,description:post.data.description ?? post.data.title,pubDate:post.data.pubDate,link:postUrl(post.id)}))}); }
