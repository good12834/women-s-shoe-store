-- Create addresses table
CREATE TABLE IF NOT EXISTS addresses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  street VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  zip_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Seed some coupons
INSERT INTO coupons (code, discount_type, discount_value, expiry_date, usage_limit) 
VALUES 
('WELCOME10', 'percentage', 10.00, '2025-12-31 23:59:59', 100),
('SAVE20', 'fixed', 20.00, '2025-12-31 23:59:59', 50);
