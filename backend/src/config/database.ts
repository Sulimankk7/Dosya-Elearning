import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },

    // FIX: The original Pool used pg defaults:
    //   max: 10 connections, idleTimeoutMillis: 10000, connectionTimeoutMillis: 0
    //
    // With Promise.all parallelizing queries, multiple connections are now acquired
    // simultaneously per request. If the pool is exhausted, new queries queue and
    // wait — adding latency that looks like slow TTFB but is actually pool starvation.
    //
    // Increased max to 20 and set a hard connection timeout so stalled requests
    // fail fast instead of hanging for 29 seconds.
    max: 20,                        // was default 10 — raise if you see pool-wait logs
    idleTimeoutMillis: 30_000,      // release idle connections after 30s
    connectionTimeoutMillis: 5_000, // fail loudly if no connection available in 5s
                                    // (was 0 = wait forever — this was contributing to
                                    //  the 29s hangs when the pool was exhausted)
});

const originalQuery = pool.query.bind(pool);

(pool as any).query = async function(...args: any[]) {
    const start = process.hrtime();
    try {
        const res = await (originalQuery as any)(...args);
        const diff = process.hrtime(start);
        const time = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);
        if (parseFloat(time) > 10) {
            console.log(`🐢 SQL SLOW (${time}ms):`, typeof args[0] === 'string' ? args[0].substring(0, 120).replace(/\n/g, ' ') : 'Query Object');
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
    .then(() => console.log('Database connected successfully'))
    .catch((err) => console.error('Database connection failed:', err));

export default pool;
