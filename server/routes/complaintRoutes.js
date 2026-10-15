const express = require("express");

const router = express.Router();

const {
  createComplaint,
  getComplaints,
  getUserComplaints,
  getComplaintById,
  updateComplaintStatus,
  deleteComplaint,
} = require("../controllers/complaintController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");


// =====================================================
// USER - CREATE COMPLAINT
// =====================================================

router.post(
  "/",
  protect,
  createComplaint
);


// =====================================================
// GET USER'S OWN COMPLAINTS
// =====================================================

router.get(
  "/user/:userId",
  protect,
  getUserComplaints
);

router.get(
  "/my/list",
  protect,
  (req, res) => {
    req.params.userId = req.user._id;
    return getUserComplaints(req, res);
  }
);


// =====================================================
// GET ALL COMPLAINTS (ADMIN / ALL)
// =====================================================

router.get(
  "/",
  protect,
  getComplaints
);


// =====================================================
// GET SINGLE COMPLAINT
// =====================================================

router.get(
  "/:id",
  protect,
  getComplaintById
);


// =====================================================
// ADMIN - UPDATE COMPLAINT STATUS
// =====================================================

router.put(
  "/:id/status",
  protect,
  adminOnly,
  updateComplaintStatus
);


// =====================================================
// ADMIN - DELETE COMPLAINT
// =====================================================

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteComplaint
);


module.exports = router;