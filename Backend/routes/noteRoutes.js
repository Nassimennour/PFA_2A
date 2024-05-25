const express = require("express");
const router = express.Router();
const {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
  getNotesByCourtierId,
  getAverageNoteForCourtier,
} = require("../controllers/noteController");

router.post("/", createNote);
router.get("/", getAllNotes);
router.get("/:id", getNoteById);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);
router.get("/courtier/:courtierId", getNotesByCourtierId);
router.get("/average/:courtierId", getAverageNoteForCourtier);

module.exports = router;
