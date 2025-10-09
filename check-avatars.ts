import { db } from "./server/db";
import { teamMembers, images } from "./shared/schema";
import { eq } from "drizzle-orm";

async function main() {
  const members = await db.select().from(teamMembers);

  console.log(`\nChecking ${members.length} team members for avatars:\n`);

  let withAvatars = 0;
  let withoutAvatars = 0;

  for (const member of members) {
    if (member.avatarImageId) {
      const [image] = await db.select().from(images).where(eq(images.id, member.avatarImageId)).limit(1);
      if (image) {
        console.log(`✅ ${member.name} - Has avatar: ${image.url}`);
        withAvatars++;
      }
    } else {
      console.log(`❌ ${member.name} - NO AVATAR`);
      withoutAvatars++;
    }
  }

  console.log(`\nSummary: ${withAvatars} with avatars, ${withoutAvatars} without avatars`);
  process.exit(0);
}

main();
