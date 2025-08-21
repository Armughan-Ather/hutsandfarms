// printSchema.mjs
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false, // Required for NeonDB
  },
});

async function printSchema() {
  try {
    const client = await pool.connect();
    console.log('Connected to the database.\n');

    const tablesResult = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    for (const { table_name } of tablesResult.rows) {
      console.log(`\n📄 Table: ${table_name}`);

      // Get column details
      const columnsResult = await client.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_name = $1
        ORDER BY ordinal_position;
      `, [table_name]);

      for (const col of columnsResult.rows) {
        console.log(`   • ${col.column_name} - ${col.data_type}${col.is_nullable === 'NO' ? ' (NOT NULL)' : ''}${col.column_default ? ` DEFAULT ${col.column_default}` : ''}`);
      }

      // Get primary key
      const pkResult = await client.query(`
        SELECT kcu.column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
        WHERE tc.table_name = $1 AND tc.constraint_type = 'PRIMARY KEY';
      `, [table_name]);

      if (pkResult.rows.length > 0) {
        const pkColumns = pkResult.rows.map(row => row.column_name).join(', ');
        console.log(`   🔑 Primary Key: ${pkColumns}`);
      }
    }

    client.release();
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await pool.end();
  }
}

printSchema();
