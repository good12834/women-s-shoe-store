const db = require('../config/db');

exports.validateCoupon = async (req, res) => {
    const { code, cartTotal } = req.body;

    try {
        const [coupons] = await db.query('SELECT * FROM coupons WHERE code = ?', [code]);

        if (coupons.length === 0) {
            return res.status(404).json({ msg: 'Invalid coupon code' });
        }

        const coupon = coupons[0];
        const now = new Date();

        if (coupon.expiry_date && new Date(coupon.expiry_date) < now) {
            return res.status(400).json({ msg: 'Coupon expired' });
        }

        if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
            return res.status(400).json({ msg: 'Coupon usage limit reached' });
        }

        let discountAmount = 0;
        if (coupon.discount_type === 'percentage') {
            discountAmount = (cartTotal * coupon.discount_value) / 100;
        } else {
            discountAmount = coupon.discount_value;
        }

        res.json({
            success: true,
            discountAmount,
            code: coupon.code,
            msg: 'Coupon applied successfully'
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
