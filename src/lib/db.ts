import pg from 'pg';

const { Pool } = pg;

// Crée l'instance du pool de connexion
export const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_DATABASE || 'mma_leones_dba',
  password: process.env.DB_PASSWORD || 'passer',
  port: parseInt(process.env.DB_PORT || '5432', 10),

  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error(
    'Erreur inattendue sur un client PostgreSQL inactif',
    err
  );
});

export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};

export default pool;