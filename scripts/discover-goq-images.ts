import fetch from "node-fetch";
import * as cheerio from "cheerio";
import * as fs from "fs";
import * as path from "path";

const GALLERY_URL = "https://www.gardensonquail.com/our-community/photo-gallery";

interface ImageInfo {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  context?: string;
}

async function discoverImages(): Promise<void> {
  console.log("╔═══════════════════════════════════════════════════════════╗");
  console.log("║  Gardens on Quail - Image Discovery Tool                 ║");
  console.log("╚═══════════════════════════════════════════════════════════╝\n");

  console.log(`🔍 Fetching page: ${GALLERY_URL}\n`);

  try {
    const response = await fetch(GALLERY_URL);
    const html = await response.text();
    const $ = cheerio.load(html);

    const images: ImageInfo[] = [];
    const imageUrls = new Set<string>(); // To avoid duplicates

    // Extract all images
    $("img").each((_, element) => {
      const $img = $(element);
      let src = $img.attr("src") || $img.attr("data-src") || $img.attr("data-lazy-src");

      if (!src) return;

      // Clean up URL
      if (src.startsWith("//")) {
        src = "https:" + src;
      } else if (src.startsWith("/")) {
        src = "https://www.gardensonquail.com" + src;
      }

      // Skip if already added
      if (imageUrls.has(src)) return;

      const alt = $img.attr("alt") || "";
      const width = parseInt($img.attr("width") || "0");
      const height = parseInt($img.attr("height") || "0");

      // Try to get context (parent section, heading, etc.)
      const $parent = $img.closest("section, div[class*='gallery'], div[class*='photo']");
      const context = $parent.find("h1, h2, h3, h4").first().text().trim();

      // Filter out logos, icons, and very small images
      const isLikelyGalleryImage =
        !src.toLowerCase().includes("logo") &&
        !src.toLowerCase().includes("icon") &&
        !src.toLowerCase().includes("favicon") &&
        (width === 0 || width > 200) &&
        (height === 0 || height > 200);

      if (isLikelyGalleryImage) {
        images.push({
          url: src,
          alt: alt || "Image",
          width: width || undefined,
          height: height || undefined,
          context: context || undefined,
        });
        imageUrls.add(src);
      }
    });

    console.log(`✅ Found ${images.length} gallery images\n`);

    // Group images by their context/section
    const groupedImages: { [key: string]: ImageInfo[] } = {};

    images.forEach((img) => {
      const category = categorizeImage(img);
      if (!groupedImages[category]) {
        groupedImages[category] = [];
      }
      groupedImages[category].push(img);
    });

    // Display results
    console.log("📊 Images by Category:\n");
    for (const [category, imgs] of Object.entries(groupedImages)) {
      console.log(`\n  ${getCategoryEmoji(category)} ${category} (${imgs.length} images):`);
      imgs.forEach((img, idx) => {
        console.log(`     ${idx + 1}. ${img.alt || "Untitled"}`);
        console.log(`        URL: ${img.url.substring(0, 80)}...`);
        if (img.context) {
          console.log(`        Context: ${img.context}`);
        }
      });
    }

    // Generate TypeScript code
    console.log("\n\n╔═══════════════════════════════════════════════════════════╗");
    console.log("║  Generated Import Data                                    ║");
    console.log("╚═══════════════════════════════════════════════════════════╝\n");

    const importData = generateImportData(groupedImages);
    console.log(importData);

    // Save to file
    const outputPath = path.join(process.cwd(), "goq-gallery-import-data.ts");
    fs.writeFileSync(outputPath, importData);
    console.log(`\n💾 Saved to: ${outputPath}`);

    // Create a JSON version too
    const jsonPath = path.join(process.cwd(), "goq-gallery-images.json");
    fs.writeFileSync(jsonPath, JSON.stringify(groupedImages, null, 2));
    console.log(`💾 Saved JSON to: ${jsonPath}`);

  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  }
}

function categorizeImage(img: ImageInfo): string {
  const lowerAlt = img.alt.toLowerCase();
  const lowerUrl = img.url.toLowerCase();
  const context = (img.context || "").toLowerCase();

  // Check alt text, URL, and context for keywords
  const allText = `${lowerAlt} ${lowerUrl} ${context}`;

  if (
    allText.includes("aerial") ||
    allText.includes("exterior") ||
    allText.includes("courtyard") ||
    allText.includes("garden") ||
    allText.includes("outdoor") ||
    allText.includes("grounds")
  ) {
    return "Beautiful Grounds & Exterior";
  }

  if (
    allText.includes("dining") ||
    allText.includes("meal") ||
    allText.includes("restaurant") ||
    allText.includes("chef") ||
    allText.includes("food")
  ) {
    return "Dining Experience";
  }

  if (
    allText.includes("apartment") ||
    allText.includes("suite") ||
    allText.includes("bedroom") ||
    allText.includes("residence") ||
    allText.includes("unit")
  ) {
    return "Residences";
  }

  if (
    allText.includes("activit") ||
    allText.includes("event") ||
    allText.includes("resident") ||
    allText.includes("enjoy") ||
    allText.includes("social") ||
    allText.includes("shuffleboard")
  ) {
    return "Activities & Events";
  }

  if (
    allText.includes("lobby") ||
    allText.includes("lounge") ||
    allText.includes("library") ||
    allText.includes("salon") ||
    allText.includes("fitness") ||
    allText.includes("chapel") ||
    allText.includes("interior") ||
    allText.includes("amenity") ||
    allText.includes("about")
  ) {
    return "Community Amenities";
  }

  return "General Gallery";
}

function getCategoryEmoji(category: string): string {
  const emojis: { [key: string]: string } = {
    "Beautiful Grounds & Exterior": "🌳",
    "Dining Experience": "🍽️",
    "Residences": "🏠",
    "Activities & Events": "🎉",
    "Community Amenities": "✨",
    "General Gallery": "📷",
  };
  return emojis[category] || "📷";
}

function generateImportData(groupedImages: { [key: string]: ImageInfo[] }): string {
  const categoryMapping: { [key: string]: string } = {
    "Beautiful Grounds & Exterior": "environment",
    "Dining Experience": "dining",
    "Residences": "apartments",
    "Activities & Events": "activities",
    "Community Amenities": "amenities",
    "General Gallery": "general",
  };

  const descriptions: { [key: string]: string } = {
    environment: "Our secure courtyard, heated walkways and scenic gardens",
    dining: "Restaurant-style dining with fresh, seasonal cuisine",
    apartments: "Comfortable, well-appointed apartments and suites",
    activities: "Engaging programs and social events for residents",
    amenities: "Explore our inviting common areas and amenities",
    general: "Explore life at Gardens on Quail",
  };

  let code = "// Auto-generated gallery import data for Gardens on Quail\n\n";
  code += "export const galleryData = [\n";

  for (const [category, imgs] of Object.entries(groupedImages)) {
    if (imgs.length === 0) continue;

    const categorySlug = categoryMapping[category] || "general";
    const isHero = categorySlug === "environment";

    code += "  {\n";
    code += `    title: "${category}",\n`;
    code += `    description: "${descriptions[categorySlug]}",\n`;
    code += `    category: "${categorySlug}",\n`;
    code += `    hero: ${isHero},\n`;
    code += "    images: [\n";

    imgs.forEach((img) => {
      code += "      {\n";
      code += `        url: "${img.url}",\n`;
      code += `        alt: "${img.alt.replace(/"/g, '\\"')}",\n`;
      code += `        caption: "${img.alt.replace(/"/g, '\\"')}",\n`;
      code += "      },\n";
    });

    code += "    ],\n";
    code += "  },\n";
  }

  code += "];\n";

  return code;
}

// Run the script
discoverImages()
  .then(() => {
    console.log("\n✅ Discovery complete!\n");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Fatal error:", error);
    process.exit(1);
  });
