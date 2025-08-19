USE tpa_portal;

-- Sample departments
INSERT IGNORE INTO departments (department_name, description) VALUES
('Human Resources', 'HR department managing employee relations and policies'),
('Information Technology', 'IT department managing technology infrastructure'),
('Operations', 'Operations department managing day-to-day business activities'),
('Finance', 'Finance department managing financial operations'),
('Marketing', 'Marketing department managing promotional activities'),
('Safety & Compliance', 'Department ensuring safety standards and regulatory compliance');


-- Sample users (passwords hashed with bcrypt)
INSERT IGNORE INTO users 
(employee_id, email, password_hash, first_name, last_name, phone, role_id, department_id, training_domain_id, is_active, email_verified) 
VALUES
('SA001', 'admin@tpaportal.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewBqOzUUV7vvEBhi', 'System', 'Administrator', '+1-555-0101', 4, 2, 2, TRUE, TRUE),
('AD001', 'hr.admin@tpaportal.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewBqOzUUV7vvEBhi', 'Sarah', 'Johnson', '+1-555-0102', 3, 1, 2, TRUE, TRUE),
('AD002', 'it.admin@tpaportal.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewBqOzUUV7vvEBhi', 'Michael', 'Chen', '+1-555-0103', 3, 2, 2, TRUE, TRUE),
('MG001', 'ops.manager@tpaportal.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewBqOzUUV7vvEBhi', 'Robert', 'Wilson', '+1-555-0201', 2, 3, 1, TRUE, TRUE),
('MG002', 'fin.manager@tpaportal.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewBqOzUUV7vvEBhi', 'Lisa', 'Anderson', '+1-555-0202', 2, 4, 2, TRUE, TRUE),
('MG003', 'safety.manager@tpaportal.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewBqOzUUV7vvEBhi', 'David', 'Brown', '+1-555-0203', 2, 6, 4, TRUE, TRUE),
('EMP001', 'john.doe@tpaportal.com', '$2a$12$LQv3c1yqBWHxkd0LHAkCOYz6TtxMQJqhN8/LewBqOzUUV7vvEBhi', 'John', 'Doe', '+1-555-0301', 1, 3, 1, TRUE, TRUE),
('EMP002', 'jane.smith@tpaportal.com', '$2a$12$LQv3c1yqBWHxkd0LHAkCOYz6TtxMQJqhN8/LewBqOzUUV7vvEBhi', 'Jane', 'Smith', '+1-555-0302', 1, 3, 3, TRUE, TRUE),
('EMP003', 'mike.jones@tpaportal.com', '$2a$12$LQv3c1yqBWHxkd0LHAkCOYz6TtxMQJqhN8/LewBqOzUUV7vvEBhi', 'Mike', 'Jones', '+1-555-0303', 1, 4, 2, TRUE, TRUE),
('EMP004', 'alice.davis@tpaportal.com', '$2a$12$LQv3c1yqBWHxkd0LHAkCOYz6TtxMQJqhN8/LewBqOzUUV7vvEBhi', 'Alice', 'Davis', '+1-555-0304', 1, 4, 2, TRUE, TRUE),
('EMP005', 'bob.miller@tpaportal.com', '$2a$12$LQv3c1yqBWHxkd0LHAkCOYz6TtxMQJqhN8/LewBqOzUUV7vvEBhi', 'Bob', 'Miller', '+1-555-0305', 1, 6, 4, TRUE, TRUE),
('EMP006', 'carol.white@tpaportal.com', '$2a$12$LQv3c1yqBWHxkd0LHAkCOYz6TtxMQJqhN8/LewBqOzUUV7vvEBhi', 'Carol', 'White', '+1-555-0306', 1, 6, 5, TRUE, TRUE);

-- Update manager relationships
UPDATE users SET manager_id = 4 WHERE id IN (7, 8);
UPDATE users SET manager_id = 5 WHERE id = 10;
UPDATE users SET manager_id = 6 WHERE id IN (11, 12);
UPDATE users SET manager_id = 3 WHERE id = 9;
SELECT id, employee_id FROM users;
-- Update department heads
UPDATE departments SET head_user_id = 4 WHERE id = 1;
UPDATE departments SET head_user_id = 14 WHERE id = 2;
UPDATE departments SET head_user_id = 21 WHERE id = 3;
UPDATE departments SET head_user_id = 15 WHERE id = 4;
UPDATE departments SET head_user_id = 19 WHERE id = 6;

-- Insert courses (ensure instructor_id and created_by match actual users.id)
INSERT INTO courses (course_name, course_code, description, department_id, training_domain_id, duration_hours, difficulty_level, prerequisites, learning_objectives, instructor_id, max_participants, schedule_start, schedule_end, location, delivery_method, status, created_by) VALUES
('Industrial Gas Safety Fundamentals', 'IGL-001', 'Basic safety protocols for handling industrial gases and liquids', 4, 1, 8.0, 'Beginner', 'None', 'Understand safety protocols, identify hazards, use protective equipment', 4, 25, '2025-09-01 09:00:00', '2025-09-01 17:00:00', 'Training Room A', 'In-person', 'Published', 4),
('CNG Operations and Maintenance', 'CNG-001', 'Comprehensive training on CNG systems operation and maintenance procedures', 6, 5, 16.0, 'Intermediate', 'Basic mechanical knowledge', 'Operate CNG systems safely, perform routine maintenance, troubleshoot issues', 5, 15, '2025-09-15 08:00:00', '2025-09-16 16:00:00', 'Workshop B', 'In-person', 'Published', 5),
('Customer Service Excellence', 'CS-001', 'Advanced customer service skills and communication techniques', 5, 3, 6.0, 'Intermediate', 'Basic customer service experience', 'Improve communication skills, handle difficult customers, resolve complaints', 15, 30, '2025-08-25 10:00:00', '2025-08-25 16:00:00', 'Conference Room', 'Hybrid', 'Active', 16),
('Administrative Procedures', 'ADM-001', 'Standard administrative procedures and documentation management', 1, 2, 4.0, 'Beginner', 'None', 'Understand admin procedures, manage documentation, use office systems', 20, 40, '2025-09-10 13:00:00', '2025-09-10 17:00:00', 'Online', 'Online', 'Published', 20),
('CNG Project Management', 'CNG-002', 'Project management principles applied to CNG and steel projects', 3, 4, 12.0, 'Advanced', 'Project management basics', 'Plan CNG projects, manage resources, ensure quality delivery', 21, 20, '2025-10-01 09:00:00', '2025-10-03 17:00:00', 'Training Center', 'In-person', 'Draft', 13),
('IT Security Awareness', 'IT-001', 'Cybersecurity best practices and threat awareness for all employees', 2, 2, 3.0, 'Beginner', 'None', 'Recognize security threats, follow security protocols, protect company data', 18, 100, '2025-08-30 14:00:00', '2025-08-30 17:00:00', 'Online', 'Online', 'Published', 18);

select * from courses;
-- Sample course enrollments
INSERT INTO course_enrollments (course_id, user_id, enrolled_by, completion_status, progress_percentage, final_score, feedback_rating, feedback_comments) VALUES
-- IGL Safety course enrollments
(200, 4, 18, 'Completed', 100.00, 92.5, 5, 'Excellent course! Very informative and well-structured.'),
(203, 20, 19, 'In Progress', 75.00, NULL, NULL, NULL),
(205, 21, 15, 'Completed', 100.00, 87.0, 4, 'Good course, practical examples were helpful.'),
(2, 7, 4, 'Not Started', 0.00, NULL, NULL, NULL),
(2, 12, 6, 'In Progress', 50.00, NULL, NULL, NULL),
(3, 8, 4, 'Completed', 100.00, 95.0, 5, 'Great training! Improved my customer interaction skills significantly.'),
(3, 2, 1, 'Completed', 100.00, 88.0, 4, 'Very useful course for daily operations.'),
(4, 9, 3, 'Completed', 100.00, 91.0, 5, 'Clear and concise training material.'),
(4, 10, 5, 'In Progress', 60.00, NULL, NULL, NULL),
(6, 7, 3, 'Completed', 100.00, 85.0, 4, 'Important information for everyone.'),
(6, 8, 3, 'Completed', 100.00, 90.0, 4, 'Eye-opening regarding security threats.'),
(6, 9, 3, 'Not Started', 0.00, NULL, NULL, NULL),
(6, 10, 3, 'Completed', 100.00, 78.0, 3, 'Good basic information.'),
(6, 11, 3, 'In Progress', 80.00, NULL, NULL, NULL);

-- Sample surveys
INSERT INTO surveys (survey_title, description, survey_type, questions, target_audience, is_active, start_date, end_date, created_by) VALUES
('Training Needs Assessment Q3 2025', 'Quarterly assessment of training needs across all departments', 'Training Needs', 
'[
    {
        "id": 1,
        "type": "multiple_choice",
        "question": "What is your current skill level in your primary domain?",
        "options": ["Beginner", "Intermediate", "Advanced", "Expert"],
        "required": true
    },
    {
        "id": 2,
        "type": "text",
        "question": "What specific training areas would benefit your role the most?",
        "required": true
    },
    {
        "id": 3,
        "type": "multiple_choice",
        "question": "What is your preferred training delivery method?",
        "options": ["In-person", "Online", "Hybrid", "Self-study"],
        "required": true
    },
    {
        "id": 4,
        "type": "rating",
        "question": "How would you rate the current training resources available?",
        "scale": 5,
        "required": true
    }
]', 
'{"departments": [1,2,3,4,6], "domains": [1,2,3,4,5]}', TRUE, '2025-08-15 00:00:00', '2025-09-15 23:59:59', 2),

('Customer Service Training Feedback', 'Feedback on the Customer Service Excellence course', 'Course Feedback',
'[
    {
        "id": 1,
        "type": "rating",
        "question": "Overall, how would you rate this course?",
        "scale": 5,
        "required": true
    },
    {
        "id": 2,
        "type": "multiple_choice",
        "question": "How relevant was the content to your job role?",
        "options": ["Very Relevant", "Relevant", "Somewhat Relevant", "Not Relevant"],
        "required": true
    },
    {
        "id": 3,
        "type": "text",
        "question": "What did you like most about the course?",
        "required": false
    },
    {
        "id": 4,
        "type": "text",
        "question": "What could be improved in future sessions?",
        "required": false
    }
]',
'{"courses": [3]}', TRUE, '2025-08-25 00:00:00', '2025-09-25 23:59:59', 2);

-- Sample survey responses
INSERT INTO survey_responses (survey_id, user_id, responses, completion_status, completion_time) VALUES
(1, 7, '{"1": "Intermediate", "2": "Advanced CNG operations and safety protocols", "3": "In-person", "4": 4}', 'Completed', '2025-08-20 10:30:00'),
(1, 8, '{"1": "Beginner", "2": "Customer service and communication skills", "3": "Hybrid", "4": 3}', 'Completed', '2025-08-22 14:15:00'),
(1, 9, '{"1": "Advanced", "2": "Cloud computing and cybersecurity", "3": "Online", "4": 4}', 'Completed', '2025-08-21 09:45:00'),

(2, 8, '{"1": 5, "2": "Very Relevant", "3": "The practical role-playing exercises were excellent", "4": "More real-world scenarios would be helpful"}', 'Completed', '2025-08-26 11:00:00'),
(2, 2, '{"1": 4, "2": "Relevant", "3": "Good structure and clear explanations", "4": "Could use more interactive elements"}', 'Completed', '2025-08-27 15:30:00');

-- Sample training needs
INSERT INTO training_needs (user_id, department_id, training_domain_id, identified_need, priority_level, business_impact, target_completion_date, estimated_participants, current_skill_level, desired_skill_level, preferred_delivery_method, status, identified_by) VALUES
('CNG Advanced Operations Training', 'High', 'Critical for upcoming project expansion', '2025-12-01', 8, 'Intermediate', 'Advanced', 'In-person', 'Approved', 4),
(9, 2, 2, 'Cloud Infrastructure Management', 'Medium', 'Important for digital transformation initiative', '2025-11-15', 5, 'Basic', 'Advanced', 'Hybrid', 'Under Review', 3),
(10, 4, 2, 'Financial Analytics and Reporting', 'Medium', 'Improve reporting accuracy and efficiency', '2025-10-30', 3, 'Intermediate', 'Advanced', 'Online', 'Identified', 5);

-- Sample feedback entries
INSERT INTO feedback (user_id, feedback_type, title, description, category, priority, status) VALUES
(7, 'Feature Request', 'Mobile App for Course Access', 'It would be great to have a mobile application to access course materials on the go, especially for field workers.', 'Mobile', 'Medium', 'New'),
(8, 'Bug Report', 'Survey Submission Error', 'When submitting the training needs survey, I got an error message and had to restart.', 'Survey', 'High', 'In Review'),
(9, 'General Feedback', 'Excellent Training Platform', 'The new training portal is much better than the previous system. Easy to navigate and find relevant courses.', 'General', 'Low', 'Resolved');

-- Sample notifications
INSERT INTO notifications (user_id, title, message, type, action_url) VALUES
(7, 'New Course Available', 'CNG Project Management course is now available for enrollment', 'Course', '/courses/5'),
(8, 'Survey Reminder', 'Please complete the Training Needs Assessment Q3 2025 survey', 'Survey', '/surveys/1'),
(9, 'Course Completion', 'Congratulations! You have completed the IT Security Awareness course', 'Success', '/courses/6'),
(10, 'Enrollment Confirmation', 'You have been enrolled in Administrative Procedures course', 'Info', '/courses/4'),
(11, 'Training Reminder', 'Your Industrial Gas Safety Fundamentals course starts tomorrow', 'Info', '/courses/1'),
(12, 'Course Update', 'CNG Operations and Maintenance course schedule has been updated', 'Warning', '/courses/2');

COMMIT;
