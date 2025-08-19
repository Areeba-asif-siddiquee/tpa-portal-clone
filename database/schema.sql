CREATE DATABASE IF NOT EXISTS tpa_portal;
USE tpa_portal;

-- User roles enumeration table
CREATE TABLE user_roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    permissions JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default roles
INSERT INTO user_roles (role_name, description, permissions) VALUES
('Employee', 'Basic user with access to training materials and surveys', '["view_courses", "take_surveys", "view_reports"]'),
('Manager', 'Team lead with additional management capabilities', '["view_courses", "take_surveys", "view_reports", "manage_team", "approve_requests"]'),
('Admin', 'Administrator with full system access except system configuration', '["all_permissions"]'),
('SystemAdmin', 'System administrator with complete access', '["all_permissions", "system_config", "user_management"]');

-- select * from user_roles ;
-- Training domains
CREATE TABLE training_domains (
    id INT PRIMARY KEY AUTO_INCREMENT,
    domain_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default domains
INSERT INTO training_domains (domain_name, description) VALUES
('IGL', 'Industrial Gas and Liquids training domain'),
('Admin', 'Administrative and office management training'),
('Customer_Service', 'Customer relations and service training'),
('CNG_Projects_and_Steel', 'CNG Projects and Steel operations training'),
('CNG_OM', 'CNG Operations and Maintenance training');

-- select * from training_domains;
-- Departments table
CREATE TABLE departments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    department_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    head_user_id INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id VARCHAR(50) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role_id INT NOT NULL,
    department_id INT,
    training_domain_id INT,
    manager_id INT,
    profile_picture VARCHAR(255),
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
    FOREIGN KEY (manager_id) REFERENCES users(id),
    INDEX idx_email (email),
    INDEX idx_employee_id (employee_id),
    INDEX idx_role_id (role_id),
    INDEX idx_department_id (department_id)
);

-- Courses table
CREATE TABLE courses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_name VARCHAR(200) NOT NULL,
    course_code VARCHAR(50) UNIQUE,
    description TEXT,
    department_id INT,
    training_domain_id INT,
    duration_hours DECIMAL(4,1),
    difficulty_level ENUM('Beginner', 'Intermediate', 'Advanced') DEFAULT 'Beginner',
    prerequisites TEXT,
    learning_objectives TEXT,
    course_materials JSON,
    instructor_id INT,
    max_participants INT DEFAULT 50,
    schedule_start DATETIME,
    schedule_end DATETIME,
    schedule_type ENUM('One-time', 'Recurring', 'Self-paced') DEFAULT 'One-time',
    location VARCHAR(200),
    delivery_method ENUM('In-person', 'Online', 'Hybrid') DEFAULT 'In-person',
    status ENUM('Draft', 'Published', 'Active', 'Completed', 'Cancelled') DEFAULT 'Draft',
    tags JSON,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (training_domain_id) REFERENCES training_domains(id),
    FOREIGN KEY (instructor_id) REFERENCES users(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_course_code (course_code),
    INDEX idx_department_id (department_id),
    INDEX idx_domain_id (training_domain_id),
    INDEX idx_status (status)
);

-- Course enrollments
CREATE TABLE course_enrollments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    user_id INT NOT NULL,
    enrolled_by INT,
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completion_date TIMESTAMP NULL,
    completion_status ENUM('Not Started', 'In Progress', 'Completed', 'Cancelled') DEFAULT 'Not Started',
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    final_score DECIMAL(5,2),
    certificate_issued BOOLEAN DEFAULT FALSE,
    feedback_rating INT CHECK (feedback_rating BETWEEN 1 AND 5),
    feedback_comments TEXT,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (enrolled_by) REFERENCES users(id),
    UNIQUE KEY unique_enrollment (course_id, user_id),
    INDEX idx_user_id (user_id),
    INDEX idx_course_id (course_id),
    INDEX idx_completion_status (completion_status)
);

-- Surveys table
CREATE TABLE surveys (
    id INT PRIMARY KEY AUTO_INCREMENT,
    survey_title VARCHAR(200) NOT NULL,
    description TEXT,
    survey_type ENUM('Training Needs', 'Course Feedback', 'General', 'Custom') DEFAULT 'Training Needs',
    questions JSON NOT NULL,
    target_audience JSON, -- departments, domains, specific users
    is_anonymous BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    start_date DATETIME,
    end_date DATETIME,
    max_responses INT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_survey_type (survey_type),
    INDEX idx_is_active (is_active),
    INDEX idx_created_by (created_by)
);

-- Survey responses
CREATE TABLE survey_responses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    survey_id INT NOT NULL,
    user_id INT,
    responses JSON NOT NULL,
    completion_status ENUM('Incomplete', 'Completed') DEFAULT 'Incomplete',
    completion_time TIMESTAMP NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (survey_id) REFERENCES surveys(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_survey_id (survey_id),
    INDEX idx_user_id (user_id),
    INDEX idx_completion_status (completion_status)
);

-- Training needs analysis
CREATE TABLE training_needs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    department_id INT,
    training_domain_id INT,
    identified_need TEXT NOT NULL,
    priority_level ENUM('Low', 'Medium', 'High', 'Critical') DEFAULT 'Medium',
    business_impact TEXT,
    target_completion_date DATE,
    estimated_participants INT,
    estimated_budget DECIMAL(10,2),
    current_skill_level ENUM('None', 'Basic', 'Intermediate', 'Advanced') DEFAULT 'None',
    desired_skill_level ENUM('Basic', 'Intermediate', 'Advanced', 'Expert') DEFAULT 'Basic',
    preferred_delivery_method ENUM('In-person', 'Online', 'Hybrid', 'Self-study') DEFAULT 'In-person',
    status ENUM('Identified', 'Under Review', 'Approved', 'In Progress', 'Completed', 'Rejected') DEFAULT 'Identified',
    identified_by INT,
    reviewed_by INT,
    approved_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (training_domain_id) REFERENCES training_domains(id),
    FOREIGN KEY (identified_by) REFERENCES users(id),
    FOREIGN KEY (reviewed_by) REFERENCES users(id),
    FOREIGN KEY (approved_by) REFERENCES users(id),
    INDEX idx_user_id (user_id),
    INDEX idx_department_id (department_id),
    INDEX idx_priority_level (priority_level),
    INDEX idx_status (status)
);

-- Feedback and support
CREATE TABLE feedback (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    feedback_type ENUM('Bug Report', 'Feature Request', 'General Feedback', 'Course Rating', 'System Issue') DEFAULT 'General Feedback',
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100),
    priority ENUM('Low', 'Medium', 'High', 'Critical') DEFAULT 'Medium',
    status ENUM('New', 'In Review', 'In Progress', 'Resolved', 'Closed') DEFAULT 'New',
    assigned_to INT,
    resolution TEXT,
    resolution_date TIMESTAMP NULL,
    attachments JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id),
    INDEX idx_user_id (user_id),
    INDEX idx_feedback_type (feedback_type),
    INDEX idx_status (status),
    INDEX idx_priority (priority)
);

-- Reports and analytics
CREATE TABLE reports (
    id INT PRIMARY KEY AUTO_INCREMENT,
    report_name VARCHAR(200) NOT NULL,
    report_type ENUM('Training Participation', 'Needs Analysis', 'Course Completion', 'Survey Results', 'Custom') DEFAULT 'Custom',
    parameters JSON,
    generated_by INT,
    file_path VARCHAR(500),
    file_format ENUM('PDF', 'Excel', 'CSV') DEFAULT 'PDF',
    generation_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    download_count INT DEFAULT 0,
    is_scheduled BOOLEAN DEFAULT FALSE,
    schedule_cron VARCHAR(100),
    FOREIGN KEY (generated_by) REFERENCES users(id),
    INDEX idx_report_type (report_type),
    INDEX idx_generated_by (generated_by),
    INDEX idx_generation_time (generation_time)
);

-- Notifications
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('Info', 'Warning', 'Success', 'Error', 'Survey', 'Course', 'Approval') DEFAULT 'Info',
    is_read BOOLEAN DEFAULT FALSE,
    action_url VARCHAR(500),
    metadata JSON,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_type (type),
    INDEX idx_created_at (created_at)
);

-- File uploads
CREATE TABLE file_uploads (
    id INT PRIMARY KEY AUTO_INCREMENT,
    original_name VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    uploaded_by INT,
    related_entity_type VARCHAR(50), -- 'course', 'survey', 'feedback', etc.
    related_entity_id INT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES users(id),
    INDEX idx_uploaded_by (uploaded_by),
    INDEX idx_related_entity (related_entity_type, related_entity_id)
);

-- Audit log
CREATE TABLE audit_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_timestamp (timestamp),
    INDEX idx_action (action)
);

-- System settings
CREATE TABLE system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    data_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    is_public BOOLEAN DEFAULT FALSE,
    updated_by INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (updated_by) REFERENCES users(id),
    INDEX idx_setting_key (setting_key)
);

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, description, data_type, is_public) VALUES
('app_name', 'TPA Portal', 'Application name', 'string', TRUE),
('app_version', '1.0.0', 'Application version', 'string', TRUE),
('maintenance_mode', 'false', 'Enable maintenance mode', 'boolean', TRUE),
('max_file_upload_size', '5242880', 'Maximum file upload size in bytes', 'number', FALSE),
('session_timeout', '3600', 'Session timeout in seconds', 'number', FALSE),
('email_notifications_enabled', 'true', 'Enable email notifications', 'boolean', FALSE),
('password_min_length', '8', 'Minimum password length', 'number', TRUE);

-- Create views for common queries
CREATE VIEW user_profile_view AS
SELECT 
    u.id,
    u.employee_id,
    u.email,
    CONCAT(u.first_name, ' ', u.last_name) as full_name,
    u.first_name,
    u.last_name,
    u.phone,
    ur.role_name,
    d.department_name,
    td.domain_name,
    CONCAT(m.first_name, ' ', m.last_name) as manager_name,
    u.profile_picture,
    u.is_active,
    u.email_verified,
    u.last_login,
    u.created_at
FROM users u
LEFT JOIN user_roles ur ON u.role_id = ur.id
LEFT JOIN departments d ON u.department_id = d.id
LEFT JOIN training_domains td ON u.training_domain_id = td.id
LEFT JOIN users m ON u.manager_id = m.id;

CREATE VIEW course_enrollment_summary AS
SELECT 
    c.id as course_id,
    c.course_name,
    c.course_code,
    c.status as course_status,
    COUNT(ce.id) as total_enrollments,
    COUNT(CASE WHEN ce.completion_status = 'Completed' THEN 1 END) as completed_enrollments,
    COUNT(CASE WHEN ce.completion_status = 'In Progress' THEN 1 END) as in_progress_enrollments,
    AVG(ce.final_score) as average_score,
    AVG(ce.feedback_rating) as average_rating
FROM courses c
LEFT JOIN course_enrollments ce ON c.id = ce.course_id
GROUP BY c.id, c.course_name, c.course_code, c.status;

-- Add foreign key constraint for department head
ALTER TABLE departments 
ADD FOREIGN KEY (head_user_id) REFERENCES users(id);

COMMIT;
