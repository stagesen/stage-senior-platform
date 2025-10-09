import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import { teamMembers } from './shared/schema';

neonConfig.webSocketConstructor = ws;

async function main() {
  const prodUrl = "postgresql://neondb_owner:npg_rkzNBcC21pWL@ep-bitter-firefly-a6e86e5e.us-west-2.aws.neon.tech/neondb?sslmode=require";

  const pool = new Pool({ connectionString: prodUrl });
  const db = drizzle(pool);

  console.log("\n🔍 Checking ACTUAL Production Database\n");

  const members = await db.select().from(teamMembers);

  console.log(`Total team members: ${members.length}\n`);

  members.forEach(m => {
    console.log(`  ${m.name} (${m.slug}) - Avatar: ${m.avatarImageId ? '✅' : '❌'}`);
  });

  await pool.end();
  process.exit(0);
}

main();
