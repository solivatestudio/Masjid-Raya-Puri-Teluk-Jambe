import { neon } from '@neondatabase/serverless';

async function main() {
  const sql = neon(process.env.DATABASE_URL);
  
  try {
    console.log('Fetching constraint name for bookings.status...');
    const res = await sql`
      SELECT conname
      FROM pg_constraint
      WHERE conrelid = 'bookings'::regclass
        AND contype = 'c'
    `;
    console.log('Constraints:', res);
    
    for (const row of res) {
      if (row.conname.includes('status')) {
        console.log(`Dropping constraint: ${row.conname}`);
        // Can't use tagged template for DDL with dynamic table/constraint names easily if not supported, so use query
        await sql.query(`ALTER TABLE bookings DROP CONSTRAINT IF EXISTS "${row.conname}"`);
      }
    }

    console.log('Adding new constraint...');
    await sql.query(`ALTER TABLE bookings ADD CONSTRAINT bookings_status_check CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled'))`);
    
    console.log('Done!');
  } catch (err) {
    console.error('Error:', err);
  }
}

main();
