const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const { assignDepartment } = require('../utils/router');

// POST - submit complaint with auto routing
router.post('/', async (req, res) => {
  console.log('POST HIT:', req.body); 
  try {
    const { title, description, category, latitude, longitude, ward, phone } = req.body;
    
    // Auto assign department based on category
    const dept = assignDepartment(category);
    console.log('DEPT:', dept);
console.log('CATEGORY:', category);
    const complaint = await Complaint.create({
      title,
      description,
      category,
      latitude,
      longitude,
      ward,
      phone,
      status: 'filed',
      assigned_dept: dept.name,
      dept_contact: dept.contact
    });

    res.status(201).json({ success: true, complaint, department: dept });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET - fetch all complaints
router.get('/', async (req, res) => {
  try {
    const complaints = await Complaint.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET - fetch by category
router.get('/category/:cat', async (req, res) => {
  try {
    const complaints = await Complaint.findAll({
      where: { category: req.params.cat },
      order: [['createdAt', 'DESC']]
    });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH - update status
router.patch('/:id/status', async (req, res) => {
  try {
    const complaint = await Complaint.findByPk(req.params.id);
    if (!complaint) return res.status(404).json({ error: 'Not found' });
    await complaint.update({ status: req.body.status });
    res.json({ success: true, complaint });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;