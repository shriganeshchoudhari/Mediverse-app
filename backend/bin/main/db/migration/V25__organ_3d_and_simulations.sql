-- V25: 3D Anatomical Organ Models & Physiological Simulation Registry

CREATE TABLE IF NOT EXISTS organ_3d_models (
    id UUID PRIMARY KEY,
    organ_system VARCHAR(50) NOT NULL, -- CARDIOVASCULAR, RESPIRATORY, RENAL, NEURAL, etc.
    organ_name VARCHAR(100) NOT NULL,
    glb_asset_url VARCHAR(500) NOT NULL,
    draco_compressed BOOLEAN NOT NULL DEFAULT TRUE,
    triangle_count INT NOT NULL DEFAULT 0,
    lod_levels_json JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_organ_3d_models_system ON organ_3d_models(organ_system);

CREATE TABLE IF NOT EXISTS anatomical_landmark_pins (
    id UUID PRIMARY KEY,
    model_id UUID NOT NULL REFERENCES organ_3d_models(id) ON DELETE CASCADE,
    pin_label VARCHAR(150) NOT NULL,
    pos_x NUMERIC(8, 4) NOT NULL,
    pos_y NUMERIC(8, 4) NOT NULL,
    pos_z NUMERIC(8, 4) NOT NULL,
    clinical_high_yield TEXT NOT NULL,
    physiological_role TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_anatomical_pins_model_id ON anatomical_landmark_pins(model_id);

CREATE TABLE IF NOT EXISTS simulation_definitions (
    id UUID PRIMARY KEY,
    simulation_key VARCHAR(100) UNIQUE NOT NULL, -- CARDIAC_CYCLE, GHK_MEMBRANE, ALVEOLAR_GAS, etc.
    title VARCHAR(200) NOT NULL,
    organ_system VARCHAR(50) NOT NULL,
    mathematical_model_type VARCHAR(50) NOT NULL, -- TIME_VARYING_ELASTANCE, GHK_VOLTAGE, ALVEOLAR_GAS_EQUATION
    default_parameters_json JSONB NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

