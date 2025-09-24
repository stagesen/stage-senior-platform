import { db } from '../server/db';
import { blogPosts } from '../shared/schema';

async function checkBlogPosts() {
  const posts = await db.select({
    title: blogPosts.title,
    slug: blogPosts.slug,
    category: blogPosts.category,
    author: blogPosts.author,
    publishedAt: blogPosts.publishedAt
  }).from(blogPosts);

  console.log(`Total blog posts imported: ${posts.length}\n`);

  posts.forEach(post => {
    console.log(`- ${post.title}`);
    console.log(`  Slug: ${post.slug}`);
    console.log(`  Category: ${post.category}`);
    console.log(`  Author: ${post.author}`);
    console.log(`  Published: ${post.publishedAt?.toDateString()}\n`);
  });
}

checkBlogPosts().catch(console.error);