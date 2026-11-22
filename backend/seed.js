const fs = require('fs');
const path = require('path');
const { initDb, query } = require('./db');

async function seed() {
  console.log('Running database seeding script...');
  await initDb();
  const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await query(schemaSql);
  console.log('Seeding completed successfully!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
