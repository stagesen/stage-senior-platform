import { db } from "../server/db";
import { communities, blogPosts } from "../shared/schema";
import { eq, and } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse/sync";

interface NewsletterRow {
  Name: string;
  Slug: string;
  "Collection ID"?: string;
  "Locale ID"?: string;
  "Item ID": string;
  Archived: string;
  Draft: string;
  "Created On": string;
  "Updated On": string;
  "Published On": string;
  Date?: string;
  Post?: string;
  Content?: string;
  Text?: string;
  Thumbnail?: string;
  Author?: string;
  Gallery?: string;
  "Gallery 1"?: string;
  "Gallery 2"?: string;
  "Gallery 3"?: string;
  PDF?: string;
  "One-Liner"?: string;
}

// Helper function to clean HTML content
function cleanHtml(html: string | undefined): string {
  if (!html) return "";
  
  // Remove empty id attributes
  let cleaned = html.replace(/\s*id=["']["']/g, "");
  
  // Remove excessive whitespace
  cleaned = cleaned.replace(/\n\s*\n/g, "\n");
  
  // Ensure proper spacing around tags
  cleaned = cleaned.replace(/>(\s*)</g, "><");
  
  return cleaned.trim();
}

// Helper function to generate excerpt from HTML
function generateExcerpt(html: string, maxLength: number = 200): string {
  // Remove HTML tags
  const text = html.replace(/<[^>]*>/g, "");
  
  // Remove extra whitespace
  const cleaned = text.replace(/\s+/g, " ").trim();
  
  // Truncate if necessary
  if (cleaned.length <= maxLength) return cleaned;
  
  // Find the last space before maxLength
  const lastSpace = cleaned.lastIndexOf(" ", maxLength);
  if (lastSpace > 0) {
    return cleaned.substring(0, lastSpace) + "...";
  }
  
  return cleaned.substring(0, maxLength) + "...";
}

// Helper function to parse date strings
function parseDate(dateStr: string | undefined): Date | null {
  if (!dateStr) return null;
  
  try {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date;
    }
  } catch (e) {
    console.error(`Failed to parse date: ${dateStr}`);
  }
  
  return null;
}

// Helper function to generate slug if missing
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Helper function to parse gallery images
function parseGalleryImages(row: NewsletterRow): string[] {
  const images: string[] = [];
  
  // Handle single gallery field
  if (row.Gallery) {
    const galleryImages = row.Gallery.split(";").map(img => img.trim()).filter(img => img);
    images.push(...galleryImages);
  }
  
  // Handle individual gallery fields
  if (row["Gallery 1"]) images.push(row["Gallery 1"]);
  if (row["Gallery 2"]) images.push(row["Gallery 2"]);
  if (row["Gallery 3"]) images.push(row["Gallery 3"]);
  
  return images.filter(img => img && img.startsWith("http"));
}

async function importNewsletters() {
  console.log("Starting newsletter import process...\n");
  
  const csvFiles = [
    { file: "Stonebridge Senior - Newsletters (1)_1759264551956.csv", communityName: "Stonebridge Senior" },
    { file: "Gardens on Quail - Newsletters (1)_1759264551957.csv", communityName: "The Gardens on Quail" },
    { file: "Gardens at Columbine - Newsletters (1)_1759264551957.csv", communityName: "Gardens at Columbine" },
    { file: "Golden Pond - Newsletters (1)_1759264551957.csv", communityName: "Golden Pond" },
  ];
  
  // Get all communities from database
  const allCommunities = await db.select().from(communities);
  console.log("Found communities in database:");
  allCommunities.forEach(c => console.log(`- ${c.name} (${c.id})`));
  console.log();
  
  // Create a map of community names to IDs
  const communityMap = new Map<string, string>();
  allCommunities.forEach(c => {
    communityMap.set(c.name, c.id);
  });
  
  let totalImported = 0;
  let totalSkipped = 0;
  let totalErrors = 0;
  
  // Process each CSV file
  for (const { file, communityName } of csvFiles) {
    console.log(`\n=== Processing ${file} ===`);
    
    const communityId = communityMap.get(communityName);
    if (!communityId) {
      console.error(`Community not found: ${communityName}`);
      console.log("Available communities:", Array.from(communityMap.keys()).join(", "));
      continue;
    }
    
    console.log(`Using community ID: ${communityId} for ${communityName}`);
    
    const csvPath = path.join(process.cwd(), "attached_assets", file);
    
    if (!fs.existsSync(csvPath)) {
      console.error(`File not found: ${csvPath}`);
      continue;
    }
    
    const csvContent = fs.readFileSync(csvPath, "utf-8");
    const records: NewsletterRow[] = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
    });
    
    console.log(`Found ${records.length} records in ${file}`);
    
    let fileImported = 0;
    let fileSkipped = 0;
    let fileErrors = 0;
    
    for (const row of records) {
      try {
        // Skip drafts and archived posts
        if (row.Draft === "true" || row.Archived === "true") {
          console.log(`Skipping ${row.Name} (draft=${row.Draft}, archived=${row.Archived})`);
          fileSkipped++;
          continue;
        }
        
        // Get content from the appropriate column
        const content = row.Post || row.Content || row.Text || "";
        
        if (!content || content.trim().length < 10) {
          console.log(`Skipping ${row.Name} (no content or too short)`);
          fileSkipped++;
          continue;
        }
        
        // Check if post with this slug already exists
        const slug = row.Slug || generateSlug(row.Name);
        const existingPost = await db
          .select()
          .from(blogPosts)
          .where(eq(blogPosts.slug, slug))
          .limit(1);
        
        if (existingPost.length > 0) {
          console.log(`Post already exists with slug: ${slug}, skipping`);
          fileSkipped++;
          continue;
        }
        
        // Clean and prepare data
        const cleanedContent = cleanHtml(content);
        const summary = generateExcerpt(cleanedContent);
        const publishedDate = parseDate(row["Published On"] || row.Date);
        const galleryImages = parseGalleryImages(row);
        
        // Create the blog post
        const newPost = {
          slug: slug,
          title: row.Name.trim(),
          content: cleanedContent,
          summary: summary,
          thumbnailImage: row.Thumbnail || null,
          galleryImages: galleryImages,
          featured: false,
          category: "newsletter",
          author: row.Author || null,
          tags: ["newsletter"],
          communityId: communityId,
          published: true,
          publishedAt: publishedDate || new Date(),
        };
        
        await db.insert(blogPosts).values(newPost);
        
        console.log(`✓ Imported: ${row.Name}`);
        fileImported++;
        
      } catch (error) {
        console.error(`✗ Error importing ${row.Name}:`, error);
        fileErrors++;
      }
    }
    
    console.log(`\nFile Summary for ${file}:`);
    console.log(`- Imported: ${fileImported}`);
    console.log(`- Skipped: ${fileSkipped}`);
    console.log(`- Errors: ${fileErrors}`);
    
    totalImported += fileImported;
    totalSkipped += fileSkipped;
    totalErrors += fileErrors;
  }
  
  console.log("\n=== IMPORT COMPLETE ===");
  console.log(`Total Imported: ${totalImported}`);
  console.log(`Total Skipped: ${totalSkipped}`);
  console.log(`Total Errors: ${totalErrors}`);
  
  // Create summary report
  const report = `
# Newsletter Import Report

## Summary
- Date: ${new Date().toISOString()}
- Total newsletters imported: ${totalImported}
- Total newsletters skipped: ${totalSkipped}
- Total errors: ${totalErrors}

## Communities Processed
${csvFiles.map(({ file, communityName }) => `- ${communityName}: ${file}`).join("\n")}

## Import Details
- Skipped all drafts and archived posts
- Generated excerpts for all posts
- Applied "newsletter" tag to all imported posts
- Set all posts as published
- Cleaned HTML content (removed empty IDs, fixed spacing)
- Preserved gallery images where available
`;
  
  fs.writeFileSync(path.join(process.cwd(), "newsletter-import-report.md"), report);
  console.log("\nReport saved to newsletter-import-report.md");
}

// Run the import
importNewsletters()
  .then(() => {
    console.log("\nImport process completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\nImport process failed:", error);
    process.exit(1);
  });