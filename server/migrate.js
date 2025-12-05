const fs = require('fs');
const path = require('path');
const db = require('./config/db');

const migrate = async () => {
    try {
        const files = fs.readdirSync(path.join(__dirname, 'migrations')).sort();

        console.log('Found migrations:', files);

        for (const file of files) {
            console.log(`Running ${file}...`);
            const sql = fs.readFileSync(path.join(__dirname, 'migrations', file), 'utf8');
            const statements = sql.split(';').filter(stmt => stmt.trim() !== '');

            for (const statement of statements) {
                await db.query(statement);
            }
        }

        console.log('All migrations completed successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
};

migrate();
