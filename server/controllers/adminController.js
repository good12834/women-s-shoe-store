const db = require('../config/db');

exports.getDashboardStats = async (req, res) => {
    try {
        const [orders] = await db.query('SELECT COUNT(*) as total_orders, SUM(total_price) as total_revenue FROM orders');
        const [products] = await db.query('SELECT COUNT(*) as total_products FROM products');
        const [users] = await db.query('SELECT COUNT(*) as total_users FROM users');

        // Low stock items (less than 5)
        const [lowStock] = await db.query(`
      SELECT p.name, pv.stock, s.size, c.color_name 
      FROM product_variants pv
      JOIN products p ON pv.product_id = p.id
      JOIN sizes s ON pv.size_id = s.id
      JOIN colors c ON pv.color_id = c.id
      WHERE pv.stock < 5
    `);

        res.json({
            totalOrders: orders[0].total_orders,
            totalRevenue: orders[0].total_revenue || 0,
            totalProducts: products[0].total_products,
            totalUsers: users[0].total_users,
            lowStock
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getInventoryLogs = async (req, res) => {
    try {
        const [logs] = await db.query(`
      SELECT il.*, p.name as product_name, s.size, c.color_name 
      FROM inventory_logs il
      JOIN product_variants pv ON il.product_variant_id = pv.id
      JOIN products p ON pv.product_id = p.id
      JOIN sizes s ON pv.size_id = s.id
      JOIN colors c ON pv.color_id = c.id
      ORDER BY il.created_at DESC
    `);
        res.json(logs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
