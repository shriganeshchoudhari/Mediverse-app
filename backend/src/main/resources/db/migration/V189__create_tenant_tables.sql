-- Create Tenants Table
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(100) UNIQUE NOT NULL,
    subscription_tier VARCHAR(50) NOT NULL DEFAULT 'ENTERPRISE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Tenant Users Mapping Table
CREATE TABLE tenant_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL, -- Logical reference to standard users table
    role VARCHAR(50) NOT NULL DEFAULT 'STUDENT', -- ADMIN, FACULTY, STUDENT
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, user_id)
);

-- Seed Demo Institutions
INSERT INTO tenants (id, name, domain, subscription_tier)
VALUES 
('60000000-0000-0000-0000-000000000001', 'Global Medical University', 'gmu.edu', 'ENTERPRISE'),
('60000000-0000-0000-0000-000000000002', 'St. Jude Teaching Hospital', 'stjude.org', 'PREMIUM');

-- Seed Mock Admin User for GMU
INSERT INTO tenant_users (tenant_id, user_id, role)
VALUES ('60000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'ADMIN');
