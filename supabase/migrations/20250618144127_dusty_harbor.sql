/*
  # Invoicing & GST Support

  1. New Tables
    - `invoices` - Invoice headers
    - `invoice_items` - Invoice line items
    - `tax_configurations` - GST/Tax settings
    - `invoice_templates` - PDF templates

  2. Features
    - GST calculations
    - Invoice numbering
    - PDF generation support
*/

-- Create tax_configurations table
CREATE TABLE IF NOT EXISTS tax_configurations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tax_name varchar(50) NOT NULL,
  tax_type varchar(20) NOT NULL CHECK (tax_type IN ('GST', 'VAT', 'SALES_TAX', 'EXCISE')),
  tax_rate numeric(5,2) NOT NULL,
  is_compound boolean DEFAULT false,
  is_active boolean DEFAULT true,
  applicable_from date DEFAULT CURRENT_DATE,
  applicable_to date,
  created_at timestamptz DEFAULT now()
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number varchar(50) UNIQUE NOT NULL,
  invoice_date date NOT NULL DEFAULT CURRENT_DATE,
  due_date date,
  customer_id uuid NOT NULL REFERENCES customers(id),
  sales_order_id uuid REFERENCES sales(id),
  warehouse_id uuid REFERENCES warehouses(id),
  
  -- Billing details
  billing_address jsonb,
  shipping_address jsonb,
  
  -- Financial details
  subtotal numeric(12,2) NOT NULL DEFAULT 0,
  discount_amount numeric(12,2) DEFAULT 0,
  discount_percentage numeric(5,2) DEFAULT 0,
  tax_amount numeric(12,2) NOT NULL DEFAULT 0,
  shipping_charges numeric(10,2) DEFAULT 0,
  other_charges numeric(10,2) DEFAULT 0,
  total_amount numeric(12,2) NOT NULL DEFAULT 0,
  
  -- GST details
  cgst_amount numeric(10,2) DEFAULT 0,
  sgst_amount numeric(10,2) DEFAULT 0,
  igst_amount numeric(10,2) DEFAULT 0,
  cess_amount numeric(10,2) DEFAULT 0,
  
  -- Status and metadata
  status varchar(20) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED')),
  payment_status varchar(20) DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PARTIAL', 'PAID', 'OVERDUE')),
  payment_terms varchar(100),
  notes text,
  terms_conditions text,
  
  -- PDF and email
  pdf_generated boolean DEFAULT false,
  pdf_path varchar(255),
  email_sent boolean DEFAULT false,
  email_sent_at timestamptz,
  
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create invoice_items table
CREATE TABLE IF NOT EXISTS invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  item_id uuid REFERENCES itemmaster(id),
  
  -- Item details
  item_description text NOT NULL,
  hsn_sac_code varchar(20),
  quantity numeric(10,3) NOT NULL,
  unit_of_measure varchar(20),
  unit_price numeric(10,2) NOT NULL,
  
  -- Calculations
  line_total numeric(12,2) NOT NULL,
  discount_amount numeric(10,2) DEFAULT 0,
  discount_percentage numeric(5,2) DEFAULT 0,
  taxable_amount numeric(12,2) NOT NULL,
  
  -- Tax details
  cgst_rate numeric(5,2) DEFAULT 0,
  cgst_amount numeric(10,2) DEFAULT 0,
  sgst_rate numeric(5,2) DEFAULT 0,
  sgst_amount numeric(10,2) DEFAULT 0,
  igst_rate numeric(5,2) DEFAULT 0,
  igst_amount numeric(10,2) DEFAULT 0,
  cess_rate numeric(5,2) DEFAULT 0,
  cess_amount numeric(10,2) DEFAULT 0,
  
  total_amount numeric(12,2) NOT NULL,
  
  created_at timestamptz DEFAULT now()
);

-- Create invoice_templates table
CREATE TABLE IF NOT EXISTS invoice_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_name varchar(100) NOT NULL,
  template_type varchar(20) DEFAULT 'STANDARD' CHECK (template_type IN ('STANDARD', 'PROFORMA', 'TAX_INVOICE', 'CREDIT_NOTE', 'DEBIT_NOTE')),
  html_template text NOT NULL,
  css_styles text,
  is_default boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE tax_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_templates ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage tax configurations"
  ON tax_configurations FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can manage invoices"
  ON invoices FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can manage invoice items"
  ON invoice_items FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can manage invoice templates"
  ON invoice_templates FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default tax configurations
INSERT INTO tax_configurations (tax_name, tax_type, tax_rate) VALUES
('CGST 9%', 'GST', 9.00),
('SGST 9%', 'GST', 9.00),
('CGST 6%', 'GST', 6.00),
('SGST 6%', 'GST', 6.00),
('CGST 14%', 'GST', 14.00),
('SGST 14%', 'GST', 14.00),
('IGST 18%', 'GST', 18.00),
('IGST 12%', 'GST', 12.00),
('IGST 28%', 'GST', 28.00)
ON CONFLICT DO NOTHING;

-- Function to calculate GST
CREATE OR REPLACE FUNCTION calculate_gst(
  p_amount numeric,
  p_gst_rate numeric,
  p_is_interstate boolean DEFAULT false
)
RETURNS TABLE (
  cgst_amount numeric,
  sgst_amount numeric,
  igst_amount numeric,
  total_tax numeric
) AS $$
DECLARE
  v_total_tax numeric;
  v_cgst numeric := 0;
  v_sgst numeric := 0;
  v_igst numeric := 0;
BEGIN
  v_total_tax := p_amount * p_gst_rate / 100;
  
  IF p_is_interstate THEN
    v_igst := v_total_tax;
  ELSE
    v_cgst := v_total_tax / 2;
    v_sgst := v_total_tax / 2;
  END IF;
  
  RETURN QUERY SELECT v_cgst, v_sgst, v_igst, v_total_tax;
END;
$$ LANGUAGE plpgsql;

-- Function to generate invoice number
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS varchar AS $$
DECLARE
  v_year varchar(4);
  v_month varchar(2);
  v_sequence integer;
  v_invoice_number varchar(50);
BEGIN
  v_year := EXTRACT(YEAR FROM CURRENT_DATE)::varchar;
  v_month := LPAD(EXTRACT(MONTH FROM CURRENT_DATE)::varchar, 2, '0');
  
  -- Get next sequence number for the month
  SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM '\d+$') AS integer)), 0) + 1
  INTO v_sequence
  FROM invoices
  WHERE invoice_number LIKE 'INV/' || v_year || '/' || v_month || '/%';
  
  v_invoice_number := 'INV/' || v_year || '/' || v_month || '/' || LPAD(v_sequence::varchar, 4, '0');
  
  RETURN v_invoice_number;
END;
$$ LANGUAGE plpgsql;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_invoices_customer_id ON invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_date ON invoices(invoice_date);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);