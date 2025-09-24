import { db } from "../server/db";
import { amenities, communities, communitiesAmenities } from "../shared/schema";
import { eq, and } from "drizzle-orm";

async function addPrivateDiningAmenity() {
  console.log("Adding Private Family Dining Room amenity to all communities...");
  
  try {
    // First, check if the amenity already exists
    let [existingAmenity] = await db
      .select()
      .from(amenities)
      .where(eq(amenities.slug, "private-family-dining-room"));
    
    // If it doesn't exist, create it
    if (!existingAmenity) {
      console.log("Creating Private Family Dining Room amenity...");
      [existingAmenity] = await db
        .insert(amenities)
        .values({
          slug: "private-family-dining-room",
          name: "Private Family Dining Room",
          category: "dining",
          description: "Enjoy intimate family meals in our elegant private dining room, perfect for celebrations and special occasions with your loved ones.",
          icon: "Utensils",
          imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80",
          sortOrder: 25,
          active: true,
        })
        .returning();
      console.log("✓ Created Private Family Dining Room amenity");
    } else {
      console.log("Private Family Dining Room amenity already exists");
      
      // Update the amenity with image if it doesn't have one
      if (!existingAmenity.imageUrl) {
        await db
          .update(amenities)
          .set({
            imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80",
            description: "Enjoy intimate family meals in our elegant private dining room, perfect for celebrations and special occasions with your loved ones.",
          })
          .where(eq(amenities.id, existingAmenity.id));
        console.log("✓ Updated amenity with image and description");
      }
    }
    
    // Get all communities
    const allCommunities = await db.select().from(communities);
    console.log(`Found ${allCommunities.length} communities`);
    
    // Add the amenity to each community if it's not already linked
    for (const community of allCommunities) {
      // Check if the amenity is already linked to this community
      const [existing] = await db
        .select()
        .from(communitiesAmenities)
        .where(
          and(
            eq(communitiesAmenities.communityId, community.id),
            eq(communitiesAmenities.amenityId, existingAmenity.id)
          )
        );
      
      if (!existing) {
        await db
          .insert(communitiesAmenities)
          .values({
            communityId: community.id,
            amenityId: existingAmenity.id,
          });
        console.log(`✓ Added Private Family Dining Room to ${community.name}`);
      } else {
        console.log(`- Private Family Dining Room already exists for ${community.name}`);
      }
    }
    
    console.log("\n✅ Successfully added Private Family Dining Room amenity to all communities!");
    
  } catch (error) {
    console.error("Error adding amenity:", error);
    process.exit(1);
  }
}

// Run the script
addPrivateDiningAmenity()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });