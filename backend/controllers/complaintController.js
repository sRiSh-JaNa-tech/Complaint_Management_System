const Complaint = require('../models/Complaint');

// Add Complaint
exports.addComplaint = async (req, res) => {
  const { name, email, title, description, category, location } = req.body;

  if (!name || !email || !title || !description || !category || !location) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    const newComplaint = new Complaint({
      name,
      email,
      title,
      description,
      category,
      location,
      user: req.user ? req.user.id : null,
    });

    const complaint = await newComplaint.save();
    res.status(201).json(complaint);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get All Complaints
exports.getComplaints = async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};
    if (category) {
      query.category = category;
    }
    const complaints = await Complaint.find(query).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get Single Complaint
exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    res.json(complaint);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    res.status(500).send('Server error');
  }
};

// Update Complaint Status
exports.updateComplaintStatus = async (req, res) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: 'Status is required' });
  }

  try {
    let complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.status = status;
    await complaint.save();

    res.json(complaint);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    res.status(500).send('Server error');
  }
};

// Search Complaint by Location
exports.searchByLocation = async (req, res) => {
  const { location } = req.query;

  if (!location) {
    return res.status(400).json({ message: 'Location query parameter is required' });
  }

  try {
    const complaints = await Complaint.find({
      location: { $regex: location, $options: 'i' } // Case-insensitive search
    }).sort({ createdAt: -1 });

    res.json(complaints);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
