import { neon } from "@neondatabase/serverless";

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required");
  }

  const sql = neon(process.env.DATABASE_URL);

  try {
    console.log("Fetching constraint name for bookings.status...");
    const constraints = await sql`
      SELECT conname
      FROM pg_constraint
      WHERE conrelid = 'bookings'::regclass
        AND contype = 'c'
        AND pg_get_constraintdef(oid) ILIKE '%status%'
    `;
    console.log("Constraints:", constraints);

    for (const row of constraints) {
      console.log(`Dropping constraint: ${row.conname}`);
      await sql.query(
        `ALTER TABLE bookings DROP CONSTRAINT IF EXISTS "${row.conname}"`,
      );
    }

    console.log("Adding repeatable status constraint...");
    await sql.query(`
      ALTER TABLE bookings
      ADD CONSTRAINT bookings_status_check
      CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled'))
    `);

    console.log("Done!");
  } catch (err) {
    console.error("Error:", err);
    process.exitCode = 1;
  }
}

main();
