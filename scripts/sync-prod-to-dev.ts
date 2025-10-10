#!/usr/bin/env tsx
import { Pool } from '@neondatabase/serverless';
import ws from 'ws';
import { neonConfig } from '@neondatabase/serverless';

neonConfig.webSocketConstructor = ws;

/**
 * Script to sync production database to development
 *
 * This script:
 * 1. Connects to both production and development databases
 * 2. Exports the entire production database schema and data
 * 3. Clears the development database
 * 4. Imports the production data into development
 *
 * Usage: npm run db:sync
 *
 * Environment variables required:
 * - PROD_DATABASE_URL: Production database connection string
 * - DATABASE_URL: Development database connection string
 */

async function syncProdToDev() {
  console.log('🔄 Starting database sync from production to development...\n');

  // Validate environment variables
  const prodUrl = process.env.PROD_DATABASE_URL;
  const devUrl = process.env.DATABASE_URL;

  if (!prodUrl) {
    throw new Error('PROD_DATABASE_URL environment variable is not set');
  }

  if (!devUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  // Safety check - ensure we're not accidentally syncing to production
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Cannot run sync in production environment!');
  }

  console.log('✓ Environment variables validated');
  console.log(`📊 Production DB: ${prodUrl.split('@')[1]?.split('?')[0] || 'hidden'}`);
  console.log(`📊 Development DB: ${devUrl.split('@')[1]?.split('?')[0] || 'hidden'}\n`);

  // Confirm before proceeding
  console.log('⚠️  WARNING: This will completely replace your development database!');
  console.log('⚠️  All existing data in development will be lost!\n');

  const prodPool = new Pool({ connectionString: prodUrl });
  const devPool = new Pool({ connectionString: devUrl });

  try {
    console.log('1️⃣  Fetching production database schema...');

    // Get all table names from production
    const tablesResult = await prodPool.query(`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename
    `);

    const tables = tablesResult.rows.map(row => row.tablename);
    console.log(`   Found ${tables.length} tables: ${tables.join(', ')}\n`);

    console.log('2️⃣  Clearing development database...');

    // Truncate all tables with CASCADE (which handles foreign keys)
    // We need to do this in a single command to avoid FK constraint issues
    if (tables.length > 0) {
      const truncateList = tables.map(t => `"${t}"`).join(', ');
      try {
        await devPool.query(`TRUNCATE TABLE ${truncateList} CASCADE`);
        console.log(`   ✓ Truncated all tables`);
      } catch (error) {
        console.log(`   ⚠️  Error truncating tables: ${error instanceof Error ? error.message : 'Unknown error'}`);
        // Try individual truncates if batch fails
        for (const table of tables) {
          try {
            await devPool.query(`TRUNCATE TABLE "${table}" CASCADE`);
            console.log(`   ✓ Truncated table: ${table}`);
          } catch (err) {
            console.log(`   ⚠️  Could not truncate ${table}: ${err instanceof Error ? err.message : 'Unknown error'}`);
          }
        }
      }
    }

    console.log('');
    console.log('3️⃣  Determining table dependency order...');

    // Get foreign key relationships to determine correct insertion order
    const fkResult = await prodPool.query(`
      SELECT
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public'
    `);

    // Build dependency graph
    const dependencies = new Map<string, Set<string>>();
    for (const table of tables) {
      dependencies.set(table, new Set());
    }

    for (const row of fkResult.rows) {
      const table = row.table_name;
      const foreignTable = row.foreign_table_name;
      if (table !== foreignTable && dependencies.has(table)) {
        dependencies.get(table)!.add(foreignTable);
      }
    }

    // Topological sort to get correct order
    const sorted: string[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    function visit(table: string) {
      if (visited.has(table)) return;
      if (visiting.has(table)) {
        // Circular dependency, skip
        return;
      }

      visiting.add(table);
      const deps = dependencies.get(table) || new Set();
      for (const dep of deps) {
        visit(dep);
      }
      visiting.delete(table);
      visited.add(table);
      sorted.push(table);
    }

    for (const table of tables) {
      visit(table);
    }

    console.log(`   Tables will be copied in dependency order\n`);
    console.log('4️⃣  Copying data from production to development...');

    // Copy data table by table in correct order
    for (const table of sorted) {
      try {
        // Get count from production
        const countResult = await prodPool.query(`SELECT COUNT(*) FROM "${table}"`);
        const rowCount = parseInt(countResult.rows[0].count);

        if (rowCount === 0) {
          console.log(`   ⊘ Skipping empty table: ${table}`);
          continue;
        }

        // Fetch all data from production
        const dataResult = await prodPool.query(`SELECT * FROM "${table}"`);
        const rows = dataResult.rows;

        if (rows.length > 0) {
          // Get column names and types from the first row
          const columns = Object.keys(rows[0]);
          const columnList = columns.map(c => `"${c}"`).join(', ');

          // Insert data into development database in batches
          const batchSize = 100;
          for (let i = 0; i < rows.length; i += batchSize) {
            const batch = rows.slice(i, i + batchSize);

            const values = batch.map((row, rowIndex) => {
              const placeholders = columns.map((_, colIndex) =>
                `$${rowIndex * columns.length + colIndex + 1}`
              ).join(', ');
              return `(${placeholders})`;
            }).join(', ');

            // Convert JSON objects to strings for proper insertion
            const params = batch.flatMap(row =>
              columns.map(col => {
                const value = row[col];
                // If value is an object and not null, stringify it
                if (value !== null && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
                  return JSON.stringify(value);
                }
                return value;
              })
            );

            await devPool.query(
              `INSERT INTO "${table}" (${columnList}) VALUES ${values}`,
              params
            );
          }

          console.log(`   ✓ Copied ${rowCount} rows to table: ${table}`);
        }
      } catch (error) {
        console.error(`   ✗ Error copying table ${table}:`, error instanceof Error ? error.message : 'Unknown error');
      }
    }

    console.log('');
    console.log('5️⃣  Resetting sequences...');

    // Reset all sequences to match the current max values
    const sequencesResult = await devPool.query(`
      SELECT sequence_name
      FROM information_schema.sequences
      WHERE sequence_schema = 'public'
    `);

    for (const row of sequencesResult.rows) {
      const sequenceName = row.sequence_name;
      const tableName = sequenceName.replace(/_seq$/, '').replace(/_id_seq$/, '');
      const columnName = sequenceName.includes('_id_seq') ? 'id' : sequenceName.replace(`${tableName}_`, '').replace('_seq', '');

      try {
        await devPool.query(`
          SELECT setval('${sequenceName}', COALESCE((SELECT MAX(${columnName}) FROM "${tableName}"), 1), true)
        `);
        console.log(`   ✓ Reset sequence: ${sequenceName}`);
      } catch (error) {
        // Sequence might not correspond to a table, skip silently
      }
    }

    console.log('');
    console.log('✅ Database sync completed successfully!');
    console.log('🎉 Your development database now matches production.\n');

  } catch (error) {
    console.error('');
    console.error('❌ Error during database sync:');
    console.error(error);
    process.exit(1);
  } finally {
    await prodPool.end();
    await devPool.end();
  }
}

// Run the sync
syncProdToDev().catch(console.error);
