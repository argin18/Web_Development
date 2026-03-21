const express = require("express");
const {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
} = require("../controllers/note.controller");
const {
  validateNote,
  validateEdit,
} = require("../middlewares/note.middleware");
const router = express.Router();

router.post("/", validateNote, createNote);
router.get("/", getNotes);
router.patch("/:id", validateEdit, updateNote);
router.delete("/:id", deleteNote);

module.exports = router;
