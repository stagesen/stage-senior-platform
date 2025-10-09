import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import { communities } from './shared/schema';
import { like } from 'drizzle-orm';

neonConfig.webSocketConstructor = ws;

async function main() {
  const prodUrl = 'postgresql://neondb_owner:npg_rkzNBcC21pWL@ep-bitter-firefly-a6e86e5e.us-west-2.aws.neon.tech/neondb?sslmode=require';
  const pool = new Pool({ connectionString: prodUrl });
  const db = drizzle(pool);

  const results = await db.select().from(communities).where(like(communities.slug, '%columbine%'));
  console.log('Communities matching columbine:');
  results.forEach(c => console.log(`  - ${c.name} (slug: ${c.slug})`));

  await pool.end();
  process.exit(0);
}

main();
