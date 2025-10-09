import { storage } from "../server/storage";
import { uploadToObjectStorage, getImageDimensions } from "../server/upload";
import { readFileSync } from "fs";
import { InsertImage } from "@shared/schema";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function fixImages() {
  console.log("🔧 Fixing Gardens on Quail feature images...\n");

  // Get the existing features with broken images
  const features = await sql`
    SELECT cf.id, cf.title, cf.image_id, i.url
    FROM community_features cf
    LEFT JOIN images i ON cf.image_id = i.id
    WHERE cf.community_id = '272f386a-a115-4730-8d13-0d0ada5dde6d'
    AND cf.sort_order IN (4, 5)
    ORDER BY cf.sort_order
  `;

  console.log("Found features:");
  features.forEach(f => console.log(`  - ${f.title}`));

  // Upload new images
  const imageFiles = [
    {
      path: "/tmp/garden-outdoor.jpg",
      alt: "Beautiful outdoor courtyard with garden spaces at Gardens on Quail",
      featureId: features[0].id,
      title: features[0].title
    },
    {
      path: "/tmp/caregiver.jpg",
      alt: "Compassionate caregiver providing personalized support",
      featureId: features[1].id,
      title: features[1].title
    }
  ];

  for (const img of imageFiles) {
    console.log(`\n📸 Uploading: ${img.title}`);

    const buffer = readFileSync(img.path);
    const dimensions = await getImageDimensions(buffer);
    const filename = `community-feature-${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;

    await uploadToObjectStorage(buffer, filename, "image/jpeg", true);

    const bucketId = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID;
    const publicUrl = `/${bucketId}/public/${filename}`;

    const imageData: InsertImage = {
      objectKey: `public/${filename}`,
      url: publicUrl,
      alt: img.alt,
      width: dimensions.width,
      height: dimensions.height,
      sizeBytes: buffer.length,
      mimeType: "image/jpeg"
    };

    const savedImage = await storage.createImage(imageData);
    console.log(`  ✓ Image uploaded: ${savedImage.id}`);

    // Update the feature with new image
    await sql`
      UPDATE community_features
      SET image_id = ${savedImage.id}
      WHERE id = ${img.featureId}
    `;
    console.log(`  ✓ Feature updated`);
  }

  console.log("\n✅ All images fixed!\n");
}

fixImages().catch(console.error);
