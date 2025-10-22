#!/usr/bin/env tsx
import { Pool } from '@neondatabase/serverless';
import ws from 'ws';
import { neonConfig } from '@neondatabase/serverless';
import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

neonConfig.webSocketConstructor = ws;

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

interface UserData {
  username: string;
  password: string;
  email: string;
  role?: string;
}

async function addAdminUser(databaseUrl: string, userData: UserData, environment: string) {
  console.log(`\n🔑 Adding admin user to ${environment}...`);

  const pool = new Pool({ connectionString: databaseUrl });

  try {
    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE username = $1 OR email = $2',
      [userData.username, userData.email]
    );

    if (existingUser.rows.length > 0) {
      console.log(`⚠️  User already exists in ${environment}:`);
      console.log(`   Username: ${existingUser.rows[0].username}`);
      console.log(`   Email: ${existingUser.rows[0].email}`);
      console.log(`   Created: ${existingUser.rows[0].created_at}`);
      return;
    }

    // Hash the password
    const hashedPassword = await hashPassword(userData.password);

    // Insert the new user
    const result = await pool.query(
      `INSERT INTO users (username, password, email, role, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       RETURNING id, username, email, role, created_at`,
      [userData.username, hashedPassword, userData.email, userData.role || 'admin']
    );

    console.log(`✅ Successfully added user to ${environment}:`);
    console.log(`   ID: ${result.rows[0].id}`);
    console.log(`   Username: ${result.rows[0].username}`);
    console.log(`   Email: ${result.rows[0].email}`);
    console.log(`   Role: ${result.rows[0].role}`);
    console.log(`   Created: ${result.rows[0].created_at}`);

  } catch (error) {
    console.error(`❌ Error adding user to ${environment}:`, error);
    throw error;
  } finally {
    await pool.end();
  }
}

async function main() {
  // User data for Colleen Emery
  const userData: UserData = {
    username: 'colleen.emery',
    password: 'StageAdmin2025!#ColleenE', // Strong temporary password
    email: 'colleen@stagesenior.com',
    role: 'admin'
  };

  console.log('👤 Adding Admin User: Colleen Emery');
  console.log('📧 Email: colleen@stagesenior.com');
  console.log('🔑 Username: colleen.emery');
  console.log('🔐 Temporary Password: StageAdmin2025!#ColleenE');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // Get database URLs from environment
  const devUrl = process.env.DATABASE_URL;
  const prodUrl = process.env.PROD_DATABASE_URL;

  if (!devUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  if (!prodUrl) {
    throw new Error('PROD_DATABASE_URL environment variable is not set');
  }

  // Add user to development
  await addAdminUser(devUrl, userData, 'DEVELOPMENT');

  // Add user to production
  await addAdminUser(prodUrl, userData, 'PRODUCTION');

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ User addition complete!');
  console.log('\n📧 Send Colleen the following credentials:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('👤 Username: colleen.emery');
  console.log('🔐 Password: StageAdmin2025!#ColleenE');
  console.log('🌐 Login URL: https://stagesenior.com/login');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('⚠️  Please advise her to change this password after first login!\n');
}

main().catch(console.error);
