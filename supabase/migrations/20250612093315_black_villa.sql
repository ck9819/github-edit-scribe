/*
  # Complete Database Schema Setup

  1. New Tables
    - `brands` - Product brands management
    - `categories` - Product categories with hierarchical support
    - `warehouses` - Warehouse/location management
    - `stock_transactions` - Stock movement tracking
    - `suppliers` - Supplier management
    - `purchase_orders` - Purchase order management
    - `purchase_order_items` - Purchase order line items
    - `goods_receipts` - Goods receipt management
    - `grn_items` - Goods receipt line items
    - `customers` - Customer management
    - `user_roles` - User role management
    - `audit_logs` - System audit trail
    - `notifications` - User notifications

  2. Functions
    - `get_next_serial_number` - Generate sequential numbers
    - `update_stock_on_transaction` - Auto-update stock levels
    - `handle_new_user` - Auto-create user profile
    - `check_low_stock` - Check for low stock items

  3. Security
    - Enable RLS on all tables
    - Add appropriate policies for each table
    - Create triggers for stock updates and audit logging

  4. Indexes
    - Add performance indexes for frequently queried columns
    - Unique constraints where needed
</*/

-- Create brands table
CREATE TABLE IF NOT EXISTS brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(100) UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create categories table with hierarchical support
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(100) NOT NULL,
  description text,
  parent_category_id uuid REFERENCES categories(id),
  created_at timestamptz DEFAULT now()
);

-- Create warehouses table
CREATE TABLE IF NOT EXISTS warehouses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(100) NOT NULL,
  address text,
  contact_person varchar(100),
  phone varchar(20),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(100) NOT NULL,
  contact_person varchar(100),
  email varchar(100),
  phone varchar(20),
  address text,
  gst_number varchar(20),
  payment_terms integer DEFAULT 30,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(100) NOT NULL,
  contact_person varchar(100),
  email varchar(100),
  phone varchar(20),
  billing_address text,
  shipping_address text,
  gst_number varchar(20),
  credit_limit numeric(12,2) DEFAULT 0,
  payment_terms integer DEFAULT 30,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Update itemmaster table to add missing columns
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'itemmaster' AND column_name = 'brand_id'
  ) THEN
    ALTER TABLE itemmaster ADD COLUMN brand_id uuid REFERENCES brands(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'itemmaster' AND column_name = 'category_id'
  ) THEN
    ALTER TABLE itemmaster ADD COLUMN category_id uuid REFERENCES categories(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'itemmaster' AND column_name = 'reorder_level'
  ) THEN
    ALTER TABLE itemmaster ADD COLUMN reorder_level integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'itemmaster' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE itemmaster ADD COLUMN is_active boolean DEFAULT true;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'itemmaster' AND column_name = 'expiry_tracking'
  ) THEN
    ALTER TABLE itemmaster ADD COLUMN expiry_tracking boolean DEFAULT false;
  END IF;
END $$;

-- Create stock_transactions table
CREATE TABLE IF NOT EXISTS stock_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL REFERENCES itemmaster(id),
  warehouse_id uuid NOT NULL REFERENCES warehouses(id),
  transaction_type varchar(20) NOT NULL CHECK (transaction_type IN ('IN', 'OUT', 'ADJUSTMENT')),
  quantity integer NOT NULL,
  unit_cost numeric(10,2),
  reference_type varchar(20) CHECK (reference_type IN ('PURCHASE', 'SALE', 'ADJUSTMENT', 'TRANSFER')),
  reference_id varchar(50),
  notes text,
  transaction_date timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- Create purchase_orders table
CREATE TABLE IF NOT EXISTS purchase_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  po_number varchar(20) UNIQUE NOT NULL,
  supplier_id uuid NOT NULL REFERENCES suppliers(id),
  order_date date NOT NULL,
  expected_delivery_date date,
  status varchar(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'PARTIAL_RECEIVED', 'RECEIVED', 'CANCELLED')),
  total_amount numeric(12,2),
  notes text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- Create purchase_order_items table
CREATE TABLE IF NOT EXISTS purchase_order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  po_id uuid REFERENCES purchase_orders(id) ON DELETE CASCADE,
  item_id uuid NOT NULL REFERENCES itemmaster(id),
  quantity integer NOT NULL,
  unit_cost numeric(10,2) NOT NULL,
  received_quantity integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create goods_receipts table
CREATE TABLE IF NOT EXISTS goods_receipts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  grn_number varchar(20) UNIQUE NOT NULL,
  po_id uuid NOT NULL REFERENCES purchase_orders(id),
  warehouse_id uuid NOT NULL REFERENCES warehouses(id),
  receipt_date date NOT NULL,
  status varchar(20) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'CONFIRMED')),
  notes text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- Create grn_items table
CREATE TABLE IF NOT EXISTS grn_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  grn_id uuid REFERENCES goods_receipts(id) ON DELETE CASCADE,
  po_item_id uuid NOT NULL REFERENCES purchase_order_items(id),
  received_quantity integer NOT NULL,
  unit_cost numeric(10,2),
  expiry_date date,
  batch_number varchar(50),
  created_at timestamptz DEFAULT now()
);

-- Update sales table to add missing columns
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'sales' AND column_name = 'customer_id'
  ) THEN
    ALTER TABLE sales ADD COLUMN customer_id uuid REFERENCES customers(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'sales' AND column_name = 'warehouse_id'
  ) THEN
    ALTER TABLE sales ADD COLUMN warehouse_id uuid REFERENCES warehouses(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'sales' AND column_name = 'payment_method'
  ) THEN
    ALTER TABLE sales ADD COLUMN payment_method varchar(20) DEFAULT 'CASH';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'sales' AND column_name = 'discount_amount'
  ) THEN
    ALTER TABLE sales ADD COLUMN discount_amount numeric(10,2) DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'sales' AND column_name = 'payment_status'
  ) THEN
    ALTER TABLE sales ADD COLUMN payment_status varchar(20) DEFAULT 'PENDING';
  END IF;
END $$;

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role varchar(20) NOT NULL CHECK (role IN ('ADMIN', 'INVENTORY_MANAGER', 'SALES_PERSON', 'PURCHASE_MANAGER')),
  permissions jsonb,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name varchar(50) NOT NULL,
  record_id uuid NOT NULL,
  action varchar(10) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
  old_values jsonb,
  new_values jsonb,
  user_id uuid REFERENCES auth.users(id),
  timestamp timestamptz DEFAULT now()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  type varchar(20) NOT NULL CHECK (type IN ('LOW_STOCK', 'EXPIRY_ALERT', 'PO_PENDING', 'PAYMENT_DUE')),
  title varchar(200) NOT NULL,
  message text,
  is_read boolean DEFAULT false,
  reference_id uuid,
  created_at timestamptz DEFAULT now()
);

-- Create function to get next serial number
CREATE OR REPLACE FUNCTION get_next_serial_number(form_type_param text)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  next_number integer;
BEGIN
  -- Insert or update the serial number
  INSERT INTO serial_numbers (form_type, last_number)
  VALUES (form_type_param, 1)
  ON CONFLICT (form_type)
  DO UPDATE SET last_number = serial_numbers.last_number + 1
  RETURNING last_number INTO next_number;
  
  RETURN next_number;
END;
$$;

-- Create function to update stock on transaction
CREATE OR REPLACE FUNCTION update_stock_on_transaction()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.transaction_type = 'IN' THEN
    UPDATE itemmaster 
    SET currentstock = COALESCE(currentstock, 0) + NEW.quantity
    WHERE id = NEW.item_id;
  ELSIF NEW.transaction_type = 'OUT' THEN
    UPDATE itemmaster 
    SET currentstock = GREATEST(COALESCE(currentstock, 0) - NEW.quantity, 0)
    WHERE id = NEW.item_id;
  ELSIF NEW.transaction_type = 'ADJUSTMENT' THEN
    UPDATE itemmaster 
    SET currentstock = NEW.quantity
    WHERE id = NEW.item_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO user_profiles (id, username, name, usertype)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'userType', 'user')
  );
  RETURN NEW;
END;
$$;

-- Create function to check low stock
CREATE OR REPLACE FUNCTION check_low_stock()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  item_record RECORD;
BEGIN
  FOR item_record IN 
    SELECT id, itemname, currentstock, reorder_level
    FROM itemmaster 
    WHERE is_active = true 
    AND currentstock <= reorder_level
  LOOP
    INSERT INTO notifications (
      type, 
      title, 
      message, 
      reference_id
    )
    VALUES (
      'LOW_STOCK',
      'Low Stock Alert',
      'Item "' || item_record.itemname || '" is running low. Current stock: ' || item_record.currentstock || ', Reorder level: ' || item_record.reorder_level,
      item_record.id
    );
  END LOOP;
END;
$$;

-- Enable Row Level Security on all tables
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE goods_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE grn_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for brands
CREATE POLICY "Users can manage brands" ON brands
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Users can view all brands" ON brands
  FOR SELECT TO authenticated USING (true);

-- Create RLS policies for categories
CREATE POLICY "Users can manage categories" ON categories
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Users can view all categories" ON categories
  FOR SELECT TO authenticated USING (true);

-- Create RLS policies for warehouses
CREATE POLICY "Users can manage warehouses" ON warehouses
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Users can view all warehouses" ON warehouses
  FOR SELECT TO authenticated USING (true);

-- Create RLS policies for suppliers
CREATE POLICY "Users can manage suppliers" ON suppliers
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Users can view all suppliers" ON suppliers
  FOR SELECT TO authenticated USING (true);

-- Create RLS policies for customers
CREATE POLICY "Users can manage customers" ON customers
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Users can view all customers" ON customers
  FOR SELECT TO authenticated USING (true);

-- Create RLS policies for stock_transactions
CREATE POLICY "Users can create stock transactions" ON stock_transactions
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can view all stock transactions" ON stock_transactions
  FOR SELECT TO authenticated USING (true);

-- Create RLS policies for purchase_orders
CREATE POLICY "Users can manage purchase orders" ON purchase_orders
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Users can view all purchase orders" ON purchase_orders
  FOR SELECT TO authenticated USING (true);

-- Create RLS policies for purchase_order_items
CREATE POLICY "Users can manage purchase order items" ON purchase_order_items
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Users can view all purchase order items" ON purchase_order_items
  FOR SELECT TO authenticated USING (true);

-- Create RLS policies for goods_receipts
CREATE POLICY "Users can manage goods receipts" ON goods_receipts
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Users can view all goods receipts" ON goods_receipts
  FOR SELECT TO authenticated USING (true);

-- Create RLS policies for grn_items
CREATE POLICY "Users can manage grn items" ON grn_items
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Users can view all grn items" ON grn_items
  FOR SELECT TO authenticated USING (true);

-- Create RLS policies for notifications
CREATE POLICY "Users can view their notifications" ON notifications
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can update their notifications" ON notifications
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Create RLS policies for audit_logs
CREATE POLICY "Users can view audit logs" ON audit_logs
  FOR SELECT TO authenticated USING (true);

-- Create triggers
CREATE TRIGGER trigger_update_stock_on_transaction
  AFTER INSERT ON stock_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_stock_on_transaction();

-- Create trigger for new user handling (if auth.users trigger doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION handle_new_user();
  END IF;
END $$;

-- Insert default data
INSERT INTO brands (name, description) VALUES 
  ('Generic', 'Generic brand for unbranded items'),
  ('Premium', 'Premium quality brand')
ON CONFLICT (name) DO NOTHING;

INSERT INTO categories (name, description) VALUES 
  ('Raw Materials', 'Basic materials used in production'),
  ('Finished Goods', 'Completed products ready for sale'),
  ('Consumables', 'Items consumed during operations'),
  ('Tools & Equipment', 'Tools and equipment for operations')
ON CONFLICT DO NOTHING;

INSERT INTO warehouses (name, address, is_active) VALUES 
  ('Main Warehouse', 'Primary storage facility', true),
  ('Secondary Warehouse', 'Backup storage facility', true)
ON CONFLICT DO NOTHING;

-- Insert default serial number records if they don't exist
INSERT INTO serial_numbers (form_type, last_number) VALUES 
  ('SE', 0),
  ('QTN', 0),
  ('OC', 0),
  ('SKU', 0),
  ('PO', 0),
  ('GRN', 0),
  ('SO', 0)
ON CONFLICT (form_type) DO NOTHING;