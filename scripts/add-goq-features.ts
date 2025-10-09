import { storage } from "../server/storage";
import { uploadToObjectStorage, getImageDimensions } from "../server/upload";
import { readFileSync } from "fs";
import { InsertImage } from "@shared/schema";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

const COMMUNITY_ID = '272f386a-a115-4730-8d13-0d0ada5dde6d'; // Gardens on Quail

interface FeatureData {
  eyebrow: string;
  title: string;
  body: string;
  imageFile: string;
  imageAlt: string;
  imageLeft: boolean;
  sortOrder: number;
}

const features: FeatureData[] = [
  {
    eyebrow: "Outdoor Living",
    title: "Serene Courtyard & Garden Spaces",
    body: "Our beautifully landscaped courtyard provides a peaceful sanctuary for residents to enjoy Colorado sunshine, tend raised garden beds, and gather with friends and family in a secure outdoor environment.",
    imageFile: "/tmp/garden-outdoor.jpg",
    imageAlt: "Beautiful outdoor courtyard with garden spaces at Gardens on Quail",
    imageLeft: false,
    sortOrder: 4
  },
  {
    eyebrow: "Compassionate Care",
    title: "24/7 Support with Care Points Flexibility",
    body: "Our dedicated care team provides round-the-clock assistance tailored to your needs. With our transparent Care Points system, you only pay for the services you actually use—no one-size-fits-all tiers or surprise increases.",
    imageFile: "/tmp/caregiver.jpg",
    imageAlt: "Compassionate caregiver providing personalized support",
    imageLeft: true,
    sortOrder: 5
  }
];

async function uploadImage(filePath: string, alt: string): Promise<string> {
  try {
    const buffer = readFileSync(filePath);
    const dimensions = await getImageDimensions(buffer);

    const filename = `community-feature-${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
    const objectKey = await uploadToObjectStorage(buffer, filename, "image/jpeg", true);

    const bucketId = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID;
    const publicUrl = `/${bucketId}/public/${filename}`;

    const imageData: InsertImage = {
      objectKey: `public/${filename}`,
      url: publicUrl,
      alt,
      width: dimensions.width,
      height: dimensions.height,
      sizeBytes: buffer.length,
      mimeType: "image/jpeg"
    };

    const savedImage = await storage.createImage(imageData);
    console.log(`  ✓ Uploaded image: ${savedImage.id}`);
    return savedImage.id;
  } catch (error) {
    console.error(`  ✗ Failed to upload image:`, error);
    throw error;
  }
}

async function addFeature(feature: FeatureData, imageId: string) {
  try {
    const result = await sql`
      INSERT INTO community_features (
        community_id,
        eyebrow,
        title,
        body,
        image_id,
        image_left,
        sort_order,
        active
      ) VALUES (
        ${COMMUNITY_ID},
        ${feature.eyebrow},
        ${feature.title},
        ${feature.body},
        ${imageId},
        ${feature.imageLeft},
        ${feature.sortOrder},
        true
      )
      RETURNING *
    `;

    console.log(`  ✓ Added feature: ${feature.title}`);
    return result[0];
  } catch (error) {
    console.error(`  ✗ Failed to add feature:`, error);
    throw error;
  }
}

async function main() {
  console.log("🌟 Adding Experience the Difference features for Gardens on Quail\n");

  for (const feature of features) {
    console.log(`\nProcessing: ${feature.title}`);

    // Upload image
    const imageId = await uploadImage(feature.imageFile, feature.imageAlt);

    // Add feature
    await addFeature(feature, imageId);
  }

  console.log("\n✅ All features added successfully!\n");
}

main().catch((error) => {
  console.error("\n❌ Error:", error);
  process.exit(1);
});
