import fs from 'fs';
import path from 'path';
import { db } from './server/db';
import { pool } from './server/db';
import { processSingleImageUpload } from './server/upload';
import { pageContentSections } from './shared/schema';
import { eq, sql } from 'drizzle-orm';

interface ImageMapping {
  filePath: string;
  fileName: string;
  sectionIds: string[];
  description: string;
}

const imageMappings: ImageMapping[] = [
  {
    filePath: 'attached_assets/generated_images/Senior_salon_wellness_space_cece5c9c.png',
    fileName: 'Senior_salon_wellness_space_cece5c9c.png',
    sectionIds: ['4392e6df-f1b7-482a-85ba-df2d5fb5ee03'],
    description: '/beauty-salon, wellness_impact'
  },
  {
    filePath: 'attached_assets/generated_images/Senior_community_courtyard_garden_58df3da2.png',
    fileName: 'Senior_community_courtyard_garden_58df3da2.png',
    sectionIds: ['7d805615-96e0-4f35-ab0c-9716d9cf2780'],
    description: '/courtyards-patios, safety_features'
  },
  {
    filePath: 'attached_assets/generated_images/Senior_restaurant-style_dining_room_392295c1.png',
    fileName: 'Senior_restaurant-style_dining_room_392295c1.png',
    sectionIds: ['0d02aafe-cfb5-4770-861f-b610103043a4'],
    description: '/dining, restaurant_dining'
  },
  {
    filePath: 'attached_assets/generated_images/Private_family_dining_celebration_7634be0e.png',
    fileName: 'Private_family_dining_celebration_7634be0e.png',
    sectionIds: ['b611a20d-2c39-4a67-8810-2153f9ab3ace'],
    description: '/dining, private_family_dining'
  },
  {
    filePath: 'attached_assets/generated_images/Social_dining_community_experience_82dff6ce.png',
    fileName: 'Social_dining_community_experience_82dff6ce.png',
    sectionIds: ['77a44bcc-6563-4feb-b471-24896eacf784'],
    description: '/dining, social_dining'
  },
  {
    filePath: 'attached_assets/generated_images/Senior_fitness_center_equipment_b27a3dd5.png',
    fileName: 'Senior_fitness_center_equipment_b27a3dd5.png',
    sectionIds: ['156dda0a-af66-4dcc-b940-12027143b89e'],
    description: '/fitness-therapy, fitness_center'
  },
  {
    filePath: 'attached_assets/generated_images/Physical_therapy_rehabilitation_session_152338a1.png',
    fileName: 'Physical_therapy_rehabilitation_session_152338a1.png',
    sectionIds: ['ab3c310a-f9a0-4c9b-85bb-4103aaca6d34'],
    description: '/fitness-therapy, physical_therapy'
  },
  {
    filePath: 'attached_assets/generated_images/Occupational_therapy_daily_skills_7eabbeee.png',
    fileName: 'Occupational_therapy_daily_skills_7eabbeee.png',
    sectionIds: ['9a9000a4-e400-4b94-b9bc-78726012670e'],
    description: '/fitness-therapy, occupational_therapy'
  },
  {
    filePath: 'attached_assets/generated_images/Expert_wellness_professional_team_618542ea.png',
    fileName: 'Expert_wellness_professional_team_618542ea.png',
    sectionIds: ['0d855502-391c-41e9-87c0-e3b98638a9cd'],
    description: '/fitness-therapy, professional_staff'
  },
  {
    filePath: 'attached_assets/generated_images/Chaplain_spiritual_care_support_de88a7a3.png',
    fileName: 'Chaplain_spiritual_care_support_de88a7a3.png',
    sectionIds: ['480ff623-b5e7-44c1-970b-3de1ffce85ae', '31aff61d-f23a-4fed-bac6-525c8d8dd88a'],
    description: 'both chaplaincy sections'
  },
  {
    filePath: 'attached_assets/generated_images/Long-term_care_insurance_consultation_25ceb88b.png',
    fileName: 'Long-term_care_insurance_consultation_25ceb88b.png',
    sectionIds: ['abd68ed2-c731-4ef3-ad0e-985c541e32e0', '62b2f3b6-34b4-4fce-b973-f00b1c560eeb'],
    description: 'both long-term care sections'
  },
  {
    filePath: 'attached_assets/generated_images/Management_services_leadership_team_9bfb43d5.png',
    fileName: 'Management_services_leadership_team_9bfb43d5.png',
    sectionIds: ['f80e75d2-62d8-4e5d-ba06-6249b1896ae5', 'e7ac8b5a-4466-49d2-acfb-8b16d49238d3'],
    description: 'both management sections'
  }
];

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function uploadAndUpdateImages() {
  console.log('Starting image upload and database update process...\n');
  
  const results: { success: boolean; fileName: string; imageId?: string; error?: string; updates?: number }[] = [];
  
  for (let i = 0; i < imageMappings.length; i++) {
    const mapping = imageMappings[i];
    
    try {
      console.log(`[${i + 1}/${imageMappings.length}] Processing: ${mapping.fileName}`);
      console.log(`  Description: ${mapping.description}`);
      
      // Check if file exists
      if (!fs.existsSync(mapping.filePath)) {
        throw new Error(`File not found: ${mapping.filePath}`);
      }
      
      // Read the file
      const fileBuffer = fs.readFileSync(mapping.filePath);
      
      // Create a mock Express.Multer.File object
      const mockFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: mapping.fileName,
        encoding: '7bit',
        mimetype: 'image/png',
        size: fileBuffer.length,
        buffer: fileBuffer,
        stream: null as any,
        destination: '',
        filename: mapping.fileName,
        path: mapping.filePath
      };
      
      // Upload the image using the existing upload function
      console.log(`  Uploading to object storage...`);
      const uploadResult = await processSingleImageUpload(mockFile, undefined);
      console.log(`  ✓ Uploaded successfully - Image ID: ${uploadResult.imageId}`);
      
      // Give a small delay between operations
      await sleep(500);
      
      // Update all associated page_content_sections using direct SQL
      let updateCount = 0;
      const client = await pool.connect();
      
      try {
        for (const sectionId of mapping.sectionIds) {
          console.log(`  Updating section: ${sectionId}`);
          
          // Check if section exists
          const checkResult = await client.query(
            'SELECT id FROM page_content_sections WHERE id = $1',
            [sectionId]
          );
          
          if (checkResult.rows.length === 0) {
            console.log(`    ⚠ Warning: Section ${sectionId} not found, skipping`);
            continue;
          }
          
          // Update the section: set imageId and remove imageUrl
          await client.query(
            `UPDATE page_content_sections 
             SET content = jsonb_set(content - 'imageUrl', '{imageId}', $1::jsonb) 
             WHERE id = $2`,
            [JSON.stringify(uploadResult.imageId), sectionId]
          );
          
          console.log(`    ✓ Updated successfully`);
          updateCount++;
        }
      } finally {
        client.release();
      }
      
      results.push({
        success: true,
        fileName: mapping.fileName,
        imageId: uploadResult.imageId,
        updates: updateCount
      });
      
      console.log(`  ✓ Completed: ${updateCount} section(s) updated\n`);
      
      // Small delay between images to prevent connection issues
      await sleep(1000);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`  ✗ Error: ${errorMessage}\n`);
      results.push({
        success: false,
        fileName: mapping.fileName,
        error: errorMessage
      });
    }
  }
  
  // Print summary
  console.log('\n========================================');
  console.log('UPLOAD AND UPDATE SUMMARY');
  console.log('========================================\n');
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`Total images processed: ${results.length}`);
  console.log(`Successful uploads: ${successful.length}`);
  console.log(`Failed uploads: ${failed.length}\n`);
  
  if (successful.length > 0) {
    console.log('✓ SUCCESSFUL UPLOADS:\n');
    successful.forEach(r => {
      console.log(`  ${r.fileName}`);
      console.log(`    Image ID: ${r.imageId}`);
      console.log(`    Sections updated: ${r.updates}\n`);
    });
  }
  
  if (failed.length > 0) {
    console.log('✗ FAILED UPLOADS:\n');
    failed.forEach(r => {
      console.log(`  ${r.fileName}`);
      console.log(`    Error: ${r.error}\n`);
    });
  }
  
  console.log('========================================\n');
  
  // Close pool
  await pool.end();
  
  process.exit(failed.length > 0 ? 1 : 0);
}

// Run the upload process
uploadAndUpdateImages().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
