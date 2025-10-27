import { db } from '../server/db';
import { pageContentSections } from '../shared/schema';
import { and, eq } from 'drizzle-orm';

/**
 * Add CTA section to the resources page
 */
async function addResourcesCTA() {
  console.log('📣 Adding CTA section to resources page...\n');

  try {
    // Check if CTA already exists
    const existing = await db.select()
      .from(pageContentSections)
      .where(
        and(
          eq(pageContentSections.pagePath, '/resources'),
          eq(pageContentSections.sectionKey, 'resources-cta')
        )
      )
      .limit(1);

    if (existing.length > 0) {
      console.log('  CTA section already exists, updating...');
      await db.update(pageContentSections)
        .set({
          title: 'Ready to Find the Perfect Community for Your Loved One?',
          subtitle: 'Our senior living experts are here to help you explore your options and find the right fit.',
          active: true,
          updatedAt: new Date(),
        })
        .where(eq(pageContentSections.id, existing[0].id));
      console.log('  ✅ CTA section updated');
    } else {
      console.log('  Creating new CTA section...');
      await db.insert(pageContentSections).values({
        pagePath: '/resources',
        sectionType: 'cta_row',
        sectionKey: 'resources-cta',
        title: 'Ready to Find the Perfect Community for Your Loved One?',
        subtitle: 'Our senior living experts are here to help you explore your options and find the right fit.',
        content: {},
        sortOrder: 100,
        active: true,
      });
      console.log('  ✅ CTA section created');
    }

    console.log('\n✅ CTA section added to resources page successfully!');
  } catch (error) {
    console.error('❌ Failed to add CTA section:', error);
    process.exit(1);
  }
}

// Run the script
addResourcesCTA();
