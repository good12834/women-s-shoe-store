const fs = require('fs');
const path = require('path');
const db = require('./config/db');

const runMigration = async (filename) => {
    try {
        console.log(`Running ${filename}...`);
        const sql = fs.readFileSync(path.join(__dirname, 'migrations', filename), 'utf8');
        const statements = sql.split(';').filter(stmt => stmt.trim() !== '');

        for (const statement of statements) {
            await db.query(statement);
        }
        console.log('Migration completed successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
};

const filename = process.argv[2];
if (!filename) {
    console.error('Please provide a filename');
    process.exit(1);
}

runMigration(filename);
