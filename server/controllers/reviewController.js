const db = require('../config/db');

exports.addReview = async (req, res) => {
    const { product_id, rating, comment, images } = req.body;
    const user_id = req.user.id;

    try {
        // Check if user bought the product (optional verification)
        // For now, allow any logged-in user to review

        const [result] = await db.query(
            'INSERT INTO reviews (user_id, product_id, rating, comment, images) VALUES (?, ?, ?, ?, ?)',
            [user_id, product_id, rating, comment, JSON.stringify(images || [])]
        );

        res.json({ msg: 'Review added successfully', reviewId: result.insertId });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getProductReviews = async (req, res) => {
    try {
        const [reviews] = await db.query(`
      SELECT r.*, u.name as user_name 
      FROM reviews r 
      JOIN users u ON r.user_id = u.id 
      WHERE r.product_id = ? 
      ORDER BY r.created_at DESC
    `, [req.params.productId]);

        res.json(reviews);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
