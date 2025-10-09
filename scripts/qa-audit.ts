import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function audit() {
  const slugs = ['golden-pond', 'the-gardens-on-quail', 'gardens-at-columbine', 'stonebridge-senior'];

  for (const slug of slugs) {
    console.log('\n=== ' + slug.toUpperCase() + ' ===\n');

    // Get community
    const [community] = await sql`
      SELECT id, name, slug, address, city, state, zip,
             phone_display, phone_dial, email,
             overview, description, short_description,
             starting_rate_display, seo_title, seo_description
      FROM communities WHERE slug = ${slug}
    `;

    console.log('Data Quality Check:\n');

    // Check for NULL critical fields
    const criticalNulls = [];
    if (!community.address) criticalNulls.push('address');
    if (!community.city) criticalNulls.push('city');
    if (!community.state) criticalNulls.push('state');
    if (!community.zip) criticalNulls.push('zip');
    if (!community.phone_display) criticalNulls.push('phone_display');
    if (!community.phone_dial) criticalNulls.push('phone_dial');
    if (!community.overview) criticalNulls.push('overview');
    if (!community.description) criticalNulls.push('description');
    if (!community.short_description) criticalNulls.push('short_description');
    if (!community.starting_rate_display) criticalNulls.push('starting_rate_display');
    if (!community.seo_title) criticalNulls.push('seo_title');
    if (!community.seo_description) criticalNulls.push('seo_description');

    if (criticalNulls.length > 0) {
      console.log('❌ NULL Critical Fields:');
      criticalNulls.forEach(field => console.log('  -', field));
    } else {
      console.log('✅ No NULL critical fields');
    }

    // Check optional fields
    const optionalNulls = [];
    if (!community.email) optionalNulls.push('email');

    if (optionalNulls.length > 0) {
      console.log('\n⚠️  NULL Optional Fields:');
      optionalNulls.forEach(field => console.log('  -', field));
    }

    // Verify phone format
    console.log('\nPhone Validation:');
    if (community.phone_display) {
      const hasFormat = /\(\d{3}\)\s*\d{3}-\d{4}/.test(community.phone_display);
      console.log('  Display Format:', hasFormat ? '✅' : '⚠️  ' + community.phone_display);
    }
    if (community.phone_dial) {
      const digitsOnly = /^[+]?\d+$/.test(community.phone_dial);
      console.log('  Dial Format:', digitsOnly ? '✅' : '⚠️  ' + community.phone_dial);
    }

    // Check description lengths
    console.log('\nContent Lengths:');
    console.log('  Overview:', (community.overview || '').length, 'chars');
    console.log('  Description:', (community.description || '').length, 'chars');
    console.log('  Short Desc:', (community.short_description || '').length, 'chars');
    const seoTitleLen = (community.seo_title || '').length;
    console.log('  SEO Title:', seoTitleLen, 'chars', seoTitleLen > 60 ? '⚠️  (too long)' : '');
    const seoDescLen = (community.seo_description || '').length;
    console.log('  SEO Description:', seoDescLen, 'chars', seoDescLen > 160 ? '⚠️  (too long)' : '');
  }
}

audit().catch(console.error);
