const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [1, "Description cannot be empty"],
      maxlength: [5000, "Description cannot exceed 5000 characters"],
    },
  },
  { timestamps: true },
);

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
