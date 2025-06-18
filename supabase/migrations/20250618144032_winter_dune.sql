/*
  # Batch & Expiry Management System

  1. New Tables
    - `item_batches` - Track items in batches with expiry dates
    - `batch_transactions` - Track batch-wise stock movements
    - `expiry_alerts` - Store expiry alert configurations

  2. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users

  3. Features
    - FIFO/LIFO stock movement tracking
    - Expiry date management
    - Batch-wise inventory tracking
*/

-- Create item_batches table
CREATE TABLE IF NOT EXISTS item_batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL REFERENCES itemmaster(id) ON DELETE CASCADE,
  warehouse_id uuid NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
  batch_number varchar(100) NOT NULL,
  manufacturing_date date,
  expiry_date date,
  quantity_received integer NOT NULL DEFAULT 0,
  quantity_available integer NOT NULL DEFAULT 0,
  unit_cost numeric(10,2),
  supplier_id uuid REFERENCES suppliers(id),
  purchase_order_id uuid REFERENCES purchase_orders(id),
  status varchar(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'EXPIRED', 'RECALLED', 'CONSUMED')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create batch_transactions table for FIFO/LIFO tracking
CREATE TABLE IF NOT EXISTS batch_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id uuid NOT NULL REFERENCES item_batches(id) ON DELETE CASCADE,
  transaction_type varchar(20) NOT NULL CHECK (transaction_type IN ('IN', 'OUT', 'ADJUSTMENT')),
  quantity integer NOT NULL,
  reference_type varchar(20) CHECK (reference_type IN ('PURCHASE', 'SALE', 'ADJUSTMENT', 'TRANSFER')),
  reference_id varchar(50),
  transaction_date timestamptz DEFAULT now(),
  created_by uuid REFERENCES users(id),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create expiry_alerts table
CREATE TABLE IF NOT EXISTS expiry_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL REFERENCES itemmaster(id) ON DELETE CASCADE,
  alert_days_before integer NOT NULL DEFAULT 30,
  is_active boolean DEFAULT true,
  email_recipients text[],
  last_alert_sent timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE item_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE batch_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE expiry_alerts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage item batches"
  ON item_batches FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can view batch transactions"
  ON batch_transactions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create batch transactions"
  ON batch_transactions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can manage expiry alerts"
  ON expiry_alerts FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_item_batches_item_id ON item_batches(item_id);
CREATE INDEX IF NOT EXISTS idx_item_batches_warehouse_id ON item_batches(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_item_batches_expiry_date ON item_batches(expiry_date);
CREATE INDEX IF NOT EXISTS idx_item_batches_status ON item_batches(status);
CREATE INDEX IF NOT EXISTS idx_batch_transactions_batch_id ON batch_transactions(batch_id);
CREATE INDEX IF NOT EXISTS idx_batch_transactions_date ON batch_transactions(transaction_date);

-- Function to get batches by FIFO/LIFO
CREATE OR REPLACE FUNCTION get_available_batches(
  p_item_id uuid,
  p_warehouse_id uuid,
  p_method varchar DEFAULT 'FIFO'
)
RETURNS TABLE (
  batch_id uuid,
  batch_number varchar,
  quantity_available integer,
  expiry_date date,
  unit_cost numeric
) AS $$
BEGIN
  IF p_method = 'FIFO' THEN
    RETURN QUERY
    SELECT 
      ib.id,
      ib.batch_number,
      ib.quantity_available,
      ib.expiry_date,
      ib.unit_cost
    FROM item_batches ib
    WHERE ib.item_id = p_item_id 
      AND ib.warehouse_id = p_warehouse_id
      AND ib.quantity_available > 0
      AND ib.status = 'ACTIVE'
    ORDER BY ib.expiry_date ASC, ib.created_at ASC;
  ELSE -- LIFO
    RETURN QUERY
    SELECT 
      ib.id,
      ib.batch_number,
      ib.quantity_available,
      ib.expiry_date,
      ib.unit_cost
    FROM item_batches ib
    WHERE ib.item_id = p_item_id 
      AND ib.warehouse_id = p_warehouse_id
      AND ib.quantity_available > 0
      AND ib.status = 'ACTIVE'
    ORDER BY ib.expiry_date DESC, ib.created_at DESC;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to check expiring items
CREATE OR REPLACE FUNCTION check_expiring_items(days_ahead integer DEFAULT 30)
RETURNS TABLE (
  item_name varchar,
  batch_number varchar,
  warehouse_name varchar,
  expiry_date date,
  quantity_available integer,
  days_to_expiry integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    im.itemname,
    ib.batch_number,
    w.name,
    ib.expiry_date,
    ib.quantity_available,
    (ib.expiry_date - CURRENT_DATE)::integer
  FROM item_batches ib
  JOIN itemmaster im ON ib.item_id = im.id
  JOIN warehouses w ON ib.warehouse_id = w.id
  WHERE ib.expiry_date <= CURRENT_DATE + INTERVAL '1 day' * days_ahead
    AND ib.quantity_available > 0
    AND ib.status = 'ACTIVE'
  ORDER BY ib.expiry_date ASC;
END;
$$ LANGUAGE plpgsql;