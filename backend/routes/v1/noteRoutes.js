const express = require("express");

const router = express.Router();
const {
  getNote,
  getNotes,
  getAllNotes,
  createNote,
  editNote,
  deleteNote,
} = require("../../controllers/noteController");
const { protect } = require("../../middleware/authMiddleware");

router.post("/", protect, createNote);
router.get("/", protect, getNotes);
router.get("/all", protect, getAllNotes);
router.get("/:id", protect, getNote);
router.put("/:id", protect, editNote);
router.delete("/:id", protect, deleteNote);

module.exports = router;
