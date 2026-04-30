-- Krevia Business Database Module Schema
-- Purpose: Extend Kreavix into a SaaS for web development services.

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Clients Table
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    company_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    project_name TEXT NOT NULL,
    status TEXT DEFAULT 'Planning' CHECK (status IN ('Planning', 'In Progress', 'Testing', 'Completed', 'Maintenance', 'Cancelled')),
    price NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_name TEXT NOT NULL,
    billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly', 'yearly')),
    status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Pending', 'Cancelled', 'Expired')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    payment_method TEXT,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Paid', 'Failed', 'Refunded')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Websites Table
CREATE TABLE IF NOT EXISTS websites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    domain TEXT,
    hosting_status TEXT DEFAULT 'Active',
    database_status TEXT DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Row Level Security (RLS)

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE websites ENABLE ROW LEVEL SECURITY;

-- CLEANUP: Drop existing policies to avoid "already exists" errors
DROP POLICY IF EXISTS "Admins can manage all clients" ON clients;
DROP POLICY IF EXISTS "Admins can manage all projects" ON projects;
DROP POLICY IF EXISTS "Admins can manage all subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Admins can manage all payments" ON payments;
DROP POLICY IF EXISTS "Admins can manage all websites" ON websites;

DROP POLICY IF EXISTS "Clients can view their own record" ON clients;
DROP POLICY IF EXISTS "Clients can view their own projects" ON projects;
DROP POLICY IF EXISTS "Clients can view their own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Clients can view their own payments" ON payments;
DROP POLICY IF EXISTS "Clients can view their own websites" ON websites;

-- ADMIN POLICIES (Full Access if role is 'admin')
CREATE POLICY "Admins can manage all clients" ON clients
    FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "Admins can manage all projects" ON projects
    FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "Admins can manage all subscriptions" ON subscriptions
    FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "Admins can manage all payments" ON payments
    FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "Admins can manage all websites" ON websites
    FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- CLIENT POLICIES (Own Data Only)
CREATE POLICY "Clients can view their own record" ON clients
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Clients can view their own projects" ON projects
    FOR SELECT USING (client_id IN (SELECT id FROM clients WHERE user_id = auth.uid()));

CREATE POLICY "Clients can view their own subscriptions" ON subscriptions
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Clients can view their own payments" ON payments
    FOR SELECT USING (client_id IN (SELECT id FROM clients WHERE user_id = auth.uid()));

CREATE POLICY "Clients can view their own websites" ON websites
    FOR SELECT USING (project_id IN (SELECT id FROM projects WHERE client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())));

-- 8. Sample Data for Testing
-- Uncomment these lines and run in SQL Editor to populate sample data
/*
INSERT INTO clients (name, email, company_name) VALUES 
('SMK Mitra Industri', 'nugrohodc06@gmail.com', 'SMK Mitra Industri'),
('Kreavix Client', 'client@kreavix.com', 'Kreavix Corp');
*/
