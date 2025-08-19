const express = require('express');
const router = express.Router();
const { db } = require('../server');
const auth = require('../middleware/auth');

// Get all training needs
router.get('/', auth, (req, res) => {
  const query = `
    SELECT tn.*, u.username, u.email, d.department_name 
    FROM training_needs tn
    JOIN users u ON tn.user_id = u.id
    LEFT JOIN departments d ON u.department_id = d.id
    ORDER BY tn.created_at DESC
  `;
  
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});

// Get training needs by user
router.get('/user/:userId', auth, (req, res) => {
  const { userId } = req.params;
  
  const query = `
    SELECT tn.*, d.department_name 
    FROM training_needs tn
    LEFT JOIN users u ON tn.user_id = u.id
    LEFT JOIN departments d ON u.department_id = d.id
    WHERE tn.user_id = ?
    ORDER BY tn.created_at DESC
  `;
  
  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});

// Create training need
router.post('/', auth, (req, res) => {
  const {
    title,
    description,
    skill_category,
    priority_level,
    business_justification,
    expected_outcome,
    timeline,
    budget_estimate,
    user_id
  } = req.body;

  const query = `
    INSERT INTO training_needs 
    (title, description, skill_category, priority_level, business_justification, 
     expected_outcome, timeline, budget_estimate, user_id, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
  `;

  db.query(query, [
    title, description, skill_category, priority_level, business_justification,
    expected_outcome, timeline, budget_estimate, user_id
  ], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to create training need' });
    res.status(201).json({ 
      message: 'Training need created successfully',
      id: result.insertId
    });
  });
});

// Update training need
router.put('/:id', auth, (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    skill_category,
    priority_level,
    business_justification,
    expected_outcome,
    timeline,
    budget_estimate,
    status
  } = req.body;

  const query = `
    UPDATE training_needs 
    SET title = ?, description = ?, skill_category = ?, priority_level = ?, 
        business_justification = ?, expected_outcome = ?, timeline = ?, 
        budget_estimate = ?, status = ?, updated_at = NOW()
    WHERE id = ?
  `;

  db.query(query, [
    title, description, skill_category, priority_level, business_justification,
    expected_outcome, timeline, budget_estimate, status, id
  ], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to update training need' });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Training need not found' });
    }
    res.json({ message: 'Training need updated successfully' });
  });
});

// Delete training need
router.delete('/:id', auth, (req, res) => {
  const { id } = req.params;
  
  db.query('DELETE FROM training_needs WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to delete training need' });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Training need not found' });
    }
    res.json({ message: 'Training need deleted successfully' });
  });
});

module.exports = router;
