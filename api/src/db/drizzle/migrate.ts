import pg from 'pg'
import dotenv from 'dotenv'
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

dotenv.config()

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

async function main() {
    console.log('Starting migration');
    await migrate(db, { migrationsFolder: "drizzle" });
    console.log('Migration finished');

}

main().catch((err) => {
    console.error(err);
    process.exit(0);
});
