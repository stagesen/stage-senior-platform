#!/usr/bin/env node

import { neon } from "@neondatabase/serverless";

const communityColors = [
  {
    name: "The Gardens on Quail", 
    mainColorHex: "#1a464c",
    ctaColorHex: "#f4d8a9"
  },
  {
    name: "Golden Pond",
    mainColorHex: "#2c417f", 
    ctaColorHex: "#ffb800"
  },
  {
    name: "Gardens at Columbine",
    mainColorHex: "#43238b",
    ctaColorHex: "#f7b27a"
  },
  {
    name: "Stonebridge Senior",
    mainColorHex: "#0e1824",
    ctaColorHex: "#e9a668"
  }
];

async function addCommunityColors() {
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL environment variable is required");
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);
  
  console.log("🎨 Adding community color schemes...\n");

  let successCount = 0;
  let errorCount = 0;

  for (const community of communityColors) {
    try {
      const result = await sql`
        UPDATE communities 
        SET 
          main_color_hex = ${community.mainColorHex},
          cta_color_hex = ${community.ctaColorHex}
        WHERE name ILIKE ${community.name}
        RETURNING name, main_color_hex, cta_color_hex
      `;

      if (result.length > 0) {
        console.log(`✅ ${community.name}:`);
        console.log(`   Main: ${community.mainColorHex}`);
        console.log(`   CTA:  ${community.ctaColorHex}\n`);
        successCount++;
      } else {
        console.log(`⚠️  Community not found: ${community.name}\n`);
        errorCount++;
      }
    } catch (error) {
      console.error(`❌ Error updating ${community.name}:`, error.message);
      errorCount++;
    }
  }

  console.log(`\n📊 Migration Summary:`);
  console.log(`   ✅ Successfully updated: ${successCount} communities`);
  console.log(`   ❌ Errors: ${errorCount}`);
  
  if (errorCount === 0) {
    console.log("\n🎉 All community colors added successfully!");
  }
}

addCommunityColors().catch((error) => {
  console.error("❌ Migration failed:", error);
  process.exit(1);
});