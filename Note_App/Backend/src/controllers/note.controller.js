const noteModel = require("../models/note.models");

// For Note create
const createNote = async (req, res) => {
  try {
    const { title, description } = req.body;

    const note = await noteModel.create({
      title,
      description,
    });

    res.status(201).json({ message: "Note created successfully", note });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// For note fetch
const getNotes = async (req, res) => {
  try {
    const notes = await noteModel.find();
    if (notes.length === 0) {
      return res.status(200).json({ message: "Note not found", notes: [] });
    }

    res.status(200).json({
      message: "Notes fetched successfully",
      notes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// For note edit
const updateNote = async (req, res) => {
  try {
    const id = req.params.id;
    const { title, description } = req.body;
    const updatedNote = await noteModel.findByIdAndUpdate(
      id,
      { title, description },
      { new: true },
    );

    if (!updatedNote) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.status(200).json({ message: "Note updated successfully", updatedNote });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server failed to update note" });
  }
};

// For note delete
const deleteNote = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedNote = await noteModel.findByIdAndDelete(id);

    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to delete note" });
  }
};

module.exports = { createNote, getNotes, updateNote, deleteNote };
