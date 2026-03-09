// Direct DB test to find the exact SQL error
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

async function test() {
    try {
        // Test 1: Basic connection
        console.log('1. Testing connection...');
        const now = await pool.query('SELECT NOW()');
        console.log('   OK:', now.rows[0].now);

        // Test 2: Check roles table
        console.log('\n2. Checking roles...');
        const roles = await pool.query('SELECT * FROM roles');
        console.log('   Roles:', JSON.stringify(roles.rows));

        // Test 3: Check users table columns
        console.log('\n3. Checking users columns...');
        const cols = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND table_schema = 'public'
      ORDER BY ordinal_position
    `);
        cols.rows.forEach(c => console.log(`   ${c.column_name}: ${c.data_type} (nullable: ${c.is_nullable})`));

        // Test 4: Check if role_id has a default
        console.log('\n4. Checking if role_id has a default...');
        const defaults = await pool.query(`
      SELECT column_name, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'role_id' AND table_schema = 'public'
    `);
        console.log('   Default:', defaults.rows[0]?.column_default || 'NONE');

        // Test 5: Try the actual INSERT that register does
        console.log('\n5. Testing INSERT INTO users (name, email, password_hash)...');
        try {
            const insertResult = await pool.query(
                `INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *`,
                ['Test Direct', 'direct_test_123@test.com', '$2b$10$fakehashfortest']
            );
            console.log('   INSERT OK:', JSON.stringify(insertResult.rows[0]));
            // Clean up
            await pool.query('DELETE FROM users WHERE email = $1', ['direct_test_123@test.com']);
            console.log('   Cleaned up test user');
        } catch (err) {
            console.log('   INSERT FAILED:', err.message);
            console.log('   Detail:', err.detail);
            console.log('   Code:', err.code);
        }

        // Test 6: Try INSERT with a role_id
        console.log('\n6. Testing INSERT with explicit role_id...');
        if (roles.rows.length > 0) {
            const studentRole = roles.rows.find(r => r.name === 'student');
            console.log('   Student role:', JSON.stringify(studentRole));
            if (studentRole) {
                try {
                    const insertResult = await pool.query(
                        `INSERT INTO users (name, email, password_hash, role_id) VALUES ($1, $2, $3, $4) RETURNING *`,
                        ['Test WithRole', 'role_test_123@test.com', '$2b$10$fakehash', studentRole.id]
                    );
                    console.log('   INSERT OK:', JSON.stringify(insertResult.rows[0]));
                    await pool.query('DELETE FROM users WHERE email = $1', ['role_test_123@test.com']);
                    console.log('   Cleaned up test user');
                } catch (err) {
                    console.log('   INSERT FAILED:', err.message);
                }
            }
        }

    } catch (err) {
        console.error('General error:', err.message);
    } finally {
        await pool.end();
    }
}

test();
