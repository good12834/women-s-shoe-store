const db = require('../config/db');

exports.createOrder = async (req, res) => {
    const { items, total_price } = req.body; // items: [{ variant_id, quantity, price }]
    const userId = req.user.id;

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const [orderResult] = await connection.query(
            'INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, ?)',
            [userId, total_price, 'pending']
        );
        const orderId = orderResult.insertId;

        for (const item of items) {
            await connection.query(
                'INSERT INTO order_items (order_id, product_variant_id, quantity, price) VALUES (?, ?, ?, ?)',
                [orderId, item.variant_id, item.quantity, item.price]
            );

            // Update stock
            await connection.query(
                'UPDATE product_variants SET stock = stock - ? WHERE id = ?',
                [item.quantity, item.variant_id]
            );

            // Log inventory change
            await connection.query(
                'INSERT INTO inventory_logs (product_variant_id, change_amount, reason) VALUES (?, ?, ?)',
                [item.variant_id, -item.quantity, 'Order #' + orderId]
            );
        }

        // Initial order history log
        await connection.query(
            'INSERT INTO order_history (order_id, status, description) VALUES (?, ?, ?)',
            [orderId, 'pending', 'Order placed successfully']
        );

        await connection.commit();
        res.json({ orderId, msg: 'Order created successfully' });
    } catch (err) {
        await connection.rollback();
        console.error(err.message);
        res.status(500).send('Server error');
    } finally {
        connection.release();
    }
};

exports.getOrders = async (req, res) => {
    try {
        const [orders] = await db.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.updateOrderStatus = async (req, res) => {
    const { status, description } = req.body;
    const { id } = req.params;

    try {
        await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);

        // Log history
        await db.query(
            'INSERT INTO order_history (order_id, status, description) VALUES (?, ?, ?)',
            [id, status, description || `Order status updated to ${status}`]
        );

        res.json({ msg: 'Order status updated' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getOrderTracking = async (req, res) => {
    try {
        const [history] = await db.query(
            'SELECT * FROM order_history WHERE order_id = ? ORDER BY created_at ASC',
            [req.params.id]
        );
        res.json(history);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const [orders] = await db.query(`
            SELECT o.*, u.name as customerName, u.email as customerEmail 
            FROM orders o 
            JOIN users u ON o.user_id = u.id 
            ORDER BY o.created_at DESC
        `);
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.updateOrderStatusAdmin = async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;

    try {
        await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);

        // Log history
        await db.query(
            'INSERT INTO order_history (order_id, status, description) VALUES (?, ?, ?)',
            [id, status, `Order status updated to ${status} by admin`]
        );

        res.json({ msg: 'Order status updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
