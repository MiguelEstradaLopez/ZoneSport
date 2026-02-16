-- ZoneSport Database Initialization Script
-- This script runs automatically when the PostgreSQL container starts for the first time

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA public;
CREATE EXTENSION IF NOT EXISTS "pgcrypto" SCHEMA public;

-- Set default search_path
ALTER DATABASE zonesport SET search_path TO public;

-- Create schema if needed
CREATE SCHEMA IF NOT EXISTS public;

-- Set timezone
SET timezone = 'UTC';

-- Log initialization
SELECT 'ZoneSport database initialized successfully' as status;
