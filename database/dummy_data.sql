-- TPA Portal Dummy Data
USE tpa_portal;

-- Clear existing data
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE audit_logs;
TRUNCATE TABLE notifications;
TRUNCATE TABLE support_tickets;
TRUNCATE TABLE training_plan_courses;
TRUNCATE TABLE training_plans;
TRUNCATE TABLE survey_responses;
TRUNCATE TABLE survey_questions;
TRUNCATE TABLE surveys;
TRUNCATE TABLE course_enrollments;
TRUNCATE TABLE course_schedules;
TRUNCATE TABLE courses;
TRUNCATE TABLE course_categories;
TRUNCATE TABLE users;
TRUNCATE TABLE departments;
TRUNCATE TABLE training_domains;
TRUNCATE TABLE user_roles;
SET FOREIGN_KEY_CHECKS = 1;

-- Insert User Roles
INSERT INTO user_roles (role_name, role_description, permissions) VALUES
('Employee', 'Basic employee with access to training materials and surveys', '["view_courses", "enroll_courses", "take_surveys", "view_own_reports"]'),
('Manager', 'Team manager with additional oversight capabilities', '["view_courses", "enroll_courses", "take_surveys", "view_own_reports", "manage_team", "approve_training", "view_team_reports"]'),
('Admin', 'Administrator with full system access', '["all_courses", "manage_courses", "create_surveys", "view_all_reports", "manage_users", "system_settings"]'),
('SystemAdmin', 'System administrator with complete access', '["all_permissions"]');

-- Insert Training Domains
INSERT INTO training_domains (domain_name, domain_code, description) VALUES
('IGL', 'IGL', 'Industrial Gas and Liquids training domain'),
('Admin', 'ADM', 'Administrative and office management training'),
('Customer Service', 'CS', 'Customer relations and service training'),
('CNG Projects and Steel', 'CPS', 'CNG Projects and Steel operations training'),
('CNG Operations', 'CNO', 'CNG Operations and Maintenance training'),
('Safety & Compliance', 'SC', 'Safety protocols and regulatory compliance training'),
('IT & Technology', 'IT', 'Information Technology and digital systems training');

-- Insert Departments
INSERT INTO departments (department_name, department_code, description) VALUES
('Human Resources', 'HR', 'Human Resources Department'),
('Information Technology', 'IT', 'Information Technology Department'),
('Operations', 'OPS', 'Operations Department'),
('Sales & Marketing', 'SM', 'Sales and Marketing Department'),
('Finance & Accounting', 'FA', 'Finance and Accounting Department'),
('Safety & Quality', 'SQ', 'Safety and Quality Assurance Department'),
('Engineering', 'ENG', 'Engineering Department'),
('Customer Service', 'CS', 'Customer Service Department');

-- Insert Users (with hashed passwords - all passwords are 'password123')
-- Password hash for 'password123' using bcrypt: $2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewiTcZDUqxb0xvIu
INSERT INTO users (employee_id, email, password_hash, first_name, last_name, phone, role_id, department_id, training_domain_id, manager_id, is_active, email_verified) VALUES
-- System Admin
('SA001', 'admin@tpa-portal.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewiTcZDUqxb0xvIu', 'John', 'Administrator', '+1234567890', 4, 2, 7, NULL, TRUE, TRUE),

-- HR Admin
('HR001', 'hr.manager@tpa-portal.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewiTcZDUqxb0xvIu', 'Sarah', 'Johnson', '+1234567891', 3, 1, 2, 1, TRUE, TRUE),

-- Department Managers
('OPS001', 'ops.manager@tpa-portal.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewiTcZDUqxb0xvIu', 'Michael', 'Rodriguez', '+1234567892', 2, 3, 1, 1, TRUE, TRUE),
('IT001', 'it.manager@tpa-portal.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewiTcZDUqxb0xvIu', 'David', 'Chen', '+1234567893', 2, 2, 7, 1, TRUE, TRUE),
('SM001', 'sales.manager@tpa-portal.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewiTcZDUqxb0xvIu', 'Emma', 'Williams', '+1234567894', 2, 4, 3, 1, TRUE, TRUE),

-- Employees
('EMP001', 'jane.doe@tpa-portal.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewiTcZDUqxb0xvIu', 'Jane', 'Doe', '+1234567895', 1, 1, 2, 2, TRUE, TRUE),
('EMP002', 'robert.smith@tpa-portal.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewiTcZDUqxb0xvIu', 'Robert', 'Smith', '+1234567896', 1, 3, 1, 3, TRUE, TRUE),
('EMP003', 'lisa.brown@tpa-portal.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewiTcZDUqxb0xvIu', 'Lisa', 'Brown', '+1234567897', 1, 2, 7, 4, TRUE, TRUE),
('EMP004', 'alex.johnson@tpa-portal.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewiTcZDUqxb0xvIu', 'Alex', 'Johnson', '+1234567898', 1, 4, 3, 5, TRUE, TRUE),
('EMP005', 'maria.garcia@tpa-portal.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewiTcZDUqxb0xvIu', 'Maria', 'Garcia', '+1234567899', 1, 8, 3, 5, TRUE, TRUE),
('EMP006', 'james.wilson@tpa-portal.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewiTcZDUqxb0xvIu', 'James', 'Wilson', '+1234567800', 1, 3, 5, 3, TRUE, TRUE),
('EMP007', 'amanda.taylor@tpa-portal.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewiTcZDUqxb0xvIu', 'Amanda', 'Taylor', '+1234567801', 1, 6, 6, 3, TRUE, TRUE),
('EMP008', 'kevin.lee@tpa-portal.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewiTcZDUqxb0xvIu', 'Kevin', 'Lee', '+1234567802', 1, 7, 4, 3, TRUE, TRUE),
('EMP009', 'rachel.davis@tpa-portal.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewiTcZDUqxb0xvIu', 'Rachel', 'Davis', '+1234567803', 1, 5, 2, 2, TRUE, TRUE),
('EMP010', 'thomas.miller@tpa-portal.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewiTcZDUqxb0xvIu', 'Thomas', 'Miller', '+1234567804', 1, 3, 1, 3, TRUE, TRUE);

-- Update departments with manager references
UPDATE departments SET manager_id = 2 WHERE id = 1; -- HR
UPDATE departments SET manager_id = 4 WHERE id = 2; -- IT
UPDATE departments SET manager_id = 3 WHERE id = 3; -- Operations
UPDATE departments SET manager_id = 5 WHERE id = 4; -- Sales & Marketing
UPDATE departments SET manager_id = 2 WHERE id = 5; -- Finance
UPDATE departments SET manager_id = 3 WHERE id = 6; -- Safety
UPDATE departments SET manager_id = 3 WHERE id = 7; -- Engineering
UPDATE departments SET manager_id = 5 WHERE id = 8; -- Customer Service

-- Insert Course Categories
INSERT INTO course_categories (category_name, description) VALUES
('Technical Skills', 'Technical and specialized skill development courses'),
('Leadership & Management', 'Leadership development and management training'),
('Safety & Compliance', 'Safety protocols and regulatory compliance training'),
('Customer Service', 'Customer relations and service excellence training'),
('IT & Digital', 'Information Technology and digital literacy training'),
('Personal Development', 'Personal and professional development courses'),
('Operations & Process', 'Operational procedures and process improvement');

-- Insert Courses
INSERT INTO courses (course_code, title, description, category_id, instructor_id, duration_hours, difficulty_level, max_participants, training_domain_id, prerequisites, learning_objectives, created_by) VALUES
('IGL001', 'Industrial Gas Safety Fundamentals', 'Comprehensive safety training for industrial gas handling and storage', 3, 3, 16, 'Beginner', 25, 1, 'Basic safety awareness', 'Understand gas safety protocols, emergency procedures, and risk assessment', 3),
('ADM001', 'Advanced Excel for Business Analytics', 'Advanced Excel skills for data analysis and reporting', 5, 4, 24, 'Intermediate', 20, 2, 'Basic Excel knowledge', 'Master advanced Excel functions, pivot tables, and data visualization', 4),
('CS001', 'Customer Service Excellence', 'Comprehensive customer service skills and best practices', 4, 5, 20, 'Beginner', 30, 3, 'Basic communication skills', 'Develop excellent customer service skills and problem-solving abilities', 5),
('CPS001', 'CNG Project Management', 'Project management principles for CNG infrastructure projects', 1, 3, 32, 'Advanced', 15, 4, 'Basic project management knowledge', 'Learn CNG project planning, execution, and monitoring techniques', 3),
('CNO001', 'CNG Equipment Maintenance', 'Maintenance procedures for CNG equipment and systems', 7, 6, 40, 'Intermediate', 12, 5, 'Basic mechanical knowledge', 'Master CNG equipment maintenance, troubleshooting, and repair procedures', 3),
('SC001', 'Workplace Safety Leadership', 'Leadership skills for promoting workplace safety culture', 2, 2, 16, 'Intermediate', 20, 6, 'Supervisory experience', 'Develop safety leadership skills and create safety-conscious workplace culture', 2),
('IT001', 'Cybersecurity Fundamentals', 'Basic cybersecurity principles and best practices', 5, 4, 28, 'Beginner', 25, 7, 'Basic computer literacy', 'Understand cybersecurity threats, prevention methods, and incident response', 4),
('LDR001', 'Team Leadership Essentials', 'Essential leadership skills for new managers', 2, 2, 24, 'Beginner', 18, 2, 'Team lead or supervisory role', 'Develop core leadership competencies and team management skills', 2),
('OPS001', 'Lean Six Sigma Green Belt', 'Process improvement methodology using Lean Six Sigma', 7, 3, 40, 'Advanced', 15, 1, 'Basic process knowledge', 'Master Lean Six Sigma tools and methodologies for process improvement', 3),
('DEV001', 'Professional Communication Skills', 'Effective communication in professional environments', 6, 5, 16, 'Beginner', 30, 2, 'None', 'Enhance verbal, written, and presentation communication skills', 5);

-- Insert Course Schedules
INSERT INTO course_schedules (course_id, batch_name, start_date, end_date, start_time, end_time, venue, max_participants, status, created_by) VALUES
(1, 'IGL Safety Q1 2024', '2024-04-15', '2024-04-17', '09:00:00', '17:00:00', 'Training Room A', 25, 'Scheduled', 3),
(2, 'Excel Analytics Batch 1', '2024-04-20', '2024-04-23', '09:00:00', '16:00:00', 'Computer Lab 1', 20, 'Scheduled', 4),
(3, 'Customer Service Q2 2024', '2024-05-05', '2024-05-08', '10:00:00', '15:00:00', 'Conference Room B', 30, 'Scheduled', 5),
(4, 'CNG PM Certification', '2024-05-15', '2024-05-22', '08:30:00', '17:30:00', 'Engineering Lab', 15, 'Scheduled', 3),
(5, 'CNG Maintenance Spring', '2024-06-01', '2024-06-10', '08:00:00', '17:00:00', 'Workshop Floor', 12, 'Scheduled', 3),
(6, 'Safety Leadership Q2', '2024-05-10', '2024-05-12', '09:00:00', '16:00:00', 'Training Room C', 20, 'Scheduled', 2),
(7, 'Cybersecurity Basics', '2024-04-25', '2024-04-29', '13:00:00', '17:00:00', 'Computer Lab 2', 25, 'Ongoing', 4),
(8, 'New Manager Training', '2024-05-20', '2024-05-23', '09:00:00', '17:00:00', 'Executive Room', 18, 'Scheduled', 2),
(9, 'Lean Six Sigma Certification', '2024-06-15', '2024-06-25', '08:00:00', '18:00:00', 'Training Center', 15, 'Scheduled', 3),
(10, 'Professional Comm Skills', '2024-04-30', '2024-05-02', '10:00:00', '16:00:00', 'Conference Room A', 30, 'Scheduled', 5);

-- Insert Course Enrollments
INSERT INTO course_enrollments (user_id, schedule_id, status, completion_date, score, rating) VALUES
-- Active enrollments
(6, 1, 'Enrolled', NULL, NULL, NULL),
(7, 1, 'Enrolled', NULL, NULL, NULL),
(10, 1, 'Enrolled', NULL, NULL, NULL),
(15, 1, 'Enrolled', NULL, NULL, NULL),
(8, 2, 'Enrolled', NULL, NULL, NULL),
(9, 2, 'Enrolled', NULL, NULL, NULL),
(14, 2, 'Enrolled', NULL, NULL, NULL),
(6, 3, 'Enrolled', NULL, NULL, NULL),
(10, 3, 'Enrolled', NULL, NULL, NULL),
(11, 3, 'Enrolled', NULL, NULL, NULL),
-- Completed enrollments with scores
(8, 7, 'Completed', '2024-04-29 17:00:00', 87.5, 4),
(9, 7, 'Completed', '2024-04-29 17:00:00', 92.0, 5),
(14, 7, 'Completed', '2024-04-29 17:00:00', 78.5, 4),
-- In progress
(7, 9, 'Enrolled', NULL, NULL, NULL),
(13, 9, 'Enrolled', NULL, NULL, NULL);

-- Insert Surveys
INSERT INTO surveys (title, description, survey_type, target_audience, start_date, end_date, is_active, created_by) VALUES
('Q1 2024 Training Needs Analysis', 'Quarterly assessment of training needs across all departments', 'Training Need Analysis', '{"roles": [1, 2], "departments": "all"}', '2024-04-01', '2024-04-30', TRUE, 2),
('Cybersecurity Course Feedback', 'Feedback collection for the Cybersecurity Fundamentals course', 'Course Feedback', '{"courses": [7]}', '2024-04-29', '2024-05-15', TRUE, 4),
('Leadership Development Survey', 'Assessment of leadership development needs for managers', 'General Survey', '{"roles": [2], "departments": "all"}', '2024-05-01', '2024-05-31', TRUE, 2),
('Safety Culture Assessment', 'Evaluation of current safety culture and awareness levels', 'General Survey', '{"departments": [3, 6, 7], "roles": "all"}', '2024-04-15', '2024-05-15', TRUE, 3);

-- Insert Survey Questions
INSERT INTO survey_questions (survey_id, question_text, question_type, options, is_required, question_order) VALUES
-- Training Needs Analysis Survey
(1, 'What training areas are most important for your role development?', 'multiple_choice', '["Technical Skills", "Leadership & Management", "Safety & Compliance", "Customer Service", "IT & Digital", "Personal Development"]', TRUE, 1),
(1, 'How would you rate your current skill level in your primary work area?', 'single_choice', '["Beginner", "Intermediate", "Advanced", "Expert"]', TRUE, 2),
(1, 'What is your preferred training delivery method?', 'single_choice', '["In-person classroom", "Online self-paced", "Virtual instructor-led", "Hands-on workshop", "Mixed approach"]', TRUE, 3),
(1, 'Please describe any specific training needs or challenges you face:', 'text', NULL, FALSE, 4),

-- Course Feedback Survey
(2, 'How would you rate the overall quality of the Cybersecurity Fundamentals course?', 'rating', NULL, TRUE, 1),
(2, 'Was the course content relevant to your job responsibilities?', 'single_choice', '["Very Relevant", "Relevant", "Somewhat Relevant", "Not Relevant"]', TRUE, 2),
(2, 'How would you rate the instructor\'s effectiveness?', 'rating', NULL, TRUE, 3),
(2, 'What aspects of the course could be improved?', 'text', NULL, FALSE, 4),
(2, 'Would you recommend this course to your colleagues?', 'boolean', NULL, TRUE, 5),

-- Leadership Development Survey
(3, 'What leadership challenges do you currently face?', 'multiple_choice', '["Team motivation", "Performance management", "Communication", "Decision making", "Conflict resolution", "Strategic thinking"]', TRUE, 1),
(3, 'How confident are you in your leadership abilities?', 'rating', NULL, TRUE, 2),
(3, 'What leadership topics would be most valuable for your development?', 'text', NULL, FALSE, 3),

-- Safety Culture Assessment
(4, 'How would you rate the current safety culture in your workplace?', 'rating', NULL, TRUE, 1),
(4, 'Do you feel comfortable reporting safety concerns?', 'boolean', NULL, TRUE, 2),
(4, 'What safety training would be most beneficial for your team?', 'multiple_choice', '["Emergency procedures", "Equipment safety", "Risk assessment", "Safety leadership", "Hazard identification", "Safety regulations"]', TRUE, 3);

-- Insert Sample Survey Responses
INSERT INTO survey_responses (survey_id, user_id, question_id, response_text, response_value) VALUES
-- Training Needs Analysis responses
(1, 6, 1, NULL, '["Technical Skills", "Personal Development"]'),
(1, 6, 2, NULL, '"Intermediate"'),
(1, 6, 3, NULL, '"Mixed approach"'),
(1, 6, 4, 'I need more training in advanced HR analytics and employee engagement strategies', NULL),

(1, 7, 1, NULL, '["Technical Skills", "Safety & Compliance"]'),
(1, 7, 2, NULL, '"Intermediate"'),
(1, 7, 3, NULL, '"Hands-on workshop"'),

(1, 8, 1, NULL, '["IT & Digital", "Personal Development"]'),
(1, 8, 2, NULL, '"Advanced"'),
(1, 8, 3, NULL, '"Online self-paced"'),

-- Course Feedback responses
(2, 8, 5, NULL, '5'),
(2, 8, 6, NULL, '"Very Relevant"'),
(2, 8, 7, NULL, '4'),
(2, 8, 8, 'More hands-on exercises would be helpful', NULL),
(2, 8, 9, NULL, 'true'),

(2, 9, 5, NULL, '5'),
(2, 9, 6, NULL, '"Very Relevant"'),
(2, 9, 7, NULL, '5'),
(2, 9, 9, NULL, 'true');

-- Insert Training Plans
INSERT INTO training_plans (user_id, plan_name, description, target_completion_date, status, created_by, approved_by) VALUES
(6, 'HR Professional Development 2024', 'Comprehensive development plan focusing on advanced HR skills and leadership', '2024-12-31', 'Active', 2, 2),
(7, 'Operations Excellence Training', 'Training plan to enhance operational efficiency and safety compliance', '2024-11-30', 'Active', 3, 3),
(8, 'IT Security Specialist Track', 'Advanced cybersecurity and IT management training path', '2024-10-31', 'Active', 4, 4),
(10, 'Technical Leadership Development', 'Leadership training for technical team leads', '2024-12-15', 'Draft', 3, NULL);

-- Insert Training Plan Courses
INSERT INTO training_plan_courses (training_plan_id, course_id, priority, target_completion_date, completion_status) VALUES
(1, 8, 'High', '2024-06-30', 'Not Started'),
(1, 10, 'Medium', '2024-08-31', 'Not Started'),
(2, 1, 'High', '2024-05-31', 'Not Started'),
(2, 6, 'High', '2024-07-31', 'Not Started'),
(2, 9, 'Medium', '2024-10-31', 'Not Started'),
(3, 7, 'High', '2024-05-31', 'Completed'),
(3, 2, 'Medium', '2024-08-31', 'Not Started'),
(4, 8, 'High', '2024-07-31', 'Not Started'),
(4, 9, 'Medium', '2024-10-31', 'Not Started');

-- Insert Support Tickets
INSERT INTO support_tickets (ticket_id, user_id, subject, description, category, priority, status, assigned_to) VALUES
('TKT-2024-001', 6, 'Cannot access course materials', 'Unable to download course materials for Excel Analytics course', 'Technical', 'Medium', 'Open', 4),
('TKT-2024-002', 8, 'Password reset request', 'Need to reset password - forgot current password', 'Account', 'Low', 'Resolved', 4),
('TKT-2024-003', 10, 'Course enrollment issue', 'Trying to enroll in CNG Project Management but getting error', 'Technical', 'Medium', 'In Progress', 4),
('TKT-2024-004', 11, 'Survey not loading', 'Training needs survey page is not loading properly', 'Technical', 'High', 'Open', 4),
('TKT-2024-005', 7, 'Certificate not generated', 'Completed cybersecurity course but certificate was not generated', 'Course Content', 'Medium', 'In Progress', 2);

-- Insert Notifications
INSERT INTO notifications (user_id, title, message, type, is_read, action_url) VALUES
(6, 'Course Enrollment Confirmed', 'You have been successfully enrolled in Customer Service Excellence course', 'success', FALSE, '/courses/3'),
(7, 'New Course Available', 'A new course "Lean Six Sigma Green Belt" is now available for enrollment', 'info', FALSE, '/courses/9'),
(8, 'Training Completion Certificate', 'Your certificate for Cybersecurity Fundamentals is now available', 'success', TRUE, '/certificates/7'),
(10, 'Survey Reminder', 'Please complete the Q1 2024 Training Needs Analysis survey', 'warning', FALSE, '/surveys/1'),
(3, 'New Support Ticket', 'A new support ticket has been assigned to you: TKT-2024-001', 'info', FALSE, '/support/tickets/1'),
(2, 'Training Plan Approval', 'Training plan for Jane Doe requires your approval', 'warning', FALSE, '/training-plans/1'),
(11, 'Course Starting Soon', 'Your enrolled course "Professional Communication Skills" starts in 3 days', 'info', FALSE, '/courses/10');

-- Insert System Settings
INSERT INTO system_settings (setting_key, setting_value, description, updated_by) VALUES
('system_name', 'TPA Portal', 'Application name displayed in the interface', 1),
('max_file_upload_size', '10', 'Maximum file upload size in MB', 1),
('password_expiry_days', '90', 'Number of days before password expires', 1),
('session_timeout_minutes', '30', 'Session timeout in minutes', 1),
('email_notifications_enabled', 'true', 'Enable/disable email notifications', 1),
('maintenance_mode', 'false', 'System maintenance mode flag', 1);

-- Insert Audit Logs (sample entries)
INSERT INTO audit_logs (user_id, action, resource_type, resource_id, old_values, new_values, ip_address, user_agent) VALUES
(2, 'CREATE_USER', 'users', 6, NULL, '{"employee_id": "EMP001", "email": "jane.doe@tpa-portal.com", "first_name": "Jane", "last_name": "Doe"}', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
(4, 'UPDATE_COURSE', 'courses', 7, '{"status": "Draft"}', '{"status": "Published"}', '192.168.1.101', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
(8, 'COMPLETE_COURSE', 'course_enrollments', 13, '{"status": "Enrolled"}', '{"status": "Completed", "score": 87.5}', '192.168.1.102', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
(3, 'CREATE_SURVEY', 'surveys', 4, NULL, '{"title": "Safety Culture Assessment", "survey_type": "General Survey"}', '192.168.1.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

-- Update current participant counts in course schedules
UPDATE course_schedules SET current_participants = (
    SELECT COUNT(*) FROM course_enrollments WHERE schedule_id = course_schedules.id
);

-- Ensure all foreign key references are valid
UPDATE departments SET manager_id = 2 WHERE id = 1 AND manager_id IS NULL;
UPDATE departments SET manager_id = 4 WHERE id = 2 AND manager_id IS NULL;
UPDATE departments SET manager_id = 3 WHERE id IN (3, 6, 7) AND manager_id IS NULL;
UPDATE departments SET manager_id = 5 WHERE id IN (4, 8) AND manager_id IS NULL;
UPDATE departments SET manager_id = 2 WHERE id = 5 AND manager_id IS NULL;
