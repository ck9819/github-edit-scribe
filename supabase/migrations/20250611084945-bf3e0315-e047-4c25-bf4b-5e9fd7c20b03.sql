
-- Create company table
CREATE TABLE public.company (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    buyername VARCHAR(100) NOT NULL UNIQUE,
    buyeremail VARCHAR(50),
    buyergst VARCHAR(50),
    buyercontact VARCHAR(50),
    deliveryaddress TEXT,
    sameasbuyeraddress BOOLEAN DEFAULT false,
    buyeraddress TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create itemmaster table
CREATE TABLE public.itemmaster (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    itemid VARCHAR(20) NOT NULL UNIQUE,
    itemname VARCHAR(255) NOT NULL,
    productservice VARCHAR(50) NOT NULL,
    buysellboth VARCHAR(50) NOT NULL,
    unitofmeasurement VARCHAR(50) NOT NULL,
    itemcategory VARCHAR(100) NOT NULL,
    currentstock INTEGER DEFAULT 0,
    defaultprice NUMERIC(10, 2),
    hsncode VARCHAR(100),
    tax VARCHAR(100),
    minimumstocklevel INTEGER DEFAULT 0,
    maximumstocklevel INTEGER,
    drawingnumber VARCHAR(100),
    serialnumber VARCHAR(100),
    counterpartycode VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sales table
CREATE TABLE public.sales (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    enquiry_id VARCHAR(20) NOT NULL UNIQUE,
    supplier_details JSONB,
    buyer_details JSONB,
    delivery_location JSONB,
    place_of_supply JSONB,
    primary_document_details JSONB,
    items JSONB,
    email_recipients TEXT,
    total_before_tax NUMERIC(10, 2),
    total_tax NUMERIC(10, 2),
    total_after_tax NUMERIC(10, 2),
    quotation_id VARCHAR(20),
    quotation_date TIMESTAMP WITH TIME ZONE,
    order_id VARCHAR(20),
    order_date TIMESTAMP WITH TIME ZONE,
    po_id VARCHAR(20),
    po_date TIMESTAMP WITH TIME ZONE,
    deal_owner VARCHAR(50),
    deal_status VARCHAR(20) DEFAULT 'Pending',
    sqcreated BOOLEAN DEFAULT false,
    occreated BOOLEAN DEFAULT false,
    created_by VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create serial_numbers table for generating unique IDs
CREATE TABLE public.serial_numbers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    form_type VARCHAR(50) NOT NULL UNIQUE,
    last_number INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial serial number data
INSERT INTO public.serial_numbers (form_type, last_number) VALUES 
('SE', 0),
('QTN', 0),
('OC', 0),
('SKU', 0);

-- Create users profile table (linked to Supabase auth)
CREATE TABLE public.user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username VARCHAR(100),
    name VARCHAR(255),
    usertype VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.company ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itemmaster ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.serial_numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for authenticated users
CREATE POLICY "Users can view all companies" ON public.company FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create companies" ON public.company FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update companies" ON public.company FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Users can view all items" ON public.itemmaster FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create items" ON public.itemmaster FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update items" ON public.itemmaster FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Users can view all sales" ON public.sales FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create sales" ON public.sales FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update sales" ON public.sales FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Users can view serial numbers" ON public.serial_numbers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update serial numbers" ON public.serial_numbers FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Users can view their own profile" ON public.user_profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.user_profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.user_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, username, name, usertype)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to get next serial number
CREATE OR REPLACE FUNCTION public.get_next_serial_number(form_type_param TEXT)
RETURNS INTEGER AS $$
DECLARE
  next_number INTEGER;
BEGIN
  UPDATE public.serial_numbers 
  SET last_number = last_number + 1 
  WHERE form_type = form_type_param 
  RETURNING last_number INTO next_number;
  
  IF next_number IS NULL THEN
    INSERT INTO public.serial_numbers (form_type, last_number) 
    VALUES (form_type_param, 1) 
    RETURNING last_number INTO next_number;
  END IF;
  
  RETURN next_number;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
