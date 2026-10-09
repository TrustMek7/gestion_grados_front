-- =============================================================================
-- CARGA DE DATOS INICIALES (MOCK SEEDER) CON UTF-8 PARA GRADOS Y TITULOS UNSA
-- =============================================================================

SET client_encoding = 'UTF8';

-- Limpieza limpia previa para evitar conflictos o tildes residuales
TRUNCATE TABLE defenses, expedient_advisors, jury_members, jury_draw_members, jury_draws, resolutions, research_works, expedients, graduates, teachers, expedient_statuses, degree_modalities, schools, users RESTART IDENTITY CASCADE;

-- 1. Usuarios administrativos
INSERT INTO users (id, email, full_name, role, is_active) VALUES
  (1, 'phidalgo@unsa.edu.pe', 'Paulo Andre Hidalgo Chinchay', 'ADMIN_GT', TRUE),
  (2, 'demo@unsa.edu.pe', 'Usuario de Demostración', 'ADMIN_GT', TRUE);

-- 2. Escuelas profesionales
INSERT INTO schools (id, name) VALUES
  (1, 'Administración'),
  (2, 'Economía'),
  (3, 'Educación'),
  (4, 'Ingeniería Civil'),
  (5, 'Ingeniería de Sistemas');

-- 3. Modalidades de obtención de grado
INSERT INTO degree_modalities (id, name, is_active) VALUES
  (1, 'Tesis', TRUE),
  (2, 'Artículo de investigación', TRUE);

-- 4. Estados del expediente administrativo
INSERT INTO expedient_statuses (id, name, is_active) VALUES
  (1, 'Registrado', TRUE),
  (2, 'En trámite', TRUE),
  (3, 'Observado', TRUE),
  (4, 'Sustentado', TRUE),
  (5, 'Completado', TRUE);

-- 5. Catálogo de docentes y jurados
INSERT INTO teachers (id, document_number, full_name, email) VALUES
  (1, '29481023', 'Elena Vargas', 'elena.vargas@unsa.edu.pe'),
  (2, '40192834', 'Rafael Montes', 'rafael.montes@unsa.edu.pe'),
  (3, '31928374', 'Patricia León', 'patricia.leon@unsa.edu.pe'),
  (4, '28371928', 'Jorge Rivas', 'jorge.rivas@unsa.edu.pe'),
  (5, '41029384', 'Adriana Soto', 'adriana.soto@unsa.edu.pe'),
  (6, '29384719', 'Daniel Fuentes', 'daniel.fuentes@unsa.edu.pe'),
  (7, '30192837', 'Mariana Vega', 'mariana.vega@unsa.edu.pe'),
  (8, '42918273', 'Héctor Salinas', 'hector.salinas@unsa.edu.pe');

-- 6. Graduandos
INSERT INTO graduates (id, document_number, first_names, last_names, school_id, academic_program) VALUES
  (1, '70112233', 'Lucía', 'Paredes', 5, 'Ingeniería de Software'),
  (2, '70223344', 'Mateo', 'Salazar', 4, 'Estructuras'),
  (3, '70334455', 'Valeria', 'Núñez', 1, 'Gestión Pública'),
  (4, '70445566', 'Diego', 'Rojas', 5, 'Seguridad de la Información'),
  (5, '70556677', 'Camila', 'Torres', 2, 'Finanzas y Proyectos'),
  (6, '70667788', 'Andrés', 'Medina', 4, 'Geotecnia'),
  (7, '70778899', 'Sofía', 'Herrera', 1, 'Marketing y Finanzas'),
  (8, '70889900', 'Gabriel', 'Vera', 5, 'Ciencia de Datos'),
  (9, '70990011', 'Daniela', 'Castro', 2, 'Economía Pública'),
  (10, '71001122', 'Nicolás', 'Flores', 4, 'Transportes'),
  (11, '71112233', 'Elena', 'Ruiz', 3, 'Lengua y Literatura'),
  (12, '71223344', 'Joaquín', 'Paz', 5, 'Gestión de TI');

-- 7. Expedientes oficiales
INSERT INTO expedients (id, number, start_date, graduate_id, modality_id, status_id, created_by, updated_by) VALUES
  (1, 'DEMO-2026-0010', '2026-03-12', 1, 1, 3, 1, 1),
  (2, 'DEMO-2026-0009', '2026-02-18', 2, 1, 2, 1, 1),
  (3, 'DEMO-2026-0008', '2026-04-06', 3, 2, 4, 1, 1),
  (4, 'DEMO-2026-0007', '2026-01-15', 4, 1, 5, 1, 1),
  (5, 'DEMO-2026-0006', '2026-09-20', 5, 2, 1, 1, 1),
  (6, 'DEMO-2026-0005', '2026-05-11', 6, 1, 3, 1, 1),
  (7, 'DEMO-2026-0004', '2026-03-25', 7, 1, 2, 1, 1),
  (8, 'DEMO-2026-0003', '2026-06-08', 8, 2, 4, 1, 1),
  (9, 'DEMO-2026-0002', '2026-01-22', 9, 1, 5, 1, 1),
  (10, 'DEMO-2026-0001', '2026-04-14', 10, 1, 2, 1, 1),
  (11, 'DEMO-2025-0020', '2025-03-10', 11, 1, 5, 1, 1),
  (12, 'DEMO-2025-0019', '2025-10-15', 12, 1, 2, 1, 1);

-- 8. Trabajos de investigación vinculados
INSERT INTO research_works (id, expedient_id, work_type, title) VALUES
  (1, 1, 'Tesis', 'Organización digital de archivos académicos'),
  (2, 2, 'Tesis', 'Evaluación de materiales para infraestructura urbana'),
  (3, 3, 'Artículo de investigación', 'Gestión documental en organizaciones educativas'),
  (4, 4, 'Tesis', 'Accesibilidad de plataformas de atención administrativa'),
  (5, 5, 'Artículo de investigación', 'Análisis de indicadores de desarrollo regional'),
  (6, 6, 'Tesis', 'Planificación del mantenimiento de infraestructura'),
  (7, 7, 'Tesis', 'Mejora de procesos de atención al usuario'),
  (8, 8, 'Artículo de investigación', 'Visualización de información para la gestión académica'),
  (9, 9, 'Tesis', 'Distribución de recursos en servicios educativos'),
  (10, 10, 'Tesis', 'Modelado de redes de movilidad urbana'),
  (11, 11, 'Tesis', 'Recursos digitales para el aprendizaje colaborativo'),
  (12, 12, 'Tesis', 'Clasificación de solicitudes administrativas');

-- 9. Resoluciones académicas de ejemplo
INSERT INTO resolutions (id, expedient_id, number, resolution_date, resolution_type, file_url) VALUES
  (1, 1, 'RESOL-2026-0010', '2026-04-01', 'Asesor', 'https://storage.unsa.edu.pe/docs/resol-2026-0010.pdf'),
  (2, 2, 'RESOL-2026-0009', '2026-03-15', 'Jurado', 'https://storage.unsa.edu.pe/docs/resol-2026-0009.pdf'),
  (3, 3, 'RESOL-2026-0008', '2026-05-10', 'Sustentación', 'https://storage.unsa.edu.pe/docs/resol-2026-0008.pdf'),
  (4, 4, 'RESOL-2026-0007', '2026-02-20', 'Título', 'https://storage.unsa.edu.pe/docs/resol-2026-0007.pdf'),
  (5, 7, 'RESOL-2026-0004', '2026-04-18', 'Sorteo', 'https://storage.unsa.edu.pe/docs/resol-2026-0004.pdf'),
  (6, 10, 'RESOL-2026-0001', '2026-05-02', 'Asesor', 'https://storage.unsa.edu.pe/docs/resol-2026-0001.pdf');

-- 10. Asesores designados
INSERT INTO expedient_advisors (id, expedient_id, teacher_id, resolution_id, assigned_at) VALUES
  (1, 1, 1, 1, '2026-04-01'),
  (2, 2, 2, 2, '2026-03-15'),
  (3, 10, 8, 6, '2026-05-02');

-- 11. Miembros de jurado
INSERT INTO jury_members (id, expedient_id, teacher_id, resolution_id, jury_role) VALUES
  (1, 2, 2, 2, 'PRESIDENTE'),
  (2, 2, 8, 2, 'SECRETARIO'),
  (3, 2, 5, 2, 'VOCAL'),
  (4, 2, 6, 2, 'ACCESITARIO'),
  (5, 4, 1, 4, 'PRESIDENTE'),
  (6, 4, 5, 4, 'SECRETARIO'),
  (7, 4, 7, 4, 'VOCAL'),
  (8, 4, 4, 4, 'ACCESITARIO');

-- 12. Sustentaciones
INSERT INTO defenses (id, expedient_id, defense_date, result) VALUES
  (1, 2, '2026-09-30', 'Pendiente'),
  (2, 3, '2026-09-23', 'Aprobado'),
  (3, 4, '2026-08-18', 'Aprobado'),
  (4, 7, '2026-10-02', 'Pendiente'),
  (5, 8, '2026-09-17', 'Aprobado'),
  (6, 9, '2026-07-10', 'Aprobado'),
  (7, 10, '2026-10-05', 'Pendiente'),
  (8, 11, '2025-11-12', 'Aprobado');

-- 13. Secuencias de ID de PostgreSQL
SELECT setval('users_id_seq', (SELECT COALESCE(MAX(id), 1) FROM users));
SELECT setval('schools_id_seq', (SELECT COALESCE(MAX(id), 1) FROM schools));
SELECT setval('degree_modalities_id_seq', (SELECT COALESCE(MAX(id), 1) FROM degree_modalities));
SELECT setval('expedient_statuses_id_seq', (SELECT COALESCE(MAX(id), 1) FROM expedient_statuses));
SELECT setval('teachers_id_seq', (SELECT COALESCE(MAX(id), 1) FROM teachers));
SELECT setval('graduates_id_seq', (SELECT COALESCE(MAX(id), 1) FROM graduates));
SELECT setval('expedients_id_seq', (SELECT COALESCE(MAX(id), 1) FROM expedients));
SELECT setval('research_works_id_seq', (SELECT COALESCE(MAX(id), 1) FROM research_works));
SELECT setval('resolutions_id_seq', (SELECT COALESCE(MAX(id), 1) FROM resolutions));
SELECT setval('expedient_advisors_id_seq', (SELECT COALESCE(MAX(id), 1) FROM expedient_advisors));
SELECT setval('jury_members_id_seq', (SELECT COALESCE(MAX(id), 1) FROM jury_members));
SELECT setval('defenses_id_seq', (SELECT COALESCE(MAX(id), 1) FROM defenses));
