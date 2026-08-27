-- V196: Multi-Tenant Data Isolation: Add tenant_id foreign keys to EMR and OSCE tables

-- 1. Add tenant_id to emr_patients
ALTER TABLE emr_patients ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_emr_patients_tenant_id ON emr_patients(tenant_id);

-- Assign existing seed patients to Global Medical University (Tenant 1)
UPDATE emr_patients 
SET tenant_id = '60000000-0000-0000-0000-000000000001' 
WHERE tenant_id IS NULL;

-- 2. Add tenant_id to osce_scores
ALTER TABLE osce_scores ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_osce_scores_tenant_id ON osce_scores(tenant_id);

-- Assign existing seed scores to Global Medical University (Tenant 1)
UPDATE osce_scores 
SET tenant_id = '60000000-0000-0000-0000-000000000001' 
WHERE tenant_id IS NULL;

-- 3. Add tenant_id to simulation_runs
ALTER TABLE simulation_runs ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_simulation_runs_tenant_id ON simulation_runs(tenant_id);
