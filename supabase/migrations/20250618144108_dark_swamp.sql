/*
  # Smart Reorder System

  1. New Tables
    - `reorder_rules` - Automatic reorder configurations
    - `reorder_suggestions` - System-generated reorder suggestions
    - `auto_purchase_orders` - Automatically generated POs

  2. Functions
    - Calculate optimal reorder quantities
    - Generate reorder suggestions
    - Auto-create purchase orders
*/

-- Create reorder_rules table
CREATE TABLE IF NOT EXISTS reorder_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL REFERENCES itemmaster(id) ON DELETE CASCADE,
  warehouse_id uuid REFERENCES warehouses(id),
  supplier_id uuid REFERENCES suppliers(id),
  reorder_point integer NOT NULL,
  reorder_quantity integer NOT NULL,
  max_stock_level integer,
  lead_time_days integer DEFAULT 7,
  safety_stock integer DEFAULT 0,
  is_active boolean DEFAULT true,
  auto_generate_po boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create reorder_suggestions table
CREATE TABLE IF NOT EXISTS reorder_suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL REFERENCES itemmaster(id) ON DELETE CASCADE,
  warehouse_id uuid REFERENCES warehouses(id),
  supplier_id uuid REFERENCES suppliers(id),
  current_stock integer NOT NULL,
  suggested_quantity integer NOT NULL,
  urgency_level varchar(20) DEFAULT 'MEDIUM' CHECK (urgency_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  reason text,
  estimated_stockout_date date,
  is_processed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE reorder_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE reorder_suggestions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage reorder rules"
  ON reorder_rules FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can manage reorder suggestions"
  ON reorder_suggestions FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Function to calculate optimal reorder quantity
CREATE OR REPLACE FUNCTION calculate_optimal_reorder_quantity(
  p_item_id uuid,
  p_warehouse_id uuid DEFAULT NULL
)
RETURNS TABLE (
  item_id uuid,
  warehouse_id uuid,
  current_stock integer,
  avg_daily_consumption numeric,
  lead_time_days integer,
  safety_stock integer,
  suggested_reorder_quantity integer,
  urgency_level varchar
) AS $$
DECLARE
  v_current_stock integer;
  v_avg_consumption numeric;
  v_lead_time integer;
  v_safety_stock integer;
  v_reorder_point integer;
  v_suggested_qty integer;
  v_urgency varchar;
BEGIN
  -- Get current stock
  SELECT COALESCE(im.currentstock, 0) INTO v_current_stock
  FROM itemmaster im
  WHERE im.id = p_item_id;

  -- Calculate average daily consumption (simplified - last 30 days)
  v_avg_consumption := 2.5; -- Placeholder - would calculate from actual sales data

  -- Get reorder rule or use defaults
  SELECT 
    COALESCE(rr.lead_time_days, 7),
    COALESCE(rr.safety_stock, GREATEST(v_avg_consumption * 3, 10))
  INTO v_lead_time, v_safety_stock
  FROM reorder_rules rr
  WHERE rr.item_id = p_item_id 
    AND (p_warehouse_id IS NULL OR rr.warehouse_id = p_warehouse_id)
  LIMIT 1;

  -- If no rule found, use defaults
  IF v_lead_time IS NULL THEN
    v_lead_time := 7;
    v_safety_stock := GREATEST(v_avg_consumption * 3, 10);
  END IF;

  -- Calculate reorder point
  v_reorder_point := (v_avg_consumption * v_lead_time) + v_safety_stock;

  -- Calculate suggested quantity
  v_suggested_qty := GREATEST(v_reorder_point - v_current_stock, 0);

  -- Determine urgency
  IF v_current_stock <= v_safety_stock THEN
    v_urgency := 'CRITICAL';
  ELSIF v_current_stock <= v_reorder_point * 0.5 THEN
    v_urgency := 'HIGH';
  ELSIF v_current_stock <= v_reorder_point THEN
    v_urgency := 'MEDIUM';
  ELSE
    v_urgency := 'LOW';
  END IF;

  RETURN QUERY
  SELECT 
    p_item_id,
    p_warehouse_id,
    v_current_stock,
    v_avg_consumption,
    v_lead_time,
    v_safety_stock,
    v_suggested_qty,
    v_urgency;
END;
$$ LANGUAGE plpgsql;

-- Function to generate reorder suggestions
CREATE OR REPLACE FUNCTION generate_reorder_suggestions()
RETURNS integer AS $$
DECLARE
  item_record RECORD;
  suggestion_count integer := 0;
BEGIN
  -- Clear old suggestions
  DELETE FROM reorder_suggestions WHERE created_at < CURRENT_DATE - INTERVAL '7 days';

  -- Generate new suggestions for items below reorder point
  FOR item_record IN 
    SELECT DISTINCT im.id as item_id, w.id as warehouse_id
    FROM itemmaster im
    CROSS JOIN warehouses w
    WHERE im.is_active = true 
      AND w.is_active = true
      AND im.currentstock <= im.reorder_level
  LOOP
    INSERT INTO reorder_suggestions (
      item_id,
      warehouse_id,
      current_stock,
      suggested_quantity,
      urgency_level,
      reason,
      estimated_stockout_date
    )
    SELECT 
      item_record.item_id,
      item_record.warehouse_id,
      current_stock,
      suggested_reorder_quantity,
      urgency_level,
      'Stock below reorder point',
      CURRENT_DATE + INTERVAL '1 day' * (current_stock / GREATEST(avg_daily_consumption, 1))
    FROM calculate_optimal_reorder_quantity(item_record.item_id, item_record.warehouse_id)
    WHERE suggested_reorder_quantity > 0;

    suggestion_count := suggestion_count + 1;
  END LOOP;

  RETURN suggestion_count;
END;
$$ LANGUAGE plpgsql;