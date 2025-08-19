const express = require('express');
const router = express.Router();
const { db } = require('../server');
const auth = require('../middleware/auth');

// Get all assessments
router.get('/', auth, (req, res) => {
  const query = `
    SELECT a.*, u.username, u.email
    FROM assessments a
    JOIN users u ON a.user_id = u.id
    ORDER BY a.created_at DESC
  `;
  
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});

// Get assessments by user
router.get('/user/:userId', auth, (req, res) => {
  const { userId } = req.params;
  
  db.query('SELECT * FROM assessments WHERE user_id = ? ORDER BY created_at DESC', 
    [userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});

// Create assessment
router.post('/', auth, (req, res) => {
  const {
    title,
    description,
    assessment_type,
    questions,
    user_id
  } = req.body;

  const query = `
    INSERT INTO assessments (title, description, assessment_type, questions, user_id, status)
    VALUES (?, ?, ?, ?, ?, 'draft')
  `;

  db.query(query, [title, description, assessment_type, JSON.stringify(questions), user_id], 
    (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to create assessment' });
    res.status(201).json({ 
      message: 'Assessment created successfully',
      id: result.insertId
    });
  });
});

// Submit assessment response
router.post('/:id/responses', auth, (req, res) => {
  const { id } = req.params;
  const { responses, user_id } = req.body;

  const query = `
    INSERT INTO assessment_responses (assessment_id, user_id, responses, submitted_at)
    VALUES (?, ?, ?, NOW())
  `;

  db.query(query, [id, user_id, JSON.stringify(responses)], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to submit assessment response' });
    res.status(201).json({ 
      message: 'Assessment response submitted successfully',
      id: result.insertId
    });
  });
});

// Get assessment responses
router.get('/:id/responses', auth, (req, res) => {
  const { id } = req.params;
  
  const query = `
    SELECT ar.*, u.username, u.email
    FROM assessment_responses ar
    JOIN users u ON ar.user_id = u.id
    WHERE ar.assessment_id = ?
    ORDER BY ar.submitted_at DESC
  `;
  
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});

module.exports = router;
