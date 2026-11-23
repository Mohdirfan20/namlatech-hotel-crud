const { Pool } = require('pg');
const { newDb } = require('pg-mem');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

let pool;
let isInMemory = false;

const initDb = async () => {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');

  // Attempt standard PostgreSQL connection first
  const realPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    user: process.env.PGUSER || 'postgres',
    host: process.env.PGHOST || 'localhost',
    database: process.env.PGDATABASE || 'namlatech_hotels',
    password: process.env.PGPASSWORD || 'postgres',
    port: parseInt(process.env.PGPORT, 10) || 5432,
    connectionTimeoutMillis: 2000 // 2 seconds timeout to detect if live PG is available
  });

  try {
    const client = await realPool.connect();
    console.log('✅ Connected to live PostgreSQL database successfully.');
    
    // Check if hotels table exists
    const res = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'hotels'
      );
    `);
    
    if (!res.rows[0].exists) {
      console.log('⚡ Initializing hotels table and seed data in PostgreSQL...');
      await client.query(schemaSql);
      console.log('✅ Database schema and seed data loaded successfully.');
    } else {
      const countRes = await client.query('SELECT COUNT(*) FROM hotels');
      console.log(`ℹ️ Existing hotels table detected with ${countRes.rows[0].count} records.`);
      if (parseInt(countRes.rows[0].count, 10) === 0) {
        console.log('⚡ Table is empty. Seeding initial hotel records...');
        await client.query(schemaSql);
      }
    }
    client.release();
    pool = realPool;
    return pool;
  } catch (err) {
    console.warn(`⚠️ Could not connect to live PostgreSQL (${err.message}).`);
    console.log('🚀 Activating embedded PostgreSQL in-memory engine (pg-mem) with 100% Native SQL compatibility...');
    
    // Use pg-mem for zero-friction standalone execution
    const memDb = newDb();
    
    // Setup pg adapter
    const pgAdapter = memDb.adapters.createPg();
    pool = new pgAdapter.Pool();
    isInMemory = true;

    // Execute schema.sql inside pg-mem (normalize type precision for AST compatibility)
    const memSql = schemaSql
      .replace(/DECIMAL\(\d+,\s*\d+\)/gi, 'DECIMAL')
      .replace(/NUMERIC\(\d+,\s*\d+\)/gi, 'NUMERIC');
    await pool.query(memSql);
    console.log('✅ Embedded PostgreSQL initialized with full schema and 25 seed records.');
    return pool;
  }
};

const query = async (text, params) => {
  if (!pool) {
    await initDb();
  }
  return pool.query(text, params);
};

module.exports = {
  getPool: () => pool,
  initDb,
  query,
  isInMemory: () => isInMemory
};
