-- Supabase Database Schema for SYNERGY INDIA
-- Run this SQL in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Admin Users Table
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    hashed_password TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Services Table
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    short_intro TEXT,
    overview TEXT NOT NULL,
    sub_services TEXT[] NOT NULL DEFAULT '{}',
    benefits TEXT[] NOT NULL DEFAULT '{}',
    cta_text VARCHAR(255) NOT NULL,
    images TEXT[] NOT NULL DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gallery Images Table
CREATE TABLE gallery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    url TEXT NOT NULL,
    alt_text VARCHAR(255) NOT NULL,
    caption TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    "order" INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leads Table
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    service_interested VARCHAR(255) NOT NULL,
    project_type VARCHAR(255) NOT NULL,
    message TEXT,
    status VARCHAR(50) DEFAULT 'New',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact Form Settings Table
CREATE TABLE contact_form_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_options TEXT[] NOT NULL DEFAULT '{}',
    project_type_options TEXT[] NOT NULL DEFAULT '{}',
    admin_email VARCHAR(255) NOT NULL,
    whatsapp_number VARCHAR(20) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CTA Settings Table
CREATE TABLE cta_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    whatsapp_template TEXT NOT NULL,
    call_number VARCHAR(20) NOT NULL,
    contact_page_link VARCHAR(255) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- General Settings Table
CREATE TABLE general_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_name VARCHAR(255) NOT NULL,
    logo_url TEXT NOT NULL,
    office_address TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    office_hours VARCHAR(255) NOT NULL,
    social_media JSONB NOT NULL DEFAULT '{}',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Login History Table
CREATE TABLE login_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    login_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    success BOOLEAN DEFAULT TRUE
);

-- Legacy Status Checks Table (for backward compatibility)
CREATE TABLE status_checks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_name VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default admin user (password: admin123)
INSERT INTO admin_users (username, hashed_password) 
VALUES ('admin', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f');

-- Insert default contact form settings
INSERT INTO contact_form_settings (service_options, project_type_options, admin_email, whatsapp_number)
VALUES (
    ARRAY['Civil & Interior Work', 'Agriculture Solutions', 'Solar Equipment'],
    ARRAY['Residential', 'Commercial', 'Agricultural', 'Industrial'],
    'info@synergyindia.com',
    '918404861022'
);

-- Insert default CTA settings
INSERT INTO cta_settings (whatsapp_template, call_number, contact_page_link)
VALUES (
    'Hello! I would like to know about {service_name} services.',
    '+916123597570',
    '/contact'
);

-- Insert default general settings
INSERT INTO general_settings (site_name, logo_url, office_address, phone, email, office_hours, social_media)
VALUES (
    'SYNERGY INDIA',
    'https://customer-assets.emergentagent.com/job_4e865656-4cd3-4df9-b985-379e174ef909/artifacts/e98t14ka_WhatsApp%20Image%202025-09-16%20at%2018.19.38_99f24a69.jpg',
    '05, Chaudhary Market, Opposite Paras HMRI Hospital, Raja Bazar, Patna - 800014',
    '+91-8404861022',
    'info@synergyindia.com',
    'Mon-Sat: 9 AM - 6 PM',
    '{"facebook": "", "instagram": "", "twitter": "", "linkedin": ""}'
);

-- Create indexes for better performance
CREATE INDEX idx_services_is_active ON services(is_active);
CREATE INDEX idx_gallery_is_active ON gallery(is_active);
CREATE INDEX idx_gallery_order ON gallery("order");
CREATE INDEX idx_leads_created_at ON leads(created_at);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_login_history_login_time ON login_history(login_time);

-- Enable Row Level Security (RLS)
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_form_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE cta_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE general_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE status_checks ENABLE ROW LEVEL SECURITY;

-- Create policies for public access to certain tables
CREATE POLICY "Allow public read access to services" ON services FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access to gallery" ON gallery FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access to contact form settings" ON contact_form_settings FOR SELECT USING (true);
CREATE POLICY "Allow public read access to CTA settings" ON cta_settings FOR SELECT USING (true);
CREATE POLICY "Allow public read access to general settings" ON general_settings FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to leads" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert access to status checks" ON status_checks FOR INSERT WITH CHECK (true);

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) VALUES ('123', '123', true);

-- Create storage policies for the bucket
CREATE POLICY "Allow public read access to images" ON storage.objects FOR SELECT USING (bucket_id = '123');
CREATE POLICY "Allow authenticated upload to images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = '123');
CREATE POLICY "Allow authenticated update to images" ON storage.objects FOR UPDATE USING (bucket_id = '123');
CREATE POLICY "Allow authenticated delete to images" ON storage.objects FOR DELETE USING (bucket_id = '123');
