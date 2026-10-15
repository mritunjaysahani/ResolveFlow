const Complaint = require("../models/Complaint");

// ================= CREATE COMPLAINT =================

const createComplaint = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      user
    } = req.body;

    const userId = user || req.user?._id;

    if (!title || !description || !category || !userId) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const complaint = new Complaint({
      title,
      description,
      category,
      user: userId,
      status: "Pending"
    });

    await complaint.save();

    res.status(201).json({
      message: "Complaint submitted successfully",
      complaint
    });

  } catch (error) {
    console.error("Create Complaint Error:", error);

    res.status(500).json({
      message: "Failed to submit complaint"
    });
  }
};


// ================= GET ALL COMPLAINTS =================

const getComplaints = async (req, res) => {
  try {

    const complaints = await Complaint.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      complaints
    });

  } catch (error) {

    console.error("Get Complaints Error:", error);

    res.status(500).json({
      message: "Failed to fetch complaints"
    });
  }
};


// ================= GET USER COMPLAINTS =================

const getUserComplaints = async (req, res) => {
  try {

    const { userId } = req.params;

    const complaints = await Complaint.find({
      user: userId
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      complaints
    });

  } catch (error) {

    console.error("Get User Complaints Error:", error);

    res.status(500).json({
      message: "Failed to fetch user complaints"
    });
  }
};


// ================= GET COMPLAINT BY ID =================

const getComplaintById = async (req, res) => {
  try {
    const { id } = req.params;

    const complaint = await Complaint.findById(id)
      .populate("user", "name email");

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found"
      });
    }

    res.status(200).json({
      complaint
    });

  } catch (error) {
    console.error("Get Complaint By ID Error:", error);

    res.status(500).json({
      message: "Failed to fetch complaint"
    });
  }
};


// ================= UPDATE STATUS =================

const updateComplaintStatus = async (req, res) => {
  try {

    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "In Progress",
      "Resolved"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid complaint status"
      });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      id,
      {
        status
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found"
      });
    }

    res.status(200).json({
      message: "Complaint status updated successfully",
      complaint
    });

  } catch (error) {

    console.error("Update Status Error:", error);

    res.status(500).json({
      message: "Failed to update complaint status"
    });
  }
};


// ================= DELETE COMPLAINT =================

const deleteComplaint = async (req, res) => {
  try {

    const { id } = req.params;

    const complaint = await Complaint.findByIdAndDelete(id);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found"
      });
    }

    res.status(200).json({
      message: "Complaint deleted successfully"
    });

  } catch (error) {

    console.error("Delete Complaint Error:", error);

    res.status(500).json({
      message: "Failed to delete complaint"
    });
  }
};


// ================= EXPORT =================

module.exports = {
  createComplaint,
  getComplaints,
  getUserComplaints,
  getComplaintById,
  updateComplaintStatus,
  deleteComplaint
};