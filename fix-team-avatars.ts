import { db } from "./server/db";
import { images, teamMembers } from "./shared/schema";
import { Storage } from "@google-cloud/storage";
import { eq } from "drizzle-orm";

const REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";

const objectStorageClient = new Storage({
  credentials: {
    audience: "replit",
    subject_token_type: "access_token",
    token_url: `${REPLIT_SIDECAR_ENDPOINT}/token`,
    type: "external_account",
    credential_source: {
      url: `${REPLIT_SIDECAR_ENDPOINT}/credential`,
      format: {
        type: "json",
        subject_token_field_name: "access_token",
      },
    },
    universe_domain: "googleapis.com",
  },
  projectId: "",
});

async function fixTeamAvatars() {
  console.log("🔧 Fixing team avatar image paths...\n");
  
  const bucketId = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID;
  if (!bucketId) {
    console.error("DEFAULT_OBJECT_STORAGE_BUCKET_ID not configured");
    return;
  }

  // Get all team member avatars
  const allImages = await db.select().from(images).where(eq(images.objectKey, db.raw("object_key LIKE '.private/team-%'")));
  
  console.log(`Found ${allImages.length} team avatar images to move\n`);

  const bucket = objectStorageClient.bucket(bucketId);
  let successCount = 0;

  for (const image of allImages) {
    try {
      console.log(`Processing: ${image.objectKey}`);
      
      // Copy from private to public
      const privateFile = bucket.file(image.objectKey);
      const filename = image.objectKey.split("/").pop();
      const publicObjectKey = `public/${filename}`;
      const publicFile = bucket.file(publicObjectKey);
      
      // Copy the file
      await privateFile.copy(publicFile);
      
      // Update database with new public URL
      const newUrl = `/${bucketId}/public/${filename}`;
      await db.update(images)
        .set({
          objectKey: publicObjectKey,
          url: newUrl
        })
        .where(eq(images.id, image.id));
      
      // Delete old private file
      await privateFile.delete();
      
      console.log(`  ✓ Moved to public: ${newUrl}\n`);
      successCount++;
    } catch (error) {
      console.error(`  ✗ Error processing ${image.objectKey}:`, error);
    }
  }

  console.log(`\n✅ Complete! Successfully moved ${successCount} images to public directory`);
}

fixTeamAvatars()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });
