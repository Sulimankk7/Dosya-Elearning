const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
    connectionString: 'postgresql://postgres:Suliman.k1212@db.zdbxwfiwmpwuednlbglp.supabase.co:5432/postgres',
    ssl: { rejectUnauthorized: false },
});

async function run() {
    try {
        console.log('Connecting to Supabase...');

        const schemaSQL = fs.readFileSync(path.join(__dirname, 'sql', 'schema.sql'), 'utf8');
        console.log('Running schema.sql...');
        await pool.query(schemaSQL);
        console.log('Schema created successfully');

        const seedSQL = fs.readFileSync(path.join(__dirname, 'sql', 'seed.sql'), 'utf8');
        console.log('Running seed.sql...');
        await pool.query(seedSQL);
        console.log('Seed data inserted successfully');

        const roles = await pool.query('SELECT * FROM roles');
        console.log('Roles:', roles.rows.map(r => r.name).join(', '));

        const courses = await pool.query('SELECT title FROM courses');
        console.log('Courses:', courses.rows.length, 'created');

        const users = await pool.query('SELECT email, full_name FROM users');
        users.rows.forEach(u => console.log('User:', u.full_name, '-', u.email));

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

run();
