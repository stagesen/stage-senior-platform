import { db } from "./server/db";
import { teamMembers } from "./shared/schema";

async function main() {
  const members = await db.select().from(teamMembers);
  console.log(`\nProduction database has ${members.length} team members:\n`);
  members.forEach(m => console.log(`  - ${m.name} (${m.slug})`));
  process.exit(0);
}

main();
