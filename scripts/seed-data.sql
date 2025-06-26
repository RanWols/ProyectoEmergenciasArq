-- Insert sample users
INSERT INTO users (id, name, email, role, department, phone, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Dr. María González', 'maria.gonzalez@colegio.edu', 'administrador', 'Dirección General', '+1234567890', true),
('550e8400-e29b-41d4-a716-446655440002', 'Prof. Carlos Rodríguez', 'carlos.rodriguez@colegio.edu', 'coordinador', 'Coordinación Académica', '+1234567891', true),
('550e8400-e29b-41d4-a716-446655440003', 'Ana Martínez', 'ana.martinez@colegio.edu', 'inspector', 'Seguridad', '+1234567892', true),
('550e8400-e29b-41d4-a716-446655440004', 'Prof. Luis Fernández', 'luis.fernandez@colegio.edu', 'docente', 'Ciencias', '+1234567893', true),
('550e8400-e29b-41d4-a716-446655440005', 'Prof. Carmen López', 'carmen.lopez@colegio.edu', 'docente', 'Matemáticas', '+1234567894', true);

-- Insert sample school locations
INSERT INTO school_locations (id, name, type, floor, building, coordinates_x, coordinates_y, capacity, description, emergency_exit, assembly_point, risk_level, equipment, responsible_person) VALUES
('aula-101', 'Aula 101', 'aula', 1, 'Edificio Principal', 10.5, 20.3, 30, 'Aula de matemáticas básicas', false, false, 'low', ARRAY['pizarra', 'proyector'], 'Prof. Carmen López'),
('aula-102', 'Aula 102', 'aula', 1, 'Edificio Principal', 15.2, 20.3, 30, 'Aula de ciencias naturales', false, false, 'low', ARRAY['pizarra', 'microscopios'], 'Prof. Luis Fernández'),
('lab-quimica', 'Laboratorio de Química', 'laboratorio', 2, 'Edificio Ciencias', 25.8, 35.7, 20, 'Laboratorio equipado para experimentos químicos', false, false, 'high', ARRAY['campana extractora', 'ducha de emergencia', 'extintor'], 'Prof. Luis Fernández'),
('lab-fisica', 'Laboratorio de Física', 'laboratorio', 2, 'Edificio Ciencias', 30.1, 35.7, 20, 'Laboratorio de física experimental', false, false, 'medium', ARRAY['equipos eléctricos', 'balanzas'], 'Prof. Luis Fernández'),
('biblioteca', 'Biblioteca Central', 'biblioteca', 1, 'Edificio Principal', 40.5, 15.2, 100, 'Biblioteca principal del colegio', false, false, 'low', ARRAY['sistema contra incendios', 'cámaras'], 'Bibliotecaria'),
('gimnasio', 'Gimnasio Principal', 'gimnasio', 1, 'Edificio Deportes', 60.3, 45.8, 200, 'Gimnasio para educación física', false, false, 'medium', ARRAY['botiquín', 'desfibrilador'], 'Prof. Educación Física'),
('enfermeria', 'Enfermería', 'enfermeria', 1, 'Edificio Principal', 20.7, 10.5, 10, 'Enfermería escolar', false, false, 'critical', ARRAY['equipo médico', 'camilla', 'botiquín completo'], 'Enfermera'),
('direccion', 'Dirección', 'oficina', 2, 'Edificio Principal', 35.2, 25.8, 15, 'Oficina de la dirección', false, false, 'medium', ARRAY['sistema de comunicación', 'caja fuerte'], 'Dr. María González'),
('patio-central', 'Patio Central', 'patio', 0, 'Exterior', 50.0, 30.0, 500, 'Patio principal para recreos', false, true, 'low', ARRAY['megáfono', 'botiquín'], 'Inspector de turno'),
('entrada-principal', 'Entrada Principal', 'entrada', 0, 'Edificio Principal', 0.0, 0.0, 50, 'Entrada principal del colegio', true, false, 'medium', ARRAY['cámaras', 'sistema de control de acceso'], 'Seguridad');

-- Insert sample alerts (some active, some resolved)
INSERT INTO alerts (id, type, location, location_id, description, status, reported_by, resolved_by, created_at, resolved_at) VALUES
('alert-001', 'incendio', 'Laboratorio de Química', 'lab-quimica', 'Humo detectado en el laboratorio durante experimento', 'resuelta', 'Prof. Luis Fernández', 'Ana Martínez', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 hour'),
('alert-002', 'medica', 'Gimnasio Principal', 'gimnasio', 'Estudiante con lesión en tobillo durante clase de educación física', 'resuelta', 'Prof. Educación Física', 'Enfermera', NOW() - INTERVAL '1 day', NOW() - INTERVAL '23 hours'),
('alert-003', 'sismo', 'Edificio Principal', 'aula-101', 'Simulacro de sismo - Evacuación ordenada', 'activa', 'Dr. María González', NULL, NOW() - INTERVAL '30 minutes', NULL);

-- Insert sample panic alerts (pending and resolved)
INSERT INTO panic_alerts (id, location, student_info, status, confirmed_by, confirmed_at, alert_type, description, created_at) VALUES
('panic-001', 'Aula 102', 'Estudiante (Anónimo)', 'false_alarm', 'Ana Martínez', NOW() - INTERVAL '3 hours', NULL, 'Activación accidental durante clase', NOW() - INTERVAL '4 hours'),
('panic-002', 'Biblioteca Central', 'Estudiante (Anónimo)', 'confirmed', 'Dr. María González', NOW() - INTERVAL '1 day', 'medica', 'Estudiante con crisis de pánico', NOW() - INTERVAL '1 day 1 hour'),
('panic-003', 'Patio Central', 'Estudiante (Anónimo)', 'pending', NULL, NULL, NULL, NULL, NOW() - INTERVAL '5 minutes');

-- Insert sample geofence events
INSERT INTO geofence_events (id, zone_id, user_id, user_name, user_role, event_type, location_id, risk_level, alert_triggered, resolved, resolved_by, resolved_at, notes, created_at) VALUES
('geo-001', 'high-risk-labs', '550e8400-e29b-41d4-a716-446655440004', 'Prof. Luis Fernández', 'docente', 'entry', 'lab-quimica', 'high', false, true, 'Ana Martínez', NOW() - INTERVAL '2 hours', 'Acceso autorizado para clase programada', NOW() - INTERVAL '3 hours'),
('geo-002', 'restricted-admin', '550e8400-e29b-41d4-a716-446655440005', 'Prof. Carmen López', 'docente', 'entry', 'direccion', 'medium', true, false, NULL, NULL, 'Acceso no autorizado detectado', NOW() - INTERVAL '1 hour'),
('geo-003', 'after-hours-restricted', '550e8400-e29b-41d4-a716-446655440003', 'Ana Martínez', 'inspector', 'entry', 'biblioteca', 'low', false, true, 'Ana Martínez', NOW() - INTERVAL '30 minutes', 'Ronda de seguridad nocturna', NOW() - INTERVAL '45 minutes');

-- Insert sample notifications
INSERT INTO notifications (id, user_id, title, message, type, priority, read, alert_id, created_at) VALUES
('notif-001', '550e8400-e29b-41d4-a716-446655440001', 'Nueva Alerta de Emergencia', 'Se ha reportado un simulacro de sismo en Aula 101', 'emergency', 'high', false, 'alert-003', NOW() - INTERVAL '30 minutes'),
('notif-002', '550e8400-e29b-41d4-a716-446655440002', 'Botón de Pánico Activado', 'Botón de pánico activado en Patio Central - Requiere confirmación', 'panic', 'critical', false, NULL, NOW() - INTERVAL '5 minutes'),
('notif-003', '550e8400-e29b-41d4-a716-446655440003', 'Acceso No Autorizado', 'Acceso no autorizado detectado en zona restringida', 'geofence', 'medium', false, NULL, NOW() - INTERVAL '1 hour'),
('notif-004', '550e8400-e29b-41d4-a716-446655440001', 'Alerta Médica Resuelta', 'La emergencia médica en el gimnasio ha sido resuelta', 'resolved', 'normal', true, 'alert-002', NOW() - INTERVAL '23 hours');

-- Insert geofence zones data
INSERT INTO geofence_zones (id, name, type, risk_level, locations, radius, active, description, alert_on_entry, alert_on_exit, alert_on_dwell_time, dwell_time_minutes, alert_priority, allowed_roles, time_start, time_end, allowed_days) VALUES
('high-risk-labs', 'Laboratorios de Alto Riesgo', 'restricted', 'high', ARRAY['lab-quimica', 'lab-fisica'], 10, true, 'Laboratorios que requieren supervisión especializada', true, false, true, 120, 'high', ARRAY['administrador', 'coordinador', 'docente'], '07:00', '18:00', ARRAY[1,2,3,4,5]),
('restricted-admin', 'Áreas Administrativas Restringidas', 'restricted', 'medium', ARRAY['direccion'], 5, true, 'Oficinas administrativas con acceso limitado', true, false, false, NULL, 'medium', ARRAY['administrador', 'coordinador'], '06:00', '20:00', ARRAY[1,2,3,4,5,6,7]),
('emergency-exits', 'Salidas de Emergencia', 'emergency', 'critical', ARRAY['entrada-principal'], 15, true, 'Salidas de emergencia que deben mantenerse despejadas', false, true, false, NULL, 'critical', ARRAY['administrador', 'coordinador', 'inspector', 'docente'], NULL, NULL, ARRAY[1,2,3,4,5,6,7]),
('safe-assembly', 'Puntos de Encuentro Seguros', 'safe', 'low', ARRAY['patio-central'], 20, true, 'Puntos de encuentro durante emergencias', false, false, false, NULL, 'normal', ARRAY['administrador', 'coordinador', 'inspector', 'docente'], NULL, NULL, ARRAY[1,2,3,4,5,6,7]),
('after-hours-restricted', 'Áreas Restringidas Fuera de Horario', 'restricted', 'medium', ARRAY['biblioteca', 'gimnasio'], 8, true, 'Áreas con acceso restringido fuera del horario escolar', true, false, false, NULL, 'medium', ARRAY['administrador', 'inspector'], '18:00', '07:00', ARRAY[1,2,3,4,5,6,7]);
