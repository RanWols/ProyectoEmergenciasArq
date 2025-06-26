-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('administrador', 'coordinador', 'inspector', 'docente')),
  department VARCHAR(255),
  phone VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR(50) NOT NULL CHECK (type IN ('incendio', 'sismo', 'medica', 'intruso')),
  location VARCHAR(255) NOT NULL,
  location_id VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'activa' CHECK (status IN ('activa', 'resuelta')),
  reported_by VARCHAR(255) NOT NULL,
  resolved_by VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create panic_alerts table
CREATE TABLE IF NOT EXISTS panic_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  location VARCHAR(255) NOT NULL,
  student_info VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'false_alarm')),
  confirmed_by VARCHAR(255),
  confirmed_at TIMESTAMP WITH TIME ZONE,
  alert_type VARCHAR(50) CHECK (alert_type IN ('incendio', 'sismo', 'medica', 'intruso')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create geofence_events table
CREATE TABLE IF NOT EXISTS geofence_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  zone_id VARCHAR(255) NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  user_role VARCHAR(50) NOT NULL,
  event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('entry', 'exit', 'dwell_exceeded', 'unauthorized_access')),
  location_id VARCHAR(255) NOT NULL,
  risk_level VARCHAR(50) NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  alert_triggered BOOLEAN DEFAULT false,
  resolved BOOLEAN DEFAULT false,
  resolved_by VARCHAR(255),
  resolved_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status);
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_panic_alerts_status ON panic_alerts(status);
CREATE INDEX IF NOT EXISTS idx_panic_alerts_created_at ON panic_alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_geofence_events_resolved ON geofence_events(resolved);
CREATE INDEX IF NOT EXISTS idx_geofence_events_created_at ON geofence_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for users table
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
