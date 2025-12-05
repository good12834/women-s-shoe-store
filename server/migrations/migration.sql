-- Enhanced Order Management System Migration
-- Phase 1: Foundation & Core Payments
-- Add support for Stripe integration, order status history, and refund processing

-- =====================================================
-- 1. ADD ORDER MANAGEMENT FIELDS TO EXISTING ORDERS TABLE
-- =====================================================

-- Add Stripe payment integration fields
ALTER TABLE orders ADD COLUMN IF NOT EXISTS stripe_payment_id VARCHAR(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS billing_address_id INT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_address_id INT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_number VARCHAR(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS estimated_delivery DATE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_carrier VARCHAR(100);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_service VARCHAR(100);

-- Add order management fields
ALTER TABLE orders ADD COLUMN IF NOT EXISTS parent_order_id INT NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS is_partial_order BOOLEAN DEFAULT FALSE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS total_items INT DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS total_weight DECIMAL(10,3) DEFAULT 0.000;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_cost DECIMAL(10,2) DEFAULT 0.00;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tax_amount DECIMAL(10,2) DEFAULT 0.00;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10,2) DEFAULT 0.00;

-- Add Stripe customer and payment method fields
ALTER TABLE orders ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS stripe_payment_method_id VARCHAR(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method_type VARCHAR(50);

-- Add timestamps for better tracking
ALTER TABLE orders ADD COLUMN IF NOT EXISTS processed_at TIMESTAMP NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMP NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP NULL;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_orders_stripe_payment ON orders(stripe_payment_id);
CREATE INDEX IF NOT EXISTS idx_orders_status_created ON orders(status, created_at);
CREATE INDEX IF NOT EXISTS idx_orders_parent ON orders(parent_order_id);
CREATE INDEX IF NOT EXISTS idx_orders_tracking ON orders(tracking_number);

-- =====================================================
-- 2. CREATE ORDER STATUS HISTORY TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS order_status_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  status VARCHAR(50) NOT NULL,
  description TEXT,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  metadata JSON,
  INDEX idx_history_order_id (order_id),
  INDEX idx_history_created_at (created_at),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- =====================================================
-- 3. CREATE REFUNDS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS refunds (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  stripe_refund_id VARCHAR(255),
  amount DECIMAL(10, 2) NOT NULL,
  reason VARCHAR(255) DEFAULT 'requested_by_customer',
  status ENUM('pending', 'succeeded', 'failed', 'canceled') DEFAULT 'pending',
  stripe_response JSON,
  processed_by INT,
  processed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  notes TEXT,
  INDEX idx_refunds_order_id (order_id),
  INDEX idx_refunds_stripe_id (stripe_refund_id),
  INDEX idx_refunds_status (status),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (processed_by) REFERENCES users(id) ON DELETE SET NULL
);

-- =====================================================
-- 4. CREATE INVENTORY ALERTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS inventory_alerts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_variant_id INT NOT NULL,
  alert_type ENUM('low_stock', 'out_of_stock', 'reorder_point', 'oversell_risk') NOT NULL,
  threshold INT NOT NULL,
  current_stock INT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  is_resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP NULL,
  resolved_by INT,
  notes TEXT,
  INDEX idx_alerts_variant (product_variant_id),
  INDEX idx_alerts_type (alert_type),
  INDEX idx_alerts_active (is_active, is_resolved),
  FOREIGN KEY (product_variant_id) REFERENCES product_variants(id) ON DELETE CASCADE,
  FOREIGN KEY (resolved_by) REFERENCES users(id) ON DELETE SET NULL
);

-- =====================================================
-- 5. CREATE SUPPLIERS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS suppliers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE,
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  contact_person VARCHAR(255),
  payment_terms VARCHAR(100),
  lead_time_days INT DEFAULT 14,
  minimum_order_value DECIMAL(10,2) DEFAULT 0.00,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  notes TEXT,
  INDEX idx_suppliers_active (is_active),
  INDEX idx_suppliers_code (code)
);

-- =====================================================
-- 6. CREATE PURCHASE ORDERS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS purchase_orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  po_number VARCHAR(100) UNIQUE NOT NULL,
  supplier_id INT NOT NULL,
  status ENUM('draft', 'pending', 'approved', 'sent', 'confirmed', 'shipped', 'received', 'cancelled', 'returned') DEFAULT 'draft',
  expected_date DATE,
  actual_received_date DATE,
  total_amount DECIMAL(10,2) DEFAULT 0.00,
  shipping_cost DECIMAL(10,2) DEFAULT 0.00,
  tax_amount DECIMAL(10,2) DEFAULT 0.00,
  created_by INT NOT NULL,
  approved_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  received_at TIMESTAMP NULL,
  notes TEXT,
  delivery_instructions TEXT,
  INDEX idx_po_supplier (supplier_id),
  INDEX idx_po_status (status),
  INDEX idx_po_created_at (created_at),
  INDEX idx_po_number (po_number),
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE RESTRICT,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
  FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
);

-- =====================================================
-- 7. CREATE PURCHASE ORDER ITEMS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS purchase_order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  purchase_order_id INT NOT NULL,
  product_variant_id INT NOT NULL,
  quantity_ordered INT NOT NULL,
  quantity_received INT DEFAULT 0,
  unit_cost DECIMAL(10,2) NOT NULL,
  total_cost DECIMAL(10,2) GENERATED ALWAYS AS (quantity_ordered * unit_cost) STORED,
  received_at TIMESTAMP NULL,
  notes TEXT,
  INDEX idx_poi_order_id (purchase_order_id),
  INDEX idx_poi_variant_id (product_variant_id),
  FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_variant_id) REFERENCES product_variants(id) ON DELETE RESTRICT
);

-- =====================================================
-- 8. CREATE ADMIN NOTIFICATIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS admin_notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type ENUM('low_stock', 'order_issue', 'payment_failed', 'dispute', 'review_pending', 'system_alert') NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  is_read BOOLEAN DEFAULT FALSE,
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  read_at TIMESTAMP NULL,
  read_by INT,
  action_url VARCHAR(500),
  metadata JSON,
  FOREIGN KEY (read_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_notifications_type (type),
  INDEX idx_notifications_priority (priority),
  INDEX idx_notifications_read (is_read),
  INDEX idx_notifications_created (created_at)
);

-- =====================================================
-- 9. CREATE ORDER SPLITTING TRACKING TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS order_splits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  original_order_id INT NOT NULL,
  new_order_id INT NOT NULL,
  split_reason VARCHAR(255),
  split_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  split_by INT NOT NULL,
  INDEX idx_splits_original (original_order_id),
  INDEX idx_splits_new (new_order_id),
  FOREIGN KEY (original_order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (new_order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (split_by) REFERENCES users(id) ON DELETE RESTRICT
);

-- =====================================================
-- 10. INSERT SAMPLE SUPPLIER DATA
-- =====================================================

INSERT INTO suppliers (name, code, email, phone, address, contact_person, payment_terms, lead_time_days) VALUES
('Premium Shoe Suppliers Inc.', 'PSS001', 'orders@premiumshoes.com', '+1-555-0123', '123 Industrial Ave, New York, NY 10001', 'John Smith', 'Net 30', 7),
('Fashion Forward Shoes', 'FFS002', 'sales@fashionforward.com', '+1-555-0124', '456 Fashion Blvd, Los Angeles, CA 90210', 'Sarah Johnson', 'Net 45', 10),
('Comfort Step Manufacturing', 'CSM003', 'info@comfortstep.com', '+1-555-0125', '789 Comfort St, Chicago, IL 60601', 'Mike Davis', 'Net 30', 14)
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- =====================================================
-- 11. CREATE INITIAL STATUS HISTORY ENTRIES
-- =====================================================

-- Insert status history for existing orders
INSERT INTO order_status_history (order_id, status, description, created_at)
SELECT id, status, CONCAT('Initial status: ', status), created_at
FROM orders
WHERE NOT EXISTS (
  SELECT 1 FROM order_status_history WHERE order_status_history.order_id = orders.id
);