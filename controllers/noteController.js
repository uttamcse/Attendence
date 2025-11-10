const mongoose = require("mongoose");
const Note = require("../models/Note");
const Customer = require("../models/Customer");
const { multer, uploadFileToGCS } = require("../utils/uploadHelper");

// Single file upload for bookImage
const uploadBookImage = multer.single("bookImage");

// Add Note Controller
const addNote = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { bookName, author, description } = req.body;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "studentId is required",
      });
    }

    // Validate required fields
    if (!bookName || !author || !description) {
      return res.status(400).json({
        success: false,
        message: "bookName, author, and description are required",
      });
    }

    // Check if student exists
    const student = await Customer.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Handle file upload (optional)
    let bookImageUrl = "";
    if (req.file) {
      try {
        bookImageUrl = await uploadFileToGCS(req.file);
      } catch (uploadError) {
        console.error("Error uploading image:", uploadError);
        // continue without blocking the request
      }
    }

    // Create and save the note
    const newNote = new Note({
      studentId,
      bookName,
      author,
      bookImage: bookImageUrl || " ", 
      description,
    });

    await newNote.save();

    return res.status(201).json({
      success: true,
      message: "Note added successfully",
      note: newNote,
    });
  } catch (error) {
    console.error("Error adding note:", error);
    return res.status(500).json({
      success: false,
      message: "Error while adding note",
      error: error.message,
    });
  }
};

const deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    
    if (! noteId) {
      return res.status(400).json({
        success: false,
        message: "Invalid noteId",
      });
    }
    const note = await Note.findByIdAndDelete(noteId);
    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  }
  catch (error) {
    
    return res.status(500).json({
      success: false,
      message: "Error while deleting note",
      error: error.message,
    });
    
  }
};

const editNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { bookName, author, description } = req.body;

    // Validate noteId
    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid noteId",
      });
    }

    // Find existing note
    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    // Handle optional file upload
    let bookImageUrl = note.bookImage;
    if (req.file) {
      try {
        bookImageUrl = await uploadFileToGCS(req.file);
      } catch (uploadError) {
        console.error("Error uploading image:", uploadError);
      }
    }

    // Update only provided fields
    if (bookName) note.bookName = bookName;
    if (author) note.author = author;
    if (description) note.description = description;
    note.bookImage = bookImageUrl;

    await note.save();

    return res.status(200).json({
      success: true,
      message: "Note updated successfully",
      note,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while updating note",
      error: error.message,
    });
  }
};

const getNotes= async (req, res) => {
  try {
    const { studentId } = req.params;

    if (! studentId) {
      return res.status(400).json({
        success: false,
        message: " studentId is required",
      });
    }
    const notes = await Note.find({ studentId });

    return res.status(200).json({
      success: true,
      notes,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while fetching notes",
      error: error.message,
    });
  }
};

module.exports = { addNote, uploadBookImage, deleteNote, editNote, getNotes };