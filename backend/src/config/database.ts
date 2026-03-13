import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

const originalQuery = pool.query.bind(pool);

(pool as any).query = async function(...args: any[]) {
    const start = process.hrtime();
    try {
        const res = await (originalQuery as any)(...args);
        const diff = process.hrtime(start);
        const time = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);
        
        // Log queries taking more than 50ms, or all if debugging
        if (parseFloat(time) > 10) {
            console.log(`🐢 SQL SLOW (${time}ms):`, typeof args[0] === 'string' ? args[0].substring(0, 100).replace(/\n/g, ' ') : 'Query Object');
        }
        
        return res;
    } catch (err) {
        console.error(`❌ SQL ERROR:`, err);
        throw err;
    }
};

pool.on('error', (err) => {
    console.error('Unexpected database error:', err);
    process.exit(-1);
});

pool.connect()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });

export default pool;