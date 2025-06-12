
-- Create comprehensive inventory management tables

-- 1. Categories table for product categorization
CREATE TABLE public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_category_id UUID REFERENCES public.categories(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Brands table
CREATE TABLE public.brands (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Warehouses/Locations table
CREATE TABLE public.warehouses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address TEXT,
    contact_person VARCHAR(100),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Enhanced products table (extending itemmaster)
ALTER TABLE public.itemmaster ADD COLUMN IF NOT EXISTS brand_id UUID REFERENCES public.brands(id);
ALTER TABLE public.itemmaster ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.categories(id);
ALTER TABLE public.itemmaster ADD COLUMN IF NOT EXISTS reorder_level INTEGER DEFAULT 0;
ALTER TABLE public.itemmaster ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.itemmaster ADD COLUMN IF NOT EXISTS expiry_tracking BOOLEAN DEFAULT false;

-- 5. Stock transactions table
CREATE TABLE public.stock_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    item_id UUID REFERENCES public.itemmaster(id) NOT NULL,
    warehouse_id UUID REFERENCES public.warehouses(id) NOT NULL,
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('IN', 'OUT', 'ADJUSTMENT')),
    quantity INTEGER NOT NULL,
    unit_cost NUMERIC(10, 2),
    reference_type VARCHAR(20) CHECK (reference_type IN ('PURCHASE', 'SALE', 'ADJUSTMENT', 'TRANSFER')),
    reference_id VARCHAR(50),
    notes TEXT,
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Suppliers table (enhanced)
CREATE TABLE public.suppliers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    gst_number VARCHAR(20),
    payment_terms INTEGER DEFAULT 30,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Purchase orders table
CREATE TABLE public.purchase_orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    po_number VARCHAR(20) NOT NULL UNIQUE,
    supplier_id UUID REFERENCES public.suppliers(id) NOT NULL,
    order_date DATE NOT NULL,
    expected_delivery_date DATE,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'PARTIAL_RECEIVED', 'RECEIVED', 'CANCELLED')),
    total_amount NUMERIC(12, 2),
    notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Purchase order items table
CREATE TABLE public.purchase_order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    po_id UUID REFERENCES public.purchase_orders(id) ON DELETE CASCADE,
    item_id UUID REFERENCES public.itemmaster(id) NOT NULL,
    quantity INTEGER NOT NULL,
    unit_cost NUMERIC(10, 2) NOT NULL,
    received_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Goods Receipt Notes (GRN) table
CREATE TABLE public.goods_receipts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    grn_number VARCHAR(20) NOT NULL UNIQUE,
    po_id UUID REFERENCES public.purchase_orders(id) NOT NULL,
    warehouse_id UUID REFERENCES public.warehouses(id) NOT NULL,
    receipt_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'CONFIRMED')),
    notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. GRN items table
CREATE TABLE public.grn_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    grn_id UUID REFERENCES public.goods_receipts(id) ON DELETE CASCADE,
    po_item_id UUID REFERENCES public.purchase_order_items(id) NOT NULL,
    received_quantity INTEGER NOT NULL,
    unit_cost NUMERIC(10, 2),
    expiry_date DATE,
    batch_number VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Enhanced customers table
CREATE TABLE public.customers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    billing_address TEXT,
    shipping_address TEXT,
    gst_number VARCHAR(20),
    credit_limit NUMERIC(12, 2) DEFAULT 0,
    payment_terms INTEGER DEFAULT 30,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Sales orders table (enhanced)
ALTER TABLE public.sales ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES public.customers(id);
ALTER TABLE public.sales ADD COLUMN IF NOT EXISTS warehouse_id UUID REFERENCES public.warehouses(id);
ALTER TABLE public.sales ADD COLUMN IF NOT EXISTS payment_method VARCHAR(20) DEFAULT 'CASH';
ALTER TABLE public.sales ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(10, 2) DEFAULT 0;
ALTER TABLE public.sales ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'PENDING';

-- 13. User roles table
CREATE TABLE public.user_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'INVENTORY_MANAGER', 'SALES_PERSON', 'PURCHASE_MANAGER')),
    permissions JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, role)
);

-- 14. Audit log table
CREATE TABLE public.audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(10) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_values JSONB,
    new_values JSONB,
    user_id UUID REFERENCES auth.users(id),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. Notifications table
CREATE TABLE public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    type VARCHAR(20) NOT NULL CHECK (type IN ('LOW_STOCK', 'EXPIRY_ALERT', 'PO_PENDING', 'PAYMENT_DUE')),
    title VARCHAR(200) NOT NULL,
    message TEXT,
    is_read BOOLEAN DEFAULT false,
    reference_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default warehouse
INSERT INTO public.warehouses (name, address, is_active) 
VALUES ('Main Warehouse', 'Default Location', true);

-- Insert some default categories
INSERT INTO public.categories (name, description) VALUES 
('Electronics', 'Electronic items and components'),
('Office Supplies', 'Office and administrative supplies'),
('Raw Materials', 'Raw materials for production');

-- Insert some default brands
INSERT INTO public.brands (name, description) VALUES 
('Generic', 'Generic brand items'),
('Premium', 'Premium quality items');

-- Enable RLS on all new tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goods_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grn_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for authenticated users
CREATE POLICY "Users can view all categories" ON public.categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage categories" ON public.categories FOR ALL TO authenticated USING (true);

CREATE POLICY "Users can view all brands" ON public.brands FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage brands" ON public.brands FOR ALL TO authenticated USING (true);

CREATE POLICY "Users can view all warehouses" ON public.warehouses FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage warehouses" ON public.warehouses FOR ALL TO authenticated USING (true);

CREATE POLICY "Users can view all stock transactions" ON public.stock_transactions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create stock transactions" ON public.stock_transactions FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can view all suppliers" ON public.suppliers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage suppliers" ON public.suppliers FOR ALL TO authenticated USING (true);

CREATE POLICY "Users can view all purchase orders" ON public.purchase_orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage purchase orders" ON public.purchase_orders FOR ALL TO authenticated USING (true);

CREATE POLICY "Users can view all purchase order items" ON public.purchase_order_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage purchase order items" ON public.purchase_order_items FOR ALL TO authenticated USING (true);

CREATE POLICY "Users can view all goods receipts" ON public.goods_receipts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage goods receipts" ON public.goods_receipts FOR ALL TO authenticated USING (true);

CREATE POLICY "Users can view all grn items" ON public.grn_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage grn items" ON public.grn_items FOR ALL TO authenticated USING (true);

CREATE POLICY "Users can view all customers" ON public.customers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage customers" ON public.customers FOR ALL TO authenticated USING (true);

CREATE POLICY "Users can view their notifications" ON public.notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update their notifications" ON public.notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can view audit logs" ON public.audit_logs FOR SELECT TO authenticated USING (true);

-- Functions for business logic
CREATE OR REPLACE FUNCTION public.update_stock_on_transaction()
RETURNS TRIGGER AS $$
BEGIN
    -- Update current stock in itemmaster based on transaction
    IF NEW.transaction_type = 'IN' THEN
        UPDATE public.itemmaster 
        SET currentstock = COALESCE(currentstock, 0) + NEW.quantity 
        WHERE id = NEW.item_id;
    ELSIF NEW.transaction_type = 'OUT' THEN
        UPDATE public.itemmaster 
        SET currentstock = COALESCE(currentstock, 0) - NEW.quantity 
        WHERE id = NEW.item_id;
    ELSIF NEW.transaction_type = 'ADJUSTMENT' THEN
        UPDATE public.itemmaster 
        SET currentstock = COALESCE(currentstock, 0) + NEW.quantity 
        WHERE id = NEW.item_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for automatic stock updates
CREATE TRIGGER trigger_update_stock_on_transaction
    AFTER INSERT ON public.stock_transactions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_stock_on_transaction();

-- Function to check low stock and create notifications
CREATE OR REPLACE FUNCTION public.check_low_stock()
RETURNS void AS $$
DECLARE
    item_record RECORD;
BEGIN
    FOR item_record IN 
        SELECT id, itemname, currentstock, reorder_level 
        FROM public.itemmaster 
        WHERE currentstock <= reorder_level AND is_active = true
    LOOP
        -- Create notification if not already exists
        INSERT INTO public.notifications (user_id, type, title, message, reference_id)
        SELECT 
            up.id,
            'LOW_STOCK',
            'Low Stock Alert',
            'Item "' || item_record.itemname || '" is running low. Current stock: ' || item_record.currentstock || ', Reorder level: ' || item_record.reorder_level,
            item_record.id
        FROM auth.users up
        LEFT JOIN public.user_profiles upp ON up.id = upp.id
        WHERE NOT EXISTS (
            SELECT 1 FROM public.notifications n 
            WHERE n.user_id = up.id 
            AND n.type = 'LOW_STOCK' 
            AND n.reference_id = item_record.id 
            AND n.is_read = false
        );
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
