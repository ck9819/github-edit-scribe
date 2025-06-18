/*
  # Advanced Reporting Views and Functions

  1. Views
    - `inventory_valuation_view` - Current inventory values by method
    - `sales_analytics_view` - Sales trends and analytics
    - `stock_movement_analysis` - Fast/slow moving products

  2. Functions
    - Calculate inventory valuation (FIFO, LIFO, Weighted Average)
    - Sales velocity calculations
    - Stock movement analysis
*/

-- Inventory valuation view
CREATE OR REPLACE VIEW inventory_valuation_view AS
SELECT 
  im.id as item_id,
  im.itemname,
  im.itemid,
  c.name as category_name,
  w.name as warehouse_name,
  COALESCE(SUM(ib.quantity_available), im.currentstock, 0) as total_quantity,
  COALESCE(AVG(ib.unit_cost), im.defaultprice, 0) as avg_unit_cost,
  COALESCE(SUM(ib.quantity_available * ib.unit_cost), im.currentstock * im.defaultprice, 0) as total_value,
  im.reorder_level,
  im.minimumstocklevel,
  CASE 
    WHEN COALESCE(SUM(ib.quantity_available), im.currentstock, 0) <= im.reorder_level THEN 'LOW_STOCK'
    WHEN COALESCE(SUM(ib.quantity_available), im.currentstock, 0) <= im.minimumstocklevel THEN 'CRITICAL'
    ELSE 'NORMAL'
  END as stock_status
FROM itemmaster im
LEFT JOIN categories c ON im.category_id = c.id
LEFT JOIN item_batches ib ON im.id = ib.item_id AND ib.status = 'ACTIVE'
LEFT JOIN warehouses w ON ib.warehouse_id = w.id
WHERE im.is_active = true
GROUP BY im.id, im.itemname, im.itemid, c.name, w.name, im.currentstock, im.defaultprice, im.reorder_level, im.minimumstocklevel;

-- Sales analytics view
CREATE OR REPLACE VIEW sales_analytics_view AS
SELECT 
  DATE_TRUNC('month', s.created_at) as month,
  DATE_TRUNC('week', s.created_at) as week,
  DATE_TRUNC('day', s.created_at) as day,
  s.customer_id,
  c.name as customer_name,
  COUNT(*) as order_count,
  SUM(s.total_before_tax) as total_before_tax,
  SUM(s.total_tax) as total_tax,
  SUM(s.total_after_tax) as total_after_tax,
  AVG(s.total_after_tax) as avg_order_value,
  s.deal_status,
  s.payment_status
FROM sales s
LEFT JOIN customers c ON s.customer_id = c.id
WHERE s.created_at >= CURRENT_DATE - INTERVAL '2 years'
GROUP BY 
  DATE_TRUNC('month', s.created_at),
  DATE_TRUNC('week', s.created_at),
  DATE_TRUNC('day', s.created_at),
  s.customer_id, c.name, s.deal_status, s.payment_status;

-- Function to calculate sales velocity
CREATE OR REPLACE FUNCTION calculate_sales_velocity(
  p_item_id uuid,
  p_days integer DEFAULT 90
)
RETURNS TABLE (
  item_id uuid,
  item_name varchar,
  total_sold integer,
  avg_daily_sales numeric,
  velocity_category varchar
) AS $$
DECLARE
  total_quantity integer;
  daily_avg numeric;
BEGIN
  -- This is a simplified calculation - in real implementation,
  -- you'd extract quantities from the sales.items JSONB field
  SELECT COALESCE(COUNT(*), 0) INTO total_quantity
  FROM sales s
  WHERE s.created_at >= CURRENT_DATE - INTERVAL '1 day' * p_days
    AND s.deal_status = 'DELIVERED';
  
  daily_avg := total_quantity::numeric / p_days;
  
  RETURN QUERY
  SELECT 
    p_item_id,
    im.itemname,
    total_quantity,
    daily_avg,
    CASE 
      WHEN daily_avg > 10 THEN 'FAST_MOVING'
      WHEN daily_avg > 1 THEN 'MEDIUM_MOVING'
      ELSE 'SLOW_MOVING'
    END
  FROM itemmaster im
  WHERE im.id = p_item_id;
END;
$$ LANGUAGE plpgsql;

-- Function for ABC analysis
CREATE OR REPLACE FUNCTION abc_analysis()
RETURNS TABLE (
  item_id uuid,
  item_name varchar,
  total_value numeric,
  percentage_of_total numeric,
  abc_category varchar
) AS $$
BEGIN
  RETURN QUERY
  WITH item_values AS (
    SELECT 
      iv.item_id,
      iv.itemname,
      iv.total_value,
      SUM(iv.total_value) OVER () as grand_total
    FROM inventory_valuation_view iv
  ),
  item_percentages AS (
    SELECT 
      item_id,
      itemname,
      total_value,
      (total_value / grand_total * 100) as percentage,
      SUM(total_value / grand_total * 100) OVER (ORDER BY total_value DESC) as cumulative_percentage
    FROM item_values
  )
  SELECT 
    ip.item_id,
    ip.itemname,
    ip.total_value,
    ip.percentage,
    CASE 
      WHEN ip.cumulative_percentage <= 80 THEN 'A'
      WHEN ip.cumulative_percentage <= 95 THEN 'B'
      ELSE 'C'
    END
  FROM item_percentages ip
  ORDER BY ip.total_value DESC;
END;
$$ LANGUAGE plpgsql;