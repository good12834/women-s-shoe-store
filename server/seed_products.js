const db = require('./config/db');

const seed = async () => {
    try {
        console.log('Seeding database...');

        // 1. Ensure Categories exist
        const categories = ['Heels', 'Sneakers', 'Sandals', 'Boots'];
        for (const cat of categories) {
            await db.query('INSERT IGNORE INTO categories (name) VALUES (?)', [cat]);
        }

        // 2. Ensure Sizes exist
        const sizes = ['35', '36', '37', '38', '39', '40', '41', '42'];
        for (const size of sizes) {
            await db.query('INSERT IGNORE INTO sizes (size) VALUES (?)', [size]);
        }

        // 3. Ensure Colors exist
        const colors = [
            { name: 'Red', hex: '#FF0000' },
            { name: 'Black', hex: '#000000' },
            { name: 'White', hex: '#FFFFFF' },
            { name: 'Nude', hex: '#E3C6B9' },
            { name: 'Brown', hex: '#8B4513' },
            { name: 'Blue', hex: '#0000FF' },
            { name: 'Pink', hex: '#FFC0CB' },
            { name: 'Gray', hex: '#808080' },
            { name: 'Tan', hex: '#D2B48C' }
        ];
        for (const color of colors) {
            await db.query('INSERT IGNORE INTO colors (color_name, hex_code) VALUES (?, ?)', [color.name, color.hex]);
        }

        // 4. Insert Products
        const products = [
            {
                name: 'Elegant Red Heels',
                price: 89.99,
                category: 'Heels',
                image_url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                rating: 4.8,
                reviews_count: 124,
                is_new: true,
                is_sale: true,
                brand: 'Designer Collection',
                heel_height: 'high',
                material: 'Leather',
                occasion: 'Party'
            },
            {
                name: 'Comfy White Sneakers',
                price: 65.00,
                category: 'Sneakers',
                image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                rating: 4.6,
                reviews_count: 89,
                is_new: false,
                is_sale: false,
                brand: 'SportyChic',
                heel_height: 'low',
                material: 'Canvas',
                occasion: 'Casual'
            },
            {
                name: 'Summer Sandals',
                price: 39.99,
                category: 'Sandals',
                image_url: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                rating: 4.7,
                reviews_count: 56,
                is_new: true,
                is_sale: true,
                brand: 'BeachVibes',
                heel_height: 'low',
                material: 'Synthetic',
                occasion: 'Casual'
            },
            {
                name: 'Classic Black Boots',
                price: 120.00,
                category: 'Boots',
                image_url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                rating: 4.9,
                reviews_count: 203,
                is_new: false,
                is_sale: false,
                brand: 'UrbanWalk',
                heel_height: 'medium',
                material: 'Leather',
                occasion: 'Work'
            }
        ];

        for (const p of products) {
            // Get category ID
            const [catRows] = await db.query('SELECT id FROM categories WHERE name = ?', [p.category]);
            const categoryId = catRows[0].id;

            // Insert Product
            const [res] = await db.query(`
                INSERT INTO products (name, price, category_id, image_url, rating, reviews_count, is_new, is_sale, brand, heel_height, material, occasion)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [p.name, p.price, categoryId, p.image_url, p.rating, p.reviews_count, p.is_new, p.is_sale, p.brand, p.heel_height, p.material, p.occasion]);

            const productId = res.insertId;
            console.log(`Inserted product: ${p.name} (ID: ${productId})`);

            // Insert Variants (Random sizes and colors)
            const sizesToUse = ['36', '37', '38', '39', '40'];
            const colorsToUse = ['Black', 'White', 'Red', 'Nude'];

            for (const s of sizesToUse) {
                const [sizeRows] = await db.query('SELECT id FROM sizes WHERE size = ?', [s]);
                if (sizeRows.length === 0) continue;
                const sizeId = sizeRows[0].id;

                for (const c of colorsToUse) {
                    const [colorRows] = await db.query('SELECT id FROM colors WHERE color_name = ?', [c]);
                    if (colorRows.length === 0) continue;
                    const colorId = colorRows[0].id;

                    // Random stock
                    const stock = Math.floor(Math.random() * 20);

                    await db.query(`
                        INSERT INTO product_variants (product_id, size_id, color_id, stock)
                        VALUES (?, ?, ?, ?)
                    `, [productId, sizeId, colorId, stock]);
                }
            }
        }

        console.log('Seeding completed successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
};

seed();
