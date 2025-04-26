import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    return res;
  } catch (error) {
    throw error;
  }
}

export async function initializeDatabase() {
  const createTablesQuery = `
    CREATE TABLE IF NOT EXISTS images (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      data BYTEA NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS user_roles (
      id SERIAL PRIMARY KEY,
      role_name VARCHAR(50) NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS consultant_submissions (
      id SERIAL PRIMARY KEY,
      image_id INTEGER REFERENCES images(id) ON DELETE CASCADE,
      length_meters NUMERIC(10, 2) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      expires_at TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP + INTERVAL '1 hour')
    );

    INSERT INTO user_roles (role_name)
    VALUES ('admin'), ('consultant'), ('cashier')
    ON CONFLICT (role_name) DO NOTHING;
  `;

  try {
    await query(createTablesQuery);
  } catch (error) {
    throw error;
  }
}
