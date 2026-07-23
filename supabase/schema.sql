-- 1. Enable PostGIS extension for spatial radius search calculations
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Safely clear old table structures to avoid relation errors
DROP TABLE IF EXISTS banners CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS colleges CASCADE;

-- 3. Create master table for colleges
CREATE TABLE colleges (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    est_year INT,
    website_url TEXT,
    district TEXT NOT NULL,
    taluka TEXT NOT NULL,
    address TEXT,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    location GEOGRAPHY(Point, 4326),
    paid_client BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Automatically generate geometric coordinates on insert or update
CREATE OR REPLACE FUNCTION calculate_college_location()
RETURNS TRIGGER AS $$
BEGIN
    NEW.location = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_college_location
BEFORE INSERT OR UPDATE ON colleges
FOR EACH ROW EXECUTE FUNCTION calculate_college_location();

-- 5. Create courses & category cutoffs table
CREATE TABLE courses (
    id BIGSERIAL PRIMARY KEY,
    college_id BIGINT REFERENCES colleges(id) ON DELETE CASCADE,
    course_name TEXT NOT NULL,
    total_fees INT,
    seats_available INT,
    portal_type TEXT, -- e.g., 'GCAS', 'ACPC', 'Direct'
    general_cutoff INT,
    ews_cutoff INT,
    obc_cutoff INT,
    sc_cutoff INT,
    st_cutoff INT
);

-- 6. Create advertising control table
CREATE TABLE banners (
    id BIGSERIAL PRIMARY KEY,
    placement_zone TEXT NOT NULL, -- e.g., 'home_header', 'category_header'
    target_category TEXT DEFAULT 'Global',
    image_url TEXT NOT NULL,
    click_url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- 7. Enable Row Level Security (RLS)
ALTER TABLE colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

-- 8. Enable public read access policies so Next.js can read data
CREATE POLICY "Public Read Colleges" ON colleges FOR SELECT USING (true);
CREATE POLICY "Public Read Courses" ON courses FOR SELECT USING (true);
CREATE POLICY "Public Read Banners" ON banners FOR SELECT USING (true);
