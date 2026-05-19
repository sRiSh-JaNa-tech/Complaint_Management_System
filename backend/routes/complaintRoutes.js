const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST api/complaints
// @desc    Add a new complaint
router.post('/', authMiddleware, complaintController.addComplaint);

// @route   GET api/complaints/search
// @desc    Search complaint by location
router.get('/search', authMiddleware, complaintController.searchByLocation);

// @route   GET api/complaints
// @desc    Get all complaints
router.get('/', authMiddleware, complaintController.getComplaints);

// @route   GET api/complaints/:id
// @desc    Get single complaint
router.get('/:id', authMiddleware, complaintController.getComplaintById);

// @route   PUT api/complaints/:id
// @desc    Update complaint status
router.put('/:id', authMiddleware, complaintController.updateComplaintStatus);

module.exports = router;
