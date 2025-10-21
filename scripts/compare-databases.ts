#!/usr/bin/env tsx
import { Pool } from '@neondatabase/serverless';
import ws from 'ws';
import { neonConfig } from '@neondatabase/serverless';

neonConfig.webSocketConstructor = ws;

async function compareDatabases() {
  const devUrl = process.argv[2];
  const prodUrl = process.argv[3];

  if (!devUrl || !prodUrl) {
    console.error('❌ Usage: tsx scripts/compare-databases.ts <dev-database-url> <prod-database-url>');
    process.exit(1);
  }

  const devPool = new Pool({ connectionString: devUrl });
  const prodPool = new Pool({ connectionString: prodUrl });

  try {
    console.log('🔍 Comparing development and production databases...\n');

    // Get all tables
    const tablesResult = await devPool.query(`
      SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename
    `);

    const tables = tablesResult.rows.map(r => r.tablename);

    console.log('Table Comparison:\n');
    console.log('┌─────────────────────────────┬──────────┬──────────┬────────────┐');
    console.log('│ Table                       │ Dev      │ Prod     │ Difference │');
    console.log('├─────────────────────────────┼──────────┼──────────┼────────────┤');

    const differences: Array<{table: string, dev: number, prod: number, diff: number}> = [];

    for (const table of tables) {
      try {
        const devCountResult = await devPool.query(`SELECT COUNT(*) FROM "${table}"`);
        const prodCountResult = await prodPool.query(`SELECT COUNT(*) FROM "${table}"`);

        const devCount = parseInt(devCountResult.rows[0].count);
        const prodCount = parseInt(prodCountResult.rows[0].count);
        const diff = devCount - prodCount;

        const paddedTable = table.padEnd(27);
        const paddedDev = devCount.toString().padStart(8);
        const paddedProd = prodCount.toString().padStart(8);
        const paddedDiff = diff.toString().padStart(10);

        const diffMarker = diff > 0 ? '⚠️ ' : diff < 0 ? '⚡' : '✓ ';

        console.log(`│ ${paddedTable} │ ${paddedDev} │ ${paddedProd} │ ${diffMarker}${paddedDiff} │`);

        if (diff !== 0) {
          differences.push({ table, dev: devCount, prod: prodCount, diff });
        }
      } catch (error) {
        console.log(`│ ${table.padEnd(27)} │ ERROR    │ ERROR    │ ERROR      │`);
      }
    }

    console.log('└─────────────────────────────┴──────────┴──────────┴────────────┘\n');

    if (differences.length > 0) {
      console.log('⚠️  Tables with differences:\n');
      for (const { table, dev, prod, diff } of differences) {
        if (diff > 0) {
          console.log(`   ${table}: ${diff} more records in DEV (Dev: ${dev}, Prod: ${prod})`);
        } else {
          console.log(`   ${table}: ${Math.abs(diff)} more records in PROD (Dev: ${dev}, Prod: ${prod})`);
        }
      }
      console.log('');
    } else {
      console.log('✅ All tables have the same number of records!\n');
    }

  } catch (error) {
    console.error('❌ Error comparing databases:', error);
    process.exit(1);
  } finally {
    await devPool.end();
    await prodPool.end();
  }
}

compareDatabases().catch(console.error);
