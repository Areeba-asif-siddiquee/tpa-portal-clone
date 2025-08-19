-- TPA Portal Complete Database Setup
-- This file contains the complete database schema and dummy data

-- Drop database if exists and create fresh
DROP DATABASE IF EXISTS tpa_portal;
CREATE DATABASE tpa_portal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tpa_portal;

-- User Roles Table
CREATE TABLE user_roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    role_description TEXT,
    permissions JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Training Domains Table
CREATE TABLE training_domains (
    id INT PRIMARY KEY AUTO_INCREMENT,
    domain_name VARCHAR(100) NOT NULL,
    domain_code VARCHAR(20) UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Departments Table
CREATE TABLE departments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    department_name VARCHAR(100) NOT NULL,
    department_code VARCHAR(20) UNIQUE,
    description TEXT,
    manager_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Users Table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role_id INT NOT NULL,
    department_id INT,
    training_domain_id INT,
    manager_id INT,
    profile_image VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP NULL,
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES user_roles(id),
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (training_domain_id) REFERENCES training_domains(id),
    FOREIGN KEY (manager_id) REFERENCES users(id)
);

-- Course Categories Table
CREATE TABLE course_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Courses Table
CREATE TABLE courses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_code VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category_id INT,
    instructor_id INT,
    duration_hours INT,
    difficulty_level ENUM('Beginner', 'Intermediate', 'Advanced') DEFAULT 'Beginner',
    max_participants INT DEFAULT 50,
    training_domain_id INT,
    course_material_url VARCHAR(500),
    prerequisites TEXT,
    learning_objectives TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES course_categories(id),
    FOREIGN KEY (instructor_id) REFERENCES users(id),
    FOREIGN KEY (training_domain_id) REFERENCES training_domains(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Course Schedules Table
CREATE TABLE course_schedules (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    batch_name VARCHAR(100),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    venue VARCHAR(255),
    max_participants INT,
    current_participants INT DEFAULT 0,
    status ENUM('Scheduled', 'Ongoing', 'Completed', 'Cancelled') DEFAULT 'Scheduled',
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Course Enrollments Table
CREATE TABLE course_enrollments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    schedule_id INT NOT NULL,
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Enrolled', 'Completed', 'Withdrawn', 'Failed') DEFAULT 'Enrolled',
    completion_date TIMESTAMP NULL,
    score DECIMAL(5,2),
    certificate_url VARCHAR(500),
    feedback TEXT,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (schedule_id) REFERENCES course_schedules(id),
    UNIQUE KEY unique_enrollment (user_id, schedule_id)
);

-- Surveys Table
CREATE TABLE surveys (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    survey_type ENUM('Training Need Analysis', 'Course Feedback', 'General Survey') DEFAULT 'General Survey',
    target_audience JSON,
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    is_anonymous BOOLEAN DEFAULT FALSE,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Survey Questions Table
CREATE TABLE survey_questions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    survey_id INT NOT NULL,
    question_text TEXT NOT NULL,
    question_type ENUM('multiple_choice', 'single_choice', 'text', 'rating', 'boolean') NOT NULL,
    options JSON,
    is_required BOOLEAN DEFAULT FALSE,
    question_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (survey_id) REFERENCES surveys(id) ON DELETE CASCADE
);

-- Survey Responses Table
CREATE TABLE survey_responses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    survey_id INT NOT NULL,
    user_id INT,
    question_id INT NOT NULL,
    response_text TEXT,
    response_value JSON,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (survey_id) REFERENCES surveys(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (question_id) REFERENCES survey_questions(id)
);

-- Training Plans Table
CREATE TABLE training_plans (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    plan_name VARCHAR(255) NOT NULL,
    description TEXT,
    target_completion_date DATE,
    status ENUM('Draft', 'Active', 'Completed', 'Cancelled') DEFAULT 'Draft',
    created_by INT,
    approved_by INT,
    approved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (approved_by) REFERENCES users(id)
);

-- Training Plan Courses Table
CREATE TABLE training_plan_courses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    training_plan_id INT NOT NULL,
    course_id INT NOT NULL,
    priority ENUM('High', 'Medium', 'Low') DEFAULT 'Medium',
    target_completion_date DATE,
    completion_status ENUM('Not Started', 'In Progress', 'Completed') DEFAULT 'Not Started',
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (training_plan_id) REFERENCES training_plans(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id),
    UNIQUE KEY unique_plan_course (training_plan_id, course_id)
);

-- Support Tickets Table
CREATE TABLE support_tickets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ticket_id VARCHAR(50) NOT NULL UNIQUE,
    user_id INT NOT NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT,
    category ENUM('Technical', 'Course Content', 'Account', 'General') DEFAULT 'General',
    priority ENUM('Low', 'Medium', 'High', 'Critical') DEFAULT 'Medium',
    status ENUM('Open', 'In Progress', 'Resolved', 'Closed') DEFAULT 'Open',
    assigned_to INT,
    resolution_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id)
);

-- Notifications Table
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    type ENUM('info', 'success', 'warning', 'error') DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    action_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- System Settings Table
CREATE TABLE system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    description TEXT,
    updated_by INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (updated_by) REFERENCES users(id)
);

-- Audit Log Table
CREATE TABLE audit_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

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
('EMP005', 'maria.garcia@tpa-portal.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewiTcZDUqxb0xvIu', 'Maria', 'Garcia', '+1234567899', 1, 8, 3, 5, TRUE, TRUE);

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
('CNO001', 'CNG Equipment Maintenance', 'Maintenance procedures for CNG equipment and systems', 7, 6, 40, 'Intermediate', 12, 5, 'Basic mechanical knowledge', 'Master CNG equipment maintenance, troubleshooting, and repair procedures', 3);

-- Insert Course Schedules
INSERT INTO course_schedules (course_id, batch_name, start_date, end_date, start_time, end_time, venue, max_participants, status, created_by) VALUES
(1, 'IGL Safety Q1 2024', '2024-04-15', '2024-04-17', '09:00:00', '17:00:00', 'Training Room A', 25, 'Scheduled', 3),
(2, 'Excel Analytics Batch 1', '2024-04-20', '2024-04-23', '09:00:00', '16:00:00', 'Computer Lab 1', 20, 'Scheduled', 4),
(3, 'Customer Service Q2 2024', '2024-05-05', '2024-05-08', '10:00:00', '15:00:00', 'Conference Room B', 30, 'Scheduled', 5);

-- Insert Sample Course Enrollments
INSERT INTO course_enrollments (user_id, schedule_id, status, completion_date, score, rating) VALUES
(6, 1, 'Enrolled', NULL, NULL, NULL),
(7, 1, 'Enrolled', NULL, NULL, NULL),
(8, 2, 'Completed', '2024-04-23 16:00:00', 87.5, 4),
(9, 2, 'Completed', '2024-04-23 16:00:00', 92.0, 5);

-- Insert Sample Surveys
INSERT INTO surveys (title, description, survey_type, target_audience, start_date, end_date, is_active, created_by) VALUES
('Q1 2024 Training Needs Analysis', 'Quarterly assessment of training needs across all departments', 'Training Need Analysis', '{"roles": [1, 2], "departments": "all"}', '2024-04-01', '2024-04-30', TRUE, 2),
('Customer Service Course Feedback', 'Feedback collection for the Customer Service Excellence course', 'Course Feedback', '{"courses": [3]}', '2024-05-08', '2024-05-20', TRUE, 5);

-- Insert Sample Notifications
INSERT INTO notifications (user_id, title, message, type, is_read, action_url) VALUES
(6, 'Course Enrollment Confirmed', 'You have been successfully enrolled in Industrial Gas Safety Fundamentals course', 'success', FALSE, '/courses/1'),
(7, 'New Course Available', 'A new course "Advanced Excel for Business Analytics" is now available for enrollment', 'info', FALSE, '/courses/2'),
(8, 'Training Completion Certificate', 'Your certificate for Advanced Excel for Business Analytics is now available', 'success', TRUE, '/certificates/2');

-- Insert System Settings
INSERT INTO system_settings (setting_key, setting_value, description, updated_by) VALUES
('system_name', 'TPA Portal', 'Application name displayed in the interface', 1),
('max_file_upload_size', '10', 'Maximum file upload size in MB', 1),
('password_expiry_days', '90', 'Number of days before password expires', 1),
('session_timeout_minutes', '30', 'Session timeout in minutes', 1);

-- Add foreign key constraints for departments manager_id after users are inserted
ALTER TABLE departments ADD CONSTRAINT fk_dept_manager FOREIGN KEY (manager_id) REFERENCES users(id);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_employee_id ON users(employee_id);
CREATE INDEX idx_users_role ON users(role_id);
CREATE INDEX idx_courses_domain ON courses(training_domain_id);
CREATE INDEX idx_enrollments_user ON course_enrollments(user_id);
CREATE INDEX idx_enrollments_schedule ON course_enrollments(schedule_id);
CREATE INDEX idx_survey_responses_survey ON survey_responses(survey_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
